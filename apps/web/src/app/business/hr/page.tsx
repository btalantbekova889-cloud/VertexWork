'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Users, UserPlus, Calendar, AlertCircle } from 'lucide-react';

const EMPLOYEES = [
  { name: 'Марупов Асылбек', dept: 'Руководство', position: 'Генеральный директор', hired: '15.03.2020', status: 'active', vacation: null },
  { name: 'Ержанов Болат', dept: 'Производство', position: 'Начальник карьера', hired: '02.06.2021', status: 'active', vacation: null },
  { name: 'Касымова Айгуль', dept: 'Продажи', position: 'Коммерческий директор', hired: '10.09.2021', status: 'active', vacation: null },
  { name: 'Жакупова Нурия', dept: 'Финансы', position: 'Главный бухгалтер', hired: '01.04.2022', status: 'active', vacation: null },
  { name: 'Сейтов Дамир', dept: 'HR', position: 'HR-менеджер', hired: '15.11.2022', status: 'active', vacation: null },
  { name: 'Ахметов Рустам', dept: 'Производство', position: 'Диспетчер', hired: '05.01.2023', status: 'active', vacation: null },
  { name: 'Нурланов Ерлан', dept: 'Логистика', position: 'Водитель', hired: '12.03.2023', status: 'active', vacation: 'Июль 2026' },
  { name: 'Дюсупов Марат', dept: 'Производство', position: 'Весовщик', hired: '22.05.2023', status: 'active', vacation: null },
  { name: 'Байжанов Серик', dept: 'Охрана', position: 'Охранник', hired: '08.08.2023', status: 'active', vacation: null },
  { name: 'Жаксыбеков Айдан', dept: 'Логистика', position: 'Водитель', hired: '14.10.2023', status: 'probation', vacation: null },
];

const DEPT_COLORS: Record<string, string> = {
  'Руководство': 'text-purple-700 bg-purple-50 border-purple-200',
  'Производство': 'text-blue-700 bg-blue-50 border-blue-200',
  'Продажи': 'text-green-700 bg-green-50 border-green-200',
  'Финансы': 'text-amber-700 bg-amber-50 border-amber-200',
  'HR': 'text-indigo-700 bg-indigo-50 border-indigo-200',
  'Логистика': 'text-orange-700 bg-orange-50 border-orange-200',
  'Охрана': 'text-red-700 bg-red-50 border-red-200',
};

export default function HRPage() {
  return (
    <AppLayout title="HR" subtitle="Управление персоналом">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Всего сотрудников" value={EMPLOYEES.length} icon={<Users size={16} />} color="blue" />
        <StatCard label="На испытательном" value={EMPLOYEES.filter(e => e.status === 'probation').length} icon={<UserPlus size={16} />} color="yellow" />
        <StatCard label="В отпуске" value={EMPLOYEES.filter(e => e.vacation).length} icon={<Calendar size={16} />} color="indigo" />
        <StatCard label="Вакансий открыто" value="3" icon={<AlertCircle size={16} />} color="purple" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">Список сотрудников</h3>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1">
              <UserPlus size={12} /> Принять
            </button>
            <button className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
              Отпуска
            </button>
          </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {EMPLOYEES.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
