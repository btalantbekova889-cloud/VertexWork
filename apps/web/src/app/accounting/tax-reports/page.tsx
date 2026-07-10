'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ChevronUp, ChevronDown, CheckCircle2, Clock, AlertCircle, Send, FileText, Download, Plus, X } from 'lucide-react';

type Status = 'accepted' | 'sent' | 'ready' | 'draft' | 'overdue';

interface TaxForm {
  id: string; code: string; name: string; period: string;
  deadline: string; status: Status; amount?: number; notes?: string;
}

const FORMS_DATA: TaxForm[] = [
  { id: 'f300-q2',  code: 'Ф-300.00', name: 'Декларация по НДС',                    period: 'II квартал 2026', deadline: '15.07.2026', status: 'ready',    amount: 820800,  notes: 'НДС к уплате по реализации' },
  { id: 'f200-jun', code: 'Ф-200.00', name: 'ИПН и ОПВ с зарплаты',                 period: 'Июнь 2026',       deadline: '15.07.2026', status: 'ready',    amount: 107000,  notes: 'Удержано из зарплаты сотрудников' },
  { id: 'f100-q2',  code: 'Ф-100.00', name: 'КПН (налог на прибыль)',               period: 'II квартал 2026', deadline: '30.07.2026', status: 'draft',    amount: 256000,  notes: 'Авансовый платёж за квартал' },
  { id: 'fsoc-jun', code: 'СН',       name: 'Социальный налог',                      period: 'Июнь 2026',       deadline: '20.07.2026', status: 'draft',    amount: 48600,   notes: '8% от ФОТ по ставке КР' },
  { id: 'fopv-jun', code: 'ОПВ',      name: 'Обязательные пенсионные взносы',        period: 'Июнь 2026',       deadline: '20.07.2026', status: 'draft',    amount: 107000,  notes: '10% от зарплаты каждого сотрудника' },
  { id: 'f300-q1',  code: 'Ф-300.00', name: 'Декларация по НДС',                    period: 'I квартал 2026',  deadline: '15.04.2026', status: 'accepted', amount: 612000,  notes: 'Принята ГНС 14.04.2026' },
  { id: 'f200-may', code: 'Ф-200.00', name: 'ИПН и ОПВ с зарплаты',                 period: 'Май 2026',        deadline: '15.06.2026', status: 'accepted', amount: 98000,   notes: 'Принята ГНС 13.06.2026' },
  { id: 'f200-apr', code: 'Ф-200.00', name: 'ИПН и ОПВ с зарплаты',                 period: 'Апрель 2026',     deadline: '15.05.2026', status: 'accepted', amount: 94500,   notes: 'Принята ГНС 14.05.2026' },
  { id: 'f100-q1',  code: 'Ф-100.00', name: 'КПН (авансовый платёж)',               period: 'I квартал 2026',  deadline: '30.04.2026', status: 'accepted', amount: 210000,  notes: 'Принята ГНС 28.04.2026' },
];

const STATUS_CONFIG: Record<Status, { label: string; bg: string; color: string; border: string; icon: React.ReactNode }> = {
  accepted: { label: 'Принята ГНС',  bg:'#f0f7e8', color:'#4a9c2c', border:'#c5e0a0', icon: <CheckCircle2 size={12}/> },
  sent:     { label: 'Отправлена',   bg:'#dde8f5', color:'#1b3a6b', border:'#bcd',    icon: <Send size={12}/> },
  ready:    { label: 'Готова',       bg:'#fff8e8', color:'#b07000', border:'#e0c080',  icon: <Clock size={12}/> },
  draft:    { label: 'Черновик',     bg:'#f5f5f5', color:'#666',    border:'#ddd',     icon: <FileText size={12}/> },
  overdue:  { label: 'Просрочена',   bg:'#fdf0f0', color:'#c03030', border:'#e0a0a0',  icon: <AlertCircle size={12}/> },
};

interface Section { id: string; title: string; forms: TaxForm[]; }

const N = (v: number) => v.toLocaleString('ru-RU');

interface FormModalProps { form: TaxForm; onClose: () => void; onSend: () => void; onAccept: () => void; }

function FormModal({ form, onClose, onSend, onAccept }: FormModalProps) {
  const [sending, setSending] = useState(false);
  const cfg = STATUS_CONFIG[form.status];

  const doSend = () => {
    setSending(true);
    setTimeout(() => { onSend(); setSending(false); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="border shadow-xl w-full max-w-lg" style={{ background: '#fff', borderColor: '#999' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ background: '#1b3a6b', borderColor: '#999' }}>
          <div className="flex items-center gap-2">
            <FileText size={14} style={{ color: '#f5821f' }} />
            <span className="text-sm font-semibold text-white">{form.code} — {form.name}</span>
          </div>
          <button onClick={onClose} style={{ color: '#8ba5cc' }}
            onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
            onMouseLeave={e=>(e.currentTarget.style.color='#8ba5cc')}>
            <X size={14}/>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Период', value: form.period },
              { label: 'Срок сдачи', value: form.deadline },
              { label: 'Налогоплательщик', value: 'ОсОО "Vertex Plus KG"' },
              { label: 'ИНН (БИН)', value: '220840037412' },
              { label: 'Сумма к уплате', value: form.amount ? `${N(form.amount)} сом` : '—' },
              { label: 'Статус', value: cfg.label },
            ].map(r => (
              <div key={r.label}>
                <div style={{ color: '#999' }}>{r.label}</div>
                <div className="font-semibold mt-0.5" style={{ color: '#333' }}>{r.value}</div>
              </div>
            ))}
          </div>

          {form.notes && (
            <div className="p-2.5 text-xs" style={{ background: '#f5f5f5', border: '1px solid #ddd', color: '#555' }}>
              <span className="font-semibold" style={{ color: '#1b3a6b' }}>Примечание: </span>{form.notes}
            </div>
          )}

          {/* Sections accordion-style */}
          <div className="border" style={{ borderColor: '#ddd' }}>
            <div className="px-3 py-1.5 text-xs font-bold" style={{ background: '#dde8f5', color: '#1b3a6b' }}>
              ▲ Налоговая отчётность
            </div>
            <div className="p-3" style={{ background: '#f9f9f9' }}>
              <ul className="text-xs space-y-1" style={{ color: '#444' }}>
                <li>• Налоговая декларация по НДС;</li>
                <li>• Налоговая декларация по налогу на прибыль;</li>
                <li>• Декларация по ИПН и ОПВ;</li>
                <li>• Социальный налог.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-4 py-3 border-t" style={{ borderColor: '#ddd', background: '#f5f5f5' }}>
          <button onClick={() => {}}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border"
            style={{ borderColor: '#ccc', color: '#555', background: '#fff' }}>
            <Download size={11}/> Скачать XML
          </button>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="text-xs px-3 py-1.5 border" style={{ borderColor: '#ccc', color: '#555' }}>
              Закрыть
            </button>
            {form.status === 'draft' && (
              <button onClick={onAccept}
                className="text-xs px-3 py-1.5 font-semibold"
                style={{ background: '#4a9c2c', color: '#fff' }}>
                Пометить готовой
              </button>
            )}
            {(form.status === 'ready' || form.status === 'draft') && (
              <button onClick={doSend} disabled={sending}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-semibold"
                style={{ background: '#f5821f', color: '#fff', opacity: sending ? 0.7 : 1 }}>
                <Send size={11}/>{sending ? 'Отправка...' : 'Отправить в ГНС'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaxReportsPage() {
  const [forms, setForms] = useState<TaxForm[]>(FORMS_DATA);
  const [openModal, setOpenModal] = useState<TaxForm | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pending: true,
    accepted: true,
  });

  const toggleSection = (id: string) =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSend = (formId: string) => {
    setForms(prev => prev.map(f => f.id === formId ? { ...f, status: 'sent' as Status } : f));
    setOpenModal(null);
  };

  const handleAccept = (formId: string) => {
    setForms(prev => prev.map(f => f.id === formId ? { ...f, status: 'ready' as Status } : f));
    setOpenModal(null);
  };

  const pending = forms.filter(f => f.status !== 'accepted');
  const accepted = forms.filter(f => f.status === 'accepted');

  const sections: Section[] = [
    { id: 'pending',  title: `Текущий период — Июнь / II квартал 2026 (${pending.length})`, forms: pending },
    { id: 'accepted', title: `Сданные отчёты (${accepted.length})`, forms: accepted },
  ];

  const totalDue = pending.reduce((s, f) => s + (f.amount ?? 0), 0);

  return (
    <AppLayout title="Налоговая отчётность" subtitle="Декларации и расчёты — Vertex Plus KG">

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'К сдаче', value: String(pending.filter(f=>f.status==='ready').length), color: '#b07000', bg: '#fff8e8', border: '#e0c080' },
          { label: 'Черновики', value: String(pending.filter(f=>f.status==='draft').length), color: '#666', bg: '#f5f5f5', border: '#ddd' },
          { label: 'Отправлено', value: String(pending.filter(f=>f.status==='sent').length), color: '#1b3a6b', bg: '#dde8f5', border: '#bcd' },
          { label: 'Всего к уплате', value: `${N(totalDue)} сом`, color: '#c03030', bg: '#fdf0f0', border: '#e0a0a0' },
        ].map((c,i) => (
          <div key={i} className="p-3 border text-center"
            style={{ background: c.bg, borderColor: c.border }}>
            <div className="text-lg font-bold" style={{ color: c.color }}>{c.value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#888' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {sections.map(section => (
        <div key={section.id} className="border mb-3 overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
          {/* Section header (accordion) */}
          <button
            className="w-full flex items-center justify-between px-3 py-2 border-b text-left"
            style={{ background: '#dde8f5', borderColor: '#bcd' }}
            onClick={() => toggleSection(section.id)}>
            <span className="text-xs font-bold" style={{ color: '#1b3a6b' }}>
              {openSections[section.id] ? '▲' : '▼'} {section.title}
            </span>
          </button>

          {openSections[section.id] && (
            <>
              {/* Sub-section: Налоговая отчётность */}
              <div className="border-b" style={{ borderColor: '#eee' }}>
                <div className="px-3 py-1.5 flex items-center gap-1" style={{ background: '#f5f5f5' }}>
                  <span className="text-xs font-semibold" style={{ color: '#555', textDecoration: 'underline dotted' }}>
                    Налоговая отчётность
                  </span>
                </div>
                <div className="px-4 py-2" style={{ background: '#fafafa' }}>
                  <ul className="space-y-1 text-xs" style={{ color: '#444' }}>
                    {section.forms.map(f => (
                      <li key={f.id} className="flex items-center gap-1.5">
                        <span style={{ color: STATUS_CONFIG[f.status].color }}>•</span>
                        {f.name} ({f.code}) — {f.period};
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#f0f0f0', color: '#666' }}>
                    {['Код формы','Наименование','Период','Срок','Сумма к уплате','Статус','Действие'].map((h,i)=>(
                      <th key={i} className={`px-3 py-2 border-b font-semibold ${i===4?'text-right':'text-left'}`}
                        style={{ borderColor: '#ddd' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.forms.map((f, i) => {
                    const cfg = STATUS_CONFIG[f.status];
                    return (
                      <tr key={f.id} style={{ background: i%2===0?'#fff':'#fafafa' }}
                        className="hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => setOpenModal(f)}>
                        <td className="px-3 py-2 border-b font-mono font-bold" style={{ borderColor:'#eee', color:'#1b3a6b' }}>{f.code}</td>
                        <td className="px-3 py-2 border-b font-medium" style={{ borderColor:'#eee', color:'#333' }}>{f.name}</td>
                        <td className="px-3 py-2 border-b" style={{ borderColor:'#eee', color:'#555' }}>{f.period}</td>
                        <td className="px-3 py-2 border-b" style={{ borderColor:'#eee', color:'#555' }}>{f.deadline}</td>
                        <td className="px-3 py-2 border-b text-right font-bold" style={{ borderColor:'#eee', color:'#333' }}>
                          {f.amount ? `${N(f.amount)} сом` : '—'}
                        </td>
                        <td className="px-3 py-2 border-b" style={{ borderColor:'#eee' }}>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                            {cfg.icon}{cfg.label}
                          </span>
                        </td>
                        <td className="px-3 py-2 border-b" style={{ borderColor:'#eee' }}
                          onClick={e => { e.stopPropagation(); setOpenModal(f); }}>
                          <div className="flex gap-1">
                            {f.status === 'draft' && (
                              <button className="text-xs px-2 py-0.5 border transition-colors"
                                style={{ background:'#f5f5f5', borderColor:'#ccc', color:'#555' }}>
                                Заполнить
                              </button>
                            )}
                            {f.status === 'ready' && (
                              <button className="text-xs px-2 py-0.5 border transition-colors"
                                style={{ background:'#f5821f', borderColor:'#f5821f', color:'#fff' }}
                                onClick={e=>{e.stopPropagation();
                                  setForms(prev=>prev.map(x=>x.id===f.id?{...x,status:'sent' as Status}:x));
                                }}>
                                Отправить
                              </button>
                            )}
                            {f.status === 'sent' && (
                              <button className="text-xs px-2 py-0.5 border"
                                style={{ background:'#dde8f5', borderColor:'#bcd', color:'#1b3a6b' }}>
                                Отслеживать
                              </button>
                            )}
                            {f.status === 'accepted' && (
                              <button className="text-xs px-2 py-0.5 border"
                                style={{ background:'#f5f5f5', borderColor:'#ddd', color:'#888' }}>
                                Просмотр
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      ))}

      {/* Info block */}
      <div className="border p-3" style={{ background: '#fff', borderColor: '#ccc' }}>
        <div className="text-xs font-bold mb-2" style={{ color: '#1b3a6b' }}>Сроки сдачи отчётности — Кыргызская Республика</div>
        <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: '#555' }}>
          {[
            ['Ф-200.00 (ИПН, ОПВ)',    'до 15-го числа следующего месяца'],
            ['Социальный налог (СН)',   'до 20-го числа следующего месяца'],
            ['Ф-300.00 (НДС)',          'до 15-го числа месяца после квартала'],
            ['Ф-100.00 (КПН)',          'авансы — до 20-го, годовой — до 1 апреля'],
            ['ОПВ (пенсионные взносы)', 'до 20-го числа следующего месяца'],
            ['Бухгалтерский баланс',   'полугодовой до 31 июля, годовой до 31 марта'],
          ].map(([form, deadline]) => (
            <div key={form} className="flex gap-2">
              <span className="font-medium w-48 flex-shrink-0" style={{ color: '#1b3a6b' }}>{form}:</span>
              <span>{deadline}</span>
            </div>
          ))}
        </div>
      </div>

      {openModal && (
        <FormModal
          form={openModal}
          onClose={() => setOpenModal(null)}
          onSend={() => handleSend(openModal.id)}
          onAccept={() => handleAccept(openModal.id)}
        />
      )}
    </AppLayout>
  );
}
