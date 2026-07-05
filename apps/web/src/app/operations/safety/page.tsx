'use client';

import AppLayout from '@/components/layout/AppLayout';
import { HardHat, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';

const INCIDENTS = [
  { date: '25.06.2026', type: 'Микротравма', location: 'Карьер, блок А-12', desc: 'Порез руки оператора при обслуживании', severity: 'low',    status: 'closed' },
  { date: '18.06.2026', type: 'Опасное происшествие', location: 'ДСК Линия 1', desc: 'Посторонний предмет в дробилке',        severity: 'medium', status: 'closed' },
  { date: '10.06.2026', type: 'Нарушение СИЗ',        location: 'Склад ГСМ',   desc: 'Работа без каски и очков защиты',       severity: 'low',    status: 'closed' },
];

const BRIEFINGS = [
  { date: '01.07.2026', type: 'Целевой инструктаж',  persons: 12, topic: 'Работы на высоте — монтаж конвейера',     done: true },
  { date: '01.07.2026', type: 'Вводный инструктаж',  persons: 2,  topic: 'Новые сотрудники: водители самосвалов',   done: true },
  { date: '25.06.2026', type: 'Внеплановый',         persons: 28, topic: 'Разбор микротравмы 25.06',                done: true },
  { date: '15.07.2026', type: 'Плановый ежемесячный', persons: 46, topic: 'Правила работы в зоне взрывных работ',   done: false },
];

const SEV: Record<string, { cls: string; label: string }> = {
  low:    { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Низкая' },
  medium: { cls: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Средняя' },
  high:   { cls: 'bg-red-50 text-red-600 border-red-200',          label: 'Высокая' },
};

export default function SafetyPage() {
  return (
    <AppLayout title="ОТ и ПБ" subtitle="Охрана труда и промышленная безопасность">
      <div className="p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Охрана труда и промышленная безопасность</h1>
          <p className="text-sm text-gray-500 mt-0.5">ОТ и ПБ · Специалист: Кенжебаев С.А. · Июль 2026</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Дней без травматизма',   value: '36',   sub: 'с 26.05.2026', color: 'text-green-600' },
            { label: 'Инцидентов за год',       value: '3',    sub: 'LTIFR = 0',   color: 'text-gray-900' },
            { label: 'Инструктажей за месяц',   value: '3',    sub: '42 человека',  color: 'text-blue-600' },
            { label: 'Выдано СИЗ',              value: '46 ч.', sub: 'комплектов',   color: 'text-gray-900' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Incidents */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <AlertTriangle size={15} className="text-orange-500" />
              <h2 className="font-semibold text-gray-800 text-sm">Инциденты (YTD)</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {INCIDENTS.map(inc => (
                <div key={inc.date + inc.type} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{inc.date} · {inc.location}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${SEV[inc.severity].cls}`}>{SEV[inc.severity].label}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{inc.type}</p>
                  <p className="text-xs text-gray-500">{inc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Briefings */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <HardHat size={15} className="text-gray-500" />
              <h2 className="font-semibold text-gray-800 text-sm">Инструктажи</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {BRIEFINGS.map(b => (
                <div key={b.date + b.type} className="px-4 py-3 flex items-start gap-3">
                  <div className="mt-0.5">
                    {b.done
                      ? <CheckCircle2 size={16} className="text-green-500" />
                      : <Calendar size={16} className="text-blue-400" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{b.type}</p>
                    <p className="text-xs text-gray-500">{b.topic}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{b.date} · {b.persons} чел.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
