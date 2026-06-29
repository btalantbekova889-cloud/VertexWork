using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Constants;

namespace VertexWork.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("summary")]
    [Authorize(Roles = $"{AppRoles.GeneralDirector},{AppRoles.CommercialDirector}")]
    public async Task<IActionResult> GetSummary(CancellationToken ct)
    {
        var result = await dashboardService.GetSummaryAsync(ct);
        return Ok(result);
    }

    [HttpGet("pipeline")]
    [Authorize(Roles = $"{AppRoles.GeneralDirector},{AppRoles.CommercialDirector},{AppRoles.Dispatcher},{AppRoles.QuarryChief}")]
    public async Task<IActionResult> GetPipeline(CancellationToken ct)
    {
        var result = await dashboardService.GetPipelineAsync(ct);
        return Ok(result);
    }
}
