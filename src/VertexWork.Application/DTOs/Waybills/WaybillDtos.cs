namespace VertexWork.Application.DTOs.Waybills;

public record WaybillDto(
    Guid Id,
    Guid OrderId,
    Guid? VehicleId,
    string? VehiclePlate,
    decimal WeightIn,
    decimal WeightOut,
    decimal WeightNet,
    DateTime? WeighedAt,
    string? S3DocPath);
