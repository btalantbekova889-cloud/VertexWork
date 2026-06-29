'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import {
  TrendingUp, Truck, Package, Users, DollarSign, Activity,
  AlertTriangle, CheckCircle2, Clock, MapPin
} from 'lucide-react';

const RECENT_ORDERS = [
  { id: 'ORД-2847', client: 'ТОО "АлтайСтрой"', material: 'Щебень фр.20-40', volume: '120 т', status: 'delivered', amount: '480 000 ₸' },
  { id: 'ОРД-2846', client: 'ИП Казаков В.С.', material: 'Щебень фр.5-20', volume: '80 т', status: 'in_progress', amount: '296 000 ₸' },
  { id: 'ОРД-2845', client: 'ТОО "МегаБуд"', material: 'Отсев', volume: '200 т', status: 'pending', amount: '360 000 ₸' },
  { id: 'ОРД-2844', client: 'АО "СтройКонсалт"', material: 'Щебень фр.40-70', volume: '300 т', status: 'delivered', amount: '1 050 000 ₸' },
  { id: 'ОРД-2843', client: 'ТОО "НурБетон"', material: 'Щебень фр.20-40', volume: '150 т', status: 'cancelled', amount: '600 000 ₸' },
];

const VEHICLES = [
  { id: 'A 147 KZ', driver: 'Сейтов М.', status: 'on_route', location: 'Алматы, ул. Абая', load: '25 т' },
  { id: 'B 234 KZ', driver: 'Ахметов Р.', status: 'loading', location: 'Карьер №1', load: '0 т' },
  { id: 'C 089 KZ', driver: 'Нурланов Е.', status: 'on_route', location: 'Алматинская обл.', load: '28 т' },
  { id: 'D 456 KZ', driver: 'Жаксыбеков А.', status: 'idle', location: 'База', load: '0 т' },
];

const STATUS_STYLE: Record<string, string> = {
  delivered: 'text-green-400 bg-green-400/10',
  in_progress: 'text-cyan-400 bg-cyan-400/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
  on_route: 'text-cyan-400 bg-cyan-400/10',
  loading: 'text-yellow-400 bg-yellow-400/10',
  idle: 'text-slate-400 bg-slate-400/10',
};

const STATUS_LABEL: Record<string, string> = {
  delivered: 'Доставлен',
  in_progress: 'В процессе',
  pending: 'Ожидание',
  cancelled: 'Отменен',
  on_route: 'В пути',
  loading: 'Загрузка',
  idle: 'На базе',
};

export default function DashboardPage() {
  return (
    <AppLayout title="Дашборд" subtitle="Обзор компании в реальном времени">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Выручка сегодня"
          value="4 820 000 ₸"
          change="+12% к вчера"
          positive
          icon={<DollarSign size={18} />}
          color="cyan"
        />
        <StatCard
          label="Заказов сегодня"
          value="23"
          change="+5 к вчера"
          positive
          icon={<Package size={18} />}
          color="blue"
        />
        <StatCard
          label="Машин в рейсе"
          value="8 / 12"
          icon={<Truck size={18} />}
          color="green"
        />
        <StatCard
          label="Добыча сегодня"
          value="1 240 т"
          change="+8% к плану"
          positive
          icon={<Activity size={18} />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <StatCard label="Дебиторская задолженность" value="12 340 000 ₸" change="-3% к прошл. нед." positive={false} color="red" />
        <StatCard label="Активных клиентов" value="47" change="+2 за неделю" positive icon={<Users size={18} />} color="yellow" />
        <StatCard label="Остаток щебня на складе" value="8 420 т" change="-120 т за день" positive={false} color="green" />
      </div>

      {/* Flow diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <Activity size={16} className="text-cyan-400" /> Движение заказа — текущий статус
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { label: 'Заказ создан', count: 23, color: 'cyan' },
            { label: 'Проверка оплаты', count: 5, color: 'yellow' },
            { label: 'Диспетчер назначил', count: 14, color: 'blue' },
            { label: 'Загрузка на карьере', count: 8, color: 'purple' },
            { label: 'В пути', count: 8, color: 'green' },
            { label: 'Доставлен', count: 12, color: 'green' },
            { label: 'Оплата зафиксирована', count: 10, color: 'cyan' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className={`text-center px-3 py-2 rounded-lg border ${
                step.color === 'cyan' ? 'border-cyan-500/30 bg-cyan-500/10' :
                step.color === 'yellow' ? 'border-yellow-500/30 bg-yellow-500/10' :
                step.color === 'blue' ? 'border-blue-500/30 bg-blue-500/10' :
                step.color === 'purple' ? 'border-purple-500/30 bg-purple-500/10' :
                'border-green-500/30 bg-green-500/10'
              }`}>
                <p className={`text-lg font-bold ${
                  step.color === 'cyan' ? 'text-cyan-400' :
                  step.color === 'yellow' ? 'text-yellow-400' :
                  step.color === 'blue' ? 'text-blue-400' :
                  step.color === 'purple' ? 'text-purple-400' : 'text-green-400'
                }`}>{step.count}</p>
                <p className="text-slate-400 text-xs whitespace-nowrap">{step.label}</p>
              </div>
              {i < 6 && <div className="text-slate-600 text-lg flex-shrink-0">→</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Последние заказы</h3>
            <a href="/business/sales" className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">Все заказы →</a>
          </div>
          <div className="space-y-2">
            {RECENT_ORDERS.map(o => (
              <div key={o.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs font-mono">{o.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium truncate">{o.client}</p>
                  <p className="text-slate-500 text-xs">{o.material} · {o.volume}</p>
                </div>
                <p className="text-white text-sm font-semibold whitespace-nowrap">{o.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Truck size={16} className="text-cyan-400" /> GPS — Машины
            </h3>
            <a href="/operations/logistics" className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">Карта →</a>
          </div>
          <div className="space-y-2 mb-4">
            {VEHICLES.map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <Truck size={16} className={
                  v.status === 'on_route' ? 'text-cyan-400' :
                  v.status === 'loading' ? 'text-yellow-400' : 'text-slate-500'
                } />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{v.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[v.status]}`}>
                      {STATUS_LABEL[v.status]}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{v.driver}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <MapPin size={10} />
                    <span className="truncate max-w-24">{v.location}</span>
                  </div>
                  <p className="text-slate-500 text-xs">{v.load}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0" />
              <span className="text-slate-400">Машина <span className="text-white">B 234 KZ</span> — превышение веса при загрузке</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
              <span className="text-slate-400">Карьер №1 — план смены выполнен на <span className="text-green-400">87%</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock size={14} className="text-cyan-400 flex-shrink-0" />
              <span className="text-slate-400">3 заказа ожидают подтверждения оплаты</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
