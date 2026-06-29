using VertexWork.Domain.Enums;

namespace VertexWork.Application.DTOs.Clients;

public record ClientDto(
    Guid Id,
    string CompanyName,
    string Inn,
    string? Phone,
    string? Email,
    decimal Balance,
    decimal CreditLimit,
    Guid? ManagerId,
    string? ManagerName);

public record CreateClientRequest(
    string CompanyName,
    string Inn,
    string? Phone,
    string? Email,
    decimal CreditLimit);

public record UpdateClientRequest(
    string CompanyName,
    string? Phone,
    string? Email,
    decimal CreditLimit);
