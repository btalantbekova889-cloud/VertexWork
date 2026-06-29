'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Truck, Package, CheckCircle2, Clock, Plus, AlertTriangle } from 'lucide-react';

const PENDING_ORDERS = [
  { id: 'ОРД-2848', client: 'ТОО "МегаБуд"', material: 'Щебень фр.20-40', volume: 120, address: 'г. Алматы, ул. Розыбакиева 5', priority: 'high' },
  { id: 'ОРД-2849', client: 'ИП Дюсупов М.', material: 'Отсев', volume: 80, address: 'г. Алматы, пр. Рыскулова 12', priority: 'normal' },
  { id: 'ОРД-2850', client: 'ТОО "НурБетон"', material: 'Щебень фр.5-20', volume: 200, address: 'Алматинская обл., Талгар', priority: 'normal' },
];

const VEHICLES = [
  { id: 'A 147 KZ', driver: 'Нурланов Е.', capacity: 30, status: 'on_route', order: 'ОРД-2847', eta: '14:30' },
  { id: 'B 234 KZ', driver: 'Жаксыбеков А.', capacity: 28, status: 'loading', order: 'ОРД-2846', eta: '—' },
  { id: 'C 089 KZ', driver: 'Темиров К.', capacity: 32, status: 'available', order: null, eta: '—' },
  { id: 'D 456 KZ', driver: 'Сатыбалдиев О.', capacity: 28, status: 'available', order: null, eta: '—' },
  { id: 'E 778 KZ', driver: 'Алиев Р.', capacity: 30, status: 'maintenance', order: null, eta: '—' },
];

const V_STATUS: Record<string, { label: string; style: string }> = {
  on_route: { label: 'В пути', style: 'text-cyan-400 bg-cyan-400/10' },
  loading: { label: 'Загрузка', style: 'text-yellow-400 bg-yellow-400/10' },
  available: { label: 'Свободна', style: 'text-green-400 bg-green-400/10' },
  maintenance: { label: 'ТО/Ремонт', style: 'text-red-400 bg-red-400/10' },
};

export default function DispatchPage() {
  return (
    <AppLayout title="Диспетчерская" subtitle="Назначение машин на рейсы">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Ожидают назначения" value={PENDING_ORDERS.length} icon={<Package size={18} />} color="yellow" />
        <StatCard label="Машин в рейсе" value={VEHICLES.filter(v => v.status === 'on_route').length} icon={<Truck size={18} />} color="cyan" />
        <StatCard label="Свободных машин" value={VEHICLES.filter(v => v.status === 'available').length} color="green" />
        <StatCard label="На ТО/Ремонте" value={VEHICLES.filter(v => v.status === 'maintenance').length} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Clock size={16} className="text-yellow-400" /> Ожидают назначения
            </h3>
          </div>
          <div className="space-y-3">
            {PENDING_ORDERS.map(o => (
              <div key={o.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs font-mono">{o.id}</span>
                      {o.priority === 'high' && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">Срочно</span>
                      )}
                    </div>
                    <p className="text-white font-medium text-sm mt-0.5">{o.client}</p>
                  </div>
                  <span className="text-cyan-400 font-bold text-sm">{o.volume} т</span>
                </div>
                <p className="text-slate-400 text-xs mb-1">{o.material}</p>
                <p className="text-slate-500 text-xs mb-3">{o.address}</p>
                <div className="flex gap-2">
                  {VEHICLES.filter(v => v.status === 'available').map(v => (
                    <button
                      key={v.id}
                      className="text-xs px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                    >
                      {v.id}
                    </button>
                  ))}
                  {VEHICLES.filter(v => v.status === 'available').length === 0 && (
                    <span className="text-slate-500 text-xs">Нет свободных машин</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Truck size={16} className="text-cyan-400" /> Парк машин
          </h3>
          <div className="space-y-2">
            {VEHICLES.map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium font-mono text-sm">{v.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${V_STATUS[v.status].style}`}>
                      {V_STATUS[v.status].label}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{v.driver} · {v.capacity} т</p>
                </div>
                <div className="text-right text-xs">
                  {v.order ? (
                    <>
                      <p className="text-slate-400 font-mono">{v.order}</p>
                      {v.eta !== '—' && <p className="text-slate-500">ETA: {v.eta}</p>}
                    </>
                  ) : (
                    <p className="text-slate-600">—</p>
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
