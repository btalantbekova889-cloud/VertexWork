'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Plus, X, CheckCircle2, Clock, AlertCircle, ChevronDown } from 'lucide-react';

interface Entry {
  id: number; num: string; date: string;
  debit: string; credit: string; amount: number; content: string;
  doc: string;
}

const INIT: Entry[] = [
  { id: 1,  num: 'ОП-001', date: '01.06.2026', debit: '7010', credit: '1310', amount: 840000,  content: 'Списание ТМЦ в производство (май)', doc: 'Акт списания №15' },
  { id: 2,  num: 'ОП-002', date: '03.06.2026', debit: '1210', credit: '6010', amount: 1050000, content: 'Реализация — АО СтройКонсалт, щебень 40-70', doc: 'Накладная №77' },
  { id: 3,  num: 'ОП-003', date: '05.06.2026', debit: '1030', credit: '1210', amount: 1050000, content: 'Оплата от АО СтройКонсалт', doc: 'ПП №12843' },
  { id: 4,  num: 'ОП-004', date: '08.06.2026', debit: '7010', credit: '3350', amount: 875000,  content: 'Начисление зарплаты за май 2026', doc: 'Расчётная ведомость №5' },
  { id: 5,  num: 'ОП-005', date: '08.06.2026', debit: '3350', credit: '1010', amount: 875000,  content: 'Выплата зарплаты за май 2026 (касса)', doc: 'РКО №48' },
  { id: 6,  num: 'ОП-006', date: '10.06.2026', debit: '3010', credit: '1030', amount: 340000,  content: 'Оплата — ТОО МеханоСервис, ремонт экскаватора', doc: 'ПП №12844' },
  { id: 7,  num: 'ОП-007', date: '12.06.2026', debit: '1310', credit: '3010', amount: 420000,  content: 'Поступление ДТ от АЗС Гелиос, 5000 л', doc: 'ТОРГ-12 №42' },
  { id: 8,  num: 'ОП-008', date: '15.06.2026', debit: '1210', credit: '6010', amount: 480000,  content: 'Реализация — ТОО АлтайСтрой, щебень 20-40', doc: 'Накладная №78' },
  { id: 9,  num: 'ОП-009', date: '18.06.2026', debit: '1010', credit: '1210', amount: 148000,  content: 'Предоплата от ИП Казаков В.С.', doc: 'ПКО №31' },
  { id: 10, num: 'ОП-010', date: '25.06.2026', debit: '7210', credit: '1030', amount: 125000,  content: 'Топливо для спецтехники (АЗС Гелиос)', doc: 'ПП №12846' },
  { id: 11, num: 'ОП-011', date: '28.06.2026', debit: '1030', credit: '1210', amount: 480000,  content: 'Оплата от ТОО АлтайСтрой', doc: 'ПП №12847' },
  { id: 12, num: 'ОП-012', date: '30.06.2026', debit: '2420', credit: '7010', amount: 1400000, content: 'Амортизация ОС за июнь 2026', doc: 'Справка-расчёт №6' },
];

const CLOSE_STEPS = [
  { id: 1, name: 'Начисление амортизации ОС',          done: true  },
  { id: 2, name: 'Списание расходов будущих периодов', done: true  },
  { id: 3, name: 'Переоценка валютных остатков',        done: true  },
  { id: 4, name: 'Закрытие счёта 7010 (себестоимость)', done: false },
  { id: 5, name: 'Расчёт налога на прибыль (КПН)',      done: false },
  { id: 6, name: 'Формирование регл. отчётности',       done: false },
];

const EMPTY = { debit: '', credit: '', amount: '', content: '', doc: '' };
const N = (v: number) => v.toLocaleString('ru-RU');

export default function OperationsPage() {
  const [entries, setEntries] = useState<Entry[]>(INIT);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [tab, setTab] = useState<'manual'|'close'>('manual');
  const [steps, setSteps] = useState(CLOSE_STEPS);
  const [running, setRunning] = useState<number|null>(null);

  const handleCreate = () => {
    if (!form.debit || !form.credit || !form.amount || !form.content) return;
    const newEntry: Entry = {
      id: Date.now(), num: `ОП-${String(entries.length + 1).padStart(3,'0')}`,
      date: new Date().toLocaleDateString('ru-RU'),
      debit: form.debit, credit: form.credit,
      amount: Number(form.amount), content: form.content,
      doc: form.doc || 'Вручную',
    };
    setEntries(prev => [newEntry, ...prev]);
    setForm(EMPTY);
    setShowModal(false);
  };

  const runStep = (id: number) => {
    setRunning(id);
    setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === id ? { ...s, done: true } : s));
      setRunning(null);
    }, 1200);
  };

  return (
    <AppLayout title="Операции" subtitle="Ручные проводки и закрытие периода">

      {/* Tabs */}
      <div className="flex gap-0 mb-3 border-b" style={{ borderColor: '#ccc' }}>
        {[
          { key: 'manual', label: 'Операции, введённые вручную' },
          { key: 'close',  label: 'Закрытие месяца' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as 'manual'|'close')}
            className="px-4 py-2 text-xs font-medium border-b-2 transition-colors -mb-px"
            style={{
              borderBottomColor: tab === t.key ? '#f5821f' : 'transparent',
              color: tab === t.key ? '#1b3a6b' : '#666',
              background: tab === t.key ? '#fff' : 'transparent',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'manual' && (
        <>
          <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
            <div className="px-3 py-2 border-b flex items-center justify-between"
              style={{ background: '#dde8f5', borderColor: '#bcd' }}>
              <span className="text-xs font-bold" style={{ color: '#1b3a6b' }}>
                Журнал операций — Июнь 2026 ({entries.length})
              </span>
              <button onClick={() => setShowModal(true)}
                className="flex items-center gap-1 text-xs px-2.5 py-1"
                style={{ background: '#f5821f', color: '#fff' }}>
                <Plus size={11} /> Создать операцию
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#f5f5f5', color: '#666' }}>
                    {['Номер','Дата','Документ','Дт','Кт','Сумма','Содержание'].map((h,i) => (
                      <th key={i} className={`px-3 py-1.5 border-b font-semibold ${i===5?'text-right':'text-left'}`}
                        style={{ borderColor: '#ddd' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={e.id} style={{ background: i%2===0?'#fff':'#fafafa' }}
                      className="hover:bg-blue-50 transition-colors">
                      <td className="px-3 py-1.5 border-b font-mono font-bold" style={{ borderColor:'#eee', color:'#1b3a6b' }}>{e.num}</td>
                      <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee', color:'#555' }}>{e.date}</td>
                      <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee', color:'#888', fontSize:10 }}>{e.doc}</td>
                      <td className="px-3 py-1.5 border-b font-bold" style={{ borderColor:'#eee', color:'#1b3a6b' }}>{e.debit}</td>
                      <td className="px-3 py-1.5 border-b font-bold" style={{ borderColor:'#eee', color:'#c03030' }}>{e.credit}</td>
                      <td className="px-3 py-1.5 border-b text-right font-bold" style={{ borderColor:'#eee', color:'#333' }}>{N(e.amount)}</td>
                      <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee', color:'#444' }}>{e.content}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#dde8f5', fontWeight: 700 }}>
                    <td colSpan={5} className="px-3 py-1.5 text-xs" style={{ color: '#1b3a6b' }}>ИТОГО оборот</td>
                    <td className="px-3 py-1.5 text-right text-xs" style={{ color: '#1b3a6b' }}>
                      {N(entries.reduce((s,e)=>s+e.amount,0))}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'close' && (
        <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
          <div className="px-3 py-2 border-b" style={{ background: '#dde8f5', borderColor: '#bcd' }}>
            <span className="text-xs font-bold" style={{ color: '#1b3a6b' }}>Закрытие месяца — Июнь 2026</span>
            <span className="text-xs ml-2" style={{ color: '#888' }}>
              Выполнено: {steps.filter(s=>s.done).length} из {steps.length}
            </span>
          </div>
          <div className="p-4 space-y-2">
            {steps.map(step => (
              <div key={step.id}
                className="flex items-center gap-3 p-3 border rounded"
                style={{ borderColor: step.done ? '#c5e0a0' : '#ddd', background: step.done ? '#f0f7e8' : '#fff' }}>
                <div className="flex-shrink-0">
                  {step.done
                    ? <CheckCircle2 size={16} style={{ color: '#4a9c2c' }} />
                    : running === step.id
                    ? <Clock size={16} style={{ color: '#b07000' }} className="animate-spin" />
                    : <AlertCircle size={16} style={{ color: '#ccc' }} />
                  }
                </div>
                <div className="flex-1">
                  <span className="text-sm" style={{ color: step.done ? '#4a9c2c' : '#333', fontWeight: step.done ? 600 : 400 }}>
                    {step.id}. {step.name}
                  </span>
                </div>
                {!step.done && (
                  <button onClick={() => runStep(step.id)}
                    disabled={running !== null}
                    className="text-xs px-3 py-1 border transition-colors"
                    style={{
                      background: running === step.id ? '#f0f0f0' : '#1b3a6b',
                      color: running === step.id ? '#999' : '#fff',
                      borderColor: '#1b3a6b',
                      opacity: running !== null && running !== step.id ? 0.4 : 1,
                    }}>
                    {running === step.id ? 'Выполняется...' : 'Выполнить'}
                  </button>
                )}
              </div>
            ))}
            {steps.every(s => s.done) && (
              <div className="mt-3 p-3 text-center border" style={{ background: '#f0f7e8', borderColor: '#c5e0a0' }}>
                <CheckCircle2 size={20} className="mx-auto mb-1" style={{ color: '#4a9c2c' }} />
                <p className="text-sm font-bold" style={{ color: '#4a9c2c' }}>Месяц закрыт успешно</p>
                <p className="text-xs mt-0.5" style={{ color: '#888' }}>Июнь 2026 — все регламентные операции выполнены</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="border shadow-xl w-full max-w-md" style={{ background: '#fff', borderColor: '#999' }}>
            <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: '#1b3a6b', borderColor: '#999' }}>
              <span className="text-sm font-semibold text-white">Новая операция (проводка)</span>
              <button onClick={() => setShowModal(false)} style={{ color: '#8ba5cc' }}
                onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                onMouseLeave={e=>(e.currentTarget.style.color='#8ba5cc')}>
                <X size={14} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#555' }}>Счёт Дт</label>
                  <input type="text" placeholder="1030" value={form.debit}
                    onChange={e=>setForm(p=>({...p,debit:e.target.value}))}
                    className="w-full px-2 py-1.5 border text-xs focus:outline-none" style={{ borderColor: '#ccc' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#555' }}>Счёт Кт</label>
                  <input type="text" placeholder="6010" value={form.credit}
                    onChange={e=>setForm(p=>({...p,credit:e.target.value}))}
                    className="w-full px-2 py-1.5 border text-xs focus:outline-none" style={{ borderColor: '#ccc' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#555' }}>Сумма (сом)</label>
                <input type="number" placeholder="0" value={form.amount}
                  onChange={e=>setForm(p=>({...p,amount:e.target.value}))}
                  className="w-full px-2 py-1.5 border text-xs focus:outline-none" style={{ borderColor: '#ccc' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#555' }}>Содержание</label>
                <input type="text" placeholder="Описание операции..." value={form.content}
                  onChange={e=>setForm(p=>({...p,content:e.target.value}))}
                  className="w-full px-2 py-1.5 border text-xs focus:outline-none" style={{ borderColor: '#ccc' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#555' }}>Основание (необязательно)</label>
                <input type="text" placeholder="Накладная, акт, ПП..." value={form.doc}
                  onChange={e=>setForm(p=>({...p,doc:e.target.value}))}
                  className="w-full px-2 py-1.5 border text-xs focus:outline-none" style={{ borderColor: '#ccc' }} />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: '#ddd', background: '#f5f5f5' }}>
              <button onClick={() => setShowModal(false)}
                className="text-xs px-3 py-1.5 border" style={{ borderColor: '#ccc', color: '#555' }}>
                Отмена
              </button>
              <button onClick={handleCreate}
                className="text-xs px-4 py-1.5 font-semibold" style={{ background: '#f5821f', color: '#fff' }}>
                Провести
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
