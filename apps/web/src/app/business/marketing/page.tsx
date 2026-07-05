'use client';

import AppLayout from '@/components/layout/AppLayout';
import { TrendingUp, Users, MousePointer, DollarSign } from 'lucide-react';

const CHANNELS = [
  { name: 'Google Ads',      leads: 34, cpl: '1 200 сом', romi: '180%', spend: '40 800 сом', status: 'active' },
  { name: 'Instagram / Meta', leads: 21, cpl: '1 800 сом', romi: '140%', spend: '37 800 сом', status: 'active' },
  { name: 'WhatsApp-рассылка', leads: 18, cpl: '200 сом',  romi: '320%', spend: '3 600 сом',  status: 'active' },
  { name: 'Сарафанное радио', leads: 29, cpl: '0 сом',    romi: '∞',    spend: '—',           status: 'organic' },
  { name: '2GIS / Карты',    leads: 12, cpl: '80 сом',    romi: '410%', spend: '960 сом',     status: 'active' },
];

const CONTENT = [
  { date: '30.06', platform: 'Instagram', type: 'Пост', caption: 'Производительность карьера июнь 2026 — 41 200 т', reach: '1 840', eng: '5.2%' },
  { date: '27.06', platform: 'Facebook',  type: 'Пост', caption: 'Новая партия щебня фр. 5-20 — отгрузка сегодня', reach: '920',   eng: '3.8%' },
  { date: '25.06', platform: 'Instagram', type: 'Story', caption: 'Экскаватор в деле — видео с карьера',            reach: '2 100', eng: '7.1%' },
  { date: '22.06', platform: 'LinkedIn',  type: 'Статья', caption: 'Vertex Plus KG: итоги Q2 2026',                 reach: '430',   eng: '4.5%' },
];

export default function MarketingPage() {
  return (
    <AppLayout title="Маркетинг" subtitle="Рекламные каналы, контент-план, аналитика трафика">
      <div className="p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Маркетинг и продвижение</h1>
          <p className="text-sm text-gray-500 mt-0.5">Рекламные каналы, контент-план, аналитика трафика — июнь 2026</p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Лидов за месяц',  value: '114',         icon: <Users size={16} />,       color: 'text-blue-600' },
            { label: 'Средний CPL',      value: '721 сом',     icon: <MousePointer size={16} />, color: 'text-orange-500' },
            { label: 'ROMI (общий)',     value: '212%',        icon: <TrendingUp size={16} />,   color: 'text-green-600' },
            { label: 'Бюджет месяца',   value: '83 160 сом',  icon: <DollarSign size={16} />,   color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Channels */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">Каналы продвижения</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Канал', 'Лидов', 'CPL', 'ROMI', 'Бюджет'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map(c => (
                <tr key={c.name} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">{c.leads}</td>
                  <td className="px-4 py-3 text-gray-600">{c.cpl}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${c.romi === '∞' || parseInt(c.romi) >= 200 ? 'text-green-600' : 'text-gray-700'}`}>{c.romi}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.spend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Content plan */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">Последние публикации</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Дата', 'Площадка', 'Тип', 'Описание', 'Охват', 'ER'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTENT.map(c => (
                <tr key={c.date + c.caption} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{c.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{c.platform}</td>
                  <td className="px-4 py-3 text-gray-600">{c.type}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{c.caption}</td>
                  <td className="px-4 py-3 text-gray-600">{c.reach}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{c.eng}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
