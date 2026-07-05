'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ShoppingCart, Plus, TrendingUp, Trash2, X } from 'lucide-react';

interface Order {
  id: number;
  orderId: string;
  client: string;
  manager: string;
  material: string;
  volume: number;
  price: number;
  status: 'delivered' | 'in_progress' | 'pending' | 'cancelled';
  date: string;
}

const INITIAL: Order[] = [
  { id: 1, orderId: 'ОРД-2847', client: 'ТОО "АлтайСтрой"',  manager: 'Касымова А.', material: 'Щебень фр.20-40', volume: 120, price: 4000, status: 'delivered',   date: '29.06.2026' },
  { id: 2, orderId: 'ОРД-2846', client: 'ИП Казаков В.С.',    manager: 'Сейтов Д.',   material: 'Щебень фр.5-20',  volume: 80,  price: 3700, status: 'in_progress', date: '29.06.2026' },
  { id: 3, orderId: 'ОРД-2845', client: 'ТОО "МегаБуд"',      manager: 'Касымова А.', material: 'Отсев',           volume: 200, price: 1800, status: 'pending',     date: '28.06.2026' },
  { id: 4, orderId: 'ОРД-2844', client: 'АО "СтройКонсалт"',  manager: 'Нурланов Е.', material: 'Щебень фр.40-70', volume: 300, price: 3500, status: 'delivered',   date: '28.06.2026' },
  { id: 5, orderId: 'ОРД-2843', client: 'ТОО "НурБетон"',     manager: 'Касымова А.', material: 'Щебень фр.20-40', volume: 150, price: 4000, status: 'cancelled',   date: '27.06.2026' },
];

const STATUS_BADGE: Record<string, string> = {
  delivered:   'text-green-700 bg-green-50 border-green-200',
  in_progress: 'text-blue-700 bg-blue-50 border-blue-200',
  pending:     'text-amber-700 bg-amber-50 border-amber-200',
  cancelled:   'text-red-700 bg-red-50 border-red-200',
};
const STATUS_LABEL: Record<string, string> = {
  delivered: 'Доставлен', in_progress: 'В пути', pending: 'Ожидает', cancelled: 'Отменён',
};
const MATERIALS = ['Щебень фр.20-40', 'Щебень фр.5-20', 'Щебень фр.40-70', 'Отсев', 'Песок строительный'];
const STATUSES = ['pending', 'in_progress', 'delivered', 'cancelled'] as const;

const EMPTY_FORM = { client: '', manager: '', material: 'Щебень фр.20-40', volume: '', price: '', status: 'pending' as const };

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.orders) && d.orders.length) setOrders(d.orders); })
      .catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!form.client.trim() || !form.volume) return;
    setSaving(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.order) setOrders(prev => [data.order, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    await fetch(`/api/orders/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleStatus = async (id: number, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  const todayOrders = orders.filter(o => o.date === new Date().toLocaleDateString('ru-RU') || o.status !== 'cancelled');
  const revenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.volume * o.price, 0);

  return (
    <AppLayout title="Продажи (CRM)" subtitle="Управление заказами и продажами">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Новый заказ</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Клиент *</label>
                <input value={form.client} onChange={e => setForm(f => ({...f, client: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder='ТОО "АлтайСтрой"' />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Менеджер</label>
                  <input value={form.manager} onChange={e => setForm(f => ({...f, manager: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Касымова А." />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Материал</label>
                  <select value={form.material} onChange={e => setForm(f => ({...f, material: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500">
                    {MATERIALS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Объём (тонн) *</label>
                  <input value={form.volume} onChange={e => setForm(f => ({...f, volume: e.target.value}))}
                    type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="100" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Цена (сом/т)</label>
                  <input value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
                    type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="4000" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Статус</label>
                <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as Order['status']}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500">
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </div>
              <button onClick={handleAdd} disabled={saving || !form.client.trim() || !form.volume}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 mt-1">
                {saving ? 'Сохранение...' : 'Создать заказ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Всего заказов',    value: orders.length,                                      icon: <ShoppingCart size={16} /> },
          { label: 'Доставлено',       value: orders.filter(o => o.status === 'delivered').length, icon: <TrendingUp size={16} /> },
          { label: 'В работе',         value: orders.filter(o => o.status === 'in_progress' || o.status === 'pending').length },
          { label: 'Выручка (доставл.)', value: (revenue / 1000000).toFixed(1) + ' млн сом' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            {s.icon && <div className="text-gray-400 mb-2">{s.icon}</div>}
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-700 font-semibold">Заказы ({orders.length})</h3>
          <button onClick={() => setShowModal(true)}
            className="text-xs px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-1">
            <Plus size={12} /> Новый заказ
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left pb-2 font-medium">№</th>
                <th className="text-left pb-2 font-medium">Клиент</th>
                <th className="text-left pb-2 font-medium">Менеджер</th>
                <th className="text-left pb-2 font-medium">Материал</th>
                <th className="text-right pb-2 font-medium">Объём</th>
                <th className="text-right pb-2 font-medium">Сумма</th>
                <th className="text-center pb-2 font-medium">Статус</th>
                <th className="text-left pb-2 font-medium">Дата</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="py-2.5 text-gray-400 font-mono text-xs">{o.orderId}</td>
                  <td className="py-2.5 text-gray-800 font-medium">{o.client}</td>
                  <td className="py-2.5 text-gray-500 text-xs">{o.manager}</td>
                  <td className="py-2.5 text-gray-500 text-xs">{o.material}</td>
                  <td className="py-2.5 text-right text-gray-600 text-xs">{o.volume} т</td>
                  <td className="py-2.5 text-right text-gray-800 font-semibold text-xs">{(o.volume * o.price).toLocaleString('ru-RU')} сом</td>
                  <td className="py-2.5 text-center">
                    <select value={o.status} onChange={e => handleStatus(o.id, e.target.value as Order['status'])}
                      className={`text-xs px-1.5 py-0.5 rounded border cursor-pointer focus:outline-none ${STATUS_BADGE[o.status]}`}>
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                  </td>
                  <td className="py-2.5 text-gray-400 text-xs">{o.date}</td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handleDelete(o.id)} title="Удалить" className="text-gray-300 hover:text-red-500 transition-colors">
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
