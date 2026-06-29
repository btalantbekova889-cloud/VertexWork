using Microsoft.EntityFrameworkCore;
using VertexWork.Application.Common;
using VertexWork.Application.DTOs.Orders;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Entities;
using VertexWork.Domain.Enums;
using VertexWork.Infrastructure.Persistence;

namespace VertexWork.Infrastructure.Services;

public class OrderService(AppDbContext db, ICurrentUserService currentUser, IAuditService audit) : IOrderService
{
    public async Task<ApiResult<OrderDto>> CreateAsync(CreateOrderRequest request, CancellationToken ct = default)
    {
        var client = await db.Clients.FindAsync([request.ClientId], ct);
        if (client is null) return ApiResult<OrderDto>.Fail("Клиент не найден.");
        if (currentUser.UserId is null) return ApiResult<OrderDto>.Fail("Пользователь не авторизован.");

        var total = Math.Round(request.QuantityOrdered * request.PricePerTon, 2);
        var order = new Order
        {
            ClientId = request.ClientId,
            CreatedById = currentUser.UserId.Value,
            MaterialType = request.MaterialType,
            QuantityOrdered = request.QuantityOrdered,
            PricePerTon = request.PricePerTon,
            TotalSum = total,
            DeliveryAddress = request.DeliveryAddress,
            Notes = request.Notes,
            Status = OrderStatus.New,
            ContractDocPath = $"docs/contracts/{Guid.NewGuid():N}.pdf",
            InvoiceDocPath = $"docs/invoices/{Guid.NewGuid():N}.pdf"
        };

        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);
        await audit.LogAsync("CREATE", nameof(Order), order.Id.ToString(), null, order, ct);
        return ApiResult<OrderDto>.Ok((await MapAsync(order.Id, ct))!);
    }

    public async Task<ApiResult<OrderDto>> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var dto = await MapAsync(id, ct);
        return dto is null ? ApiResult<OrderDto>.Fail("Заказ не найден.") : ApiResult<OrderDto>.Ok(dto);
    }

    public async Task<ApiResult<PaginatedList<OrderDto>>> GetAllAsync(OrderStatus? status, int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Orders.AsNoTracking()
            .Include(o => o.Client)
            .Include(o => o.AssignedVehicle)
            .AsQueryable();

        if (status.HasValue) query = query.Where(o => o.Status == status.Value);

        var total = await query.CountAsync(ct);
        var ids = await query.OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(o => o.Id).ToListAsync(ct);

        var items = new List<OrderDto>();
        foreach (var id in ids) items.Add((await MapAsync(id, ct))!);

        return ApiResult<PaginatedList<OrderDto>>.Ok(new PaginatedList<OrderDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize });
    }

    public async Task<ApiResult<OrderDto>> ApproveFinanceAsync(Guid id, FinanceApprovalRequest request, CancellationToken ct = default)
    {
        var order = await db.Orders.Include(o => o.Client).FirstOrDefaultAsync(o => o.Id == id, ct);
        if (order is null) return ApiResult<OrderDto>.Fail("Заказ не найден.");
        if (order.Status != OrderStatus.New) return ApiResult<OrderDto>.Fail("Финансовая проверка доступна только для новых заказов.");

        if (!request.Approved)
        {
            order.Status = OrderStatus.Rejected;
            order.Notes = request.Comment;
            await db.SaveChangesAsync(ct);
            await audit.LogAsync("FINANCE_REJECT", nameof(Order), id.ToString(), null, order, ct);
            return ApiResult<OrderDto>.Ok((await MapAsync(id, ct))!);
        }

        var client = order.Client;
        var availableCredit = client.Balance + client.CreditLimit;
        if (availableCredit < order.TotalSum)
            return ApiResult<OrderDto>.Fail($"Недостаточно средств. Доступно: {availableCredit:N2}, требуется: {order.TotalSum:N2}.");

        order.Status = OrderStatus.Paid;
        order.FinanceApprovedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        await audit.LogAsync("FINANCE_APPROVE", nameof(Order), id.ToString(), null, order, ct);
        return ApiResult<OrderDto>.Ok((await MapAsync(id, ct))!);
    }

    public async Task<ApiResult<OrderDto>> DispatchAsync(Guid id, DispatchOrderRequest request, CancellationToken ct = default)
    {
        var order = await db.Orders.FindAsync([id], ct);
        if (order is null) return ApiResult<OrderDto>.Fail("Заказ не найден.");
        if (order.Status != OrderStatus.Paid && order.Status != OrderStatus.InProduction)
            return ApiResult<OrderDto>.Fail("Назначение транспорта доступно после финансового одобрения.");

        var vehicle = await db.Vehicles.FindAsync([request.VehicleId], ct);
        if (vehicle is null) return ApiResult<OrderDto>.Fail("Транспорт не найден.");
        if (vehicle.Status != VehicleStatus.Available) return ApiResult<OrderDto>.Fail("Транспорт недоступен.");

        order.AssignedVehicleId = request.VehicleId;
        order.AssignedDriverId = request.DriverId;
        order.Status = OrderStatus.InProduction;
        order.DispatchedAt = DateTime.UtcNow;
        vehicle.Status = VehicleStatus.OnTrip;

        await db.SaveChangesAsync(ct);
        await audit.LogAsync("DISPATCH", nameof(Order), id.ToString(), null, order, ct);
        return ApiResult<OrderDto>.Ok((await MapAsync(id, ct))!);
    }

    public async Task<ApiResult<OrderDto>> ConfirmQuarryAsync(Guid id, QuarryConfirmRequest request, CancellationToken ct = default)
    {
        var order = await db.Orders.FindAsync([id], ct);
        if (order is null) return ApiResult<OrderDto>.Fail("Заказ не найден.");
        if (order.Status != OrderStatus.InProduction) return ApiResult<OrderDto>.Fail("Подтверждение карьера доступно для заказов в производстве.");

        if (!request.MaterialAvailable)
            return ApiResult<OrderDto>.Fail("Материал недоступен на карьере.");

        var stock = await db.WarehouseStocks.FirstOrDefaultAsync(s => s.MaterialType == order.MaterialType, ct);
        if (stock is null || stock.QuantityTons - stock.ReservedTons < order.QuantityOrdered)
            return ApiResult<OrderDto>.Fail("Недостаточно остатков на складе.");

        stock.ReservedTons += order.QuantityOrdered;
        await db.SaveChangesAsync(ct);
        await audit.LogAsync("QUARRY_CONFIRM", nameof(Order), id.ToString(), null, order, ct);
        return ApiResult<OrderDto>.Ok((await MapAsync(id, ct))!);
    }

    public async Task<ApiResult<OrderDto>> RecordWeighingAsync(Guid id, WeighingRequest request, CancellationToken ct = default)
    {
        var order = await db.Orders.FindAsync([id], ct);
        if (order is null) return ApiResult<OrderDto>.Fail("Заказ не найден.");
        if (order.Status != OrderStatus.InProduction) return ApiResult<OrderDto>.Fail("Взвешивание доступно для заказов в производстве.");

        if (request.WeightOut <= request.WeightIn)
            return ApiResult<OrderDto>.Fail("Вес брутто должен быть больше веса тары.");

        var net = request.WeightOut - request.WeightIn;
        var waybill = await db.Waybills.FirstOrDefaultAsync(w => w.OrderId == id, ct);
        if (waybill is null)
        {
            waybill = new Waybill
            {
                OrderId = id,
                VehicleId = request.VehicleId ?? order.AssignedVehicleId,
                DriverId = request.DriverId ?? order.AssignedDriverId,
                WeightIn = request.WeightIn,
                WeightOut = request.WeightOut,
                ScaleOperatorId = currentUser.UserId,
                WeighedAt = DateTime.UtcNow,
                S3DocPath = $"docs/waybills/{Guid.NewGuid():N}.pdf"
            };
            db.Waybills.Add(waybill);
        }
        else
        {
            waybill.WeightIn = request.WeightIn;
            waybill.WeightOut = request.WeightOut;
            waybill.WeighedAt = DateTime.UtcNow;
        }

        order.Status = OrderStatus.AtScale;

        var stock = await db.WarehouseStocks.FirstOrDefaultAsync(s => s.MaterialType == order.MaterialType, ct);
        if (stock is not null)
        {
            stock.QuantityTons -= net;
            stock.ReservedTons = Math.Max(0, stock.ReservedTons - order.QuantityOrdered);
        }

        await db.SaveChangesAsync(ct);
        await audit.LogAsync("WEIGH", nameof(Order), id.ToString(), null, new { net, request.WeightIn, request.WeightOut }, ct);
        return ApiResult<OrderDto>.Ok((await MapAsync(id, ct))!);
    }

    public async Task<ApiResult<OrderDto>> StartTransitAsync(Guid id, CancellationToken ct = default)
    {
        var order = await db.Orders.FindAsync([id], ct);
        if (order is null) return ApiResult<OrderDto>.Fail("Заказ не найден.");
        if (order.Status != OrderStatus.AtScale) return ApiResult<OrderDto>.Fail("Отправка в путь доступна после взвешивания.");

        order.Status = OrderStatus.InTransit;
        await db.SaveChangesAsync(ct);
        await audit.LogAsync("TRANSIT_START", nameof(Order), id.ToString(), null, order, ct);
        return ApiResult<OrderDto>.Ok((await MapAsync(id, ct))!);
    }

    public async Task<ApiResult<OrderDto>> MarkDeliveredAsync(Guid id, CancellationToken ct = default)
    {
        var order = await db.Orders.FindAsync([id], ct);
        if (order is null) return ApiResult<OrderDto>.Fail("Заказ не найден.");
        if (order.Status != OrderStatus.InTransit) return ApiResult<OrderDto>.Fail("Доставка доступна для заказов в пути.");

        order.Status = OrderStatus.Delivered;
        if (order.AssignedVehicleId.HasValue)
        {
            var vehicle = await db.Vehicles.FindAsync([order.AssignedVehicleId.Value], ct);
            if (vehicle is not null) vehicle.Status = VehicleStatus.Available;
        }

        await db.SaveChangesAsync(ct);
        await audit.LogAsync("DELIVERED", nameof(Order), id.ToString(), null, order, ct);
        return ApiResult<OrderDto>.Ok((await MapAsync(id, ct))!);
    }

    public async Task<ApiResult<OrderDto>> CloseAsync(Guid id, CloseOrderRequest request, CancellationToken ct = default)
    {
        var order = await db.Orders.Include(o => o.Client).FirstOrDefaultAsync(o => o.Id == id, ct);
        if (order is null) return ApiResult<OrderDto>.Fail("Заказ не найден.");
        if (order.Status != OrderStatus.Delivered) return ApiResult<OrderDto>.Fail("Закрытие доступно для доставленных заказов.");

        order.Client.Balance -= order.TotalSum;
        order.Status = OrderStatus.Closed;
        order.ClosedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        await audit.LogAsync("CLOSE", nameof(Order), id.ToString(), null, new { request.PaymentReference, order.TotalSum }, ct);
        return ApiResult<OrderDto>.Ok((await MapAsync(id, ct))!);
    }

    private async Task<OrderDto?> MapAsync(Guid id, CancellationToken ct) =>
        await db.Orders.AsNoTracking()
            .Include(o => o.Client)
            .Include(o => o.AssignedVehicle)
            .Where(o => o.Id == id)
            .Select(o => new OrderDto(
                o.Id, o.ClientId, o.Client.CompanyName, o.MaterialType, o.QuantityOrdered,
                o.PricePerTon, o.TotalSum, o.Status, o.DeliveryAddress, o.CreatedAt,
                o.AssignedVehicleId, o.AssignedVehicle != null ? o.AssignedVehicle.PlateNumber : null,
                o.FinanceApprovedAt, o.DispatchedAt, o.ClosedAt))
            .FirstOrDefaultAsync(ct);
}
