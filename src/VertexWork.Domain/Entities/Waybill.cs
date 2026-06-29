using VertexWork.Domain.Common;

namespace VertexWork.Domain.Entities;

public class Waybill : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid? VehicleId { get; set; }
    public Guid? DriverId { get; set; }
    public decimal WeightIn { get; set; }
    public decimal WeightOut { get; set; }
    public decimal WeightNet => WeightOut - WeightIn;
    public Guid? ScaleOperatorId { get; set; }
    public string? S3DocPath { get; set; }
    public DateTime? WeighedAt { get; set; }

    public Order Order { get; set; } = null!;
    public Vehicle? Vehicle { get; set; }
    public User? Driver { get; set; }
    public User? ScaleOperator { get; set; }
}
