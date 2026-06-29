'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Truck, MapPin, Route, Clock, Navigation } from 'lucide-react';

const TRIPS = [
  { id: 'РЕЙ-847', vehicle: 'A 147 KZ', driver: 'Нурланов Е.', from: 'Карьер №1', to: 'г. Алматы, ул. Абая 5', load: 28, status: 'on_route', started: '08:15', eta: '10:30', progress: 68 },
  { id: 'РЕЙ-846', vehicle: 'B 234 KZ', driver: 'Жаксыбеков А.', from: 'Карьер №1', to: 'г. Алматы, пр. Достык 180', load: 30, status: 'loading', started: '—', eta: '—', progress: 0 },
  { id: 'РЕЙ-845', vehicle: 'C 089 KZ', driver: 'Темиров К.', from: 'Карьер №1', to: 'Алматинская обл., Талгар', load: 32, status: 'delivering', started: '07:00', eta: '11:00', progress: 45 },
  { id: 'РЕЙ-844', vehicle: 'F 321 KZ', driver: 'Алиев Р.', from: 'Карьер №1', to: 'г. Алматы, ул. Розыбакиева', load: 25, status: 'delivered', started: '06:30', eta: '—', progress: 100 },
];

const STATUS: Record<string, { label: string; style: string }> = {
  on_route: { label: 'В пути', style: 'text-cyan-400 bg-cyan-400/10' },
  loading: { label: 'Загрузка', style: 'text-yellow-400 bg-yellow-400/10' },
  delivering: { label: 'Доставка', style: 'text-blue-400 bg-blue-400/10' },
  delivered: { label: 'Доставлен', style: 'text-green-400 bg-green-400/10' },
};

export default function LogisticsPage() {
  return (
    <AppLayout title="Логистика" subtitle="Управление маршрутами и доставкой">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Рейсов сегодня" value="18" icon={<Route size={18} />} color="cyan" />
        <StatCard label="В пути" value={TRIPS.filter(t => ['on_route', 'delivering'].includes(t.status)).length} icon={<Truck size={18} />} color="blue" />
        <StatCard label="Доставлено" value={TRIPS.filter(t => t.status === 'delivered').length} color="green" />
        <StatCard label="Перевезено тонн" value="624 т" icon={<Navigation size={18} />} color="purple" />
      </div>

      {/* GPS Map placeholder */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <MapPin size={16} className="text-cyan-400" /> GPS — карта в реальном времени
          </h3>
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Онлайн
          </span>
        </div>
        <div className="h-64 bg-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #64748b 0, #64748b 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #64748b 0, #64748b 1px, transparent 0, transparent 50%)',
            backgroundSize: '40px 40px'
          }} />
          {/* Simulated truck positions */}
          {TRIPS.filter(t => ['on_route', 'delivering'].includes(t.status)).map((t, i) => (
            <div
              key={t.id}
              className="absolute flex flex-col items-center gap-1"
              style={{ left: `${25 + i * 22}%`, top: `${30 + i * 15}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center">
                <Truck size={14} className="text-cyan-400" />
              </div>
              <span className="text-xs text-cyan-400 font-mono bg-slate-900/80 px-1 rounded">{t.vehicle}</span>
            </div>
          ))}
          <div className="absolute bottom-4 left-4 right-4 flex gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-3 h-3 rounded-full border border-cyan-500 bg-cyan-500/20" />
              В пути
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-3 h-3 rounded-full border border-green-500 bg-green-500/20" />
              Доставлен
            </div>
          </div>
        </div>
      </div>

      {/* Trips table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Рейсы сегодня</h3>
        <div className="space-y-3">
          {TRIPS.map(t => (
            <div key={t.id} className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-slate-500 text-xs font-mono">{t.id}</p>
                  <p className="text-white font-medium font-mono">{t.vehicle}</p>
                  <p className="text-slate-400 text-xs">{t.driver}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="text-green-400">●</span> {t.from}
                    <span>→</span>
                    <span className="text-cyan-400">●</span>
                    <span className="truncate">{t.to}</span>
                  </div>
                  {t.progress > 0 && t.progress < 100 && (
                    <div className="h-1.5 bg-slate-700 rounded-full mt-2">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${t.progress}%` }} />
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS[t.status].style}`}>{STATUS[t.status].label}</span>
                  <div className="flex gap-3 mt-1 text-xs text-slate-500 justify-end">
                    <span>Груз: {t.load} т</span>
                    {t.eta !== '—' && <span>ETA: {t.eta}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
