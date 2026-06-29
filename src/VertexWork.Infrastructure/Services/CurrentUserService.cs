using System.Text.Json;
using Microsoft.AspNetCore.Http;
using VertexWork.Application.Interfaces;
using VertexWork.Infrastructure.Persistence;

namespace VertexWork.Infrastructure.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public Guid? UserId
    {
        get
        {
            var sub = httpContextAccessor.HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                      ?? httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value;
            return Guid.TryParse(sub, out var id) ? id : null;
        }
    }

    public string? Email => httpContextAccessor.HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
    public string? Role => httpContextAccessor.HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
    public string? IpAddress => httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
}

public class AuditService(AppDbContext db, ICurrentUserService currentUser) : IAuditService
{
    public async Task LogAsync(string action, string entityName, string? entityId, object? oldValues, object? newValues, CancellationToken ct = default)
    {
        db.AuditLogs.Add(new Domain.Entities.AuditLog
        {
            UserId = currentUser.UserId,
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            OldValues = oldValues is null ? null : JsonSerializer.Serialize(oldValues),
            NewValues = newValues is null ? null : JsonSerializer.Serialize(newValues),
            IpAddress = currentUser.IpAddress
        });
        await db.SaveChangesAsync(ct);
    }
}
