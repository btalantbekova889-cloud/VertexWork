using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using VertexWork.Application.DTOs.Auth;
using VertexWork.Application.Interfaces;
using VertexWork.Infrastructure.Options;
using VertexWork.Infrastructure.Persistence;
using VertexWork.Infrastructure.Services;

namespace VertexWork.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    IAuthService authService,
    AuthService authServiceImpl,
    AppDbContext db,
    IOptions<CookieSettings> cookieOptions) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await authService.LoginAsync(request, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        if (!result.Success) return BadRequest(result);

        if (result.Data!.RequiresTwoFactor)
            return Ok(result);

        var user = await db.Users.FindAsync([result.Data.UserId], ct);
        if (user is null) return BadRequest(ApiFail("Пользователь не найден."));

        await db.Entry(user).Reference(u => u.Role).LoadAsync(ct);
        var tokens = await authServiceImpl.CreateTokensForUserAsync(user, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        SetAuthCookies(tokens.AccessToken, tokens.RefreshToken, tokens.ExpiresAt);
        return Ok(new { result.Success, result.Data, accessTokenExpiresAt = tokens.ExpiresAt });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(CancellationToken ct)
    {
        if (!Request.Cookies.TryGetValue(cookieOptions.Value.RefreshTokenName, out var refreshToken))
            return Unauthorized(ApiFail("Refresh-токен отсутствует."));

        var result = await authService.RefreshTokenAsync(refreshToken, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        if (!result.Success) return Unauthorized(result);

        SetAccessCookie(result.Data!.AccessToken, result.Data.AccessTokenExpiresAt);
        if (!string.IsNullOrEmpty(result.Data.RefreshToken))
        {
            var cookie = cookieOptions.Value;
            Response.Cookies.Append(cookie.RefreshTokenName, result.Data.RefreshToken, BuildCookieOptions(DateTimeOffset.UtcNow.AddDays(7), cookie));
        }
        return Ok(result);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        if (Request.Cookies.TryGetValue(cookieOptions.Value.RefreshTokenName, out var refreshToken))
            await authService.RevokeRefreshTokenAsync(refreshToken, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);

        Response.Cookies.Delete(cookieOptions.Value.AccessTokenName);
        Response.Cookies.Delete(cookieOptions.Value.RefreshTokenName);
        return Ok(new { success = true });
    }

    [HttpPost("2fa/setup")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> SetupTwoFactor(CancellationToken ct)
    {
        var userId = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userId, out var id)) return Unauthorized();
        var result = await authService.SetupTwoFactorAsync(id, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("2fa/enable")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> EnableTwoFactor([FromBody] VerifyTwoFactorRequest request, CancellationToken ct)
    {
        var userId = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userId, out var id)) return Unauthorized();
        var result = await authService.EnableTwoFactorAsync(id, request, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    private void SetAuthCookies(string accessToken, string refreshToken, DateTime accessExpires)
    {
        SetAccessCookie(accessToken, accessExpires);
        var cookie = cookieOptions.Value;
        Response.Cookies.Append(cookie.RefreshTokenName, refreshToken, BuildCookieOptions(DateTimeOffset.UtcNow.AddDays(7), cookie));
    }

    private void SetAccessCookie(string accessToken, DateTime accessExpires)
    {
        var cookie = cookieOptions.Value;
        Response.Cookies.Append(cookie.AccessTokenName, accessToken, BuildCookieOptions(new DateTimeOffset(accessExpires), cookie));
    }

    private static CookieOptions BuildCookieOptions(DateTimeOffset expires, CookieSettings settings) => new()
    {
        HttpOnly = true,
        Secure = settings.Secure,
        SameSite = settings.SameSite.Equals("None", StringComparison.OrdinalIgnoreCase) ? SameSiteMode.None : SameSiteMode.Strict,
        Expires = expires,
        Path = "/"
    };

    private static object ApiFail(string error) => new { success = false, error };
}
