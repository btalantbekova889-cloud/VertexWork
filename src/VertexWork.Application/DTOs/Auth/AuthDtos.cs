namespace VertexWork.Application.DTOs.Auth;

public record LoginRequest(string Email, string Password, string? TotpCode = null);
public record LoginResponse(Guid UserId, string Email, string FullName, string Role, bool RequiresTwoFactor);
public record TokenResponse(string AccessToken, DateTime AccessTokenExpiresAt, string? RefreshToken = null);
public record SetupTwoFactorResponse(string Secret, string QrCodeUri);
public record VerifyTwoFactorRequest(string Code);
