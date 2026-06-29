using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Vehicles;

namespace VertexWork.Application.Interfaces;

public interface IVehicleService
{
    Task<ApiResult<VehicleDto>> CreateAsync(CreateVehicleRequest request, CancellationToken ct = default);
    Task<ApiResult<VehicleDto>> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ApiResult<PaginatedList<VehicleDto>>> GetAllAsync(int page, int pageSize, CancellationToken ct = default);
    Task<ApiResult<VehicleDto>> UpdateStatusAsync(Guid id, UpdateVehicleStatusRequest request, CancellationToken ct = default);
}
