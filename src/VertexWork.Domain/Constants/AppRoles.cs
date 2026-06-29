namespace VertexWork.Domain.Constants;

public static class AppRoles
{
    public const string GeneralDirector = "GeneralDirector";
    public const string CommercialDirector = "CommercialDirector";
    public const string Accountant = "Accountant";
    public const string SalesManager = "SalesManager";
    public const string QuarryChief = "QuarryChief";
    public const string Dispatcher = "Dispatcher";
    public const string Weigher = "Weigher";
    public const string Storekeeper = "Storekeeper";
    public const string HrManager = "HrManager";
    public const string Driver = "Driver";

    public static readonly IReadOnlyList<string> All =
    [
        GeneralDirector,
        CommercialDirector,
        Accountant,
        SalesManager,
        QuarryChief,
        Dispatcher,
        Weigher,
        Storekeeper,
        HrManager,
        Driver
    ];
}
