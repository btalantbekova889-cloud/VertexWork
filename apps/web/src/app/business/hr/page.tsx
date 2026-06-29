'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Users, UserPlus, UserMinus, Calendar, AlertCircle } from 'lucide-react';

const EMPLOYEES = [
  { name: 'Марупов Асылбек', dept: 'Руководство', position: 'Генеральный директор', hired: '15.03.2020', status: 'active', vacation: null },
  { name: 'Ержанов Болат', dept: 'Operations', position: 'Начальник карьера', hired: '02.06.2021', status: 'active', vacation: null },
  { name: 'Касымова Айгуль', dept: 'Продажи', position: 'Коммерческий директор', hired: '10.09.2021', status: 'active', vacation: null },
  { name: 'Жакупова Нурия', dept: 'Финансы', position: 'Главный бухгалтер', hired: '01.04.2022', status: 'active', vacation: null },
  { name: 'Сейтов Дамир', dept: 'HR', position: 'HR-менеджер', hired: '15.11.2022', status: 'active', vacation: null },
  { name: 'Ахметов Рустам', dept: 'Operations', position: 'Диспетчер', hired: '05.01.2023', status: 'active', vacation: null },
  { name: 'Нурланов Ерлан', dept: 'Логистика', position: 'Водитель', hired: '12.03.2023', status: 'active', vacation: 'Июль 2026' },
  { name: 'Дюсупов Марат', dept: 'Operations', position: 'Весовщик', hired: '22.05.2023', status: 'active', vacation: null },
  { name: 'Байжанов Серик', dept: 'Охрана', position: 'Охранник', hired: '08.08.2023', status: 'active', vacation: null },
  { name: 'Жаксыбеков Айдан', dept: 'Логистика', position: 'Водитель', hired: '14.10.2023', status: 'probation', vacation: null },
];

const DEPT_COLORS: Record<string, string> = {
  'Руководство': 'text-purple-400 bg-purple-400/10',
  'Operations': 'text-cyan-400 bg-cyan-400/10',
  'Продажи': 'text-green-400 bg-green-400/10',
  'Финансы': 'text-yellow-400 bg-yellow-400/10',
  'HR': 'text-blue-400 bg-blue-400/10',
  'Логистика': 'text-orange-400 bg-orange-400/10',
  'Охрана': 'text-red-400 bg-red-400/10',
};

export default function HRPage() {
  return (
    <AppLayout title="HR" subtitle="Управление персоналом">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Всего сотрудников" value={EMPLOYEES.length} icon={<Users size={18} />} color="cyan" />
        <StatCard label="На испытательном" value={EMPLOYEES.filter(e => e.status === 'probation').length} icon={<UserPlus size={18} />} color="yellow" />
        <StatCard label="В отпуске" value={EMPLOYEES.filter(e => e.vacation).length} icon={<Calendar size={18} />} color="blue" />
        <StatCard label="Вакансий открыто" value="3" icon={<AlertCircle size={18} />} color="purple" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Список сотрудников</h3>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
              <UserPlus size={12} /> Принять
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
              Отпуска
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left py-2 pb-3 font-medium">Сотрудник</th>
                <th className="text-left py-2 pb-3 font-medium">Отдел</th>
                <th className="text-left py-2 pb-3 font-medium">Должность</th>
                <th className="text-left py-2 pb-3 font-medium">Принят</th>
                <th className="text-center py-2 pb-3 font-medium">Статус</th>
                <th className="text-left py-2 pb-3 font-medium">Отпуск</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {EMPLOYEES.map((e, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {e.name[0]}
                      </div>
                      <span className="text-white font-medium">{e.name}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${DEPT_COLORS[e.dept] || 'text-slate-400 bg-slate-400/10'}`}>{e.dept}</span>
                  </td>
                  <td className="py-3 text-slate-400 text-xs">{e.position}</td>
                  <td className="py-3 text-slate-500 text-xs">{e.hired}</td>
                  <td className="py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === 'active' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                      {e.status === 'active' ? 'Работает' : 'Испытательный'}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 text-xs">{e.vacation || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
