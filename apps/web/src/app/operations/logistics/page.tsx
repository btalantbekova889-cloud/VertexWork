'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Truck, MapPin, Route, Navigation } from 'lucide-react';

const TRIPS = [
  { id: 'РЕЙ-847', vehicle: 'A 147 KG', driver: 'Нурланов Е.', from: 'Карьер №1', to: 'г. Бишкек, ул. Абая 5', load: 28, status: 'on_route', started: '08:15', eta: '10:30', progress: 68 },
  { id: 'РЕЙ-846', vehicle: 'B 234 KG', driver: 'Жаксыбеков А.', from: 'Карьер №1', to: 'г. Бишкек, пр. Достык 180', load: 30, status: 'loading', started: '—', eta: '—', progress: 0 },
  { id: 'РЕЙ-845', vehicle: 'C 089 KG', driver: 'Темиров К.', from: 'Карьер №1', to: 'Чуйская обл., Токмок', load: 32, status: 'delivering', started: '07:00', eta: '11:00', progress: 45 },
  { id: 'РЕЙ-844', vehicle: 'F 321 KG', driver: 'Алиев Р.', from: 'Карьер №1', to: 'г. Бишкек, ул. Розыбакиева', load: 25, status: 'delivered', started: '06:30', eta: '—', progress: 100 },
];

const STATUS: Record<string, { label: string; badge: string }> = {
  on_route:  { label: 'В пути',    badge: 'text-blue-700 bg-blue-50 border-blue-200' },
  loading:   { label: 'Загрузка',  badge: 'text-amber-700 bg-amber-50 border-amber-200' },
  delivering:{ label: 'Доставка',  badge: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  delivered: { label: 'Доставлен', badge: 'text-green-700 bg-green-50 border-green-200' },
};

export default function LogisticsPage() {
  return (
    <AppLayout title="Логистика" subtitle="Управление маршрутами и доставкой">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Рейсов сегодня" value="18" icon={<Route size={16} />} color="blue" />
        <StatCard label="В пути" value={TRIPS.filter(t => ['on_route', 'delivering'].includes(t.status)).length} icon={<Truck size={16} />} color="indigo" />
        <StatCard label="Доставлено" value={TRIPS.filter(t => t.status === 'delivered').length} color="green" />
        <StatCard label="Перевезено тонн" value="624 т" icon={<Navigation size={16} />} color="purple" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-700 font-semibold flex items-center gap-2">
            <MapPin size={15} className="text-blue-600" /> GPS — карта в реальном времени
          </h3>
          <span className="flex items-center gap-1.5 text-xs text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Онлайн
          </span>
        </div>
        <div className="h-56 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-200">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #d1d5db 0, #d1d5db 1px, transparent 0, transparent 40px), repeating-linear-gradient(90deg, #d1d5db 0, #d1d5db 1px, transparent 0, transparent 40px)',
            backgroundSize: '40px 40px'
          }} />
          {TRIPS.filter(t => ['on_route', 'delivering'].includes(t.status)).map((t, i) => (
            <div
              key={t.id}
              className="absolute flex flex-col items-center gap-1"
              style={{ left: `${25 + i * 22}%`, top: `${30 + i * 15}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-400 flex items-center justify-center shadow-sm">
                <Truck size={14} className="text-blue-600" />
              </div>
              <span className="text-xs text-blue-700 font-mono bg-white/90 px-1 rounded shadow-sm">{t.vehicle}</span>
            </div>
          ))}
          <div className="absolute bottom-3 left-3 right-3 flex gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-full border border-blue-400 bg-blue-100" />В пути
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-full border border-green-500 bg-green-100" />Доставлен
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="text-gray-700 font-semibold mb-4">Рейсы сегодня</h3>
        <div className="space-y-3">
          {TRIPS.map(t => (
            <div key={t.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-gray-400 text-xs font-mono">{t.id}</p>
                  <p className="text-gray-800 font-medium font-mono text-sm">{t.vehicle}</p>
                  <p className="text-gray-400 text-xs">{t.driver}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span className="text-green-500">●</span> {t.from}
                    <span>→</span>
                    <span className="text-blue-500">●</span>
                    <span className="truncate">{t.to}</span>
                  </div>
                  {t.progress > 0 && t.progress < 100 && (
                    <div className="h-1.5 bg-gray-100 rounded-full mt-2">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${t.progress}%` }} />
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs px-1.5 py-0.5 rounded border ${STATUS[t.status].badge}`}>{STATUS[t.status].label}</span>
                  <div className="flex gap-3 mt-1 text-xs text-gray-400 justify-end">
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
