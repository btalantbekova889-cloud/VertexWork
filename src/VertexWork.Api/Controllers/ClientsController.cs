using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VertexWork.Application.DTOs.Clients;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Constants;

namespace VertexWork.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientsController(IClientService clientService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = $"{AppRoles.GeneralDirector},{AppRoles.CommercialDirector},{AppRoles.SalesManager},{AppRoles.Accountant}")]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await clientService.GetAllAsync(page, pageSize, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = $"{AppRoles.GeneralDirector},{AppRoles.CommercialDirector},{AppRoles.SalesManager},{AppRoles.Accountant}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await clientService.GetByIdAsync(id, ct);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [Authorize(Roles = $"{AppRoles.SalesManager},{AppRoles.CommercialDirector}")]
    public async Task<IActionResult> Create([FromBody] CreateClientRequest request, CancellationToken ct)
    {
        var result = await clientService.CreateAsync(request, ct);
        return result.Success ? CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result) : BadRequest(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{AppRoles.SalesManager},{AppRoles.CommercialDirector}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateClientRequest request, CancellationToken ct)
    {
        var result = await clientService.UpdateAsync(id, request, ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
