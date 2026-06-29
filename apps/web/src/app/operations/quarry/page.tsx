'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Pickaxe, Activity, Clock, AlertTriangle, CheckCircle2, Truck } from 'lucide-react';

const SHIFTS = [
  { shift: 'Смена 1 (07:00–19:00)', foreman: 'Ержанов Б.', workers: 12, extracted: 620, plan: 700, equipment: 'Экскаватор CAT-349, 3 самосвала' },
  { shift: 'Смена 2 (19:00–07:00)', foreman: 'Темиров А.', workers: 10, extracted: 420, plan: 600, equipment: 'Экскаватор Komatsu, 2 самосвала' },
];

const QUARRY_STATS = [
  { zone: 'Блок А-12', material: 'Щебень фр.20-40', status: 'active', extracted_today: 480, remaining: 125000 },
  { zone: 'Блок Б-7', material: 'Щебень фр.5-20', status: 'active', extracted_today: 320, remaining: 89000 },
  { zone: 'Блок В-3', material: 'Отсев', status: 'maintenance', extracted_today: 0, remaining: 210000 },
  { zone: 'Блок Г-15', material: 'Щебень фр.40-70', status: 'active', extracted_today: 440, remaining: 67000 },
];

export default function QuarryPage() {
  const totalToday = QUARRY_STATS.reduce((s, q) => s + q.extracted_today, 0);

  return (
    <AppLayout title="Карьер (добыча)" subtitle="Управление горнодобывающими работами">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Добыто сегодня" value={`${totalToday} т`} change="+8% к плану" positive icon={<Pickaxe size={18} />} color="cyan" />
        <StatCard label="План смены" value="1 300 т" color="blue" />
        <StatCard label="Выполнение плана" value={`${Math.round((totalToday / 1300) * 100)}%`} icon={<Activity size={18} />} color="green" />
        <StatCard label="Рабочих на смене" value="22" icon={<Clock size={18} />} color="purple" />
      </div>

      {/* Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {SHIFTS.map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">{s.shift}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? 'text-green-400 bg-green-400/10' : 'text-slate-400 bg-slate-400/10'}`}>
                {i === 0 ? 'Активная' : 'Следующая'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
              <div><p className="text-slate-500">Мастер смены</p><p className="text-white font-medium">{s.foreman}</p></div>
              <div><p className="text-slate-500">Рабочих</p><p className="text-white font-medium">{s.workers}</p></div>
              <div><p className="text-slate-500">Добыто</p><p className="text-cyan-400 font-bold text-sm">{s.extracted} т</p></div>
              <div><p className="text-slate-500">План</p><p className="text-white font-medium">{s.plan} т</p></div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Выполнение плана</span>
                <span className={`font-medium ${s.extracted / s.plan >= 0.9 ? 'text-green-400' : s.extracted / s.plan >= 0.7 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {Math.round((s.extracted / s.plan) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full">
                <div
                  className={`h-full rounded-full ${s.extracted / s.plan >= 0.9 ? 'bg-green-500' : s.extracted / s.plan >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min((s.extracted / s.plan) * 100, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-slate-500 text-xs">{s.equipment}</p>
          </div>
        ))}
      </div>

      {/* Zones */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Рабочие блоки</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left py-2 pb-3 font-medium">Блок</th>
                <th className="text-left py-2 pb-3 font-medium">Материал</th>
                <th className="text-center py-2 pb-3 font-medium">Статус</th>
                <th className="text-right py-2 pb-3 font-medium">Добыто сегодня</th>
                <th className="text-right py-2 pb-3 font-medium">Остаток запасов</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {QUARRY_STATS.map((q, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 text-white font-medium font-mono">{q.zone}</td>
                  <td className="py-3 text-slate-300 text-xs">{q.material}</td>
                  <td className="py-3 text-center">
                    {q.status === 'active' ? (
                      <span className="flex items-center justify-center gap-1 text-xs text-green-400">
                        <CheckCircle2 size={12} /> Работает
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1 text-xs text-yellow-400">
                        <AlertTriangle size={12} /> ТО
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right text-cyan-400 font-semibold">{q.extracted_today > 0 ? `${q.extracted_today} т` : '—'}</td>
                  <td className="py-3 text-right text-slate-300">{q.remaining.toLocaleString('ru-RU')} т</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
