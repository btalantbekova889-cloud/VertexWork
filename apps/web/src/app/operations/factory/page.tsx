'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Factory, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

const LINES = [
  { name: 'ДСК Линия 1',      material: 'Щебень фр. 20-40', capacity: '180 т/ч', actual: '162 т/ч', status: 'running',     operator: 'Сатыбалдиев Э.' },
  { name: 'ДСК Линия 2',      material: 'Щебень фр. 5-20',  capacity: '150 т/ч', actual: '148 т/ч', status: 'running',     operator: 'Орозов К.' },
  { name: 'Грохот ГИТ-51',    material: 'Отсев',             capacity: '120 т/ч', actual: '0 т/ч',   status: 'maintenance', operator: 'Техобслуживание' },
  { name: 'Пескосортировщик', material: 'Песок строительный',capacity: '80 т/ч',  actual: '74 т/ч',  status: 'running',     operator: 'Бекбоев А.' },
];

const SHIFT = [
  { param: 'Начало смены',       value: '07:00' },
  { param: 'Конец смены',        value: '19:00' },
  { param: 'Мастер смены',       value: 'Темиров Алмас' },
  { param: 'Произведено за смену', value: '4 820 т' },
  { param: 'Простои',            value: '1 ч 20 мин (ГИТ-51)' },
  { param: 'OEE',                value: '81%' },
];

const STATUS_MAP: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  running:     { label: 'Работает',       cls: 'text-green-700 bg-green-50 border-green-200',  icon: <CheckCircle2 size={12} /> },
  maintenance: { label: 'Тех. обслуж.',  cls: 'text-orange-700 bg-orange-50 border-orange-200', icon: <AlertTriangle size={12} /> },
  stopped:     { label: 'Остановлено',   cls: 'text-red-600 bg-red-50 border-red-200',          icon: <AlertTriangle size={12} /> },
};

export default function FactoryPage() {
  return (
    <AppLayout title="Завод (ДСК)" subtitle="Дробильно-сортировочный комплекс">
      <div className="p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Завод (ДСК) — Дробильно-сортировочный комплекс</h1>
          <p className="text-sm text-gray-500 mt-0.5">Мощность: 40 000 т/мес · Смена 1 (07:00–19:00) · 1 июля 2026</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Произведено сегодня',  value: '4 820 т',  sub: 'план: 5 000 т' },
            { label: 'Линий в работе',        value: '3 / 4',    sub: '1 на обслуживании' },
            { label: 'OEE смены',             value: '81%',      sub: 'цель ≥ 75%' },
            { label: 'Произведено за месяц',  value: '38 540 т', sub: 'план: 40 000 т' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Lines */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Factory size={15} className="text-gray-500" />
              <h2 className="font-semibold text-gray-800 text-sm">Производственные линии</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Линия', 'Материал', 'Мощность', 'Факт', 'Оператор', 'Статус'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LINES.map(l => (
                  <tr key={l.name} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{l.name}</td>
                    <td className="px-4 py-3 text-gray-600">{l.material}</td>
                    <td className="px-4 py-3 text-gray-500">{l.capacity}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{l.actual}</td>
                    <td className="px-4 py-3 text-gray-600">{l.operator}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${STATUS_MAP[l.status].cls}`}>
                        {STATUS_MAP[l.status].icon}{STATUS_MAP[l.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shift info */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Activity size={15} className="text-gray-500" />
              <h2 className="font-semibold text-gray-800 text-sm">Параметры смены</h2>
            </div>
            <div className="p-4 space-y-3">
              {SHIFT.map(r => (
                <div key={r.param} className="flex justify-between items-start gap-2">
                  <span className="text-xs text-gray-500">{r.param}</span>
                  <span className="text-xs font-medium text-gray-900 text-right">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
