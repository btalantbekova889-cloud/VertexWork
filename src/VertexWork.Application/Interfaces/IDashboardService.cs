using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Dashboard;

namespace VertexWork.Application.Interfaces;

public interface IDashboardService
{
    Task<ApiResult<DashboardSummaryDto>> GetSummaryAsync(CancellationToken ct = default);
    Task<ApiResult<IReadOnlyList<OrderPipelineItemDto>>> GetPipelineAsync(CancellationToken ct = default);
}
