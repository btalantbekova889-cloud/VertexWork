using VertexWork.Domain.Enums;

namespace VertexWork.Application.DTOs.Orders;

public record OrderDto(
    Guid Id,
    Guid ClientId,
    string ClientName,
    string MaterialType,
    decimal QuantityOrdered,
    decimal PricePerTon,
    decimal TotalSum,
    OrderStatus Status,
    string DeliveryAddress,
    DateTime CreatedAt,
    Guid? AssignedVehicleId,
    string? AssignedVehiclePlate,
    DateTime? FinanceApprovedAt,
    DateTime? DispatchedAt,
    DateTime? ClosedAt);

public record CreateOrderRequest(
    Guid ClientId,
    string MaterialType,
    decimal QuantityOrdered,
    decimal PricePerTon,
    string DeliveryAddress,
    string? Notes);

public record FinanceApprovalRequest(bool Approved, string? Comment);
public record DispatchOrderRequest(Guid VehicleId, Guid? DriverId);
public record QuarryConfirmRequest(bool MaterialAvailable, string? Comment);
public record WeighingRequest(decimal WeightIn, decimal WeightOut, Guid? VehicleId, Guid? DriverId);
public record CloseOrderRequest(string? PaymentReference);
