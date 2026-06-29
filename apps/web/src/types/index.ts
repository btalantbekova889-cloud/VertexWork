export type UserRole =
  | 'director'
  | 'commercial_director'
  | 'accountant'
  | 'hr'
  | 'quarry_manager'
  | 'dispatcher'
  | 'logistician'
  | 'weigher'
  | 'warehouse_keeper'
  | 'security';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  director: 'Генеральный директор',
  commercial_director: 'Коммерческий директор',
  accountant: 'Бухгалтер',
  hr: 'HR',
  quarry_manager: 'Начальник карьера',
  dispatcher: 'Диспетчер',
  logistician: 'Логист',
  weigher: 'Весовщик',
  warehouse_keeper: 'Кладовщик',
  security: 'Охрана',
};

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
  roles?: UserRole[];
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: string;
}
