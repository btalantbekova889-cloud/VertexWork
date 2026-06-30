import { AppRoles } from "./types";

export type NavItem = {
  href: string;
  label: string;
  roles: string[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Дашборд",
    roles: [AppRoles.GeneralDirector, AppRoles.CommercialDirector, AppRoles.Dispatcher, AppRoles.QuarryChief],
  },
  {
    href: "/orders",
    label: "Заказы",
    roles: Object.values(AppRoles),
  },
  {
    href: "/clients",
    label: "Клиенты",
    roles: [AppRoles.GeneralDirector, AppRoles.CommercialDirector, AppRoles.SalesManager, AppRoles.Accountant],
  },
  {
    href: "/vehicles",
    label: "Транспорт",
    roles: [AppRoles.GeneralDirector, AppRoles.Dispatcher, AppRoles.QuarryChief],
  },
  {
    href: "/warehouse",
    label: "Склад",
    roles: [AppRoles.GeneralDirector, AppRoles.Storekeeper, AppRoles.QuarryChief],
  },
  {
    href: "/audit",
    label: "Журнал аудита",
    roles: [AppRoles.GeneralDirector, AppRoles.HrManager],
  },
];

export function navItemsForRole(role: string | undefined): NavItem[] {
  if (!role) return [];
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
