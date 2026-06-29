'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Lock, LogIn, LogOut as LogOutIcon, Shield, Eye, FileText, Plus } from 'lucide-react';

const PASSES = [
  { time: '09:45', vehicle: 'A 147 KZ', driver: 'Нурланов Е.', type: 'exit', order: 'ОРД-2847', weight: '53.4 т', approved: 'Байжанов С.' },
  { time: '09:30', vehicle: 'D 456 KZ', driver: 'Сатыбалдиев О.', type: 'entry', order: 'ОРД-2845', weight: '24.2 т', approved: 'Байжанов С.' },
  { time: '09:15', vehicle: 'B 234 KZ', driver: 'Жаксыбеков А.', type: 'entry', order: 'ОРД-2846', weight: '24.6 т', approved: 'Байжанов С.' },
  { time: '09:00', vehicle: 'C 089 KZ', driver: 'Темиров К.', type: 'exit', order: 'ОРД-2848', weight: '58.1 т', approved: 'Байжанов С.' },
  { time: '08:45', vehicle: 'F 321 KZ', driver: 'Алиев Р.', type: 'exit', order: 'ОРД-2844', weight: '55.2 т', approved: 'Байжанов С.' },
  { time: '08:30', vehicle: 'A 147 KZ', driver: 'Нурланов Е.', type: 'entry', order: 'ОРД-2847', weight: '24.2 т', approved: 'Байжанов С.' },
];

const VISITORS = [
  { name: 'Петров А.В.', company: 'ТОО "АлтайСтрой"', purpose: 'Проверка груза', in: '09:00', out: null, pass: 'ВП-0445' },
  { name: 'Иванова М.С.', company: 'Налоговая инспекция', purpose: 'Проверка', in: '10:30', out: null, pass: 'ВП-0446' },
  { name: 'Сидоров К.П.', company: 'АО "СтройКонсалт"', purpose: 'Самовывоз', in: '08:15', out: '08:55', pass: 'ВП-0444' },
];

export default function SecurityPage() {
  return (
    <AppLayout title="Охрана" subtitle="Контроль территории и пропускной режим">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Въездов сегодня" value={PASSES.filter(p => p.type === 'entry').length} icon={<LogIn size={18} />} color="cyan" />
        <StatCard label="Выездов сегодня" value={PASSES.filter(p => p.type === 'exit').length} icon={<LogOutIcon size={18} />} color="blue" />
        <StatCard label="Посетителей сейчас" value={VISITORS.filter(v => !v.out).length} icon={<Eye size={18} />} color="yellow" />
        <StatCard label="Пропусков выдано" value={PASSES.length} icon={<FileText size={18} />} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vehicle pass log */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Shield size={16} className="text-cyan-400" /> Журнал транспорта
            </h3>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
              <Plus size={12} /> Ручной пропуск
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pb-3 font-medium">Время</th>
                  <th className="text-left py-2 pb-3 font-medium">Машина</th>
                  <th className="text-left py-2 pb-3 font-medium">Водитель</th>
                  <th className="text-center py-2 pb-3 font-medium">Тип</th>
                  <th className="text-left py-2 pb-3 font-medium">Заказ</th>
                  <th className="text-right py-2 pb-3 font-medium">Вес</th>
                  <th className="text-left py-2 pb-3 font-medium">Охранник</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {PASSES.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 text-slate-400 text-xs font-mono">{p.time}</td>
                    <td className="py-3 text-white font-medium font-mono">{p.vehicle}</td>
                    <td className="py-3 text-slate-300 text-xs">{p.driver}</td>
                    <td className="py-3 text-center">
                      {p.type === 'entry' ? (
                        <span className="flex items-center justify-center gap-1 text-xs text-green-400">
                          <LogIn size={12} /> Въезд
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-xs text-cyan-400">
                          <LogOutIcon size={12} /> Выезд
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-400 text-xs font-mono">{p.order}</td>
                    <td className="py-3 text-right text-slate-300 text-xs">{p.weight}</td>
                    <td className="py-3 text-slate-500 text-xs">{p.approved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visitors */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Eye size={16} className="text-yellow-400" /> Посетители
          </h3>
          <div className="space-y-3">
            {VISITORS.map((v, i) => (
              <div key={i} className={`p-3 rounded-lg border ${v.out ? 'border-slate-700/50 bg-slate-800/30' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{v.name}</p>
                    <p className="text-slate-400 text-xs">{v.company}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{v.purpose}</p>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${v.out ? 'text-slate-500 bg-slate-700' : 'text-yellow-400 bg-yellow-400/10'}`}>
                    {v.pass}
                  </span>
                </div>
                <div className="flex gap-3 text-xs mt-2">
                  <span className="text-green-400 flex items-center gap-1"><LogIn size={10} />{v.in}</span>
                  {v.out ? (
                    <span className="text-slate-400 flex items-center gap-1"><LogOutIcon size={10} />{v.out}</span>
                  ) : (
                    <span className="text-yellow-400">На территории</span>
                  )}
                </div>
              </div>
            ))}
            <button className="w-full text-xs px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors flex items-center justify-center gap-1.5">
              <Plus size={12} /> Зарегистрировать посетителя
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
