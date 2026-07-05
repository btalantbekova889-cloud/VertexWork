'use client';

import AppLayout from '@/components/layout/AppLayout';
import { ScrollText, Clock } from 'lucide-react';

const TENDERS = [
  { id: 'Т-2026-041', name: 'Поставка щебня фр. 20-40 для ГДТС КР', volume: '5 000 т', amount: '1 500 000 сом', deadline: '15.07.2026', status: 'active' },
  { id: 'Т-2026-038', name: 'Отсев для дорожных работ — Бишкек ГСК', volume: '3 200 т', amount: '640 000 сом',   deadline: '10.07.2026', status: 'active' },
  { id: 'Т-2026-032', name: 'Щебень фр. 5-20 для ОсОО СтройГрупп',  volume: '8 000 т', amount: '2 400 000 сом', deadline: '30.06.2026', status: 'won' },
  { id: 'Т-2026-029', name: 'Песок строительный — тендер Минтранса',  volume: '2 000 т', amount: '300 000 сом',   deadline: '20.06.2026', status: 'lost' },
  { id: 'Т-2026-025', name: 'Инертные материалы для ОФ Кумтор',       volume: '12 000 т', amount: '3 600 000 сом', deadline: '01.06.2026', status: 'won' },
];

const STATUS: Record<string, { label: string; cls: string }> = {
  active: { label: 'Участвуем',  cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  won:    { label: 'Выиграли',   cls: 'bg-green-50 text-green-700 border-green-200' },
  lost:   { label: 'Проиграли',  cls: 'bg-red-50 text-red-600 border-red-200' },
};

export default function TendersPage() {
  return (
    <AppLayout title="Тендеры" subtitle="Государственные закупки и коммерческие тендеры">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Тендеры и гостендеры</h1>
            <p className="text-sm text-gray-500 mt-0.5">Государственные закупки и коммерческие тендеры</p>
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Новый тендер
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Активных',    value: '2', sub: 'в процессе' },
            { label: 'Выиграно',    value: '2', sub: 'в этом году' },
            { label: 'Сумма побед', value: '6.1 млн', sub: 'сом' },
            { label: 'Конверсия',   value: '67%',  sub: 'win rate' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Номер', 'Наименование', 'Объём', 'Сумма', 'Срок подачи', 'Статус'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TENDERS.map((t, i) => (
                <tr key={t.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-4 py-3 font-mono text-xs text-blue-700 font-medium">{t.id}</td>
                  <td className="px-4 py-3 text-gray-800 max-w-xs">{t.name}</td>
                  <td className="px-4 py-3 text-gray-600">{t.volume}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{t.amount}</td>
                  <td className="px-4 py-3 text-gray-600 flex items-center gap-1.5">
                    <Clock size={12} className="text-gray-400" />{t.deadline}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${STATUS[t.status].cls}`}>
                      {STATUS[t.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
