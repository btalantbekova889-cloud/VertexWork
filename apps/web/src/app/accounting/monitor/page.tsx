'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { apiFetch } from '@/lib/api';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Client { id: number; name: string; debt: number; }
interface HistRec { employeeId: number; month: number; accrued: number; advance: number; }

const OSV = [
  { account: '1010', name: 'Касса',                     obDt: 1850000,  obCt: 0,        turnDt: 2480000,  turnCt: 3090000,  endDt: 1240000,  endCt: 0 },
  { account: '1030', name: 'Расчётные счета в банках',  obDt: 19200000, obCt: 0,        turnDt: 6840000,  turnCt: 2590000,  endDt: 23450000, endCt: 0 },
  { account: '1210', name: 'Дебиторская задолженность', obDt: 3180000,  obCt: 0,        turnDt: 6840000,  turnCt: 5894000,  endDt: 4126000,  endCt: 0 },
  { account: '1310', name: 'Сырьё и материалы',         obDt: 840000,   obCt: 0,        turnDt: 1200000,  turnCt: 960000,   endDt: 1080000,  endCt: 0 },
  { account: '2410', name: 'Основные средства',         obDt: 85400000, obCt: 0,        turnDt: 0,        turnCt: 0,        endDt: 85400000, endCt: 0 },
  { account: '2420', name: 'Износ ОС',                  obDt: 0,        obCt: 12600000, turnDt: 0,        turnCt: 1400000,  endDt: 0,        endCt: 14000000 },
  { account: '3010', name: 'Кредиторская задолженность',obDt: 0,        obCt: 2840000,  turnDt: 2840000,  turnCt: 3320000,  endDt: 0,        endCt: 3320000 },
  { account: '3350', name: 'Задолженность по зарплате', obDt: 0,        obCt: 0,        turnDt: 875000,   turnCt: 1070000,  endDt: 0,        endCt: 195000 },
  { account: '5110', name: 'Уставный капитал',          obDt: 0,        obCt: 50000000, turnDt: 0,        turnCt: 0,        endDt: 0,        endCt: 50000000 },
  { account: '6010', name: 'Доход от реализации',       obDt: 0,        obCt: 0,        turnDt: 0,        turnCt: 6840000,  endDt: 0,        endCt: 6840000 },
  { account: '7010', name: 'Себестоимость реализации',  obDt: 0,        obCt: 0,        turnDt: 3960000,  turnCt: 0,        endDt: 3960000,  endCt: 0 },
  { account: '7210', name: 'Административные расходы',  obDt: 0,        obCt: 0,        turnDt: 620000,   turnCt: 0,        endDt: 620000,   endCt: 0 },
];

const TAX_CALENDAR = [
  { name: 'Форма 200.00 (ИПН, ОПВ)', deadline: '15.07.2026', status: 'danger', note: 'Срок в 5 дней' },
  { name: 'Форма 300.00 (НДС)',       deadline: '15.07.2026', status: 'danger', note: 'Срок в 5 дней' },
  { name: 'Форма 100.00 (КПН)',       deadline: '30.07.2026', status: 'warn',   note: 'Квартальная' },
  { name: 'Бухгалтерский баланс',     deadline: '31.07.2026', status: 'ok',     note: 'Полугодовой' },
  { name: 'Отчёт о прибылях (ОПУ)',   deadline: '31.07.2026', status: 'ok',     note: 'Полугодовой' },
];

const N = (v: number) => v.toLocaleString('ru-RU');

export default function MonitorPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [hist, setHist] = useState<HistRec[]>([]);
  const [period, setPeriod] = useState<'month'|'quarter'|'year'>('month');

  useEffect(() => {
    apiFetch<{ clients: Client[] }>('/api/clients').then(d => setClients(d.clients)).catch(() => {});
    apiFetch<{ history: HistRec[] }>('/api/salaries/history?year=2026').then(d => setHist(d.history)).catch(() => {});
  }, []);

  const totalDebt = clients.reduce((s, c) => s + (c.debt || 0), 0);
  const salJun = hist.filter(h => h.month === 6).reduce((s, h) => s + h.accrued, 0);

  const revenue = 6840000;
  const cogs = 3960000;
  const admin = 620000;
  const profit = revenue - cogs - admin;
  const vat = Math.round(revenue * 0.12);

  return (
    <AppLayout title="Руководителю" subtitle="Монитор основных показателей — Июнь 2026">

      {/* Period filter */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold" style={{ color: '#1b3a6b' }}>Монитор основных показателей</h2>
        <div className="flex gap-1">
          {(['month','quarter','year'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="text-xs px-3 py-1 border transition-colors"
              style={{
                background: period === p ? '#1b3a6b' : '#fff',
                color: period === p ? '#fff' : '#333',
                borderColor: period === p ? '#1b3a6b' : '#ccc',
              }}>
              {p === 'month' ? 'Месяц' : p === 'quarter' ? 'Квартал' : 'Год'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Выручка (июнь)',    value: N(revenue),  unit: 'сом', trend: '+14%', up: true  },
          { label: 'Расходы (июнь)',    value: N(cogs + admin), unit: 'сом', trend: '+8%',  up: false },
          { label: 'Прибыль (июнь)',    value: N(profit),   unit: 'сом', trend: '+22%', up: true  },
          { label: 'НДС к уплате (Q2)', value: N(vat),      unit: 'сом', trend: '',     up: true  },
        ].map((k, i) => (
          <div key={i} className="p-3 border" style={{ background: '#fff', borderColor: '#ccc' }}>
            <div className="text-xs mb-1" style={{ color: '#888' }}>{k.label}</div>
            <div className="text-base font-bold" style={{ color: '#1b3a6b' }}>{k.value}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs" style={{ color: '#aaa' }}>{k.unit}</span>
              {k.trend && (
                <span className="flex items-center gap-0.5 text-xs" style={{ color: k.up ? '#4a9c2c' : '#c03030' }}>
                  {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{k.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* OSV table */}
        <div className="lg:col-span-2 border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
          <div className="px-3 py-1.5 border-b font-semibold text-xs flex items-center gap-2"
            style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
            Оборотно-сальдовая ведомость — Июнь 2026
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#f0f0f0', color: '#555' }}>
                  <th className="text-left px-2 py-1.5 border-b" style={{ borderColor: '#ddd', width: 50 }}>Счёт</th>
                  <th className="text-left px-2 py-1.5 border-b" style={{ borderColor: '#ddd' }}>Наименование</th>
                  <th className="text-right px-2 py-1.5 border-b" style={{ borderColor: '#ddd', width: 90 }}>Нач. Дт</th>
                  <th className="text-right px-2 py-1.5 border-b" style={{ borderColor: '#ddd', width: 90 }}>Нач. Кт</th>
                  <th className="text-right px-2 py-1.5 border-b" style={{ borderColor: '#ddd', width: 90 }}>Об. Дт</th>
                  <th className="text-right px-2 py-1.5 border-b" style={{ borderColor: '#ddd', width: 90 }}>Об. Кт</th>
                  <th className="text-right px-2 py-1.5 border-b" style={{ borderColor: '#ddd', width: 90 }}>Кон. Дт</th>
                  <th className="text-right px-2 py-1.5 border-b" style={{ borderColor: '#ddd', width: 90 }}>Кон. Кт</th>
                </tr>
              </thead>
              <tbody>
                {OSV.map((row, i) => (
                  <tr key={row.account}
                    style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}
                    className="hover:bg-blue-50 transition-colors cursor-pointer">
                    <td className="px-2 py-1 border-b font-mono font-bold" style={{ borderColor: '#eee', color: '#1b3a6b' }}>{row.account}</td>
                    <td className="px-2 py-1 border-b" style={{ borderColor: '#eee', color: '#333' }}>{row.name}</td>
                    <td className="px-2 py-1 border-b text-right" style={{ borderColor: '#eee', color: '#555' }}>{row.obDt ? N(row.obDt) : ''}</td>
                    <td className="px-2 py-1 border-b text-right" style={{ borderColor: '#eee', color: '#555' }}>{row.obCt ? N(row.obCt) : ''}</td>
                    <td className="px-2 py-1 border-b text-right font-medium" style={{ borderColor: '#eee', color: '#333' }}>{row.turnDt ? N(row.turnDt) : ''}</td>
                    <td className="px-2 py-1 border-b text-right font-medium" style={{ borderColor: '#eee', color: '#333' }}>{row.turnCt ? N(row.turnCt) : ''}</td>
                    <td className="px-2 py-1 border-b text-right font-bold" style={{ borderColor: '#eee', color: '#1b3a6b' }}>{row.endDt ? N(row.endDt) : ''}</td>
                    <td className="px-2 py-1 border-b text-right font-bold" style={{ borderColor: '#eee', color: '#c03030' }}>{row.endCt ? N(row.endCt) : ''}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#dde8f5', fontWeight: 700 }}>
                  <td colSpan={2} className="px-2 py-1.5 text-xs" style={{ color: '#1b3a6b' }}>ИТОГО</td>
                  <td className="px-2 py-1.5 text-right text-xs" style={{ color: '#1b3a6b' }}>{N(OSV.reduce((s,r)=>s+r.obDt,0))}</td>
                  <td className="px-2 py-1.5 text-right text-xs" style={{ color: '#c03030' }}>{N(OSV.reduce((s,r)=>s+r.obCt,0))}</td>
                  <td className="px-2 py-1.5 text-right text-xs" style={{ color: '#1b3a6b' }}>{N(OSV.reduce((s,r)=>s+r.turnDt,0))}</td>
                  <td className="px-2 py-1.5 text-right text-xs" style={{ color: '#c03030' }}>{N(OSV.reduce((s,r)=>s+r.turnCt,0))}</td>
                  <td className="px-2 py-1.5 text-right text-xs" style={{ color: '#1b3a6b' }}>{N(OSV.reduce((s,r)=>s+r.endDt,0))}</td>
                  <td className="px-2 py-1.5 text-right text-xs" style={{ color: '#c03030' }}>{N(OSV.reduce((s,r)=>s+r.endCt,0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-3">

          {/* Tax calendar */}
          <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
            <div className="px-3 py-1.5 border-b font-semibold text-xs" style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
              Налоговый календарь — Июль 2026
            </div>
            <div className="divide-y" style={{ borderColor: '#eee' }}>
              {TAX_CALENDAR.map((t, i) => (
                <div key={i} className="px-3 py-2 flex items-start gap-2">
                  {t.status === 'danger'
                    ? <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#c03030' }} />
                    : t.status === 'warn'
                    ? <Clock size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#b07000' }} />
                    : <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#4a9c2c' }} />
                  }
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#333' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: '#888', fontSize: 10 }}>
                      до {t.deadline} · {t.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer debt */}
          <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
            <div className="px-3 py-1.5 border-b font-semibold text-xs" style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
              Дебиторская задолженность
            </div>
            <div className="p-3 space-y-1.5">
              {clients.filter(c => c.debt > 0).map(c => (
                <div key={c.id} className="flex justify-between items-center text-xs">
                  <span className="truncate" style={{ color: '#444', maxWidth: 120 }}>{c.name}</span>
                  <span className="font-bold ml-2" style={{ color: '#c03030' }}>{N(c.debt)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-1.5 border-t text-xs font-bold" style={{ borderColor: '#eee' }}>
                <span style={{ color: '#333' }}>ИТОГО</span>
                <span style={{ color: '#c03030' }}>{N(totalDebt)}</span>
              </div>
            </div>
          </div>

          {/* Salary summary */}
          <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
            <div className="px-3 py-1.5 border-b font-semibold text-xs" style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
              Расходы на зарплату
            </div>
            <div className="p-3 space-y-1">
              {[
                { label: 'Март 2026', value: hist.filter(h=>h.month===3).reduce((s,h)=>s+h.accrued,0) },
                { label: 'Апрель 2026', value: hist.filter(h=>h.month===4).reduce((s,h)=>s+h.accrued,0) },
                { label: 'Май 2026', value: hist.filter(h=>h.month===5).reduce((s,h)=>s+h.accrued,0) },
                { label: 'Июнь 2026', value: salJun },
              ].map((r, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span style={{ color: '#555' }}>{r.label}</span>
                  <span className="font-semibold" style={{ color: '#1b3a6b' }}>{r.value ? N(r.value) : '—'}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
