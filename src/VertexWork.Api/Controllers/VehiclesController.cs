using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VertexWork.Application.DTOs.Vehicles;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Constants;

namespace VertexWork.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VehiclesController(IVehicleService vehicleService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = $"{AppRoles.GeneralDirector},{AppRoles.Dispatcher},{AppRoles.QuarryChief}")]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await vehicleService.GetAllAsync(page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = $"{AppRoles.GeneralDirector},{AppRoles.Dispatcher},{AppRoles.QuarryChief}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await vehicleService.GetByIdAsync(id, ct);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [Authorize(Roles = AppRoles.Dispatcher)]
    public async Task<IActionResult> Create([FromBody] CreateVehicleRequest request, CancellationToken ct)
    {
        var result = await vehicleService.CreateAsync(request, ct);
        return result.Success ? CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result) : BadRequest(result);
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = AppRoles.Dispatcher)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateVehicleStatusRequest request, CancellationToken ct)
    {
        var result = await vehicleService.UpdateStatusAsync(id, request, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
