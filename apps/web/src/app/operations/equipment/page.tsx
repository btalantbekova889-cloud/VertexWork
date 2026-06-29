'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Wrench, CheckCircle2, AlertTriangle, Fuel } from 'lucide-react';

const EQUIPMENT = [
  { id: 'ЭКС-001', name: 'Экскаватор CAT 349', type: 'Экскаватор', status: 'working', hours_today: 9.5, fuel_today: 380, next_to: '15.07.2026', condition: 'good' },
  { id: 'ЭКС-002', name: 'Экскаватор Komatsu PC360', type: 'Экскаватор', status: 'working', hours_today: 8.0, fuel_today: 320, next_to: '20.07.2026', condition: 'good' },
  { id: 'БУЛ-001', name: 'Бульдозер Komatsu D85', type: 'Бульдозер', status: 'maintenance', hours_today: 0, fuel_today: 0, next_to: 'В ТО', condition: 'maintenance' },
  { id: 'ДРБ-001', name: 'Дробилка СМД-108', type: 'Дробилка', status: 'working', hours_today: 10, fuel_today: 150, next_to: '01.08.2026', condition: 'good' },
  { id: 'КМП-001', name: 'Компрессор Atlas Copco', type: 'Компрессор', status: 'idle', hours_today: 2, fuel_today: 40, next_to: '10.07.2026', condition: 'warning' },
  { id: 'ГРЕ-001', name: 'Грейдер XCMG GR215', type: 'Грейдер', status: 'working', hours_today: 7, fuel_today: 280, next_to: '25.07.2026', condition: 'good' },
];

const STATUS: Record<string, { label: string; badge: string }> = {
  working:     { label: 'Работает',   badge: 'text-green-700 bg-green-50 border-green-200' },
  maintenance: { label: 'ТО/Ремонт', badge: 'text-red-700 bg-red-50 border-red-200' },
  idle:        { label: 'Простой',    badge: 'text-amber-700 bg-amber-50 border-amber-200' },
};

export default function EquipmentPage() {
  const totalFuel = EQUIPMENT.reduce((s, e) => s + e.fuel_today, 0);
  const working = EQUIPMENT.filter(e => e.status === 'working').length;

  return (
    <AppLayout title="Техника" subtitle="Управление парком техники и ТО">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Всего единиц" value={EQUIPMENT.length} icon={<Wrench size={16} />} color="blue" />
        <StatCard label="В работе" value={working} icon={<CheckCircle2 size={16} />} color="green" />
        <StatCard label="На ТО/Ремонте" value={EQUIPMENT.filter(e => e.status === 'maintenance').length} icon={<AlertTriangle size={16} />} color="red" />
        <StatCard label="Топливо сегодня" value={`${totalFuel} л`} icon={<Fuel size={16} />} color="yellow" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">Парк техники</h3>
          <button className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1">
            <Wrench size={12} /> Создать заявку на ремонт
          </button>
        </div>

        <div className="space-y-3">
          {EQUIPMENT.map(e => (
            <div key={e.id} className={`p-4 rounded-lg border ${
              e.condition === 'maintenance' ? 'border-red-200 bg-red-50' :
              e.condition === 'warning' ? 'border-amber-200 bg-amber-50' :
              'border-gray-100 bg-gray-50'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  e.condition === 'maintenance' ? 'bg-red-100' :
                  e.condition === 'warning' ? 'bg-amber-100' : 'bg-blue-50'
                }`}>
                  <Wrench size={16} className={
                    e.condition === 'maintenance' ? 'text-red-500' :
                    e.condition === 'warning' ? 'text-amber-500' : 'text-blue-600'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-400 text-xs font-mono">{e.id}</span>
                    <p className="text-gray-800 font-medium text-sm">{e.name}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${STATUS[e.status].badge}`}>{STATUS[e.status].label}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{e.type}</p>
                </div>
                <div className="flex gap-6 text-right flex-shrink-0">
                  <div>
                    <p className="text-gray-400 text-xs">Часов сегодня</p>
                    <p className="text-gray-800 font-medium text-sm">{e.hours_today} ч</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Топливо</p>
                    <p className="text-gray-800 font-medium text-sm">{e.fuel_today} л</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">След. ТО</p>
                    <p className={`text-sm font-medium ${e.status === 'maintenance' ? 'text-red-600' : 'text-gray-600'}`}>{e.next_to}</p>
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
