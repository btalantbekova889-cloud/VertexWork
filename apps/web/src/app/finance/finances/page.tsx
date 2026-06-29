'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { TrendingUp, TrendingDown, AlertCircle, Building } from 'lucide-react';

const DEBTS = [
  { company: 'ТОО "КаменьСтрой"', amount: 2800000, overdue: 45, risk: 'high' },
  { company: 'ИП Ахметов С.', amount: 560000, overdue: 12, risk: 'medium' },
  { company: 'ТОО "НурТас"', amount: 1200000, overdue: 28, risk: 'high' },
  { company: 'АО "Строй Групп"', amount: 340000, overdue: 5, risk: 'low' },
  { company: 'ТОО "АлтайСтрой"', amount: 780000, overdue: 18, risk: 'medium' },
];

const RISK: Record<string, { label: string; style: string }> = {
  high:   { label: 'Высокий', style: 'text-red-700 bg-red-50 border-red-200' },
  medium: { label: 'Средний', style: 'text-amber-700 bg-amber-50 border-amber-200' },
  low:    { label: 'Низкий',  style: 'text-green-700 bg-green-50 border-green-200' },
};

const EXPENSES = [
  { label: 'Зарплата сотрудников', amount: 18500000, pct: 35 },
  { label: 'Топливо и ГСМ', amount: 9200000, pct: 17 },
  { label: 'Ремонт техники', amount: 7800000, pct: 15 },
  { label: 'Аренда и коммуналка', amount: 5300000, pct: 10 },
  { label: 'Налоги', amount: 6700000, pct: 13 },
  { label: 'Прочие расходы', amount: 5700000, pct: 10 },
];

export default function FinancesPage() {
  return (
    <AppLayout title="Финансы" subtitle="Финансовые показатели и задолженности">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Выручка (месяц)" value="87 400 000 сом" change="+15%" positive color="blue" />
        <StatCard label="Прибыль (месяц)" value="34 200 000 сом" change="+9%" positive icon={<TrendingUp size={16} />} color="green" />
        <StatCard label="Расходы (месяц)" value="53 200 000 сом" change="+3%" positive={false} icon={<TrendingDown size={16} />} color="red" />
        <StatCard label="Дебиторка" value="5 680 000 сом" icon={<AlertCircle size={16} />} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
            <AlertCircle size={15} className="text-amber-500" /> Контроль задолженностей
          </h3>
          <div className="space-y-2">
            {DEBTS.map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <Building size={14} className="text-gray-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm font-medium truncate">{d.company}</p>
                  <p className="text-gray-400 text-xs">Просрочено {d.overdue} дней</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 text-sm font-semibold">{(d.amount / 1000000).toFixed(1)} млн сом</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded border ${RISK[d.risk].style}`}>{RISK[d.risk].label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4">Структура расходов (месяц)</h3>
          <div className="space-y-3">
            {EXPENSES.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-gray-700 font-medium">{(item.amount / 1000000).toFixed(1)} млн сом · {item.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
