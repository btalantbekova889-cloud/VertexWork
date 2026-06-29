using VertexWork.Domain.Common;
using VertexWork.Domain.Enums;

namespace VertexWork.Domain.Entities;

public class Order : BaseEntity
{
    public Guid ClientId { get; set; }
    public Guid CreatedById { get; set; }
    public string MaterialType { get; set; } = string.Empty;
    public decimal QuantityOrdered { get; set; }
    public decimal PricePerTon { get; set; }
    public decimal TotalSum { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.New;
    public string DeliveryAddress { get; set; } = string.Empty;
    public Guid? AssignedVehicleId { get; set; }
    public Guid? AssignedDriverId { get; set; }
    public string? ContractDocPath { get; set; }
    public string? InvoiceDocPath { get; set; }
    public string? Notes { get; set; }
    public DateTime? FinanceApprovedAt { get; set; }
    public DateTime? DispatchedAt { get; set; }
    public DateTime? ClosedAt { get; set; }

    public Client Client { get; set; } = null!;
    public User CreatedBy { get; set; } = null!;
    public Vehicle? AssignedVehicle { get; set; }
    public User? AssignedDriver { get; set; }
    public Waybill? Waybill { get; set; }
}
