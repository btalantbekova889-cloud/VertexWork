using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Auth;

namespace VertexWork.Application.Interfaces;

public interface IAuthService
{
    Task<ApiResult<LoginResponse>> LoginAsync(LoginRequest request, string? ipAddress, CancellationToken ct = default);
    Task<ApiResult<TokenResponse>> RefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default);
    Task RevokeRefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default);
    Task<ApiResult<SetupTwoFactorResponse>> SetupTwoFactorAsync(Guid userId, CancellationToken ct = default);
    Task<ApiResult<bool>> EnableTwoFactorAsync(Guid userId, VerifyTwoFactorRequest request, CancellationToken ct = default);
}

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Email { get; }
    string? Role { get; }
    string? IpAddress { get; }
}

public interface IAuditService
{
    Task LogAsync(string action, string entityName, string? entityId, object? oldValues, object? newValues, CancellationToken ct = default);
}
