using VertexWork.Domain.Common;
using VertexWork.Domain.Enums;

namespace VertexWork.Domain.Entities;

public class Vehicle : BaseEntity
{
    public string PlateNumber { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public decimal Capacity { get; set; }
    public string? GpsTrackerId { get; set; }
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    public bool IsOwned { get; set; } = true;

    public ICollection<Order> Orders { get; set; } = [];
    public ICollection<Waybill> Waybills { get; set; } = [];
}
