'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { apiFetch } from '@/lib/api';
import { currentYearMonth, todayYMD } from '@/lib/date';
import { Pickaxe, Activity, Clock, AlertTriangle, CheckCircle2, LogIn, LogOut } from 'lucide-react';

interface Employee { id: number; fullName: string; position: string; }
interface AttendanceRecord { id: number; employeeId: number; workDate: string; entryTime: string | null; exitTime: string | null; source: string; }

function hoursWorked(entry: string | null, exit: string | null): number {
  if (!entry) return 0;
  const [eh, em] = entry.split(':').map(Number);
  const start = eh * 60 + em;
  let end: number;
  if (exit) { const [xh, xm] = exit.split(':').map(Number); end = xh * 60 + xm; }
  else { const now = new Date(); end = now.getHours() * 60 + now.getMinutes(); }
  return Math.max(0, Math.round(((end - start) / 60) * 10) / 10);
}

const SHIFTS = [
  { shift: 'Смена 1 (07:00–19:00)', foreman: 'Ержанов Б.', workers: 12, extracted: 620, plan: 700, equipment: 'Экскаватор CAT-349, 3 самосвала' },
  { shift: 'Смена 2 (19:00–07:00)', foreman: 'Темиров А.', workers: 10, extracted: 420, plan: 600, equipment: 'Экскаватор Komatsu, 2 самосвала' },
];

const QUARRY_STATS = [
  { zone: 'Блок А-12', material: 'Щебень фр.20-40', status: 'active',      extracted_today: 480, remaining: 125000 },
  { zone: 'Блок Б-7',  material: 'Щебень фр.5-20',  status: 'active',      extracted_today: 320, remaining: 89000  },
  { zone: 'Блок В-3',  material: 'Отсев',            status: 'maintenance', extracted_today: 0,   remaining: 210000 },
  { zone: 'Блок Г-15', material: 'Щебень фр.40-70', status: 'active',      extracted_today: 440, remaining: 67000  },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  on_shift: { label: 'На смене',    cls: 'text-green-700 bg-green-50 border-green-200' },
  exit:     { label: 'Выехал',      cls: 'text-gray-600 bg-gray-50 border-gray-200'   },
  absent:   { label: 'Отсутствует', cls: 'text-red-600 bg-red-50 border-red-200'      },
};

export default function QuarryPage() {
  const [tab, setTab] = useState<'extraction' | 'attendance'>('extraction');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState('');
  const [marking, setMarking] = useState<number | null>(null);
  const totalToday = QUARRY_STATS.reduce((s, q) => s + q.extracted_today, 0);

  const load = useCallback(async () => {
    try {
      const { year, month } = currentYearMonth();
      const [empData, attData] = await Promise.all([
        apiFetch<{ employees: Employee[] }>('/api/employees'),
        apiFetch<{ records: AttendanceRecord[] }>(`/api/attendance?year=${year}&month=${month}`),
      ]);
      setEmployees(empData.employees);
      setRecords(attData.records);
      setError('');
    } catch { setError('Не удалось загрузить данные посещаемости.'); }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  const handleMark = async (employeeId: number, action: 'entry' | 'exit' | 'remove') => {
    setMarking(employeeId);
    try {
      await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, action }),
      });
      await load();
    } finally { setMarking(null); }
  };

  const today = todayYMD();
  const attendanceToday = employees.map(e => {
    const rec = records.find(r => r.employeeId === e.id && r.workDate.slice(0, 10) === today);
    const status = !rec ? 'absent' : rec.exitTime ? 'exit' : 'on_shift';
    return { id: e.id, name: e.fullName, position: e.position, entry: rec?.entryTime ?? null, exit: rec?.exitTime ?? null, status, hours: rec ? hoursWorked(rec.entryTime, rec.exitTime) : 0 };
  });

  return (
    <AppLayout title="Карьер (добыча)" subtitle="Управление горнодобывающими работами">
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        {(['extraction', 'attendance'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'extraction' ? 'Добыча' : 'Посещаемость'}
          </button>
        ))}
      </div>

      {tab === 'extraction' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <StatCard label="Добыто сегодня"  value={`${totalToday} т`}                              change="+8% к плану" positive icon={<Pickaxe size={16} />} />
            <StatCard label="План смены"       value="1 300 т" />
            <StatCard label="Выполнение плана" value={`${Math.round((totalToday / 1300) * 100)}%`}  icon={<Activity size={16} />} />
            <StatCard label="Рабочих на смене" value="22"                                            icon={<Clock size={16} />} />
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
                  <div><p className="text-gray-400">Добыто</p><p className="text-gray-800 font-bold text-sm">{s.extracted} т</p></div>
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
                    <div className={`h-full rounded-full ${s.extracted / s.plan >= 0.9 ? 'bg-green-500' : s.extracted / s.plan >= 0.7 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min((s.extracted / s.plan) * 100, 100)}%` }} />
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
                        {q.status === 'active'
                          ? <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded"><CheckCircle2 size={11} /> Работает</span>
                          : <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded"><AlertTriangle size={11} /> ТО</span>}
                      </td>
                      <td className="py-2.5 text-right text-gray-800 font-semibold">{q.extracted_today > 0 ? `${q.extracted_today} т` : '—'}</td>
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
          {error && <div className="m-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-gray-700 font-semibold text-sm">Посещаемость — сегодня</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> На смене: {attendanceToday.filter(a => a.status === 'on_shift').length}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> Отсутствует: {attendanceToday.filter(a => a.status === 'absent').length}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 font-medium">ФИО</th>
                  <th className="text-left px-4 py-2.5 font-medium">Должность</th>
                  <th className="text-center px-4 py-2.5 font-medium">Въезд</th>
                  <th className="text-center px-4 py-2.5 font-medium">Выезд</th>
                  <th className="text-center px-4 py-2.5 font-medium">Статус</th>
                  <th className="text-right px-4 py-2.5 font-medium">Часов</th>
                  <th className="text-right px-4 py-2.5 font-medium">Отметка</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {attendanceToday.map(a => {
                  const s = STATUS_MAP[a.status];
                  const busy = marking === a.id;
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 text-gray-800 font-medium">{a.name}</td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs">{a.position}</td>
                      <td className="px-4 py-2.5 text-center text-gray-700 font-mono text-xs">{a.entry ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-2.5 text-center text-gray-500 font-mono text-xs">{a.exit ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${s.cls}`}>{s.label}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-700 font-semibold text-xs">
                        {a.hours > 0 ? `${a.hours} ч` : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {a.status === 'absent' && (
                            <button onClick={() => handleMark(a.id, 'entry')} disabled={busy}
                              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 transition-colors">
                              <LogIn size={11} />{busy ? '…' : 'Вход'}
                            </button>
                          )}
                          {a.status === 'on_shift' && (
                            <>
                              <button onClick={() => handleMark(a.id, 'exit')} disabled={busy}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-900 disabled:opacity-50 transition-colors">
                                <LogOut size={11} />{busy ? '…' : 'Выход'}
                              </button>
                              <button onClick={() => handleMark(a.id, 'remove')} disabled={busy}
                                className="text-xs px-1.5 py-1 rounded border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 disabled:opacity-50 transition-colors">
                                ×
                              </button>
                            </>
                          )}
                          {a.status === 'exit' && (
                            <button onClick={() => handleMark(a.id, 'remove')} disabled={busy}
                              className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 disabled:opacity-50 transition-colors">
                              {busy ? '…' : 'Сбросить'}
                            </button>
                          )}
                        </div>
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
