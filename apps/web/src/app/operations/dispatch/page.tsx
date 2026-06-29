'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Truck, Package, Clock } from 'lucide-react';

const PENDING_ORDERS = [
  { id: 'ОРД-2848', client: 'ТОО "МегаБуд"', material: 'Щебень фр.20-40', volume: 120, address: 'г. Бишкек, ул. Розыбакиева 5', priority: 'high' },
  { id: 'ОРД-2849', client: 'ИП Дюсупов М.', material: 'Отсев', volume: 80, address: 'г. Бишкек, пр. Рыскулова 12', priority: 'normal' },
  { id: 'ОРД-2850', client: 'ТОО "НурБетон"', material: 'Щебень фр.5-20', volume: 200, address: 'Чуйская обл., Токмок', priority: 'normal' },
];

const VEHICLES = [
  { id: 'A 147 KG', driver: 'Нурланов Е.', capacity: 30, status: 'on_route', order: 'ОРД-2847', eta: '14:30' },
  { id: 'B 234 KG', driver: 'Жаксыбеков А.', capacity: 28, status: 'loading', order: 'ОРД-2846', eta: '—' },
  { id: 'C 089 KG', driver: 'Темиров К.', capacity: 32, status: 'available', order: null, eta: '—' },
  { id: 'D 456 KG', driver: 'Сатыбалдиев О.', capacity: 28, status: 'available', order: null, eta: '—' },
  { id: 'E 778 KG', driver: 'Алиев Р.', capacity: 30, status: 'maintenance', order: null, eta: '—' },
];

const V_STATUS: Record<string, { label: string; badge: string }> = {
  on_route:    { label: 'В пути',     badge: 'text-blue-700 bg-blue-50 border-blue-200' },
  loading:     { label: 'Загрузка',   badge: 'text-amber-700 bg-amber-50 border-amber-200' },
  available:   { label: 'Свободна',   badge: 'text-green-700 bg-green-50 border-green-200' },
  maintenance: { label: 'ТО/Ремонт', badge: 'text-red-700 bg-red-50 border-red-200' },
};

export default function DispatchPage() {
  return (
    <AppLayout title="Диспетчерская" subtitle="Назначение машин на рейсы">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Ожидают назначения" value={PENDING_ORDERS.length} icon={<Package size={16} />} color="yellow" />
        <StatCard label="Машин в рейсе" value={VEHICLES.filter(v => v.status === 'on_route').length} icon={<Truck size={16} />} color="blue" />
        <StatCard label="Свободных машин" value={VEHICLES.filter(v => v.status === 'available').length} color="green" />
        <StatCard label="На ТО/Ремонте" value={VEHICLES.filter(v => v.status === 'maintenance').length} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
            <Clock size={15} className="text-amber-500" /> Ожидают назначения
          </h3>
          <div className="space-y-3">
            {PENDING_ORDERS.map(o => (
              <div key={o.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs font-mono">{o.id}</span>
                      {o.priority === 'high' && (
                        <span className="text-xs px-1.5 py-0.5 rounded border text-red-700 bg-red-50 border-red-200">Срочно</span>
                      )}
                    </div>
                    <p className="text-gray-800 font-medium text-sm mt-0.5">{o.client}</p>
                  </div>
                  <span className="text-blue-600 font-bold text-sm">{o.volume} т</span>
                </div>
                <p className="text-gray-500 text-xs mb-1">{o.material}</p>
                <p className="text-gray-400 text-xs mb-3">{o.address}</p>
                <div className="flex gap-2 flex-wrap">
                  {VEHICLES.filter(v => v.status === 'available').map(v => (
                    <button
                      key={v.id}
                      className="text-xs px-2.5 py-1 rounded border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      {v.id}
                    </button>
                  ))}
                  {VEHICLES.filter(v => v.status === 'available').length === 0 && (
                    <span className="text-gray-400 text-xs">Нет свободных машин</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
            <Truck size={15} className="text-blue-600" /> Парк машин
          </h3>
          <div className="space-y-2">
            {VEHICLES.map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-medium font-mono text-sm">{v.id}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${V_STATUS[v.status].badge}`}>
                      {V_STATUS[v.status].label}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{v.driver} · {v.capacity} т</p>
                </div>
                <div className="text-right text-xs">
                  {v.order ? (
                    <>
                      <p className="text-gray-500 font-mono">{v.order}</p>
                      {v.eta !== '—' && <p className="text-gray-400">ETA: {v.eta}</p>}
                    </>
                  ) : (
                    <p className="text-gray-300">—</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
