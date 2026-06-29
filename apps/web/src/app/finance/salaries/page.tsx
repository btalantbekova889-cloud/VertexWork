'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Users, TrendingUp, Gift, AlertTriangle } from 'lucide-react';

const EMPLOYEES = [
  { name: 'Ержанов Болат', position: 'Начальник карьера', base: 45000, bonus: 9000, penalty: 0, total: 54000, status: 'paid' },
  { name: 'Ахметов Рустам', position: 'Диспетчер', base: 28000, bonus: 2800, penalty: 0, total: 30800, status: 'paid' },
  { name: 'Сейтов Марат', position: 'Весовщик', base: 20000, bonus: 0, penalty: 1000, total: 19000, status: 'pending' },
  { name: 'Нурланов Ерлан', position: 'Водитель', base: 22000, bonus: 4400, penalty: 0, total: 26400, status: 'paid' },
  { name: 'Жаксыбеков Айдан', position: 'Водитель', base: 22000, bonus: 2200, penalty: 500, total: 23700, status: 'pending' },
  { name: 'Касымова Айгуль', position: 'Менеджер продаж', base: 30000, bonus: 8500, penalty: 0, total: 38500, status: 'paid' },
  { name: 'Жакупова Нурия', position: 'Бухгалтер', base: 35000, bonus: 3500, penalty: 0, total: 38500, status: 'paid' },
];

export default function SalariesPage() {
  const totalPayroll = EMPLOYEES.reduce((s, e) => s + e.total, 0);
  const totalBonus = EMPLOYEES.reduce((s, e) => s + e.bonus, 0);
  const totalPenalty = EMPLOYEES.reduce((s, e) => s + e.penalty, 0);

  return (
    <AppLayout title="Зарплаты" subtitle="Расчёт зарплат сотрудников">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="ФОТ (месяц)" value={`${totalPayroll.toLocaleString('ru-RU')} сом`} icon={<Users size={16} />} color="blue" />
        <StatCard label="Премии" value={`${totalBonus.toLocaleString('ru-RU')} сом`} icon={<Gift size={16} />} color="green" />
        <StatCard label="Штрафы" value={`${totalPenalty.toLocaleString('ru-RU')} сом`} icon={<AlertTriangle size={16} />} color="red" />
        <StatCard label="Средняя з/п" value={`${Math.round(totalPayroll / EMPLOYEES.length).toLocaleString('ru-RU')} сом`} icon={<TrendingUp size={16} />} color="indigo" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">Ведомость — Июнь 2026</h3>
          <button className="text-xs px-3 py-1.5 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
            Сформировать выплату
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Сотрудник</th>
                <th className="text-left pb-2 font-medium">Должность</th>
                <th className="text-right pb-2 font-medium">Оклад</th>
                <th className="text-right pb-2 font-medium">Премия</th>
                <th className="text-right pb-2 font-medium">Штраф</th>
                <th className="text-right pb-2 font-medium">Итого</th>
                <th className="text-center pb-2 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {EMPLOYEES.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-2.5 text-gray-800 font-medium">{e.name}</td>
                  <td className="py-2.5 text-gray-500 text-xs">{e.position}</td>
                  <td className="py-2.5 text-right text-gray-600">{e.base.toLocaleString('ru-RU')} сом</td>
                  <td className="py-2.5 text-right text-green-600">{e.bonus > 0 ? `+${e.bonus.toLocaleString('ru-RU')} сом` : '—'}</td>
                  <td className="py-2.5 text-right text-red-600">{e.penalty > 0 ? `−${e.penalty.toLocaleString('ru-RU')} сом` : '—'}</td>
                  <td className="py-2.5 text-right text-gray-900 font-bold">{e.total.toLocaleString('ru-RU')} сом</td>
                  <td className="py-2.5 text-center">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${e.status === 'paid' ? 'text-green-700 bg-green-50 border-green-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
                      {e.status === 'paid' ? 'Выплачено' : 'Ожидает'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-200">
              <tr>
                <td colSpan={2} className="py-2.5 text-gray-600 font-semibold text-sm">ИТОГО</td>
                <td className="py-2.5 text-right text-gray-700 font-semibold">{EMPLOYEES.reduce((s,e)=>s+e.base,0).toLocaleString('ru-RU')} сом</td>
                <td className="py-2.5 text-right text-green-600 font-semibold">+{totalBonus.toLocaleString('ru-RU')} сом</td>
                <td className="py-2.5 text-right text-red-600 font-semibold">−{totalPenalty.toLocaleString('ru-RU')} сом</td>
                <td className="py-2.5 text-right text-blue-700 font-bold text-base">{totalPayroll.toLocaleString('ru-RU')} сом</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
