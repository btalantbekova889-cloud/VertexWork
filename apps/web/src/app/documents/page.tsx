'use client';

import AppLayout from '@/components/layout/AppLayout';
import { FileText, Download, Eye, Plus, Search } from 'lucide-react';

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
  'Счет': 'text-blue-400 bg-blue-400/10',
  'Акт': 'text-green-400 bg-green-400/10',
  'Накладная': 'text-cyan-400 bg-cyan-400/10',
  'Договор': 'text-purple-400 bg-purple-400/10',
  'Налог. отчет': 'text-yellow-400 bg-yellow-400/10',
};

const STATUS_LABEL: Record<string, { label: string; style: string }> = {
  paid: { label: 'Оплачен', style: 'text-green-400 bg-green-400/10' },
  signed: { label: 'Подписан', style: 'text-green-400 bg-green-400/10' },
  issued: { label: 'Выдан', style: 'text-cyan-400 bg-cyan-400/10' },
  pending: { label: 'Ожидает', style: 'text-yellow-400 bg-yellow-400/10' },
  active: { label: 'Активен', style: 'text-blue-400 bg-blue-400/10' },
  submitted: { label: 'Сдан', style: 'text-purple-400 bg-purple-400/10' },
};

export default function DocumentsPage() {
  return (
    <AppLayout title="Документы" subtitle="Счета, акты, договоры и накладные">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {['Счет', 'Акт', 'Договор', 'Накладная'].map((type, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center hover:border-slate-600 transition-colors cursor-pointer">
            <div className={`text-2xl font-bold mb-1 ${['text-blue-400','text-green-400','text-purple-400','text-cyan-400'][i]}`}>
              {DOCUMENTS.filter(d => d.type === type).length}
            </div>
            <p className="text-slate-400 text-xs">{type}ов</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Все документы</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Поиск..."
                className="bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-300 placeholder-slate-500 w-40 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
              <Plus size={12} /> Создать
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left py-2 pb-3 font-medium">Номер</th>
                <th className="text-left py-2 pb-3 font-medium">Тип</th>
                <th className="text-left py-2 pb-3 font-medium">Контрагент</th>
                <th className="text-right py-2 pb-3 font-medium">Сумма</th>
                <th className="text-left py-2 pb-3 font-medium">Дата</th>
                <th className="text-center py-2 pb-3 font-medium">Статус</th>
                <th className="text-center py-2 pb-3 font-medium">Формат</th>
                <th className="text-center py-2 pb-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {DOCUMENTS.map((d, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-3 text-slate-400 font-mono text-xs">{d.id}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_STYLE[d.type] || 'text-slate-400 bg-slate-400/10'}`}>{d.type}</span>
                  </td>
                  <td className="py-3 text-white">{d.client || '—'}</td>
                  <td className="py-3 text-right text-white font-medium">
                    {d.amount ? `${d.amount.toLocaleString('ru-RU')} ₸` : '—'}
                  </td>
                  <td className="py-3 text-slate-500 text-xs">{d.date}</td>
                  <td className="py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_LABEL[d.status]?.style}`}>
                      {STATUS_LABEL[d.status]?.label}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 font-mono">{d.ext}</span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                        <Eye size={13} />
                      </button>
                      <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
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
