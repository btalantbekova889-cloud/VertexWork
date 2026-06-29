'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Settings, Bell, Shield, Globe, Database, ChevronRight } from 'lucide-react';

const SETTING_GROUPS = [
  {
    icon: <Settings size={18} />,
    label: 'Общие настройки',
    color: 'text-cyan-400',
    items: [
      { label: 'Название компании', value: 'ТОО "VertexWork"', type: 'text' },
      { label: 'ИИН/БИН', value: '220540012345', type: 'text' },
      { label: 'Адрес', value: 'г. Алматы, ул. Абая 150', type: 'text' },
      { label: 'Телефон', value: '+7 727 123-45-67', type: 'text' },
    ],
  },
  {
    icon: <Bell size={18} />,
    label: 'Уведомления',
    color: 'text-yellow-400',
    items: [
      { label: 'Новый заказ', value: true, type: 'toggle' },
      { label: 'Задолженность клиента', value: true, type: 'toggle' },
      { label: 'Низкий остаток на складе', value: true, type: 'toggle' },
      { label: 'ТО техники', value: false, type: 'toggle' },
      { label: 'Выход сотрудника за периметр', value: true, type: 'toggle' },
    ],
  },
  {
    icon: <Shield size={18} />,
    label: 'Безопасность',
    color: 'text-red-400',
    items: [
      { label: 'Двухфакторная аутентификация', value: false, type: 'toggle' },
      { label: 'Автоматический выход (мин)', value: '30', type: 'text' },
      { label: 'Журнал действий', value: true, type: 'toggle' },
      { label: 'IP-ограничения', value: false, type: 'toggle' },
    ],
  },
  {
    icon: <Database size={18} />,
    label: 'Система',
    color: 'text-purple-400',
    items: [
      { label: 'Язык интерфейса', value: 'Русский', type: 'select' },
      { label: 'Часовой пояс', value: 'UTC+6 (Алматы)', type: 'select' },
      { label: 'Валюта', value: 'KZT (₸)', type: 'select' },
      { label: 'Автобэкап', value: true, type: 'toggle' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <AppLayout title="Настройки" subtitle="Конфигурация системы">
      <div className="max-w-3xl space-y-4">
        {SETTING_GROUPS.map((group, gi) => (
          <div key={gi} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className={group.color}>{group.icon}</span>
              {group.label}
            </h3>
            <div className="space-y-1 divide-y divide-slate-800">
              {group.items.map((item, ii) => (
                <div key={ii} className="flex items-center justify-between py-3">
                  <p className="text-slate-300 text-sm">{item.label}</p>
                  <div>
                    {item.type === 'toggle' ? (
                      <button
                        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                          item.value ? 'bg-cyan-500' : 'bg-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          item.value ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    ) : item.type === 'select' ? (
                      <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 transition-colors">
                        {item.value}
                        <ChevronRight size={14} className="text-slate-500" />
                      </button>
                    ) : (
                      <input
                        type="text"
                        defaultValue={item.value as string}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 w-56 focus:outline-none focus:border-cyan-500/50 transition-colors text-right"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-sm transition-colors">
            Отмена
          </button>
          <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all">
            Сохранить изменения
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
