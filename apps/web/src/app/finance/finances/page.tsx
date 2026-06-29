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

const RISK_STYLE: Record<string, string> = {
  high: 'text-red-400 bg-red-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  low: 'text-green-400 bg-green-400/10',
};

const RISK_LABEL: Record<string, string> = {
  high: 'Высокий', medium: 'Средний', low: 'Низкий',
};

export default function FinancesPage() {
  return (
    <AppLayout title="Финансы" subtitle="Финансовые показатели и задолженности">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Выручка (месяц)" value="87 400 000 ₸" change="+15% к прошлому" positive color="cyan" />
        <StatCard label="Прибыль (месяц)" value="34 200 000 ₸" change="+9%" positive icon={<TrendingUp size={18} />} color="green" />
        <StatCard label="Расходы (месяц)" value="53 200 000 ₸" change="+3%" positive={false} icon={<TrendingDown size={18} />} color="red" />
        <StatCard label="Дебиторка" value="5 680 000 ₸" icon={<AlertCircle size={18} />} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Debt table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-yellow-400" /> Контроль задолженностей
          </h3>
          <div className="space-y-2">
            {DEBTS.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Building size={14} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{d.company}</p>
                  <p className="text-slate-500 text-xs">Просрочено {d.overdue} дней</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-semibold">{(d.amount / 1000000).toFixed(1)} млн ₸</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${RISK_STYLE[d.risk]}`}>{RISK_LABEL[d.risk]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Структура расходов (месяц)</h3>
          <div className="space-y-3">
            {[
              { label: 'Зарплата сотрудников', amount: 18500000, pct: 35 },
              { label: 'Топливо и ГСМ', amount: 9200000, pct: 17 },
              { label: 'Ремонт техники', amount: 7800000, pct: 15 },
              { label: 'Аренда и коммуналка', amount: 5300000, pct: 10 },
              { label: 'Налоги', amount: 6700000, pct: 13 },
              { label: 'Прочие расходы', amount: 5700000, pct: 10 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-medium">{(item.amount / 1000000).toFixed(1)} млн ₸ · {item.pct}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
