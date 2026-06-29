using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Orders;
using VertexWork.Domain.Enums;

namespace VertexWork.Application.Interfaces;

public interface IOrderService
{
    Task<ApiResult<OrderDto>> CreateAsync(CreateOrderRequest request, CancellationToken ct = default);
    Task<ApiResult<OrderDto>> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ApiResult<PaginatedList<OrderDto>>> GetAllAsync(OrderStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task<ApiResult<OrderDto>> ApproveFinanceAsync(Guid id, FinanceApprovalRequest request, CancellationToken ct = default);
    Task<ApiResult<OrderDto>> DispatchAsync(Guid id, DispatchOrderRequest request, CancellationToken ct = default);
    Task<ApiResult<OrderDto>> ConfirmQuarryAsync(Guid id, QuarryConfirmRequest request, CancellationToken ct = default);
    Task<ApiResult<OrderDto>> RecordWeighingAsync(Guid id, WeighingRequest request, CancellationToken ct = default);
    Task<ApiResult<OrderDto>> StartTransitAsync(Guid id, CancellationToken ct = default);
    Task<ApiResult<OrderDto>> MarkDeliveredAsync(Guid id, CancellationToken ct = default);
    Task<ApiResult<OrderDto>> CloseAsync(Guid id, CloseOrderRequest request, CancellationToken ct = default);
}
