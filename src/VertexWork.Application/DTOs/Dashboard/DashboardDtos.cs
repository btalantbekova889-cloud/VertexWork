namespace VertexWork.Application.DTOs.Dashboard;

public record DashboardSummaryDto(
    decimal TotalRevenue,
    decimal TotalExpenses,
    decimal NetProfit,
    decimal MarginPercent,
    int ActiveOrders,
    int OrdersInTransit,
    int AvailableVehicles,
    decimal TotalStockTons);

public record OrderPipelineItemDto(
    Guid OrderId,
    string ClientName,
    string MaterialType,
    decimal QuantityOrdered,
    string Status,
    DateTime CreatedAt);
