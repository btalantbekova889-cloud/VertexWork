namespace VertexWork.Application.DTOs.Audit;

public record AuditLogDto(
    Guid Id,
    Guid? UserId,
    string? UserName,
    string Action,
    string EntityName,
    string? EntityId,
    string? OldValues,
    string? NewValues,
    DateTime Timestamp,
    string? IpAddress);
