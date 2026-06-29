using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Clients;

namespace VertexWork.Application.Interfaces;

public interface IClientService
{
    Task<ApiResult<ClientDto>> CreateAsync(CreateClientRequest request, CancellationToken ct = default);
    Task<ApiResult<ClientDto>> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ApiResult<PaginatedList<ClientDto>>> GetAllAsync(int page, int pageSize, CancellationToken ct = default);
    Task<ApiResult<ClientDto>> UpdateAsync(Guid id, UpdateClientRequest request, CancellationToken ct = default);
}
