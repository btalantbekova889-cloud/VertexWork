using Microsoft.EntityFrameworkCore;
using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Clients;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Constants;
using VertexWork.Domain.Entities;
using VertexWork.Infrastructure.Persistence;

namespace VertexWork.Infrastructure.Services;

public class ClientService(AppDbContext db, ICurrentUserService currentUser, IAuditService audit) : IClientService
{
    public async Task<ApiResult<ClientDto>> CreateAsync(CreateClientRequest request, CancellationToken ct = default)
    {
        if (await db.Clients.AnyAsync(c => c.Inn == request.Inn, ct))
            return ApiResult<ClientDto>.Fail("Клиент с таким ИНН уже существует.");

        var client = new Client
        {
            CompanyName = request.CompanyName,
            Inn = request.Inn,
            Phone = request.Phone,
            Email = request.Email,
            CreditLimit = request.CreditLimit,
            ManagerId = currentUser.UserId
        };

        db.Clients.Add(client);
        await db.SaveChangesAsync(ct);
        await audit.LogAsync("CREATE", nameof(Client), client.Id.ToString(), null, client, ct);
        var mapped = await MapAsync(client.Id, ct);
        return ApiResult<ClientDto>.Ok(mapped!);
    }

    public async Task<ApiResult<ClientDto>> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var dto = await MapAsync(id, ct);
        return dto is null ? ApiResult<ClientDto>.Fail("Клиент не найден.") : ApiResult<ClientDto>.Ok(dto);
    }

    public async Task<ApiResult<PaginatedList<ClientDto>>> GetAllAsync(int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Clients.AsNoTracking().Include(c => c.Manager).AsQueryable();
        if (currentUser.Role == AppRoles.SalesManager)
            query = query.Where(c => c.ManagerId == currentUser.UserId);

        var total = await query.CountAsync(ct);
        var items = await query.OrderBy(c => c.CompanyName)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(c => new ClientDto(c.Id, c.CompanyName, c.Inn, c.Phone, c.Email, c.Balance, c.CreditLimit, c.ManagerId, c.Manager != null ? c.Manager.FullName : null))
            .ToListAsync(ct);

        return ApiResult<PaginatedList<ClientDto>>.Ok(new PaginatedList<ClientDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize });
    }

    public async Task<ApiResult<ClientDto>> UpdateAsync(Guid id, UpdateClientRequest request, CancellationToken ct = default)
    {
        var client = await db.Clients.FindAsync([id], ct);
        if (client is null) return ApiResult<ClientDto>.Fail("Клиент не найден.");

        var old = new { client.CompanyName, client.Phone, client.Email, client.CreditLimit };
        client.CompanyName = request.CompanyName;
        client.Phone = request.Phone;
        client.Email = request.Email;
        client.CreditLimit = request.CreditLimit;
        client.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        await audit.LogAsync("UPDATE", nameof(Client), id.ToString(), old, client, ct);
        return ApiResult<ClientDto>.Ok((await MapAsync(id, ct))!);
    }

    private async Task<ClientDto?> MapAsync(Guid id, CancellationToken ct) =>
        await db.Clients.AsNoTracking().Include(c => c.Manager)
            .Where(c => c.Id == id)
            .Select(c => new ClientDto(c.Id, c.CompanyName, c.Inn, c.Phone, c.Email, c.Balance, c.CreditLimit, c.ManagerId, c.Manager != null ? c.Manager.FullName : null))
            .FirstOrDefaultAsync(ct);
}
