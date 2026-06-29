using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using VertexWork.Application.Interfaces;
using VertexWork.Domain.Constants;
using VertexWork.Domain.Entities;
using VertexWork.Domain.Enums;
using VertexWork.Infrastructure.Auth;
using VertexWork.Infrastructure.Options;
using VertexWork.Infrastructure.Persistence;
using VertexWork.Infrastructure.Services;

namespace VertexWork.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
        services.Configure<CookieSettings>(configuration.GetSection(CookieSettings.SectionName));

        var provider = configuration.GetValue<string>("Database:Provider") ?? "Postgres";
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");

        services.AddDbContext<AppDbContext>(options =>
        {
            if (string.Equals(provider, "Sqlite", StringComparison.OrdinalIgnoreCase))
                options.UseSqlite(connectionString);
            else
                options.UseNpgsql(connectionString);
        });

        var redisConnection = configuration.GetConnectionString("Redis");
        if (!string.IsNullOrWhiteSpace(redisConnection))
        {
            services.AddSingleton<IConnectionMultiplexer>(_ =>
                ConnectionMultiplexer.Connect(new ConfigurationOptions
                {
                    EndPoints = { redisConnection },
                    AbortOnConnectFail = false
                }));
        }

        services.AddHttpContextAccessor();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<ITotpService, TotpService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IClientService, ClientService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IVehicleService, VehicleService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IWarehouseService, WarehouseService>();
        services.AddScoped<IAuditQueryService, AuditQueryService>();

        return services;
    }

    public static async Task InitializeDatabaseAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var provider = configuration.GetValue<string>("Database:Provider") ?? "Postgres";

        if (string.Equals(provider, "Sqlite", StringComparison.OrdinalIgnoreCase))
            await db.Database.EnsureCreatedAsync();
        else
            await db.Database.MigrateAsync();

        await DatabaseSeeder.SeedAsync(db, scope.ServiceProvider.GetRequiredService<IPasswordHasher>());
    }
}

internal static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext db, IPasswordHasher passwordHasher)
    {
        if (await db.Roles.AnyAsync()) return;

        var roles = AppRoles.All.Select(name => new Domain.Entities.Role
        {
            Name = name,
            DisplayName = name switch
            {
                AppRoles.GeneralDirector => "Генеральный директор",
                AppRoles.CommercialDirector => "Коммерческий директор",
                AppRoles.Accountant => "Бухгалтер",
                AppRoles.SalesManager => "Менеджер по продажам",
                AppRoles.QuarryChief => "Начальник карьера",
                AppRoles.Dispatcher => "Диспетчер",
                AppRoles.Weigher => "Весовщик",
                AppRoles.Storekeeper => "Кладовщик",
                AppRoles.HrManager => "HR-менеджер",
                AppRoles.Driver => "Водитель",
                _ => name
            }
        }).ToList();

        db.Roles.AddRange(roles);
        await db.SaveChangesAsync();

        var roleMap = await db.Roles.ToDictionaryAsync(r => r.Name, r => r.Id);
        var demoUsers = new[]
        {
            ("director@vertex.ru", "Генеральный директор", AppRoles.GeneralDirector),
            ("sales@vertex.ru", "Иван Менеджер", AppRoles.SalesManager),
            ("finance@vertex.ru", "Ольга Бухгалтер", AppRoles.Accountant),
            ("dispatch@vertex.ru", "Сергей Диспетчер", AppRoles.Dispatcher),
            ("weigher@vertex.ru", "Пётр Весовщик", AppRoles.Weigher),
            ("quarry@vertex.ru", "Алексей Начальник карьера", AppRoles.QuarryChief)
        };

        foreach (var (email, name, role) in demoUsers)
        {
            db.Users.Add(new User
            {
                Email = email,
                FullName = name,
                PasswordHash = passwordHasher.Hash("Vertex2026!"),
                RoleId = roleMap[role],
                Status = UserStatus.Active
            });
        }

        db.Clients.AddRange(
            new Client { CompanyName = "ООО СтройПуть", Inn = "7701234567", Balance = 500000, CreditLimit = 200000, Phone = "+7-495-111-22-33" },
            new Client { CompanyName = "АО ДорСтрой", Inn = "7707654321", Balance = 120000, CreditLimit = 500000, Phone = "+7-495-444-55-66" }
        );

        db.Vehicles.AddRange(
            new Vehicle { PlateNumber = "А123BC77", Model = "KAMAZ 65115", Capacity = 20, GpsTrackerId = "WIALON-001", Status = VehicleStatus.Available },
            new Vehicle { PlateNumber = "В456DE77", Model = "Volvo FMX", Capacity = 25, GpsTrackerId = "WIALON-002", Status = VehicleStatus.Available }
        );

        db.WarehouseStocks.AddRange(
            new WarehouseStock { SiteName = "Карьер Северный", MaterialType = "Щебень 5-20", QuantityTons = 15000, ReservedTons = 0 },
            new WarehouseStock { SiteName = "Карьер Северный", MaterialType = "Щебень 10-20", QuantityTons = 12000, ReservedTons = 0 },
            new WarehouseStock { SiteName = "Карьер Южный", MaterialType = "Щебень 20-40", QuantityTons = 8000, ReservedTons = 0 }
        );

        await db.SaveChangesAsync();
    }
}
