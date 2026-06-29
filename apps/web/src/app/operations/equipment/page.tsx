'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Wrench, CheckCircle2, AlertTriangle, Clock, Fuel } from 'lucide-react';

const EQUIPMENT = [
  { id: 'ЭКС-001', name: 'Экскаватор CAT 349', type: 'Экскаватор', status: 'working', hours_today: 9.5, fuel_today: 380, next_to: '15.07.2026', condition: 'good' },
  { id: 'ЭКС-002', name: 'Экскаватор Komatsu PC360', type: 'Экскаватор', status: 'working', hours_today: 8.0, fuel_today: 320, next_to: '20.07.2026', condition: 'good' },
  { id: 'БУЛ-001', name: 'Бульдозер Komatsu D85', type: 'Бульдозер', status: 'maintenance', hours_today: 0, fuel_today: 0, next_to: 'В ТО', condition: 'maintenance' },
  { id: 'ДРБ-001', name: 'Дробилка СМД-108', type: 'Дробилка', status: 'working', hours_today: 10, fuel_today: 150, next_to: '01.08.2026', condition: 'good' },
  { id: 'КМП-001', name: 'Компрессор Atlas Copco', type: 'Компрессор', status: 'idle', hours_today: 2, fuel_today: 40, next_to: '10.07.2026', condition: 'warning' },
  { id: 'ГРЕ-001', name: 'Грейдер XCMG GR215', type: 'Грейдер', status: 'working', hours_today: 7, fuel_today: 280, next_to: '25.07.2026', condition: 'good' },
];

const STATUS: Record<string, { label: string; style: string }> = {
  working: { label: 'Работает', style: 'text-green-400 bg-green-400/10' },
  maintenance: { label: 'ТО/Ремонт', style: 'text-red-400 bg-red-400/10' },
  idle: { label: 'Простой', style: 'text-yellow-400 bg-yellow-400/10' },
};

export default function EquipmentPage() {
  const totalFuel = EQUIPMENT.reduce((s, e) => s + e.fuel_today, 0);
  const working = EQUIPMENT.filter(e => e.status === 'working').length;

  return (
    <AppLayout title="Техника" subtitle="Управление парком техники и ТО">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Всего единиц" value={EQUIPMENT.length} icon={<Wrench size={18} />} color="cyan" />
        <StatCard label="В работе" value={working} icon={<CheckCircle2 size={18} />} color="green" />
        <StatCard label="На ТО/Ремонте" value={EQUIPMENT.filter(e => e.status === 'maintenance').length} icon={<AlertTriangle size={18} />} color="red" />
        <StatCard label="Топливо сегодня" value={`${totalFuel} л`} icon={<Fuel size={18} />} color="yellow" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Парк техники</h3>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
            <Wrench size={12} /> Создать заявку на ремонт
          </button>
        </div>

        <div className="space-y-3">
          {EQUIPMENT.map(e => (
            <div key={e.id} className={`p-4 rounded-xl border ${
              e.condition === 'maintenance' ? 'border-red-500/20 bg-red-500/5' :
              e.condition === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' :
              'border-slate-700/50 bg-slate-800/50'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  e.condition === 'maintenance' ? 'bg-red-500/10' :
                  e.condition === 'warning' ? 'bg-yellow-500/10' : 'bg-cyan-500/10'
                }`}>
                  <Wrench size={18} className={
                    e.condition === 'maintenance' ? 'text-red-400' :
                    e.condition === 'warning' ? 'text-yellow-400' : 'text-cyan-400'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 text-xs font-mono">{e.id}</span>
                    <p className="text-white font-medium text-sm">{e.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS[e.status].style}`}>{STATUS[e.status].label}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{e.type}</p>
                </div>
                <div className="flex gap-6 text-right flex-shrink-0">
                  <div>
                    <p className="text-slate-500 text-xs">Часов сегодня</p>
                    <p className="text-white font-medium text-sm">{e.hours_today} ч</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Топливо</p>
                    <p className="text-white font-medium text-sm">{e.fuel_today} л</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">След. ТО</p>
                    <p className={`text-sm font-medium ${e.status === 'maintenance' ? 'text-red-400' : 'text-slate-300'}`}>{e.next_to}</p>
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
