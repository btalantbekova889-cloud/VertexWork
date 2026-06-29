'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Users, Plus, Phone, MapPin } from 'lucide-react';

const CLIENTS = [
  { id: 1, name: 'ТОО "АлтайСтрой"', contact: 'Иванов П.С.', phone: '+7 777 123-45-67', city: 'Алматы', orders: 47, totalAmount: 18400000, debt: 0, status: 'active' },
  { id: 2, name: 'АО "СтройКонсалт"', contact: 'Петрова М.А.', phone: '+7 701 987-65-43', city: 'Алматы', orders: 32, totalAmount: 14200000, debt: 1050000, status: 'active' },
  { id: 3, name: 'ТОО "МегаБуд"', contact: 'Асанов К.Т.', phone: '+7 747 555-33-22', city: 'Алматы', orders: 18, totalAmount: 6800000, debt: 780000, status: 'active' },
  { id: 4, name: 'ИП Казаков В.С.', contact: 'Казаков В.С.', phone: '+7 712 444-22-11', city: 'Алматы', orders: 12, totalAmount: 3200000, debt: 296000, status: 'active' },
  { id: 5, name: 'ТОО "КаменьСтрой"', contact: 'Бекова Р.Н.', phone: '+7 778 666-44-33', city: 'Алматы', orders: 8, totalAmount: 2800000, debt: 2800000, status: 'blocked' },
  { id: 6, name: 'ТОО "НурБетон"', contact: 'Жаксыбеков А.', phone: '+7 700 111-22-33', city: 'Бишкек', orders: 5, totalAmount: 1200000, debt: 0, status: 'active' },
];

export default function ClientsPage() {
  return (
    <AppLayout title="Клиенты" subtitle="База клиентов и история сотрудничества">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Всего клиентов" value={CLIENTS.length} icon={<Users size={16} />} color="blue" />
        <StatCard label="Активных" value={CLIENTS.filter(c => c.status === 'active').length} color="green" />
        <StatCard label="С задолженностью" value={CLIENTS.filter(c => c.debt > 0).length} color="yellow" />
        <StatCard label="Заблокированных" value={CLIENTS.filter(c => c.status === 'blocked').length} color="red" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">База клиентов</h3>
          <button className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1">
            <Plus size={12} /> Новый клиент
          </button>
        </div>

        <div className="space-y-2">
          {CLIENTS.map(c => (
            <div key={c.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${c.status === 'blocked' ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <Users size={15} className={c.status === 'blocked' ? 'text-red-500' : 'text-blue-600'} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-gray-800 font-medium">{c.name}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${c.status === 'active' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                        {c.status === 'active' ? 'Активен' : 'Заблокирован'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-gray-400 text-xs"><Phone size={10} />{c.phone}</span>
                      <span className="flex items-center gap-1 text-gray-400 text-xs"><MapPin size={10} />{c.city}</span>
                      <span className="text-gray-400 text-xs">Контакт: {c.contact}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0 text-right">
                  <div>
                    <p className="text-gray-400 text-xs">Заказов</p>
                    <p className="text-gray-800 font-medium">{c.orders}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Оборот</p>
                    <p className="text-gray-800 font-medium">{(c.totalAmount / 1000000).toFixed(1)} млн сом</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Долг</p>
                    <p className={c.debt > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-medium'}>
                      {c.debt > 0 ? `${c.debt.toLocaleString('ru-RU')} сом` : '—'}
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
