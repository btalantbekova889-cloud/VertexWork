'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ScrollText, Clock, Plus, Trash2, X } from 'lucide-react';

interface Tender {
  id: number;
  tenderId: string;
  name: string;
  volume: string;
  amount: string;
  deadline: string;
  status: 'active' | 'won' | 'lost';
}

const INITIAL: Tender[] = [
  { id: 1, tenderId: 'Т-2026-041', name: 'Поставка щебня фр. 20-40 для ГДТС КР', volume: '5 000 т',  amount: '1 500 000 сом', deadline: '15.07.2026', status: 'active' },
  { id: 2, tenderId: 'Т-2026-038', name: 'Отсев для дорожных работ — Бишкек ГСК', volume: '3 200 т',  amount: '640 000 сом',   deadline: '10.07.2026', status: 'active' },
  { id: 3, tenderId: 'Т-2026-032', name: 'Щебень фр. 5-20 для ОсОО СтройГрупп',  volume: '8 000 т',  amount: '2 400 000 сом', deadline: '30.06.2026', status: 'won' },
  { id: 4, tenderId: 'Т-2026-029', name: 'Песок строительный — тендер Минтранса', volume: '2 000 т',  amount: '300 000 сом',   deadline: '20.06.2026', status: 'lost' },
  { id: 5, tenderId: 'Т-2026-025', name: 'Инертные материалы для ОФ Кумтор',      volume: '12 000 т', amount: '3 600 000 сом', deadline: '01.06.2026', status: 'won' },
];

const STATUS: Record<string, { label: string; cls: string }> = {
  active: { label: 'Участвуем', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  won:    { label: 'Выиграли',  cls: 'bg-green-50 text-green-700 border-green-200' },
  lost:   { label: 'Проиграли', cls: 'bg-red-50 text-red-600 border-red-200' },
};

const STATUSES = ['active', 'won', 'lost'] as const;
const EMPTY_FORM = { name: '', volume: '', amount: '', deadline: '', status: 'active' as const };

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/tenders')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.tenders) && d.tenders.length) setTenders(d.tenders); })
      .catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.tender) setTenders(prev => [data.tender, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setTenders(prev => prev.filter(t => t.id !== id));
    await fetch(`/api/tenders/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const active = tenders.filter(t => t.status === 'active').length;
  const won    = tenders.filter(t => t.status === 'won').length;
  const total  = tenders.length;
  const winRate = total > 0 ? Math.round((won / (total - active)) * 100) || 0 : 0;

  return (
    <AppLayout title="Тендеры" subtitle="Государственные закупки и коммерческие тендеры">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Новый тендер</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Наименование тендера *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Поставка щебня для..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Объём</label>
                  <input value={form.volume} onChange={e => setForm(f => ({...f, volume: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="5 000 т" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Сумма</label>
                  <input value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="1 500 000 сом" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Срок подачи</label>
                  <input value={form.deadline} onChange={e => setForm(f => ({...f, deadline: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="15.07.2026" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Статус</label>
                  <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as Tender['status']}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500">
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS[s].label}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleAdd} disabled={saving || !form.name.trim()}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 mt-1">
                {saving ? 'Сохранение...' : 'Добавить тендер'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Активных',    value: active },
          { label: 'Выиграно',    value: won },
          { label: 'Всего',       value: total },
          { label: 'Win rate',    value: winRate + '%' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-700 font-semibold">Тендеры ({tenders.length})</h3>
          <button onClick={() => setShowModal(true)}
            className="text-xs px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-1">
            <Plus size={12} /> Новый тендер
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Номер</th>
                <th className="text-left pb-2 font-medium">Наименование</th>
                <th className="text-left pb-2 font-medium">Объём</th>
                <th className="text-left pb-2 font-medium">Сумма</th>
                <th className="text-left pb-2 font-medium">Срок подачи</th>
                <th className="text-center pb-2 font-medium">Статус</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tenders.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="py-2.5 font-mono text-xs text-gray-500">{t.tenderId}</td>
                  <td className="py-2.5 text-gray-800 max-w-xs">{t.name}</td>
                  <td className="py-2.5 text-gray-500 text-xs">{t.volume}</td>
                  <td className="py-2.5 text-gray-800 font-semibold text-xs">{t.amount}</td>
                  <td className="py-2.5 text-gray-400 text-xs">
                    <span className="flex items-center gap-1"><Clock size={11} />{t.deadline}</span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${STATUS[t.status].cls}`}>
                      {STATUS[t.status].label}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handleDelete(t.id)} title="Удалить" className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
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
