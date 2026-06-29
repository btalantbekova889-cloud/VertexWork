using VertexWork.Domain.Common;

namespace VertexWork.Domain.Entities;

public class WarehouseStock : BaseEntity
{
    public string SiteName { get; set; } = string.Empty;
    public string MaterialType { get; set; } = string.Empty;
    public decimal QuantityTons { get; set; }
    public decimal ReservedTons { get; set; }
}
