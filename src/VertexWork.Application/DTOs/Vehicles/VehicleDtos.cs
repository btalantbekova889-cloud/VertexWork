using VertexWork.Domain.Enums;

namespace VertexWork.Application.DTOs.Vehicles;

public record VehicleDto(
    Guid Id,
    string PlateNumber,
    string Model,
    decimal Capacity,
    string? GpsTrackerId,
    VehicleStatus Status,
    bool IsOwned);

public record CreateVehicleRequest(
    string PlateNumber,
    string Model,
    decimal Capacity,
    string? GpsTrackerId,
    bool IsOwned);

public record UpdateVehicleStatusRequest(VehicleStatus Status);
