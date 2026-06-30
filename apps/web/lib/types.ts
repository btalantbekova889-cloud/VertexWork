export type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  errors: string[];
};

export type PaginatedList<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const AppRoles = {
  GeneralDirector: "GeneralDirector",
  CommercialDirector: "CommercialDirector",
  Accountant: "Accountant",
  SalesManager: "SalesManager",
  QuarryChief: "QuarryChief",
  Dispatcher: "Dispatcher",
  Weigher: "Weigher",
  Storekeeper: "Storekeeper",
  HrManager: "HrManager",
  Driver: "Driver",
} as const;

export type AppRole = (typeof AppRoles)[keyof typeof AppRoles];

export const RoleLabels: Record<string, string> = {
  GeneralDirector: "Генеральный директор",
  CommercialDirector: "Коммерческий директор",
  Accountant: "Бухгалтер",
  SalesManager: "Менеджер по продажам",
  QuarryChief: "Начальник карьера",
  Dispatcher: "Диспетчер",
  Weigher: "Весовщик",
  Storekeeper: "Кладовщик",
  HrManager: "HR-менеджер",
  Driver: "Водитель",
};

export type SessionUser = {
  userId: string;
  email: string;
  fullName: string;
  role: string;
};

export type LoginResponse = {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  requiresTwoFactor: boolean;
};

export const OrderStatus = {
  New: 0,
  Paid: 1,
  InProduction: 2,
  AtScale: 3,
  InTransit: 4,
  Delivered: 5,
  Closed: 6,
  Rejected: 7,
} as const;

export type OrderStatusValue = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderStatusLabels: Record<number, string> = {
  0: "Новый",
  1: "Оплачен",
  2: "В производстве",
  3: "На весовой",
  4: "В пути",
  5: "Доставлен",
  6: "Закрыт",
  7: "Отклонён",
};

export const OrderStatusNameLabels: Record<string, string> = {
  New: "Новый",
  Paid: "Оплачен",
  InProduction: "В производстве",
  AtScale: "На весовой",
  InTransit: "В пути",
  Delivered: "Доставлен",
  Closed: "Закрыт",
  Rejected: "Отклонён",
};

export const VehicleStatus = {
  Available: 0,
  OnTrip: 1,
  Maintenance: 2,
} as const;

export const VehicleStatusLabels: Record<number, string> = {
  0: "Свободен",
  1: "В рейсе",
  2: "На обслуживании",
};

export type OrderDto = {
  id: string;
  clientId: string;
  clientName: string;
  materialType: string;
  quantityOrdered: number;
  pricePerTon: number;
  totalSum: number;
  status: number;
  deliveryAddress: string;
  createdAt: string;
  assignedVehicleId?: string | null;
  assignedVehiclePlate?: string | null;
  financeApprovedAt?: string | null;
  dispatchedAt?: string | null;
  closedAt?: string | null;
};

export type CreateOrderRequest = {
  clientId: string;
  materialType: string;
  quantityOrdered: number;
  pricePerTon: number;
  deliveryAddress: string;
  notes?: string | null;
};

export type ClientDto = {
  id: string;
  companyName: string;
  inn: string;
  phone?: string | null;
  email?: string | null;
  balance: number;
  creditLimit: number;
  managerId?: string | null;
  managerName?: string | null;
};

export type CreateClientRequest = {
  companyName: string;
  inn: string;
  phone?: string | null;
  email?: string | null;
  creditLimit: number;
};

export type UpdateClientRequest = {
  companyName: string;
  phone?: string | null;
  email?: string | null;
  creditLimit: number;
};

export type VehicleDto = {
  id: string;
  plateNumber: string;
  model: string;
  capacity: number;
  gpsTrackerId?: string | null;
  status: number;
  isOwned: boolean;
};

export type CreateVehicleRequest = {
  plateNumber: string;
  model: string;
  capacity: number;
  gpsTrackerId?: string | null;
  isOwned: boolean;
};

export type WarehouseStockDto = {
  id: string;
  siteName: string;
  materialType: string;
  quantityTons: number;
  reservedTons: number;
  availableTons: number;
};

export type DashboardSummaryDto = {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  marginPercent: number;
  activeOrders: number;
  ordersInTransit: number;
  availableVehicles: number;
  totalStockTons: number;
};

export type OrderPipelineItemDto = {
  orderId: string;
  clientName: string;
  materialType: string;
  quantityOrdered: number;
  status: string;
  createdAt: string;
};

export type AuditLogDto = {
  id: string;
  userId?: string | null;
  userName?: string | null;
  action: string;
  entityName: string;
  entityId?: string | null;
  oldValues?: string | null;
  newValues?: string | null;
  timestamp: string;
  ipAddress?: string | null;
};
