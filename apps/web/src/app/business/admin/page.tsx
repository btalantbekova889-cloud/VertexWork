'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Shield, UserCog, Key, Activity, Plus } from 'lucide-react';

const USERS = [
  { name: 'Марупов Асылбек', role: 'Генеральный директор', email: 'director@vertex.kz', lastLogin: '29.06.2026 09:12', status: 'active' },
  { name: 'Касымова Айгуль', role: 'Коммерческий директор', email: 'commercial@vertex.kz', lastLogin: '29.06.2026 08:55', status: 'active' },
  { name: 'Жакупова Нурия', role: 'Бухгалтер', email: 'accountant@vertex.kz', lastLogin: '29.06.2026 09:30', status: 'active' },
  { name: 'Сейтов Дамир', role: 'HR', email: 'hr@vertex.kz', lastLogin: '29.06.2026 08:40', status: 'active' },
  { name: 'Ержанов Болат', role: 'Нач. карьера', email: 'quarry@vertex.kz', lastLogin: '29.06.2026 07:15', status: 'active' },
  { name: 'Ахметов Рустам', role: 'Диспетчер', email: 'dispatch@vertex.kz', lastLogin: '28.06.2026 18:00', status: 'active' },
  { name: 'Дюсупов Марат', role: 'Весовщик', email: 'weigher@vertex.kz', lastLogin: '29.06.2026 07:05', status: 'active' },
  { name: 'Байжанов Серик', role: 'Охрана', email: 'security@vertex.kz', lastLogin: '29.06.2026 06:00', status: 'active' },
];

const AUDIT_LOG = [
  { user: 'Касымова А.', action: 'Создан заказ ОРД-2847', time: '29.06 09:45' },
  { user: 'Ахметов Р.', action: 'Назначена машина A 147 KZ на рейс', time: '29.06 09:30' },
  { user: 'Дюсупов М.', action: 'Взвешивание — накладная ВС-4521', time: '29.06 08:55' },
  { user: 'Жакупова Н.', action: 'Платеж подтвержден — 480 000 ₸', time: '29.06 08:40' },
  { user: 'Байжанов С.', action: 'Пропуск выдан — A 147 KZ', time: '29.06 08:30' },
  { user: 'Сейтов Д.', action: 'Добавлен сотрудник Жаксыбеков А.', time: '28.06 17:20' },
];

export default function AdminPage() {
  return (
    <AppLayout title="Администрирование" subtitle="Управление пользователями и доступами">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Пользователей', value: USERS.length, icon: <UserCog size={18} />, color: 'text-cyan-400' },
          { label: 'Активных сейчас', value: 5, icon: <Activity size={18} />, color: 'text-green-400' },
          { label: 'Ролей в системе', value: 10, icon: <Shield size={18} />, color: 'text-purple-400' },
          { label: 'Событий сегодня', value: 124, icon: <Key size={18} />, color: 'text-yellow-400' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className={s.color}>{s.icon}</span>
              <p className="text-slate-400 text-xs uppercase tracking-wider">{s.label}</p>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Пользователи системы</h3>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
              <Plus size={12} /> Добавить
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pb-3 font-medium">Пользователь</th>
                  <th className="text-left py-2 pb-3 font-medium">Роль</th>
                  <th className="text-left py-2 pb-3 font-medium">Email</th>
                  <th className="text-left py-2 pb-3 font-medium">Последний вход</th>
                  <th className="text-center py-2 pb-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {USERS.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                          {u.name[0]}
                        </div>
                        <span className="text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400 text-xs">{u.role}</td>
                    <td className="py-3 text-slate-400 text-xs font-mono">{u.email}</td>
                    <td className="py-3 text-slate-500 text-xs">{u.lastLogin}</td>
                    <td className="py-3 text-center"><span className="text-xs px-2 py-0.5 rounded-full text-green-400 bg-green-400/10">Активен</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" /> Журнал действий
          </h3>
          <div className="space-y-3">
            {AUDIT_LOG.map((log, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{log.user}</p>
                  <p className="text-slate-400">{log.action}</p>
                  <p className="text-slate-600 mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
