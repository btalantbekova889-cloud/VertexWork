'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Users, TrendingUp, Gift, AlertTriangle } from 'lucide-react';

const EMPLOYEES = [
  { name: 'Ержанов Болат', position: 'Начальник карьера', base: 450000, bonus: 90000, penalty: 0, total: 540000, status: 'paid' },
  { name: 'Ахметов Рустам', position: 'Диспетчер', base: 280000, bonus: 28000, penalty: 0, total: 308000, status: 'paid' },
  { name: 'Сейтов Марат', position: 'Весовщик', base: 200000, bonus: 0, penalty: 10000, total: 190000, status: 'pending' },
  { name: 'Нурланов Ерлан', position: 'Водитель', base: 220000, bonus: 44000, penalty: 0, total: 264000, status: 'paid' },
  { name: 'Жаксыбеков Айдан', position: 'Водитель', base: 220000, bonus: 22000, penalty: 5000, total: 237000, status: 'pending' },
  { name: 'Касымова Айгуль', position: 'Менеджер продаж', base: 300000, bonus: 85000, penalty: 0, total: 385000, status: 'paid' },
  { name: 'Жакупова Нурия', position: 'Бухгалтер', base: 350000, bonus: 35000, penalty: 0, total: 385000, status: 'paid' },
];

export default function SalariesPage() {
  const totalPayroll = EMPLOYEES.reduce((sum, e) => sum + e.total, 0);
  const totalBonus = EMPLOYEES.reduce((sum, e) => sum + e.bonus, 0);
  const totalPenalty = EMPLOYEES.reduce((sum, e) => sum + e.penalty, 0);

  return (
    <AppLayout title="Зарплаты" subtitle="Расчет зарплат сотрудников">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="ФОТ (месяц)" value={`${(totalPayroll / 1000).toFixed(0)} тыс ₸`} icon={<Users size={18} />} color="cyan" />
        <StatCard label="Премии" value={`${(totalBonus / 1000).toFixed(0)} тыс ₸`} icon={<Gift size={18} />} color="green" />
        <StatCard label="Штрафы" value={`${(totalPenalty / 1000).toFixed(0)} тыс ₸`} icon={<AlertTriangle size={18} />} color="red" />
        <StatCard label="Средняя з/п" value={`${((totalPayroll / EMPLOYEES.length) / 1000).toFixed(0)} тыс ₸`} icon={<TrendingUp size={18} />} color="blue" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Ведомость — Июнь 2026</h3>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors">
            Сформировать выплату
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left py-2 pb-3 font-medium">Сотрудник</th>
                <th className="text-left py-2 pb-3 font-medium">Должность</th>
                <th className="text-right py-2 pb-3 font-medium">Оклад</th>
                <th className="text-right py-2 pb-3 font-medium">Премия</th>
                <th className="text-right py-2 pb-3 font-medium">Штраф</th>
                <th className="text-right py-2 pb-3 font-medium">Итого</th>
                <th className="text-center py-2 pb-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {EMPLOYEES.map((e, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 text-white font-medium">{e.name}</td>
                  <td className="py-3 text-slate-400 text-xs">{e.position}</td>
                  <td className="py-3 text-right text-slate-300">{e.base.toLocaleString('ru-RU')} ₸</td>
                  <td className="py-3 text-right text-green-400">
                    {e.bonus > 0 ? `+${e.bonus.toLocaleString('ru-RU')} ₸` : '—'}
                  </td>
                  <td className="py-3 text-right text-red-400">
                    {e.penalty > 0 ? `-${e.penalty.toLocaleString('ru-RU')} ₸` : '—'}
                  </td>
                  <td className="py-3 text-right text-white font-bold">{e.total.toLocaleString('ru-RU')} ₸</td>
                  <td className="py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === 'paid' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                      {e.status === 'paid' ? 'Выплачено' : 'Ожидает'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-700">
                <td colSpan={2} className="py-3 text-slate-400 font-medium">ИТОГО</td>
                <td className="py-3 text-right text-white font-bold">{EMPLOYEES.reduce((s,e)=>s+e.base,0).toLocaleString('ru-RU')} ₸</td>
                <td className="py-3 text-right text-green-400 font-bold">+{totalBonus.toLocaleString('ru-RU')} ₸</td>
                <td className="py-3 text-right text-red-400 font-bold">-{totalPenalty.toLocaleString('ru-RU')} ₸</td>
                <td className="py-3 text-right text-cyan-400 font-bold text-base">{totalPayroll.toLocaleString('ru-RU')} ₸</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
