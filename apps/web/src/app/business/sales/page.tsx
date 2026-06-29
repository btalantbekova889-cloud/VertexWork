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
];

const STATUS_BADGE: Record<string, string> = {
  delivered:   'text-green-700 bg-green-50 border-green-200',
  in_progress: 'text-blue-700 bg-blue-50 border-blue-200',
  pending:     'text-amber-700 bg-amber-50 border-amber-200',
  cancelled:   'text-red-700 bg-red-50 border-red-200',
};
const STATUS_LABEL: Record<string, string> = {
  delivered: 'Доставлен', in_progress: 'В пути', pending: 'Ожидает', cancelled: 'Отменён',
};

const MANAGERS = [
  { name: 'Касымова Айгуль', orders: 87, revenue: 34200000, plan: 91 },
  { name: 'Сейтов Дамир', orders: 63, revenue: 24800000, plan: 82 },
  { name: 'Нурланов Ерлан', orders: 45, revenue: 18200000, plan: 74 },
];

export default function SalesPage() {
  return (
    <AppLayout title="Продажи (CRM)" subtitle="Управление заказами и продажами">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Заказов сегодня" value="23" change="+5" positive icon={<ShoppingCart size={16} />} color="blue" />
        <StatCard label="Выручка сегодня" value="4 820 000 сом" change="+12%" positive icon={<TrendingUp size={16} />} color="green" />
        <StatCard label="Средний чек" value="209 565 сом" change="+2%" positive color="indigo" />
        <StatCard label="Звонков сегодня" value="37" icon={<Phone size={16} />} color="purple" />
      </div>

      {/* Managers */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
        <h3 className="text-gray-700 font-semibold mb-3">ТОП Менеджеры — Июнь 2026</h3>
        <div className="grid grid-cols-3 gap-3">
          {MANAGERS.map((m, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">{i + 1}</div>
                <p className="text-gray-800 text-sm font-medium">{m.name}</p>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex justify-between"><span>Заказов</span><span className="text-gray-700 font-medium">{m.orders}</span></div>
                <div className="flex justify-between"><span>Выручка</span><span className="text-gray-700 font-medium">{(m.revenue / 1000000).toFixed(1)} млн сом</span></div>
                <div className="flex justify-between"><span>План</span>
                  <span className={`font-semibold ${m.plan >= 90 ? 'text-green-600' : m.plan >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{m.plan}%</span>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full">
                <div className={`h-full rounded-full ${m.plan >= 90 ? 'bg-green-500' : m.plan >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${m.plan}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-700 font-semibold">Заказы</h3>
          <button className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1">
            <Plus size={12} /> Новый заказ
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left pb-2 font-medium">№</th>
                <th className="text-left pb-2 font-medium">Клиент</th>
                <th className="text-left pb-2 font-medium">Менеджер</th>
                <th className="text-left pb-2 font-medium">Материал</th>
                <th className="text-right pb-2 font-medium">Объём</th>
                <th className="text-right pb-2 font-medium">Сумма</th>
                <th className="text-center pb-2 font-medium">Статус</th>
                <th className="text-left pb-2 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ORDERS.map(o => (
                <tr key={o.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="py-2.5 text-gray-400 font-mono text-xs">{o.id}</td>
                  <td className="py-2.5 text-gray-800 font-medium">{o.client}</td>
                  <td className="py-2.5 text-gray-500 text-xs">{o.manager}</td>
                  <td className="py-2.5 text-gray-500 text-xs">{o.material}</td>
                  <td className="py-2.5 text-right text-gray-600 text-xs">{o.volume} т</td>
                  <td className="py-2.5 text-right text-gray-800 font-semibold text-xs">{(o.volume * o.price).toLocaleString('ru-RU')} сом</td>
                  <td className="py-2.5 text-center"><span className={`text-xs px-1.5 py-0.5 rounded border ${STATUS_BADGE[o.status]}`}>{STATUS_LABEL[o.status]}</span></td>
                  <td className="py-2.5 text-gray-400 text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
