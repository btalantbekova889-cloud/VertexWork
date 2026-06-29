using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Audit;
using VertexWork.Application.DTOs.Warehouse;

namespace VertexWork.Application.Interfaces;

public interface IWarehouseService
{
    Task<ApiResult<IReadOnlyList<WarehouseStockDto>>> GetStockAsync(CancellationToken ct = default);
    Task<ApiResult<WarehouseStockDto>> AdjustStockAsync(Guid id, InventoryAdjustmentRequest request, CancellationToken ct = default);
}

public interface IAuditQueryService
{
    Task<ApiResult<PaginatedList<AuditLogDto>>> GetLogsAsync(int page, int pageSize, CancellationToken ct = default);
}
