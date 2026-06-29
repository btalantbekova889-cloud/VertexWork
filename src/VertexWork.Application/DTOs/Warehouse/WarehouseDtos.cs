namespace VertexWork.Application.DTOs.Warehouse;

public record WarehouseStockDto(
    Guid Id,
    string SiteName,
    string MaterialType,
    decimal QuantityTons,
    decimal ReservedTons,
    decimal AvailableTons);

public record InventoryAdjustmentRequest(decimal QuantityDelta, string Reason);
