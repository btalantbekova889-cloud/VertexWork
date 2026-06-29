using Microsoft.EntityFrameworkCore;
using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Audit;
using VertexWork.Application.DTOs.Dashboard;
using VertexWork.Application.DTOs.Warehouse;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Enums;
using VertexWork.Infrastructure.Persistence;

namespace VertexWork.Infrastructure.Services;

public class DashboardService(AppDbContext db) : IDashboardService
{
    public async Task<ApiResult<DashboardSummaryDto>> GetSummaryAsync(CancellationToken ct = default)
    {
        var closedOrders = db.Orders.AsNoTracking().Where(o => o.Status == OrderStatus.Closed);
        var revenue = await closedOrders.SumAsync(o => (decimal?)o.TotalSum, ct) ?? 0;
        var expenses = revenue * 0.62m;
        var profit = revenue - expenses;
        var margin = revenue > 0 ? Math.Round(profit / revenue * 100, 2) : 0;

        var activeOrders = await db.Orders.CountAsync(o => o.Status != OrderStatus.Closed && o.Status != OrderStatus.Rejected, ct);
        var inTransit = await db.Orders.CountAsync(o => o.Status == OrderStatus.InTransit, ct);
        var availableVehicles = await db.Vehicles.CountAsync(v => v.Status == VehicleStatus.Available, ct);
        var stock = await db.WarehouseStocks.SumAsync(s => (decimal?)s.QuantityTons, ct) ?? 0;

        return ApiResult<DashboardSummaryDto>.Ok(new DashboardSummaryDto(revenue, expenses, profit, margin, activeOrders, inTransit, availableVehicles, stock));
    }

    public async Task<ApiResult<IReadOnlyList<OrderPipelineItemDto>>> GetPipelineAsync(CancellationToken ct = default)
    {
        var items = await db.Orders.AsNoTracking()
            .Include(o => o.Client)
            .Where(o => o.Status != OrderStatus.Closed && o.Status != OrderStatus.Rejected)
            .OrderBy(o => o.CreatedAt)
            .Select(o => new OrderPipelineItemDto(o.Id, o.Client.CompanyName, o.MaterialType, o.QuantityOrdered, o.Status.ToString(), o.CreatedAt))
            .ToListAsync(ct);
        return ApiResult<IReadOnlyList<OrderPipelineItemDto>>.Ok(items);
    }
}

public class WarehouseService(AppDbContext db, IAuditService audit) : IWarehouseService
{
    public async Task<ApiResult<IReadOnlyList<WarehouseStockDto>>> GetStockAsync(CancellationToken ct = default)
    {
        var items = await db.WarehouseStocks.AsNoTracking()
            .OrderBy(s => s.SiteName).ThenBy(s => s.MaterialType)
            .Select(s => new WarehouseStockDto(s.Id, s.SiteName, s.MaterialType, s.QuantityTons, s.ReservedTons, s.QuantityTons - s.ReservedTons))
            .ToListAsync(ct);
        return ApiResult<IReadOnlyList<WarehouseStockDto>>.Ok(items);
    }

    public async Task<ApiResult<WarehouseStockDto>> AdjustStockAsync(Guid id, InventoryAdjustmentRequest request, CancellationToken ct = default)
    {
        var stock = await db.WarehouseStocks.FindAsync([id], ct);
        if (stock is null) return ApiResult<WarehouseStockDto>.Fail("Запись склада не найдена.");

        var oldQty = stock.QuantityTons;
        stock.QuantityTons += request.QuantityDelta;
        if (stock.QuantityTons < 0) return ApiResult<WarehouseStockDto>.Fail("Остаток не может быть отрицательным.");
        stock.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        await audit.LogAsync("STOCK_ADJUST", nameof(Domain.Entities.WarehouseStock), id.ToString(), new { oldQty }, new { stock.QuantityTons, request.Reason }, ct);
        return ApiResult<WarehouseStockDto>.Ok(new WarehouseStockDto(stock.Id, stock.SiteName, stock.MaterialType, stock.QuantityTons, stock.ReservedTons, stock.QuantityTons - stock.ReservedTons));
    }
}

public class AuditQueryService(AppDbContext db) : IAuditQueryService
{
    public async Task<ApiResult<PaginatedList<AuditLogDto>>> GetLogsAsync(int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var query = db.AuditLogs.AsNoTracking().Include(a => a.User);
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(a => a.Timestamp)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(a => new AuditLogDto(a.Id, a.UserId, a.User != null ? a.User.FullName : null, a.Action, a.EntityName, a.EntityId, a.OldValues, a.NewValues, a.Timestamp, a.IpAddress))
            .ToListAsync(ct);
        return ApiResult<PaginatedList<AuditLogDto>>.Ok(new PaginatedList<AuditLogDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize });
    }
}
