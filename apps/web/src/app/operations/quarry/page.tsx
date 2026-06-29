'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Pickaxe, Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const SHIFTS = [
  { shift: 'Смена 1 (07:00–19:00)', foreman: 'Ержанов Б.', workers: 12, extracted: 620, plan: 700, equipment: 'Экскаватор CAT-349, 3 самосвала' },
  { shift: 'Смена 2 (19:00–07:00)', foreman: 'Темиров А.', workers: 10, extracted: 420, plan: 600, equipment: 'Экскаватор Komatsu, 2 самосвала' },
];

const QUARRY_STATS = [
  { zone: 'Блок А-12', material: 'Щебень фр.20-40',  status: 'active',      extracted_today: 480, remaining: 125000 },
  { zone: 'Блок Б-7',  material: 'Щебень фр.5-20',   status: 'active',      extracted_today: 320, remaining: 89000  },
  { zone: 'Блок В-3',  material: 'Отсев',             status: 'maintenance', extracted_today: 0,   remaining: 210000 },
  { zone: 'Блок Г-15', material: 'Щебень фр.40-70',  status: 'active',      extracted_today: 440, remaining: 67000  },
];

const ATTENDANCE = [
  { name: 'Ержанов Болат',      position: 'Начальник карьера', entry: '07:00', exit: null,    status: 'on_shift', hours: 2.8 },
  { name: 'Ахметов Рустам',    position: 'Диспетчер',         entry: '07:05', exit: null,    status: 'on_shift', hours: 2.7 },
  { name: 'Сейтов Марат',      position: 'Весовщик',          entry: '07:15', exit: null,    status: 'on_shift', hours: 2.5 },
  { name: 'Нурланов Ерлан',    position: 'Водитель',          entry: '07:05', exit: '09:30', status: 'exit',     hours: 2.4 },
  { name: 'Жаксыбеков Айдан',  position: 'Водитель',          entry: '07:10', exit: '08:50', status: 'exit',     hours: 1.7 },
  { name: 'Темиров Канат',      position: 'Водитель',          entry: '07:20', exit: null,    status: 'on_shift', hours: 2.4 },
  { name: 'Карибеков Данияр',  position: 'Водитель',          entry: '07:25', exit: null,    status: 'on_shift', hours: 2.3 },
  { name: 'Мусаев Азамат',     position: 'Взрывник',          entry: '07:10', exit: null,    status: 'on_shift', hours: 2.6 },
  { name: 'Байжанов Серик',    position: 'Механик',           entry: '07:00', exit: null,    status: 'on_shift', hours: 2.8 },
  { name: 'Сатыбалдиев Омар',  position: 'Водитель',          entry: null,    exit: null,    status: 'absent',   hours: 0   },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  on_shift: { label: 'На смене',   cls: 'text-green-700 bg-green-50 border-green-200'  },
  exit:     { label: 'Выехал',     cls: 'text-gray-600 bg-gray-50 border-gray-200'     },
  absent:   { label: 'Отсутствует', cls: 'text-red-600 bg-red-50 border-red-200'       },
};

export default function QuarryPage() {
  const [tab, setTab] = useState<'extraction' | 'attendance'>('extraction');
  const totalToday = QUARRY_STATS.reduce((s, q) => s + q.extracted_today, 0);

  return (
    <AppLayout title="Карьер (добыча)" subtitle="Управление горнодобывающими работами">
      {/* Tab switcher */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('extraction')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === 'extraction' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Добыча
        </button>
        <button
          onClick={() => setTab('attendance')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === 'attendance' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Посещаемость
        </button>
      </div>

      {tab === 'extraction' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <StatCard label="Добыто сегодня"    value={`${totalToday} т`}                                  change="+8% к плану" positive icon={<Pickaxe size={16} />} />
            <StatCard label="План смены"         value="1 300 т" />
            <StatCard label="Выполнение плана"   value={`${Math.round((totalToday / 1300) * 100)}%`}       icon={<Activity size={16} />} />
            <StatCard label="Рабочих на смене"  value="22"                                                 icon={<Clock size={16} />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {SHIFTS.map((s, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-700 font-semibold text-sm">{s.shift}</h3>
                  <span className={`text-xs px-1.5 py-0.5 rounded border ${i === 0 ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                    {i === 0 ? 'Активная' : 'Следующая'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                  <div><p className="text-gray-400">Мастер смены</p><p className="text-gray-800 font-medium">{s.foreman}</p></div>
                  <div><p className="text-gray-400">Рабочих</p><p className="text-gray-800 font-medium">{s.workers}</p></div>
                  <div><p className="text-gray-400">Добыто</p><p className="text-blue-600 font-bold text-sm">{s.extracted} т</p></div>
                  <div><p className="text-gray-400">План</p><p className="text-gray-800 font-medium">{s.plan} т</p></div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Выполнение плана</span>
                    <span className={`font-medium ${s.extracted / s.plan >= 0.9 ? 'text-green-600' : s.extracted / s.plan >= 0.7 ? 'text-amber-600' : 'text-red-600'}`}>
                      {Math.round((s.extracted / s.plan) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.extracted / s.plan >= 0.9 ? 'bg-green-500' : s.extracted / s.plan >= 0.7 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min((s.extracted / s.plan) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-2">{s.equipment}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-gray-700 font-semibold mb-4 text-sm">Рабочие блоки</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                    <th className="text-left pb-2.5 font-medium">Блок</th>
                    <th className="text-left pb-2.5 font-medium">Материал</th>
                    <th className="text-center pb-2.5 font-medium">Статус</th>
                    <th className="text-right pb-2.5 font-medium">Добыто сегодня</th>
                    <th className="text-right pb-2.5 font-medium">Остаток запасов</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {QUARRY_STATS.map((q, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 text-gray-800 font-medium font-mono">{q.zone}</td>
                      <td className="py-2.5 text-gray-500 text-xs">{q.material}</td>
                      <td className="py-2.5 text-center">
                        {q.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                            <CheckCircle2 size={11} /> Работает
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            <AlertTriangle size={11} /> ТО
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-right text-blue-600 font-semibold">{q.extracted_today > 0 ? `${q.extracted_today} т` : '—'}</td>
                      <td className="py-2.5 text-right text-gray-500">{q.remaining.toLocaleString('ru-RU')} т</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'attendance' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-gray-700 font-semibold text-sm">Посещаемость — сегодня</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" /> На смене: {ATTENDANCE.filter(a => a.status === 'on_shift').length}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Отсутствует: {ATTENDANCE.filter(a => a.status === 'absent').length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 font-medium">ФИО</th>
                  <th className="text-left px-4 py-2.5 font-medium">Должность</th>
                  <th className="text-center px-4 py-2.5 font-medium">Въезд (АРН)</th>
                  <th className="text-center px-4 py-2.5 font-medium">Выезд (АРН)</th>
                  <th className="text-center px-4 py-2.5 font-medium">Статус</th>
                  <th className="text-right px-4 py-2.5 font-medium">Часов на смене</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ATTENDANCE.map((a, i) => {
                  const s = STATUS_MAP[a.status];
                  return (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 text-gray-800 font-medium">{a.name}</td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs">{a.position}</td>
                      <td className="px-4 py-2.5 text-center text-gray-700 font-mono text-xs">
                        {a.entry ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-center text-gray-500 font-mono text-xs">
                        {a.exit ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${s.cls}`}>{s.label}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-700 font-semibold text-xs">
                        {a.hours > 0 ? `${a.hours} ч` : <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
