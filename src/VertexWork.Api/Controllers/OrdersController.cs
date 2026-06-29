using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VertexWork.Application.DTOs.Orders;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Constants;
using VertexWork.Domain.Enums;

namespace VertexWork.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] OrderStatus? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await orderService.GetAllAsync(status, page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await orderService.GetByIdAsync(id, ct);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [Authorize(Roles = AppRoles.SalesManager)]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request, CancellationToken ct)
    {
        var result = await orderService.CreateAsync(request, ct);
        return result.Success ? CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result) : BadRequest(result);
    }

    [HttpPost("{id:guid}/finance-approval")]
    [Authorize(Roles = AppRoles.Accountant)]
    public async Task<IActionResult> FinanceApproval(Guid id, [FromBody] FinanceApprovalRequest request, CancellationToken ct)
    {
        var result = await orderService.ApproveFinanceAsync(id, request, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{id:guid}/dispatch")]
    [Authorize(Roles = AppRoles.Dispatcher)]
    public async Task<IActionResult> Dispatch(Guid id, [FromBody] DispatchOrderRequest request, CancellationToken ct)
    {
        var result = await orderService.DispatchAsync(id, request, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{id:guid}/quarry-confirm")]
    [Authorize(Roles = AppRoles.QuarryChief)]
    public async Task<IActionResult> QuarryConfirm(Guid id, [FromBody] QuarryConfirmRequest request, CancellationToken ct)
    {
        var result = await orderService.ConfirmQuarryAsync(id, request, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{id:guid}/weigh")]
    [Authorize(Roles = AppRoles.Weigher)]
    public async Task<IActionResult> Weigh(Guid id, [FromBody] WeighingRequest request, CancellationToken ct)
    {
        var result = await orderService.RecordWeighingAsync(id, request, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{id:guid}/start-transit")]
    [Authorize(Roles = $"{AppRoles.Dispatcher},{AppRoles.Driver}")]
    public async Task<IActionResult> StartTransit(Guid id, CancellationToken ct)
    {
        var result = await orderService.StartTransitAsync(id, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{id:guid}/delivered")]
    [Authorize(Roles = $"{AppRoles.Dispatcher},{AppRoles.Driver}")]
    public async Task<IActionResult> MarkDelivered(Guid id, CancellationToken ct)
    {
        var result = await orderService.MarkDeliveredAsync(id, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{id:guid}/close")]
    [Authorize(Roles = AppRoles.Accountant)]
    public async Task<IActionResult> Close(Guid id, [FromBody] CloseOrderRequest request, CancellationToken ct)
    {
        var result = await orderService.CloseAsync(id, request, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
