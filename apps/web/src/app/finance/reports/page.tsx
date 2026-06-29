'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { CheckCircle2, Clock, AlertCircle, Plus, Upload, Paperclip } from 'lucide-react';

const REPORTS = [
  { id: 'Ф-100.00', name: 'Форма 100.00 — КПН',                 period: 'Q2 2026',    status: 'ready',   deadline: '30.07.2026', type: 'tax'       },
  { id: 'Ф-200.00', name: 'Форма 200.00 — ИПН и ОПВ',           period: 'Июнь 2026',  status: 'ready',   deadline: '15.07.2026', type: 'tax'       },
  { id: 'Ф-300.00', name: 'Форма 300.00 — НДС',                  period: 'Q2 2026',    status: 'pending', deadline: '15.07.2026', type: 'tax'       },
  { id: 'ББ-2026',  name: 'Бухгалтерский баланс',                 period: 'H1 2026',    status: 'draft',   deadline: '31.07.2026', type: 'financial' },
  { id: 'ОПУ-2026', name: 'Отчёт о прибылях и убытках',          period: 'H1 2026',    status: 'draft',   deadline: '31.07.2026', type: 'financial' },
  { id: 'ДДС-06',   name: 'Отчёт о движении ДС',                 period: 'Июнь 2026',  status: 'ready',   deadline: '10.07.2026', type: 'financial' },
  { id: 'АС-047',   name: 'Акт сверки — АО "СтройКонсалт"',     period: 'Июнь 2026',  status: 'ready',   deadline: '05.07.2026', type: 'act'       },
];

const STATUS: Record<string, { icon: React.ReactNode; label: string; badge: string }> = {
  ready:   { icon: <CheckCircle2 size={13} className="text-green-500" />, label: 'Готов',    badge: 'text-green-700 bg-green-50 border-green-200'  },
  pending: { icon: <Clock size={13} className="text-amber-500" />,        label: 'В работе', badge: 'text-amber-700 bg-amber-50 border-amber-200'  },
  draft:   { icon: <AlertCircle size={13} className="text-gray-400" />,   label: 'Черновик', badge: 'text-gray-600 bg-gray-50 border-gray-200'    },
};

const TYPE_BADGE: Record<string, string> = {
  tax:       'text-purple-700 bg-purple-50 border-purple-200',
  financial: 'text-blue-700 bg-blue-50 border-blue-200',
  act:       'text-cyan-700 bg-cyan-50 border-cyan-200',
};
const TYPE_LABEL: Record<string, string> = { tax: 'Налоговый', financial: 'Финансовый', act: 'Акт' };

export default function ReportsPage() {
  const [uploads, setUploads] = useState<Record<string, string>>({});

  const handleUpload = (reportId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.xlsx,.xls,.docx,.doc';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setUploads(prev => ({ ...prev, [reportId]: file.name }));
    };
    input.click();
  };

  return (
    <AppLayout title="Отчёты" subtitle="Финансовая и налоговая отчётность">
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Готовых',   value: REPORTS.filter(r => r.status === 'ready').length,   color: 'text-green-600' },
          { label: 'В работе',  value: REPORTS.filter(r => r.status === 'pending').length,  color: 'text-amber-600' },
          { label: 'Черновики', value: REPORTS.filter(r => r.status === 'draft').length,    color: 'text-gray-500'  },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-gray-700 font-semibold text-sm">Документы и отчёты</h3>
          <button className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <Plus size={12} /> Создать отчёт
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-4 py-2.5 font-medium">Код</th>
                <th className="text-left px-4 py-2.5 font-medium">Название</th>
                <th className="text-left px-4 py-2.5 font-medium">Период</th>
                <th className="text-left px-4 py-2.5 font-medium">Тип</th>
                <th className="text-left px-4 py-2.5 font-medium">Срок</th>
                <th className="text-center px-4 py-2.5 font-medium">Статус</th>
                <th className="text-center px-4 py-2.5 font-medium">Файл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {REPORTS.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 group transition-colors">
                  <td className="px-4 py-2.5 text-gray-400 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-2.5 text-gray-800 font-medium">{r.name}</td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{r.period}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${TYPE_BADGE[r.type]}`}>
                      {TYPE_LABEL[r.type]}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{r.deadline}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded border ${STATUS[r.status].badge}`}>
                      {STATUS[r.status].icon}{STATUS[r.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {uploads[r.id] ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <Paperclip size={11} />
                        <span className="max-w-[120px] truncate" title={uploads[r.id]}>{uploads[r.id]}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpload(r.id)}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Upload size={11} /> Загрузить
                      </button>
                    )}
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
