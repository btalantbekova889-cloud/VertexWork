'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Truck, Package, Clock } from 'lucide-react';

interface Vehicle { id: number; plate: string; driver: string; capacity: number; status: string; order: string | null; eta: string; }
interface Order { id: string; client: string; material: string; volume: number; address: string; priority: string; assigned?: boolean; }

const INITIAL_ORDERS: Order[] = [
  { id: 'ОРД-2848', client: 'ТОО "МегаБуд"',   material: 'Щебень фр.20-40', volume: 120, address: 'г. Бишкек, ул. Розыбакиева 5',  priority: 'high' },
  { id: 'ОРД-2849', client: 'ИП Дюсупов М.',    material: 'Отсев',           volume: 80,  address: 'г. Бишкек, пр. Рыскулова 12',   priority: 'normal' },
  { id: 'ОРД-2850', client: 'ТОО "НурБетон"',   material: 'Щебень фр.5-20', volume: 200, address: 'Чуйская обл., Токмок',           priority: 'normal' },
];

const V_STATUS: Record<string, { label: string; badge: string }> = {
  on_route:    { label: 'В пути',    badge: 'text-blue-700 bg-blue-50 border-blue-200' },
  loading:     { label: 'Загрузка',  badge: 'text-amber-700 bg-amber-50 border-amber-200' },
  available:   { label: 'Свободна', badge: 'text-green-700 bg-green-50 border-green-200' },
  maintenance: { label: 'ТО/Ремонт',badge: 'text-red-700 bg-red-50 border-red-200' },
};

export default function DispatchPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  useEffect(() => {
    fetch('/api/vehicles')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.vehicles) && d.vehicles.length) setVehicles(d.vehicles); })
      .catch(() => {});
  }, []);

  const assign = async (orderId: string, vehicleId: number) => {
    const plate = vehicles.find(v => v.id === vehicleId)?.plate || '';
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status: 'on_route', order: orderId } : v));
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assigned: true } : o));
    await fetch(`/api/vehicles/${vehicleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'on_route', order: orderId }),
    }).catch(() => {});
  };

  const pending = orders.filter(o => !o.assigned);
  const available = vehicles.filter(v => v.status === 'available');

  return (
    <AppLayout title="Диспетчерская" subtitle="Назначение машин на рейсы">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Ожидают назначения" value={pending.length}                                              icon={<Package size={16} />} color="yellow" />
        <StatCard label="Машин в рейсе"       value={vehicles.filter(v => v.status === 'on_route').length}      icon={<Truck size={16} />}   color="blue" />
        <StatCard label="Свободных машин"     value={available.length}                                           color="green" />
        <StatCard label="На ТО/Ремонте"       value={vehicles.filter(v => v.status === 'maintenance').length}   color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
            <Clock size={15} className="text-amber-500" /> Ожидают назначения
          </h3>
          <div className="space-y-3">
            {pending.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Все заказы назначены</p>}
            {pending.map(o => (
              <div key={o.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs font-mono">{o.id}</span>
                      {o.priority === 'high' && <span className="text-xs px-1.5 py-0.5 rounded border text-red-700 bg-red-50 border-red-200">Срочно</span>}
                    </div>
                    <p className="text-gray-800 font-medium text-sm mt-0.5">{o.client}</p>
                  </div>
                  <span className="text-gray-800 font-bold text-sm">{o.volume} т</span>
                </div>
                <p className="text-gray-500 text-xs mb-1">{o.material}</p>
                <p className="text-gray-400 text-xs mb-3">{o.address}</p>
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-gray-400 text-xs">Назначить:</span>
                  {available.map(v => (
                    <button key={v.id} onClick={() => assign(o.id, v.id)}
                      className="text-xs px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors font-mono">
                      {v.plate}
                    </button>
                  ))}
                  {available.length === 0 && <span className="text-gray-400 text-xs">Нет свободных машин</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
            <Truck size={15} className="text-gray-600" /> Парк машин
          </h3>
          <div className="space-y-2">
            {vehicles.map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-medium font-mono text-sm">{v.plate}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${V_STATUS[v.status]?.badge || ''}`}>
                      {V_STATUS[v.status]?.label || v.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{v.driver} · {v.capacity} т</p>
                </div>
                <div className="text-right text-xs">
                  {v.order ? <p className="text-gray-500 font-mono">{v.order}</p> : <p className="text-gray-300">—</p>}
                  {v.eta && v.eta !== '—' && <p className="text-gray-400">ETA: {v.eta}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
