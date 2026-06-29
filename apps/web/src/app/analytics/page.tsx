'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { BarChart3, TrendingUp, Package } from 'lucide-react';

const MONTHLY = [
  { month: 'Янв', revenue: 62, profit: 24, extraction: 8200 },
  { month: 'Фев', revenue: 58, profit: 21, extraction: 7600 },
  { month: 'Мар', revenue: 75, profit: 30, extraction: 9800 },
  { month: 'Апр', revenue: 81, profit: 33, extraction: 10500 },
  { month: 'Май', revenue: 79, profit: 31, extraction: 10200 },
  { month: 'Июн', revenue: 87, profit: 34, extraction: 11400 },
];

const maxRevenue = Math.max(...MONTHLY.map(m => m.revenue));

export default function AnalyticsPage() {
  return (
    <AppLayout title="Аналитика" subtitle="Финансовая и производственная аналитика">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Выручка (год)" value="442 млн сом" change="+18%" positive icon={<BarChart3 size={16} />} color="blue" />
        <StatCard label="Прибыль (год)" value="173 млн сом" change="+22%" positive icon={<TrendingUp size={16} />} color="green" />
        <StatCard label="Маржинальность" value="39.1%" change="+1.2%" positive color="indigo" />
        <StatCard label="Себест. добычи / т" value="2 150 сом" change="-3.5%" positive icon={<Package size={16} />} color="purple" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
        <h3 className="text-gray-700 font-semibold mb-6">Динамика выручки и прибыли (млн сом)</h3>
        <div className="flex items-end gap-4 h-48">
          {MONTHLY.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 items-end" style={{ height: '160px' }}>
                <div
                  className="flex-1 rounded-t bg-blue-500 hover:bg-blue-600 transition-colors"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                  title={`Выручка: ${m.revenue} млн сом`}
                />
                <div
                  className="flex-1 rounded-t bg-green-500 hover:bg-green-600 transition-colors"
                  style={{ height: `${(m.profit / maxRevenue) * 100}%` }}
                  title={`Прибыль: ${m.profit} млн сом`}
                />
              </div>
              <span className="text-gray-400 text-xs">{m.month}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-6 mt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-3 h-3 rounded bg-blue-500" /> Выручка
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-3 h-3 rounded bg-green-500" /> Прибыль
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4">Структура добычи (июнь 2026)</h3>
          <div className="space-y-3">
            {[
              { material: 'Щебень фр.20-40', volume: 4850, pct: 43, color: 'bg-blue-500' },
              { material: 'Щебень фр.5-20', volume: 2750, pct: 24, color: 'bg-indigo-500' },
              { material: 'Щебень фр.40-70', volume: 2400, pct: 21, color: 'bg-purple-500' },
              { material: 'Отсев', volume: 1400, pct: 12, color: 'bg-gray-400' },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{m.material}</span>
                  <span className="text-gray-700 font-medium">{m.volume.toLocaleString('ru-RU')} т · {m.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4">Ключевые показатели</h3>
          <div className="space-y-0">
            {[
              { label: 'Средняя цена продажи / т', value: '3 840 сом', vs: '+120 сом к прошлому кварталу', positive: true },
              { label: 'Себестоимость добычи / т', value: '2 150 сом', vs: '-75 сом оптимизация', positive: true },
              { label: 'Оборачиваемость склада', value: '12.4 дня', vs: '-0.8 дня', positive: true },
              { label: 'Клиентов за квартал', value: '47', vs: '+5 новых', positive: true },
              { label: 'Средний чек', value: '209 565 сом', vs: '+12 000 сом', positive: true },
              { label: 'Просроченная дебиторка', value: '18.3%', vs: '+2.1% рост риска', positive: false },
            ].map((kpi, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <p className="text-gray-500 text-xs">{kpi.label}</p>
                <div className="text-right">
                  <p className="text-gray-800 font-semibold text-sm">{kpi.value}</p>
                  <p className={`text-xs ${kpi.positive ? 'text-green-600' : 'text-red-500'}`}>{kpi.vs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
