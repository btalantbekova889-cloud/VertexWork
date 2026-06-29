'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Download, Eye, Plus, Search } from 'lucide-react';

const DOCUMENTS = [
  { id: 'СЧТ-2847', type: 'Счет', client: 'ТОО "АлтайСтрой"', amount: 480000, date: '29.06.2026', status: 'paid', ext: 'PDF' },
  { id: 'АКТ-2847', type: 'Акт', client: 'ТОО "АлтайСтрой"', amount: 480000, date: '29.06.2026', status: 'signed', ext: 'PDF' },
  { id: 'НТ-12233', type: 'Накладная', client: 'ТОО "АлтайСтрой"', amount: 480000, date: '29.06.2026', status: 'issued', ext: 'PDF' },
  { id: 'СЧТ-2846', type: 'Счет', client: 'ИП Казаков В.С.', amount: 296000, date: '29.06.2026', status: 'pending', ext: 'PDF' },
  { id: 'АКТ-2844', type: 'Акт', client: 'АО "СтройКонсалт"', amount: 1050000, date: '28.06.2026', status: 'signed', ext: 'PDF' },
  { id: 'СЧТ-2844', type: 'Счет', client: 'АО "СтройКонсалт"', amount: 1050000, date: '28.06.2026', status: 'paid', ext: 'PDF' },
  { id: 'ДОГ-2026-047', type: 'Договор', client: 'ТОО "НурБетон"', amount: null, date: '25.06.2026', status: 'active', ext: 'DOCX' },
  { id: 'НО-2026-06', type: 'Налог. отчет', client: null, amount: null, date: '20.06.2026', status: 'submitted', ext: 'PDF' },
];

const TYPE_STYLE: Record<string, string> = {
  'Счет': 'text-blue-700 bg-blue-50 border-blue-200',
  'Акт': 'text-green-700 bg-green-50 border-green-200',
  'Накладная': 'text-cyan-700 bg-cyan-50 border-cyan-200',
  'Договор': 'text-purple-700 bg-purple-50 border-purple-200',
  'Налог. отчет': 'text-amber-700 bg-amber-50 border-amber-200',
};

const STATUS_LABEL: Record<string, { label: string; style: string }> = {
  paid:      { label: 'Оплачен',  style: 'text-green-700 bg-green-50 border-green-200' },
  signed:    { label: 'Подписан', style: 'text-green-700 bg-green-50 border-green-200' },
  issued:    { label: 'Выдан',    style: 'text-blue-700 bg-blue-50 border-blue-200' },
  pending:   { label: 'Ожидает',  style: 'text-amber-700 bg-amber-50 border-amber-200' },
  active:    { label: 'Активен',  style: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  submitted: { label: 'Сдан',     style: 'text-purple-700 bg-purple-50 border-purple-200' },
};

export default function DocumentsPage() {
  return (
    <AppLayout title="Документы" subtitle="Счета, акты, договоры и накладные">
      <div className="grid grid-cols-4 gap-4 mb-5">
        {['Счет', 'Акт', 'Договор', 'Накладная'].map((type, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-center hover:border-gray-300 transition-colors cursor-pointer">
            <div className={`text-2xl font-bold mb-1 ${['text-blue-600','text-green-600','text-purple-600','text-cyan-600'][i]}`}>
              {DOCUMENTS.filter(d => d.type === type).length}
            </div>
            <p className="text-gray-500 text-xs">{type}ов</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">Все документы</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск..."
                className="border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 w-40 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <button className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1">
              <Plus size={12} /> Создать
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Номер</th>
                <th className="text-left pb-2 font-medium">Тип</th>
                <th className="text-left pb-2 font-medium">Контрагент</th>
                <th className="text-right pb-2 font-medium">Сумма</th>
                <th className="text-left pb-2 font-medium">Дата</th>
                <th className="text-center pb-2 font-medium">Статус</th>
                <th className="text-center pb-2 font-medium">Формат</th>
                <th className="text-center pb-2 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DOCUMENTS.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-2.5 text-gray-400 font-mono text-xs">{d.id}</td>
                  <td className="py-2.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${TYPE_STYLE[d.type] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>{d.type}</span>
                  </td>
                  <td className="py-2.5 text-gray-800 font-medium">{d.client || '—'}</td>
                  <td className="py-2.5 text-right text-gray-800 font-medium">
                    {d.amount ? `${d.amount.toLocaleString('ru-RU')} сом` : '—'}
                  </td>
                  <td className="py-2.5 text-gray-400 text-xs">{d.date}</td>
                  <td className="py-2.5 text-center">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${STATUS_LABEL[d.status]?.style}`}>
                      {STATUS_LABEL[d.status]?.label}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="text-xs px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 font-mono bg-gray-50">{d.ext}</span>
                  </td>
                  <td className="py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye size={13} />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download size={13} />
                      </button>
                    </div>
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
