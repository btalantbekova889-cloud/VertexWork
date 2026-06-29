using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using VertexWork.Domain.Entities;
using VertexWork.Infrastructure.Options;

namespace VertexWork.Infrastructure.Auth;

public interface IJwtTokenGenerator
{
    (string Token, DateTime ExpiresAt) GenerateAccessToken(User user, string roleName);
    string GenerateRefreshToken();
}

public class JwtTokenGenerator(IOptions<JwtSettings> options) : IJwtTokenGenerator
{
    private readonly JwtSettings _settings = options.Value;

    public (string Token, DateTime ExpiresAt) GenerateAccessToken(User user, string roleName)
    {
        var expires = DateTime.UtcNow.AddMinutes(_settings.AccessTokenMinutes);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Role, roleName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: creds);

        return (new JwtSecurityTokenHandler().WriteToken(token), expires);
    }

    public string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }
}

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}

public class BcryptPasswordHasher : IPasswordHasher
{
    public string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password);
    public bool Verify(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
}

public interface ITotpService
{
    string GenerateSecret();
    string GetQrCodeUri(string email, string secret);
    bool ValidateCode(string secret, string code);
}

public class TotpService : ITotpService
{
    public string GenerateSecret() => OtpNet.Base32Encoding.ToString(OtpNet.KeyGeneration.GenerateRandomKey(20));

    public string GetQrCodeUri(string email, string secret)
    {
        var encodedSecret = Uri.EscapeDataString(secret);
        var encodedEmail = Uri.EscapeDataString(email);
        return $"otpauth://totp/VertexWork:{encodedEmail}?secret={encodedSecret}&issuer=VertexWork&digits=6";
    }

    public bool ValidateCode(string secret, string code)
    {
        if (string.IsNullOrWhiteSpace(code) || string.IsNullOrWhiteSpace(secret))
            return false;

        var totp = new OtpNet.Totp(OtpNet.Base32Encoding.ToBytes(secret));
        return totp.VerifyTotp(code, out _, new OtpNet.VerificationWindow(previous: 1, future: 1));
    }
}
