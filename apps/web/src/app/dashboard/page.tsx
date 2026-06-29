'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Truck, Package, DollarSign, Activity, AlertTriangle, CheckCircle2, Clock, MapPin, TrendingUp } from 'lucide-react';

const ORDERS = [
  { id: 'ОРД-2847', client: 'ТОО "АлтайСтрой"', material: 'Щебень фр.20-40', volume: '120 т', status: 'delivered', amount: '480 000 сом' },
  { id: 'ОРД-2846', client: 'ИП Казаков В.С.', material: 'Щебень фр.5-20', volume: '80 т', status: 'in_progress', amount: '296 000 сом' },
  { id: 'ОРД-2845', client: 'ТОО "МегаБуд"', material: 'Отсев', volume: '200 т', status: 'pending', amount: '360 000 сом' },
  { id: 'ОРД-2844', client: 'АО "СтройКонсалт"', material: 'Щебень фр.40-70', volume: '300 т', status: 'delivered', amount: '1 050 000 сом' },
  { id: 'ОРД-2843', client: 'ТОО "НурБетон"', material: 'Щебень фр.20-40', volume: '150 т', status: 'cancelled', amount: '600 000 сом' },
];

const VEHICLES = [
  { id: 'A 147 KZ', driver: 'Нурланов Е.', status: 'on_route', location: 'Бишкек, ул. Абая', load: '25 т' },
  { id: 'B 234 KZ', driver: 'Жаксыбеков А.', status: 'loading', location: 'Карьер №1', load: '0 т' },
  { id: 'C 089 KZ', driver: 'Темиров К.', status: 'on_route', location: 'Чуйская обл.', load: '28 т' },
  { id: 'D 456 KZ', driver: 'Сатыбалдиев О.', status: 'idle', location: 'База', load: '0 т' },
];

const STATUS_BADGE: Record<string, string> = {
  delivered:   'text-green-700 bg-green-100 border-green-200',
  in_progress: 'text-blue-700 bg-blue-100 border-blue-200',
  pending:     'text-amber-700 bg-amber-100 border-amber-200',
  cancelled:   'text-red-700 bg-red-100 border-red-200',
  on_route:    'text-blue-700 bg-blue-100 border-blue-200',
  loading:     'text-amber-700 bg-amber-100 border-amber-200',
  idle:        'text-gray-600 bg-gray-100 border-gray-200',
};

const STATUS_LABEL: Record<string, string> = {
  delivered: 'Доставлен', in_progress: 'В пути', pending: 'Ожидает',
  cancelled: 'Отменён', on_route: 'В пути', loading: 'Загрузка', idle: 'На базе',
};

export default function DashboardPage() {
  return (
    <AppLayout title="Дашборд" subtitle="Обзор компании в реальном времени">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Выручка сегодня" value="4 820 000 сом" change="+12% к вчера" positive icon={<DollarSign size={16} />} color="blue" />
        <StatCard label="Заказов сегодня" value="23" change="+5" positive icon={<Package size={16} />} color="indigo" />
        <StatCard label="Машин в рейсе" value="8 / 12" icon={<Truck size={16} />} color="green" />
        <StatCard label="Добыча сегодня" value="1 240 т" change="+8% к плану" positive icon={<Activity size={16} />} color="purple" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard label="Дебиторская задолженность" value="12 340 000 сом" change="+3% к прошл. нед." positive={false} color="red" />
        <StatCard label="Активных клиентов" value="47" change="+2 за неделю" positive icon={<TrendingUp size={16} />} color="green" />
        <StatCard label="Остаток щебня" value="8 420 т" change="-120 т за день" positive={false} color="yellow" />
      </div>

      {/* Flow */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-5">
        <h3 className="text-gray-700 font-semibold text-sm mb-3">Движение заказа — статус сегодня</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { label: 'Создан', count: 23, color: 'bg-blue-100 text-blue-700 border-blue-200' },
            { label: 'Проверка оплаты', count: 5, color: 'bg-amber-100 text-amber-700 border-amber-200' },
            { label: 'Назначен транспорт', count: 14, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
            { label: 'Загрузка', count: 8, color: 'bg-purple-100 text-purple-700 border-purple-200' },
            { label: 'В пути', count: 8, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
            { label: 'Доставлен', count: 12, color: 'bg-green-100 text-green-700 border-green-200' },
            { label: 'Оплата', count: 10, color: 'bg-green-100 text-green-800 border-green-200' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 flex-shrink-0">
              <div className={`text-center px-3 py-2 rounded border ${step.color}`}>
                <p className="text-lg font-bold leading-none">{step.count}</p>
                <p className="text-xs mt-0.5 whitespace-nowrap">{step.label}</p>
              </div>
              {i < 6 && <span className="text-gray-300 text-sm">›</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Orders */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-700 font-semibold text-sm">Последние заказы</h3>
            <a href="/business/sales" className="text-blue-600 text-xs hover:underline">Все →</a>
          </div>
          <table className="w-full text-xs">
            <tbody className="divide-y divide-gray-100">
              {ORDERS.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="py-2 pr-2 text-gray-400 font-mono">{o.id}</td>
                  <td className="py-2 pr-2 text-gray-700 font-medium max-w-[120px] truncate">{o.client}</td>
                  <td className="py-2 pr-2">
                    <span className={`px-1.5 py-0.5 rounded border text-xs ${STATUS_BADGE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                  </td>
                  <td className="py-2 text-right text-gray-800 font-semibold whitespace-nowrap">{o.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vehicles */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-700 font-semibold text-sm">GPS — Транспорт</h3>
            <a href="/operations/logistics" className="text-blue-600 text-xs hover:underline">Карта →</a>
          </div>
          <div className="space-y-2 mb-3">
            {VEHICLES.map(v => (
              <div key={v.id} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
                <Truck size={14} className={v.status === 'on_route' ? 'text-blue-500' : v.status === 'loading' ? 'text-amber-500' : 'text-gray-300'} />
                <span className="text-gray-800 font-medium font-mono text-xs w-20 flex-shrink-0">{v.id}</span>
                <span className={`px-1.5 py-0.5 rounded border text-xs ${STATUS_BADGE[v.status]}`}>{STATUS_LABEL[v.status]}</span>
                <span className="text-gray-400 text-xs ml-auto flex items-center gap-1 truncate"><MapPin size={9} />{v.location}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertTriangle size={12} className="text-amber-500 flex-shrink-0" />
              <span>B 234 KZ — превышение веса при загрузке</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
              <span>Карьер №1 — план смены 87%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} className="text-blue-500 flex-shrink-0" />
              <span>3 заказа ожидают подтверждения оплаты</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
