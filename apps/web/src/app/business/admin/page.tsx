'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Activity, Plus, X } from 'lucide-react';

interface SysUser { name: string; role: string; email: string; lastLogin: string; status: string; }

const INIT_USERS: SysUser[] = [
  { name: 'Марупов Асылбек', role: 'Генеральный директор', email: 'director@vertex.kg',   lastLogin: '29.06.2026 09:12', status: 'active' },
  { name: 'Касымова Айгуль', role: 'Коммерческий директор',email: 'commercial@vertex.kg', lastLogin: '29.06.2026 08:55', status: 'active' },
  { name: 'Жакупова Нурия',  role: 'Бухгалтер',           email: 'accountant@vertex.kg', lastLogin: '29.06.2026 09:30', status: 'active' },
  { name: 'Сейтов Дамир',    role: 'HR',                  email: 'hr@vertex.kg',          lastLogin: '29.06.2026 08:40', status: 'active' },
  { name: 'Ержанов Болат',   role: 'Нач. карьера',        email: 'quarry@vertex.kg',      lastLogin: '29.06.2026 07:15', status: 'active' },
];

const AUDIT_LOG = [
  { user: 'Касымова А.',  action: 'Создан заказ ОРД-2847',                time: '29.06 09:45' },
  { user: 'Ержанов Б.',  action: 'Назначена машина A 147 KZ на рейс',   time: '29.06 09:30' },
  { user: 'Ержанов Б.',  action: 'Взвешивание — накладная ВС-4521',      time: '29.06 08:55' },
  { user: 'Жакупова Н.', action: 'Платеж подтвержден — 480 000 сом',     time: '29.06 08:40' },
  { user: 'Ержанов Б.',  action: 'Пропуск выдан — A 147 KZ',             time: '29.06 08:30' },
  { user: 'Сейтов Д.',   action: 'Добавлен сотрудник Жаксыбеков А.',     time: '28.06 17:20' },
];

const EMPTY_FORM = { name: '', role: '', email: '' };

export default function AdminPage() {
  const [users, setUsers] = useState<SysUser[]>(INIT_USERS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    setSaving(true);
    const newUser: SysUser = {
      name: form.name.trim(),
      role: form.role.trim(),
      email: form.email.trim() || `${form.name.toLowerCase().replace(/\s+/g, '.')}@vertex.kg`,
      lastLogin: '—',
      status: 'active',
    };
    setUsers(prev => [...prev, newUser]);
    setShowModal(false);
    setForm(EMPTY_FORM);
    setSaving(false);
  };

  return (
    <AppLayout title="Администрирование" subtitle="Управление пользователями и доступами">
      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Добавить пользователя</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">ФИО *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Иванов Иван" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Роль *</label>
                <input value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Менеджер по продажам" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="user@vertex.kg" />
              </div>
              <button onClick={handleAdd} disabled={saving || !form.name.trim() || !form.role.trim()}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Добавить пользователя'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Пользователей',  value: users.length, color: 'text-gray-900' },
          { label: 'Активных сейчас', value: users.filter(u => u.lastLogin !== '—').length, color: 'text-green-600' },
          { label: 'Ролей в системе', value: new Set(users.map(u => u.role)).size, color: 'text-gray-900' },
          { label: 'Событий сегодня', value: 124, color: 'text-gray-900' },
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
            <button onClick={() => setShowModal(true)}
              className="text-xs px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-1">
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
                {users.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
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
            <Activity size={15} className="text-gray-500" /> Журнал действий
          </h3>
          <div className="space-y-3">
            {AUDIT_LOG.map((log, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
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
