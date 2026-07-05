'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Users, Plus, Phone, MapPin, Trash2, X } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  contact: string;
  phone: string;
  city: string;
  orders: number;
  totalAmount: number;
  debt: number;
  status: 'active' | 'blocked';
}

const INITIAL: Client[] = [
  { id: 1, name: 'ТОО "АлтайСтрой"',  contact: 'Иванов П.С.',   phone: '+7 777 123-45-67', city: 'Алматы', orders: 47, totalAmount: 18400000, debt: 0,       status: 'active' },
  { id: 2, name: 'АО "СтройКонсалт"',  contact: 'Петрова М.А.',  phone: '+7 701 987-65-43', city: 'Алматы', orders: 32, totalAmount: 14200000, debt: 1050000, status: 'active' },
  { id: 3, name: 'ТОО "МегаБуд"',      contact: 'Асанов К.Т.',   phone: '+7 747 555-33-22', city: 'Алматы', orders: 18, totalAmount: 6800000,  debt: 780000,  status: 'active' },
  { id: 4, name: 'ИП Казаков В.С.',     contact: 'Казаков В.С.',  phone: '+7 712 444-22-11', city: 'Алматы', orders: 12, totalAmount: 3200000,  debt: 296000,  status: 'active' },
  { id: 5, name: 'ТОО "КаменьСтрой"',  contact: 'Бекова Р.Н.',   phone: '+7 778 666-44-33', city: 'Алматы', orders: 8,  totalAmount: 2800000,  debt: 2800000, status: 'blocked' },
  { id: 6, name: 'ТОО "НурБетон"',     contact: 'Жаксыбеков А.', phone: '+7 700 111-22-33', city: 'Бишкек', orders: 5,  totalAmount: 1200000,  debt: 0,       status: 'active' },
];

const EMPTY_FORM = { name: '', contact: '', phone: '', city: '', status: 'active' as const };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.clients) && d.clients.length) setClients(d.clients); })
      .catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.client) setClients(prev => [...prev, data.client]);
      setShowModal(false);
      setForm(EMPTY_FORM);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setClients(prev => prev.filter(c => c.id !== id));
    await fetch(`/api/clients/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const toggleBlock = async (id: number, current: string) => {
    const status = current === 'active' ? 'blocked' : 'active';
    setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    await fetch(`/api/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  return (
    <AppLayout title="Клиенты" subtitle="База клиентов и история сотрудничества">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Новый клиент</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Название компании *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder='ТОО "Название"' />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Контактное лицо</label>
                  <input value={form.contact} onChange={e => setForm(f => ({...f, contact: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Иванов И.И." />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Город</label>
                  <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Бишкек" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Телефон</label>
                <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="+996 700 000 000" />
              </div>
              <button onClick={handleAdd} disabled={saving || !form.name.trim()}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 mt-1">
                {saving ? 'Сохранение...' : 'Добавить клиента'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Всего клиентов',     value: clients.length },
          { label: 'Активных',           value: clients.filter(c => c.status === 'active').length },
          { label: 'С задолженностью',   value: clients.filter(c => c.debt > 0).length },
          { label: 'Заблокированных',    value: clients.filter(c => c.status === 'blocked').length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">База клиентов ({clients.length})</h3>
          <button onClick={() => setShowModal(true)}
            className="text-xs px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-1">
            <Plus size={12} /> Новый клиент
          </button>
        </div>

        <div className="space-y-2">
          {clients.map(c => (
            <div key={c.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${c.status === 'blocked' ? 'bg-red-50' : 'bg-gray-100'}`}>
                    <Users size={15} className={c.status === 'blocked' ? 'text-red-500' : 'text-gray-500'} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-gray-800 font-medium">{c.name}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${c.status === 'active' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                        {c.status === 'active' ? 'Активен' : 'Заблокирован'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      {c.phone && <span className="flex items-center gap-1 text-gray-400 text-xs"><Phone size={10} />{c.phone}</span>}
                      {c.city && <span className="flex items-center gap-1 text-gray-400 text-xs"><MapPin size={10} />{c.city}</span>}
                      {c.contact && <span className="text-gray-400 text-xs">Контакт: {c.contact}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Заказов</p>
                    <p className="text-gray-800 font-medium">{c.orders}</p>
                  </div>
                  {c.totalAmount > 0 && (
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Оборот</p>
                      <p className="text-gray-800 font-medium">{(c.totalAmount / 1000000).toFixed(1)} млн сом</p>
                    </div>
                  )}
                  {c.debt > 0 && (
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Долг</p>
                      <p className="text-red-600 font-semibold text-sm">{c.debt.toLocaleString('ru-RU')} сом</p>
                    </div>
                  )}
                  <div className="flex items-center gap-1 ml-2">
                    <button onClick={() => toggleBlock(c.id, c.status)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${c.status === 'active' ? 'text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-600' : 'text-green-600 border-green-200 hover:bg-green-50'}`}>
                      {c.status === 'active' ? 'Блок' : 'Разблок'}
                    </button>
                    <button onClick={() => handleDelete(c.id)} title="Удалить" className="text-gray-300 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
