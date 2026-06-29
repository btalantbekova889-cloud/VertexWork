'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Settings, Bell, Shield, Database, ChevronRight } from 'lucide-react';

const SETTING_GROUPS = [
  {
    icon: <Settings size={16} />,
    label: 'Общие настройки',
    color: 'text-blue-600',
    items: [
      { label: 'Название компании', value: 'ОАО "VertexWork"', type: 'text' },
      { label: 'ИНН', value: '220540012345', type: 'text' },
      { label: 'Адрес', value: 'г. Бишкек, ул. Абая 150', type: 'text' },
      { label: 'Телефон', value: '+996 312 123-456', type: 'text' },
    ],
  },
  {
    icon: <Bell size={16} />,
    label: 'Уведомления',
    color: 'text-amber-500',
    items: [
      { label: 'Новый заказ', value: true, type: 'toggle' },
      { label: 'Задолженность клиента', value: true, type: 'toggle' },
      { label: 'Низкий остаток на складе', value: true, type: 'toggle' },
      { label: 'ТО техники', value: false, type: 'toggle' },
      { label: 'Выход сотрудника за периметр', value: true, type: 'toggle' },
    ],
  },
  {
    icon: <Shield size={16} />,
    label: 'Безопасность',
    color: 'text-red-500',
    items: [
      { label: 'Двухфакторная аутентификация', value: false, type: 'toggle' },
      { label: 'Автоматический выход (мин)', value: '30', type: 'text' },
      { label: 'Журнал действий', value: true, type: 'toggle' },
      { label: 'IP-ограничения', value: false, type: 'toggle' },
    ],
  },
  {
    icon: <Database size={16} />,
    label: 'Система',
    color: 'text-purple-600',
    items: [
      { label: 'Язык интерфейса', value: 'Русский', type: 'select' },
      { label: 'Часовой пояс', value: 'UTC+6 (Бишкек)', type: 'select' },
      { label: 'Валюта', value: 'KGS (сом)', type: 'select' },
      { label: 'Автобэкап', value: true, type: 'toggle' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <AppLayout title="Настройки" subtitle="Конфигурация системы">
      <div className="max-w-3xl space-y-4">
        {SETTING_GROUPS.map((group, gi) => (
          <div key={gi} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
              <span className={group.color}>{group.icon}</span>
              {group.label}
            </h3>
            <div className="space-y-0 divide-y divide-gray-50">
              {group.items.map((item, ii) => (
                <div key={ii} className="flex items-center justify-between py-3">
                  <p className="text-gray-600 text-sm">{item.label}</p>
                  <div>
                    {item.type === 'toggle' ? (
                      <button
                        className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 ${
                          item.value ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        style={{ width: '40px', height: '22px' }}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-[3px] transition-transform shadow-sm ${
                          item.value ? 'translate-x-[19px]' : 'translate-x-[3px]'
                        }`} />
                      </button>
                    ) : item.type === 'select' ? (
                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                        {item.value}
                        <ChevronRight size={13} className="text-gray-400" />
                      </button>
                    ) : (
                      <input
                        type="text"
                        defaultValue={item.value as string}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 w-56 focus:outline-none focus:border-blue-400 transition-colors text-right"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 text-sm transition-colors">
            Отмена
          </button>
          <button className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            Сохранить изменения
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
