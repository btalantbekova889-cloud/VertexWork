namespace VertexWork.Infrastructure.Options;

public class JwtSettings
{
    public const string SectionName = "Jwt";
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = "VertexWork";
    public string Audience { get; set; } = "VertexWorkClients";
    public int AccessTokenMinutes { get; set; } = 15;
    public int RefreshTokenDays { get; set; } = 7;
}

public class CookieSettings
{
    public const string SectionName = "Cookies";
    public string AccessTokenName { get; set; } = "vw_access";
    public string RefreshTokenName { get; set; } = "vw_refresh";
    public bool Secure { get; set; }
    public string SameSite { get; set; } = "Strict";
}
