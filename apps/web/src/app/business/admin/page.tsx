'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Shield, UserCog, Key, Activity, Plus } from 'lucide-react';

const USERS = [
  { name: 'Марупов Асылбек', role: 'Генеральный директор', email: 'director@vertex.kg', lastLogin: '29.06.2026 09:12', status: 'active' },
  { name: 'Касымова Айгуль', role: 'Коммерческий директор', email: 'commercial@vertex.kg', lastLogin: '29.06.2026 08:55', status: 'active' },
  { name: 'Жакупова Нурия', role: 'Бухгалтер', email: 'accountant@vertex.kg', lastLogin: '29.06.2026 09:30', status: 'active' },
  { name: 'Сейтов Дамир', role: 'HR', email: 'hr@vertex.kg', lastLogin: '29.06.2026 08:40', status: 'active' },
  { name: 'Ержанов Болат', role: 'Нач. карьера', email: 'quarry@vertex.kg', lastLogin: '29.06.2026 07:15', status: 'active' },
];

const AUDIT_LOG = [
  { user: 'Касымова А.', action: 'Создан заказ ОРД-2847', time: '29.06 09:45' },
  { user: 'Ержанов Б.', action: 'Назначена машина A 147 KZ на рейс', time: '29.06 09:30' },
  { user: 'Ержанов Б.', action: 'Взвешивание — накладная ВС-4521', time: '29.06 08:55' },
  { user: 'Жакупова Н.', action: 'Платеж подтвержден — 480 000 сом', time: '29.06 08:40' },
  { user: 'Ержанов Б.', action: 'Пропуск выдан — A 147 KZ', time: '29.06 08:30' },
  { user: 'Сейтов Д.', action: 'Добавлен сотрудник Жаксыбеков А.', time: '28.06 17:20' },
];

export default function AdminPage() {
  return (
    <AppLayout title="Администрирование" subtitle="Управление пользователями и доступами">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Пользователей', value: USERS.length, color: 'text-blue-600' },
          { label: 'Активных сейчас', value: 4, color: 'text-green-600' },
          { label: 'Ролей в системе', value: 5, color: 'text-purple-600' },
          { label: 'Событий сегодня', value: 124, color: 'text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-semibold">Пользователи системы</h3>
            <button className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1">
              <Plus size={12} /> Добавить
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Пользователь</th>
                  <th className="text-left pb-2 font-medium">Роль</th>
                  <th className="text-left pb-2 font-medium">Email</th>
                  <th className="text-left pb-2 font-medium">Последний вход</th>
                  <th className="text-center pb-2 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {USERS.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                          {u.name[0]}
                        </div>
                        <span className="text-gray-800 font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-gray-500 text-xs">{u.role}</td>
                    <td className="py-2.5 text-gray-400 text-xs font-mono">{u.email}</td>
                    <td className="py-2.5 text-gray-400 text-xs">{u.lastLogin}</td>
                    <td className="py-2.5 text-center">
                      <span className="text-xs px-1.5 py-0.5 rounded border text-green-700 bg-green-50 border-green-200">Активен</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
            <Activity size={15} className="text-blue-600" /> Журнал действий
          </h3>
          <div className="space-y-3">
            {AUDIT_LOG.map((log, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium">{log.user}</p>
                  <p className="text-gray-500">{log.action}</p>
                  <p className="text-gray-400 mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
