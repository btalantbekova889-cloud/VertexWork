using VertexWork.Domain.Common;

namespace VertexWork.Domain.Entities;

public class Client : BaseEntity
{
    public string CompanyName { get; set; } = string.Empty;
    public string Inn { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public decimal Balance { get; set; }
    public decimal CreditLimit { get; set; }
    public Guid? ManagerId { get; set; }

    public User? Manager { get; set; }
    public ICollection<Order> Orders { get; set; } = [];
}
