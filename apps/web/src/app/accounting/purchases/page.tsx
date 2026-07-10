'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Plus, X, CheckCircle2, Clock, FileText } from 'lucide-react';

interface Purchase {
  id: number; num: string; date: string; supplier: string;
  item: string; amount: number; vat: number; paid: boolean;
}

const INIT_DATA: Purchase[] = [
  { id: 1,  num: 'Пост-0041', date: '02.06.2026', supplier: 'ТОО "МеханоСервис"',   item: 'Ремонт экскаватора CAT',         amount: 340000,  vat: 40800,  paid: true  },
  { id: 2,  num: 'Пост-0042', date: '05.06.2026', supplier: 'АЗС "Гелиос"',         item: 'Дизельное топливо, 5 000 л',     amount: 420000,  vat: 50400,  paid: true  },
  { id: 3,  num: 'Пост-0043', date: '08.06.2026', supplier: 'ТОО "ЭкспоШина"',      item: 'Шины для самосвала (8 шт.)',     amount: 280000,  vat: 33600,  paid: true  },
  { id: 4,  num: 'Пост-0044', date: '12.06.2026', supplier: 'ТОО "ГорСнаб"',        item: 'Запчасти для бурового станка',   amount: 195000,  vat: 23400,  paid: false },
  { id: 5,  num: 'Пост-0045', date: '15.06.2026', supplier: 'ИП Куров Д.В.',         item: 'Хозяйственный инвентарь',        amount: 48000,   vat: 5760,   paid: true  },
  { id: 6,  num: 'Пост-0046', date: '18.06.2026', supplier: 'ТОО "МеханоСервис"',   item: 'Масло гидравлическое, 200 л',    amount: 76000,   vat: 9120,   paid: false },
  { id: 7,  num: 'Пост-0047', date: '22.06.2026', supplier: 'ОсОО "АлтайСтальМет"', item: 'Металлопрокат (арматура)',        amount: 138000,  vat: 16560,  paid: false },
  { id: 8,  num: 'Пост-0048', date: '25.06.2026', supplier: 'АЗС "Гелиос"',         item: 'Дизельное топливо, 3 000 л',     amount: 252000,  vat: 30240,  paid: true  },
  { id: 9,  num: 'Пост-0049', date: '28.06.2026', supplier: 'ТОО "БурТех"',         item: 'Долото буровое DH (2 шт.)',      amount: 310000,  vat: 37200,  paid: false },
  { id: 10, num: 'Пост-0050', date: '30.06.2026', supplier: 'ТОО "КиберТех"',       item: 'ПО и обслуживание весовой',     amount: 55000,   vat: 6600,   paid: false },
];

const EMPTY = { supplier: '', item: '', amount: '', vat: '' };

type Filter = 'all' | 'paid' | 'unpaid';

export default function PurchasesPage() {
  const [data, setData] = useState<Purchase[]>(INIT_DATA);
  const [filter, setFilter] = useState<Filter>('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const shown = filter === 'all' ? data : data.filter(d => filter === 'paid' ? d.paid : !d.paid);

  const totalAll = data.reduce((s, d) => s + d.amount, 0);
  const totalPaid = data.filter(d => d.paid).reduce((s, d) => s + d.amount, 0);
  const totalUnpaid = data.filter(d => !d.paid).reduce((s, d) => s + d.amount, 0);

  const handleCreate = () => {
    if (!form.supplier.trim() || !form.item.trim() || !form.amount) return;
    setSaving(true);
    const amt = Number(form.amount);
    const vat = form.vat ? Number(form.vat) : Math.round(amt * 0.12);
    const newRec: Purchase = {
      id: Date.now(), num: `Пост-${String(data.length + 51).padStart(4, '0')}`,
      date: new Date().toLocaleDateString('ru-RU'), supplier: form.supplier,
      item: form.item, amount: amt, vat, paid: false,
    };
    setData(prev => [newRec, ...prev]);
    setForm(EMPTY);
    setShowModal(false);
    setSaving(false);
  };

  const markPaid = (id: number) => setData(prev => prev.map(d => d.id === id ? { ...d, paid: true } : d));

  const N = (v: number) => v.toLocaleString('ru-RU');

  return (
    <AppLayout title="Покупки" subtitle="Поступление товаров и услуг от поставщиков">

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[
          { label: 'Всего поступлений', value: N(totalAll), color: '#1b3a6b' },
          { label: 'Оплачено',           value: N(totalPaid),   color: '#4a9c2c' },
          { label: 'К оплате',           value: N(totalUnpaid), color: '#c03030' },
        ].map((c, i) => (
          <div key={i} className="p-3 border" style={{ background: '#fff', borderColor: '#ccc' }}>
            <div className="text-xs mb-0.5" style={{ color: '#888' }}>{c.label}</div>
            <div className="text-sm font-bold" style={{ color: c.color }}>{c.value} сом</div>
          </div>
        ))}
      </div>

      <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
        <div className="px-3 py-2 border-b flex items-center justify-between" style={{ background: '#dde8f5', borderColor: '#bcd' }}>
          <span className="text-xs font-bold" style={{ color: '#1b3a6b' }}>
            Поступления — Июнь 2026 ({shown.length})
          </span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {(['all','paid','unpaid'] as Filter[]).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="text-xs px-2.5 py-0.5 border transition-colors"
                  style={{
                    background: filter === f ? '#1b3a6b' : '#fff',
                    color: filter === f ? '#fff' : '#333',
                    borderColor: filter === f ? '#1b3a6b' : '#ccc',
                  }}>
                  {f === 'all' ? 'Все' : f === 'paid' ? 'Оплачено' : 'Не оплачено'}
                </button>
              ))}
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1 text-xs px-2.5 py-1 border transition-colors"
              style={{ background: '#f5821f', color: '#fff', borderColor: '#f5821f' }}>
              <Plus size={11} /> Создать
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#f5f5f5', color: '#666' }}>
                {['Номер','Дата','Поставщик','Номенклатура','Сумма','НДС','Статус',''].map((h,i) => (
                  <th key={i} className={`px-3 py-2 border-b font-semibold ${i >= 4 ? 'text-right' : 'text-left'}`}
                    style={{ borderColor: '#ddd' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}
                  className="hover:bg-blue-50 transition-colors">
                  <td className="px-3 py-1.5 border-b font-mono font-bold" style={{ borderColor: '#eee', color: '#1b3a6b' }}>{p.num}</td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor: '#eee', color: '#555' }}>{p.date}</td>
                  <td className="px-3 py-1.5 border-b font-medium" style={{ borderColor: '#eee', color: '#333', maxWidth: 160 }}>{p.supplier}</td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor: '#eee', color: '#555' }}>{p.item}</td>
                  <td className="px-3 py-1.5 border-b text-right font-bold" style={{ borderColor: '#eee', color: '#333' }}>{N(p.amount)}</td>
                  <td className="px-3 py-1.5 border-b text-right" style={{ borderColor: '#eee', color: '#888' }}>{N(p.vat)}</td>
                  <td className="px-3 py-1.5 border-b text-right" style={{ borderColor: '#eee' }}>
                    {p.paid
                      ? <span className="inline-flex items-center gap-1" style={{ color: '#4a9c2c' }}><CheckCircle2 size={11}/>Оплачено</span>
                      : <span className="inline-flex items-center gap-1" style={{ color: '#c03030' }}><Clock size={11}/>Не оплачено</span>
                    }
                  </td>
                  <td className="px-3 py-1.5 border-b text-right" style={{ borderColor: '#eee' }}>
                    {!p.paid && (
                      <button onClick={() => markPaid(p.id)}
                        className="text-xs px-2 py-0.5 border transition-colors"
                        style={{ background: '#1b3a6b', color: '#fff', borderColor: '#1b3a6b' }}>
                        Оплатить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#dde8f5', fontWeight: 700 }}>
                <td colSpan={4} className="px-3 py-1.5 text-xs" style={{ color: '#1b3a6b' }}>ИТОГО ({shown.length})</td>
                <td className="px-3 py-1.5 text-right text-xs" style={{ color: '#1b3a6b' }}>
                  {N(shown.reduce((s,d)=>s+d.amount,0))}
                </td>
                <td className="px-3 py-1.5 text-right text-xs" style={{ color: '#888' }}>
                  {N(shown.reduce((s,d)=>s+d.vat,0))}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="border shadow-xl w-full max-w-md" style={{ background: '#fff', borderColor: '#999' }}>
            <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: '#1b3a6b', borderColor: '#999' }}>
              <div className="flex items-center gap-2">
                <FileText size={14} style={{ color: '#f5821f' }} />
                <span className="text-sm font-semibold text-white">Новое поступление</span>
              </div>
              <button onClick={() => setShowModal(false)} style={{ color: '#8ba5cc' }}
                onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                onMouseLeave={e=>(e.currentTarget.style.color='#8ba5cc')}>
                <X size={14} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Поставщик', key: 'supplier', placeholder: 'ТОО / ИП / ОсОО...' },
                { label: 'Номенклатура', key: 'item', placeholder: 'Наименование товара или услуги' },
                { label: 'Сумма (сом)', key: 'amount', placeholder: '0' },
                { label: 'НДС (сом, необязательно)', key: 'vat', placeholder: 'Авто 12%' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#555' }}>{f.label}</label>
                  <input
                    type={f.key === 'amount' || f.key === 'vat' ? 'number' : 'text'}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-2 py-1.5 border text-xs focus:outline-none"
                    style={{ borderColor: '#ccc' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: '#ddd', background: '#f5f5f5' }}>
              <button onClick={() => setShowModal(false)}
                className="text-xs px-3 py-1.5 border" style={{ borderColor: '#ccc', color: '#555' }}>
                Отмена
              </button>
              <button onClick={handleCreate} disabled={saving}
                className="text-xs px-4 py-1.5 font-semibold"
                style={{ background: '#f5821f', color: '#fff', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Создание...' : 'Создать документ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
