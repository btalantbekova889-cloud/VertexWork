export type UserRole =
  | 'director'
  | 'coo'
  | 'commercial_director'
  | 'financial_director'
  | 'accountant'
  | 'hr'
  | 'quarry_manager'
  | 'marketer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  director:            'Генеральный директор',
  coo:                 'Исполнительный директор',
  commercial_director: 'Коммерческий директор',
  financial_director:  'Финансовый директор',
  accountant:          'Бухгалтер',
  hr:                  'HR-менеджер',
  quarry_manager:      'Директор карьера',
  marketer:            'Маркетолог',
};
