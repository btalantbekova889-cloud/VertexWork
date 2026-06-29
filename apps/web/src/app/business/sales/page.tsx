'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { ShoppingCart, Plus, TrendingUp, Phone } from 'lucide-react';

const ORDERS = [
  { id: 'ОРД-2847', client: 'ТОО "АлтайСтрой"', manager: 'Касымова А.', material: 'Щебень фр.20-40', volume: 120, price: 4000, status: 'delivered', date: '29.06.2026' },
  { id: 'ОРД-2846', client: 'ИП Казаков В.С.', manager: 'Сейтов Д.', material: 'Щебень фр.5-20', volume: 80, price: 3700, status: 'in_progress', date: '29.06.2026' },
  { id: 'ОРД-2845', client: 'ТОО "МегаБуд"', manager: 'Касымова А.', material: 'Отсев', volume: 200, price: 1800, status: 'pending', date: '28.06.2026' },
  { id: 'ОРД-2844', client: 'АО "СтройКонсалт"', manager: 'Нурланов Е.', material: 'Щебень фр.40-70', volume: 300, price: 3500, status: 'delivered', date: '28.06.2026' },
  { id: 'ОРД-2843', client: 'ТОО "НурБетон"', manager: 'Касымова А.', material: 'Щебень фр.20-40', volume: 150, price: 4000, status: 'cancelled', date: '27.06.2026' },
  { id: 'ОРД-2842', client: 'ИП Дюсупов М.', manager: 'Сейтов Д.', material: 'Щебень фр.20-40', volume: 90, price: 4000, status: 'delivered', date: '27.06.2026' },
];

const STATUS_STYLE: Record<string, string> = {
  delivered: 'text-green-400 bg-green-400/10',
  in_progress: 'text-cyan-400 bg-cyan-400/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
};

const STATUS_LABEL: Record<string, string> = {
  delivered: 'Доставлен', in_progress: 'В пути', pending: 'Ожидает', cancelled: 'Отменен',
};

export default function SalesPage() {
  return (
    <AppLayout title="Продажи (CRM)" subtitle="Управление заказами и продажами">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Заказов сегодня" value="23" change="+5" positive icon={<ShoppingCart size={18} />} color="cyan" />
        <StatCard label="Выручка сегодня" value="4 820 000 ₸" change="+12%" positive icon={<TrendingUp size={18} />} color="green" />
        <StatCard label="Средний чек" value="209 565 ₸" change="+2%" positive color="blue" />
        <StatCard label="Звонков сегодня" value="37" icon={<Phone size={18} />} color="purple" />
      </div>

      {/* Manager performance */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
        <h3 className="text-white font-semibold mb-4">ТОП Менеджеры — Июнь 2026</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Касымова Айгуль', orders: 87, revenue: 34200000, plan: 91 },
            { name: 'Сейтов Дамир', orders: 63, revenue: 24800000, plan: 82 },
            { name: 'Нурланов Ерлан', orders: 45, revenue: 18200000, plan: 74 },
          ].map((m, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {i + 1}
                </div>
                <p className="text-white text-sm font-medium">{m.name}</p>
              </div>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between"><span>Заказов</span><span className="text-white font-medium">{m.orders}</span></div>
                <div className="flex justify-between"><span>Выручка</span><span className="text-white font-medium">{(m.revenue / 1000000).toFixed(1)} млн ₸</span></div>
                <div className="flex justify-between"><span>Plan</span><span className={m.plan >= 90 ? 'text-green-400 font-medium' : m.plan >= 75 ? 'text-yellow-400 font-medium' : 'text-red-400 font-medium'}>{m.plan}%</span></div>
              </div>
              <div className="mt-3 h-1.5 bg-slate-700 rounded-full">
                <div className={`h-full rounded-full ${m.plan >= 90 ? 'bg-green-500' : m.plan >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${m.plan}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Заказы</h3>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
            <Plus size={12} /> Новый заказ
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left py-2 pb-3 font-medium">№ Заказа</th>
                <th className="text-left py-2 pb-3 font-medium">Клиент</th>
                <th className="text-left py-2 pb-3 font-medium">Менеджер</th>
                <th className="text-left py-2 pb-3 font-medium">Материал</th>
                <th className="text-right py-2 pb-3 font-medium">Объем</th>
                <th className="text-right py-2 pb-3 font-medium">Сумма</th>
                <th className="text-center py-2 pb-3 font-medium">Статус</th>
                <th className="text-left py-2 pb-3 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ORDERS.map(o => (
                <tr key={o.id} className="hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <td className="py-3 text-slate-400 font-mono text-xs">{o.id}</td>
                  <td className="py-3 text-white font-medium">{o.client}</td>
                  <td className="py-3 text-slate-400 text-xs">{o.manager}</td>
                  <td className="py-3 text-slate-300 text-xs">{o.material}</td>
                  <td className="py-3 text-right text-slate-300">{o.volume} т</td>
                  <td className="py-3 text-right text-white font-semibold">{(o.volume * o.price).toLocaleString('ru-RU')} ₸</td>
                  <td className="py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                  </td>
                  <td className="py-3 text-slate-500 text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
