using Microsoft.EntityFrameworkCore;
using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Vehicles;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Entities;
using VertexWork.Infrastructure.Persistence;

namespace VertexWork.Infrastructure.Services;

public class VehicleService(AppDbContext db, IAuditService audit) : IVehicleService
{
    public async Task<ApiResult<VehicleDto>> CreateAsync(CreateVehicleRequest request, CancellationToken ct = default)
    {
        if (await db.Vehicles.AnyAsync(v => v.PlateNumber == request.PlateNumber, ct))
            return ApiResult<VehicleDto>.Fail("Транспорт с таким номером уже существует.");

        var vehicle = new Vehicle
        {
            PlateNumber = request.PlateNumber,
            Model = request.Model,
            Capacity = request.Capacity,
            GpsTrackerId = request.GpsTrackerId,
            IsOwned = request.IsOwned
        };

        db.Vehicles.Add(vehicle);
        await db.SaveChangesAsync(ct);
        await audit.LogAsync("CREATE", nameof(Vehicle), vehicle.Id.ToString(), null, vehicle, ct);
        return ApiResult<VehicleDto>.Ok(Map(vehicle));
    }

    public async Task<ApiResult<VehicleDto>> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var vehicle = await db.Vehicles.AsNoTracking().FirstOrDefaultAsync(v => v.Id == id, ct);
        return vehicle is null ? ApiResult<VehicleDto>.Fail("Транспорт не найден.") : ApiResult<VehicleDto>.Ok(Map(vehicle));
    }

    public async Task<ApiResult<PaginatedList<VehicleDto>>> GetAllAsync(int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var query = db.Vehicles.AsNoTracking();
        var total = await query.CountAsync(ct);
        var items = await query.OrderBy(v => v.PlateNumber)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(v => new VehicleDto(v.Id, v.PlateNumber, v.Model, v.Capacity, v.GpsTrackerId, v.Status, v.IsOwned))
            .ToListAsync(ct);
        return ApiResult<PaginatedList<VehicleDto>>.Ok(new PaginatedList<VehicleDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize });
    }

    public async Task<ApiResult<VehicleDto>> UpdateStatusAsync(Guid id, UpdateVehicleStatusRequest request, CancellationToken ct = default)
    {
        var vehicle = await db.Vehicles.FindAsync([id], ct);
        if (vehicle is null) return ApiResult<VehicleDto>.Fail("Транспорт не найден.");
        var old = vehicle.Status;
        vehicle.Status = request.Status;
        vehicle.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        await audit.LogAsync("UPDATE_STATUS", nameof(Vehicle), id.ToString(), new { old }, new { request.Status }, ct);
        return ApiResult<VehicleDto>.Ok(Map(vehicle));
    }

    private static VehicleDto Map(Vehicle v) =>
        new(v.Id, v.PlateNumber, v.Model, v.Capacity, v.GpsTrackerId, v.Status, v.IsOwned);
}
