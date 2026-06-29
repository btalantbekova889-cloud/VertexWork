'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Users, Plus, Phone, Mail, MapPin, TrendingUp } from 'lucide-react';

const CLIENTS = [
  { id: 1, name: 'ТОО "АлтайСтрой"', contact: 'Иванов П.С.', phone: '+7 777 123-45-67', city: 'Алматы', orders: 47, totalAmount: 18400000, debt: 0, status: 'active' },
  { id: 2, name: 'АО "СтройКонсалт"', contact: 'Петрова М.А.', phone: '+7 701 987-65-43', city: 'Алматы', orders: 32, totalAmount: 14200000, debt: 1050000, status: 'active' },
  { id: 3, name: 'ТОО "МегаБуд"', contact: 'Асанов К.Т.', phone: '+7 747 555-33-22', city: 'Алматы', orders: 18, totalAmount: 6800000, debt: 780000, status: 'active' },
  { id: 4, name: 'ИП Казаков В.С.', contact: 'Казаков В.С.', phone: '+7 712 444-22-11', city: 'Алматы', orders: 12, totalAmount: 3200000, debt: 296000, status: 'active' },
  { id: 5, name: 'ТОО "КаменьСтрой"', contact: 'Бекова Р.Н.', phone: '+7 778 666-44-33', city: 'Алматы', orders: 8, totalAmount: 2800000, debt: 2800000, status: 'blocked' },
  { id: 6, name: 'ТОО "НурБетон"', contact: 'Жаксыбеков А.', phone: '+7 700 111-22-33', city: 'Нур-Султан', orders: 5, totalAmount: 1200000, debt: 0, status: 'active' },
];

export default function ClientsPage() {
  return (
    <AppLayout title="Клиенты" subtitle="База клиентов и история сотрудничества">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Всего клиентов" value={CLIENTS.length} icon={<Users size={18} />} color="cyan" />
        <StatCard label="Активных" value={CLIENTS.filter(c => c.status === 'active').length} color="green" />
        <StatCard label="С задолженностью" value={CLIENTS.filter(c => c.debt > 0).length} color="yellow" />
        <StatCard label="Заблокированных" value={CLIENTS.filter(c => c.status === 'blocked').length} color="red" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">База клиентов</h3>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
            <Plus size={12} /> Новый клиент
          </button>
        </div>

        <div className="space-y-2">
          {CLIENTS.map(c => (
            <div key={c.id} className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.status === 'blocked' ? 'bg-red-500/10' : 'bg-cyan-500/10'}`}>
                    <Users size={16} className={c.status === 'blocked' ? 'text-red-400' : 'text-cyan-400'} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium">{c.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'active' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        {c.status === 'active' ? 'Активен' : 'Заблокирован'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-400 text-xs"><Phone size={10} />{c.phone}</span>
                      <span className="flex items-center gap-1 text-slate-400 text-xs"><MapPin size={10} />{c.city}</span>
                      <span className="text-slate-400 text-xs">Контакт: {c.contact}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0 text-right">
                  <div>
                    <p className="text-slate-400 text-xs">Заказов</p>
                    <p className="text-white font-medium">{c.orders}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Оборот</p>
                    <p className="text-white font-medium">{(c.totalAmount / 1000000).toFixed(1)} млн ₸</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Долг</p>
                    <p className={c.debt > 0 ? 'text-red-400 font-semibold' : 'text-green-400 font-medium'}>
                      {c.debt > 0 ? `${c.debt.toLocaleString('ru-RU')} ₸` : '—'}
                    </p>
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
