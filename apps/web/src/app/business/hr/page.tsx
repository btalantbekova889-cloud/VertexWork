'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Users, UserPlus, Calendar, AlertCircle, Trash2, X } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  dept: string;
  position: string;
  hired: string;
  status: 'active' | 'probation';
  vacation: string | null;
}

const INITIAL: Employee[] = [
  { id: 1,  name: 'Ержанов Болат',      dept: 'Производство', position: 'Оператор экскаватора', hired: '02.06.2021', status: 'active',    vacation: null },
  { id: 2,  name: 'Темиров Алмас',      dept: 'Логистика',    position: 'Водитель самосвала',   hired: '12.03.2023', status: 'active',    vacation: 'Июль 2026' },
  { id: 3,  name: 'Касымов Нурлан',     dept: 'Производство', position: 'Механик',              hired: '05.01.2023', status: 'active',    vacation: null },
  { id: 4,  name: 'Асылбеков Данияр',   dept: 'Производство', position: 'Инженер-геолог',       hired: '15.11.2022', status: 'active',    vacation: null },
  { id: 5,  name: 'Жаксыбекова Айгуль', dept: 'Финансы',      position: 'Бухгалтер',            hired: '01.04.2022', status: 'active',    vacation: null },
  { id: 6,  name: 'Маратов Серик',      dept: 'Охрана',       position: 'Охранник КПП',         hired: '08.08.2023', status: 'active',    vacation: null },
  { id: 7,  name: 'Дуйсенов Берик',     dept: 'Производство', position: 'Геодезист',            hired: '22.05.2023', status: 'active',    vacation: null },
  { id: 8,  name: 'Сейтов Дамир',       dept: 'HR',           position: 'HR-менеджер',          hired: '15.11.2022', status: 'active',    vacation: null },
  { id: 9,  name: 'Байжанов Серик',     dept: 'Охрана',       position: 'Охранник',             hired: '08.08.2023', status: 'active',    vacation: null },
  { id: 10, name: 'Жаксыбеков Айдан',   dept: 'Логистика',    position: 'Водитель',             hired: '14.10.2023', status: 'probation', vacation: null },
];

const DEPTS = ['Руководство', 'Производство', 'Финансы', 'HR', 'Логистика', 'Охрана', 'IT', 'Продажи', 'Администрация'];

const DEPT_COLORS: Record<string, string> = {
  'Руководство': 'text-purple-700 bg-purple-50 border-purple-200',
  'Производство': 'text-blue-700 bg-blue-50 border-blue-200',
  'Продажи':     'text-green-700 bg-green-50 border-green-200',
  'Финансы':     'text-amber-700 bg-amber-50 border-amber-200',
  'HR':          'text-indigo-700 bg-indigo-50 border-indigo-200',
  'Логистика':   'text-orange-700 bg-orange-50 border-orange-200',
  'Охрана':      'text-red-700 bg-red-50 border-red-200',
  'IT':          'text-cyan-700 bg-cyan-50 border-cyan-200',
};

const EMPTY_FORM = { name: '', dept: 'Производство', position: '', hired: '', status: 'active' as const, baseSalary: '50000' };

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/employees')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.employees) && d.employees.length) setEmployees(d.employees); })
      .catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.position.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.employee) setEmployees(prev => [...prev, data.employee]);
      setShowModal(false);
      setForm(EMPTY_FORM);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    await fetch(`/api/employees/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  return (
    <AppLayout title="HR" subtitle="Управление персоналом">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Принять сотрудника</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">ФИО *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Иванов Иван Иванович" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Отдел</label>
                  <select value={form.dept} onChange={e => setForm(f => ({...f, dept: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500">
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Статус</label>
                  <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as 'active' | 'probation'}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500">
                    <option value="active">Работает</option>
                    <option value="probation">Испытательный</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Должность *</label>
                <input value={form.position} onChange={e => setForm(f => ({...f, position: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Водитель самосвала" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Дата приёма</label>
                  <input value={form.hired} onChange={e => setForm(f => ({...f, hired: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="01.07.2026" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Оклад (сом)</label>
                  <input value={form.baseSalary} onChange={e => setForm(f => ({...f, baseSalary: e.target.value}))}
                    type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="50000" />
                </div>
              </div>
              <button onClick={handleAdd} disabled={saving || !form.name.trim() || !form.position.trim()}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 mt-1">
                {saving ? 'Сохранение...' : 'Принять на работу'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Всего сотрудников',  value: employees.length,                                    icon: <Users size={16} /> },
          { label: 'На испытательном',   value: employees.filter(e => e.status === 'probation').length, icon: <UserPlus size={16} /> },
          { label: 'В отпуске',          value: employees.filter(e => e.vacation).length,             icon: <Calendar size={16} /> },
          { label: 'Вакансий открыто',   value: 3,                                                    icon: <AlertCircle size={16} /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-gray-400 mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">Список сотрудников ({employees.length})</h3>
          <button onClick={() => setShowModal(true)}
            className="text-xs px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-1">
            <UserPlus size={12} /> Принять
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Сотрудник</th>
                <th className="text-left pb-2 font-medium">Отдел</th>
                <th className="text-left pb-2 font-medium">Должность</th>
                <th className="text-left pb-2 font-medium">Принят</th>
                <th className="text-center pb-2 font-medium">Статус</th>
                <th className="text-left pb-2 font-medium">Отпуск</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {e.name[0]}
                      </div>
                      <span className="text-gray-800 font-medium">{e.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${DEPT_COLORS[e.dept] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>{e.dept}</span>
                  </td>
                  <td className="py-2.5 text-gray-500 text-xs">{e.position}</td>
                  <td className="py-2.5 text-gray-400 text-xs">{e.hired}</td>
                  <td className="py-2.5 text-center">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${e.status === 'active' ? 'text-green-700 bg-green-50 border-green-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
                      {e.status === 'active' ? 'Работает' : 'Испытательный'}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-400 text-xs">{e.vacation || '—'}</td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handleDelete(e.id)} title="Удалить" className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
