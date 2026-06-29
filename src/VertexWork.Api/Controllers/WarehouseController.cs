using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VertexWork.Application.DTOs.Warehouse;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Constants;

namespace VertexWork.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WarehouseController(IWarehouseService warehouseService) : ControllerBase
{
    [HttpGet("stock")]
    [Authorize(Roles = $"{AppRoles.Storekeeper},{AppRoles.QuarryChief},{AppRoles.GeneralDirector}")]
    public async Task<IActionResult> GetStock(CancellationToken ct)
    {
        var result = await warehouseService.GetStockAsync(ct);
        return Ok(result);
    }

    [HttpPost("stock/{id:guid}/adjust")]
    [Authorize(Roles = AppRoles.Storekeeper)]
    public async Task<IActionResult> AdjustStock(Guid id, [FromBody] InventoryAdjustmentRequest request, CancellationToken ct)
    {
        var result = await warehouseService.AdjustStockAsync(id, request, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = $"{AppRoles.GeneralDirector},{AppRoles.HrManager}")]
public class AuditController(IAuditQueryService auditQueryService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var result = await auditQueryService.GetLogsAsync(page, pageSize, ct);
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public IActionResult Get() => Ok(new { status = "healthy", service = "Vertex Work API", timestamp = DateTime.UtcNow });
}
