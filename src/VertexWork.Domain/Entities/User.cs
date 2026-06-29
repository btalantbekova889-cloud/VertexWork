using VertexWork.Domain.Common;
using VertexWork.Domain.Enums;

namespace VertexWork.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public Guid RoleId { get; set; }
    public UserStatus Status { get; set; } = UserStatus.Active;
    public string? TotpSecret { get; set; }
    public bool TwoFactorEnabled { get; set; }

    public Role Role { get; set; } = null!;
    public ICollection<Client> ManagedClients { get; set; } = [];
    public ICollection<Order> CreatedOrders { get; set; } = [];
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}
