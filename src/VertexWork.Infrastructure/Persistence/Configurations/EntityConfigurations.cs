using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VertexWork.Domain.Entities;

namespace VertexWork.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(x => x.Email).IsUnique();
        builder.Property(x => x.Email).HasMaxLength(256).IsRequired();
        builder.Property(x => x.FullName).HasMaxLength(256).IsRequired();
        builder.Property(x => x.Phone).HasMaxLength(32);
        builder.HasOne(x => x.Role).WithMany(x => x.Users).HasForeignKey(x => x.RoleId);
    }
}

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasIndex(x => x.Name).IsUnique();
        builder.Property(x => x.Name).HasMaxLength(64).IsRequired();
        builder.Property(x => x.DisplayName).HasMaxLength(128).IsRequired();
    }
}

public class ClientConfiguration : IEntityTypeConfiguration<Client>
{
    public void Configure(EntityTypeBuilder<Client> builder)
    {
        builder.HasIndex(x => x.Inn).IsUnique();
        builder.Property(x => x.CompanyName).HasMaxLength(256).IsRequired();
        builder.Property(x => x.Inn).HasMaxLength(12).IsRequired();
        builder.Property(x => x.Balance).HasPrecision(18, 2);
        builder.Property(x => x.CreditLimit).HasPrecision(18, 2);
        builder.HasOne(x => x.Manager).WithMany(x => x.ManagedClients).HasForeignKey(x => x.ManagerId);
    }
}

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property(x => x.MaterialType).HasMaxLength(64).IsRequired();
        builder.Property(x => x.QuantityOrdered).HasPrecision(18, 3);
        builder.Property(x => x.PricePerTon).HasPrecision(18, 2);
        builder.Property(x => x.TotalSum).HasPrecision(18, 2);
        builder.Property(x => x.DeliveryAddress).HasMaxLength(512).IsRequired();
        builder.HasOne(x => x.Client).WithMany(x => x.Orders).HasForeignKey(x => x.ClientId);
        builder.HasOne(x => x.CreatedBy).WithMany(x => x.CreatedOrders).HasForeignKey(x => x.CreatedById);
        builder.HasOne(x => x.AssignedVehicle).WithMany(x => x.Orders).HasForeignKey(x => x.AssignedVehicleId);
        builder.HasOne(x => x.AssignedDriver).WithMany().HasForeignKey(x => x.AssignedDriverId);
        builder.HasOne(x => x.Waybill).WithOne(x => x.Order).HasForeignKey<Waybill>(x => x.OrderId);
    }
}

public class WaybillConfiguration : IEntityTypeConfiguration<Waybill>
{
    public void Configure(EntityTypeBuilder<Waybill> builder)
    {
        builder.HasIndex(x => x.OrderId).IsUnique();
        builder.Property(x => x.WeightIn).HasPrecision(18, 3);
        builder.Property(x => x.WeightOut).HasPrecision(18, 3);
        builder.Ignore(x => x.WeightNet);
    }
}

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.HasIndex(x => x.PlateNumber).IsUnique();
        builder.Property(x => x.PlateNumber).HasMaxLength(16).IsRequired();
        builder.Property(x => x.Model).HasMaxLength(128).IsRequired();
        builder.Property(x => x.Capacity).HasPrecision(18, 2);
    }
}

public class WarehouseStockConfiguration : IEntityTypeConfiguration<WarehouseStock>
{
    public void Configure(EntityTypeBuilder<WarehouseStock> builder)
    {
        builder.HasIndex(x => new { x.SiteName, x.MaterialType }).IsUnique();
        builder.Property(x => x.SiteName).HasMaxLength(128).IsRequired();
        builder.Property(x => x.MaterialType).HasMaxLength(64).IsRequired();
        builder.Property(x => x.QuantityTons).HasPrecision(18, 3);
        builder.Property(x => x.ReservedTons).HasPrecision(18, 3);
    }
}

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.HasIndex(x => x.Timestamp);
        builder.Property(x => x.Action).HasMaxLength(128).IsRequired();
        builder.Property(x => x.EntityName).HasMaxLength(128).IsRequired();
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
    }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasIndex(x => x.Token).IsUnique();
        builder.Property(x => x.Token).HasMaxLength(512).IsRequired();
        builder.HasOne(x => x.User).WithMany(x => x.RefreshTokens).HasForeignKey(x => x.UserId);
    }
}
