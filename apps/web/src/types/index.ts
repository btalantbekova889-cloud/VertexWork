export type UserRole =
  | 'director'
  | 'commercial_director'
  | 'accountant'
  | 'hr'
  | 'quarry_manager';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  director: 'Генеральный директор',
  commercial_director: 'Коммерческий директор',
  accountant: 'Бухгалтер',
  hr: 'HR',
  quarry_manager: 'Начальник карьера',
};
