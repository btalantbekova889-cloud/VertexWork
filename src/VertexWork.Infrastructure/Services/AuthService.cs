using Microsoft.EntityFrameworkCore;
using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Auth;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Entities;
using VertexWork.Domain.Enums;
using VertexWork.Infrastructure.Auth;
using VertexWork.Infrastructure.Persistence;

namespace VertexWork.Infrastructure.Services;

public class AuthService(
    AppDbContext db,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator jwtTokenGenerator,
    ITotpService totpService,
    IAuditService auditService) : IAuthService
{
    public async Task<ApiResult<LoginResponse>> LoginAsync(LoginRequest request, string? ipAddress, CancellationToken ct = default)
    {
        var user = await db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == request.Email, ct);
        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
            return ApiResult<LoginResponse>.Fail("Неверный email или пароль.");

        if (user.Status != UserStatus.Active)
            return ApiResult<LoginResponse>.Fail("Учётная запись заблокирована.");

        if (user.TwoFactorEnabled)
        {
            if (string.IsNullOrWhiteSpace(request.TotpCode))
                return ApiResult<LoginResponse>.Ok(new LoginResponse(user.Id, user.Email, user.FullName, user.Role.Name, RequiresTwoFactor: true));

            if (!totpService.ValidateCode(user.TotpSecret!, request.TotpCode))
                return ApiResult<LoginResponse>.Fail("Неверный код двухфакторной аутентификации.");
        }

        await auditService.LogAsync("LOGIN", nameof(User), user.Id.ToString(), null, new { user.Email }, ct);

        return ApiResult<LoginResponse>.Ok(new LoginResponse(user.Id, user.Email, user.FullName, user.Role.Name, RequiresTwoFactor: false));
    }

    public async Task<ApiResult<TokenResponse>> RefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default)
    {
        var stored = await db.RefreshTokens.Include(r => r.User).ThenInclude(u => u.Role)
            .FirstOrDefaultAsync(r => r.Token == refreshToken, ct);

        if (stored is null || !stored.IsActive)
            return ApiResult<TokenResponse>.Fail("Refresh-токен недействителен.");

        stored.RevokedAt = DateTime.UtcNow;
        var newRefresh = jwtTokenGenerator.GenerateRefreshToken();
        stored.ReplacedByToken = newRefresh;

        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = stored.UserId,
            Token = newRefresh,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedByIp = ipAddress
        });

        var (access, expires) = jwtTokenGenerator.GenerateAccessToken(stored.User, stored.User.Role.Name);
        await db.SaveChangesAsync(ct);
        return ApiResult<TokenResponse>.Ok(new TokenResponse(access, expires, newRefresh));
    }

    public async Task RevokeRefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default)
    {
        var stored = await db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == refreshToken, ct);
        if (stored is null || !stored.IsActive) return;
        stored.RevokedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
    }

    public async Task<ApiResult<SetupTwoFactorResponse>> SetupTwoFactorAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await db.Users.FindAsync([userId], ct);
        if (user is null) return ApiResult<SetupTwoFactorResponse>.Fail("Пользователь не найден.");

        user.TotpSecret = totpService.GenerateSecret();
        await db.SaveChangesAsync(ct);
        return ApiResult<SetupTwoFactorResponse>.Ok(new SetupTwoFactorResponse(user.TotpSecret, totpService.GetQrCodeUri(user.Email, user.TotpSecret)));
    }

    public async Task<ApiResult<bool>> EnableTwoFactorAsync(Guid userId, VerifyTwoFactorRequest request, CancellationToken ct = default)
    {
        var user = await db.Users.FindAsync([userId], ct);
        if (user is null || string.IsNullOrEmpty(user.TotpSecret))
            return ApiResult<bool>.Fail("Сначала настройте 2FA.");

        if (!totpService.ValidateCode(user.TotpSecret, request.Code))
            return ApiResult<bool>.Fail("Неверный код.");

        user.TwoFactorEnabled = true;
        await db.SaveChangesAsync(ct);
        return ApiResult<bool>.Ok(true);
    }

    public async Task<(string AccessToken, DateTime ExpiresAt, string RefreshToken)> CreateTokensForUserAsync(User user, string? ipAddress, CancellationToken ct)
    {
        var refresh = jwtTokenGenerator.GenerateRefreshToken();
        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            Token = refresh,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedByIp = ipAddress
        });
        var (access, expires) = jwtTokenGenerator.GenerateAccessToken(user, user.Role.Name);
        await db.SaveChangesAsync(ct);
        return (access, expires, refresh);
    }
}
