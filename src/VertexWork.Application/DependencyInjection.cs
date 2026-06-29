using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using VertexWork.Application.DTOs.Auth;
using VertexWork.Application.DTOs.Clients;
using VertexWork.Application.DTOs.Orders;
using VertexWork.Application.DTOs.Vehicles;

namespace VertexWork.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<CreateOrderRequestValidator>();
        return services;
    }
}

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}

public class CreateClientRequestValidator : AbstractValidator<CreateClientRequest>
{
    public CreateClientRequestValidator()
    {
        RuleFor(x => x.CompanyName).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Inn).NotEmpty().Length(10, 12);
        RuleFor(x => x.CreditLimit).GreaterThanOrEqualTo(0);
    }
}

public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(x => x.ClientId).NotEmpty();
        RuleFor(x => x.MaterialType).NotEmpty();
        RuleFor(x => x.QuantityOrdered).GreaterThan(0);
        RuleFor(x => x.PricePerTon).GreaterThan(0);
        RuleFor(x => x.DeliveryAddress).NotEmpty();
    }
}

public class CreateVehicleRequestValidator : AbstractValidator<CreateVehicleRequest>
{
    public CreateVehicleRequestValidator()
    {
        RuleFor(x => x.PlateNumber).NotEmpty();
        RuleFor(x => x.Model).NotEmpty();
        RuleFor(x => x.Capacity).GreaterThan(0);
    }
}
