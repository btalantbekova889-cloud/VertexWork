'use client';

import AppLayout from '@/components/layout/AppLayout';
import { FileText, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const REPORTS = [
  { name: 'Форма 100.00 — КПН', period: 'Q2 2026', status: 'ready', deadline: '30.07.2026', type: 'tax' },
  { name: 'Форма 200.00 — ИПН и ОПВ', period: 'Июнь 2026', status: 'ready', deadline: '15.07.2026', type: 'tax' },
  { name: 'Форма 300.00 — НДС', period: 'Q2 2026', status: 'pending', deadline: '15.07.2026', type: 'tax' },
  { name: 'Бухгалтерский баланс', period: 'H1 2026', status: 'draft', deadline: '31.07.2026', type: 'financial' },
  { name: 'Отчет о прибылях и убытках', period: 'H1 2026', status: 'draft', deadline: '31.07.2026', type: 'financial' },
  { name: 'Отчет о движении ДС', period: 'Июнь 2026', status: 'ready', deadline: '10.07.2026', type: 'financial' },
  { name: 'Акт сверки — АО "СтройКонсалт"', period: 'Июнь 2026', status: 'ready', deadline: '05.07.2026', type: 'act' },
];

const STATUS_ICON: Record<string, React.ReactNode> = {
  ready: <CheckCircle2 size={14} className="text-green-400" />,
  pending: <Clock size={14} className="text-yellow-400" />,
  draft: <AlertCircle size={14} className="text-slate-400" />,
};

const STATUS_LABEL: Record<string, string> = {
  ready: 'Готов', pending: 'В работе', draft: 'Черновик',
};

const STATUS_STYLE: Record<string, string> = {
  ready: 'text-green-400 bg-green-400/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  draft: 'text-slate-400 bg-slate-400/10',
};

const TYPE_LABEL: Record<string, string> = {
  tax: 'Налоговый', financial: 'Финансовый', act: 'Акт',
};

export default function ReportsPage() {
  return (
    <AppLayout title="Отчеты" subtitle="Финансовая и налоговая отчетность">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Готовых отчетов', value: REPORTS.filter(r => r.status === 'ready').length, color: 'text-green-400' },
          { label: 'В работе', value: REPORTS.filter(r => r.status === 'pending').length, color: 'text-yellow-400' },
          { label: 'Черновики', value: REPORTS.filter(r => r.status === 'draft').length, color: 'text-slate-400' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-400 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Документы и отчеты</h3>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
            <FileText size={12} /> Создать отчет
          </button>
        </div>

        <div className="space-y-2">
          {REPORTS.map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{r.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-slate-500 text-xs">{r.period}</span>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-slate-500 text-xs">Срок: {r.deadline}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${r.type === 'tax' ? 'text-purple-400 bg-purple-400/10' : r.type === 'financial' ? 'text-blue-400 bg-blue-400/10' : 'text-cyan-400 bg-cyan-400/10'}`}>
                    {TYPE_LABEL[r.type]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {STATUS_ICON[r.status]}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                </div>
                {r.status === 'ready' && (
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
                    <Download size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
