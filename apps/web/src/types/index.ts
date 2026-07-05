export type UserRole =
  | 'director'
  | 'coo'
  | 'commercial_director'
  | 'financial_director'
  | 'hr'
  | 'lawyer'
  | 'it_specialist'
  | 'marketer'
  | 'sales_manager'
  | 'logist'
  | 'tender_specialist'
  | 'operator'
  | 'accountant'
  | 'purchaser'
  | 'smm_manager'
  | 'content_marketer'
  | 'office_admin'
  | 'production_director'
  | 'quarry_manager'
  | 'logistics_head';

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
  hr:                  'HR-менеджер',
  lawyer:              'Юрист',
  it_specialist:       'IT-специалист',
  marketer:            'Маркетолог',
  sales_manager:       'Менеджер по продажам',
  logist:              'Логист',
  tender_specialist:   'Специалист по тендерам',
  operator:            'Оператор',
  accountant:          'Бухгалтер',
  purchaser:           'Закупщик',
  smm_manager:         'SMM-менеджер',
  content_marketer:    'Контент-маркетолог',
  office_admin:        'Администратор офиса',
  production_director: 'Производственный директор',
  quarry_manager:      'Директор карьера',
  logistics_head:      'Руководитель логистики',
};
