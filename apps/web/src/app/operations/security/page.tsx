'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { LogIn, LogOut as LogOutIcon, Shield, Eye, FileText, Plus } from 'lucide-react';

const PASSES = [
  { time: '09:45', vehicle: 'A 147 KG', driver: 'Нурланов Е.', type: 'exit', order: 'ОРД-2847', weight: '53.4 т', approved: 'Байжанов С.' },
  { time: '09:30', vehicle: 'D 456 KG', driver: 'Сатыбалдиев О.', type: 'entry', order: 'ОРД-2845', weight: '24.2 т', approved: 'Байжанов С.' },
  { time: '09:15', vehicle: 'B 234 KG', driver: 'Жаксыбеков А.', type: 'entry', order: 'ОРД-2846', weight: '24.6 т', approved: 'Байжанов С.' },
  { time: '09:00', vehicle: 'C 089 KG', driver: 'Темиров К.', type: 'exit', order: 'ОРД-2848', weight: '58.1 т', approved: 'Байжанов С.' },
  { time: '08:45', vehicle: 'F 321 KG', driver: 'Алиев Р.', type: 'exit', order: 'ОРД-2844', weight: '55.2 т', approved: 'Байжанов С.' },
  { time: '08:30', vehicle: 'A 147 KG', driver: 'Нурланов Е.', type: 'entry', order: 'ОРД-2847', weight: '24.2 т', approved: 'Байжанов С.' },
];

const VISITORS = [
  { name: 'Петров А.В.', company: 'ТОО "АлтайСтрой"', purpose: 'Проверка груза', in: '09:00', out: null, pass: 'ВП-0445' },
  { name: 'Иванова М.С.', company: 'Налоговая инспекция', purpose: 'Проверка', in: '10:30', out: null, pass: 'ВП-0446' },
  { name: 'Сидоров К.П.', company: 'АО "СтройКонсалт"', purpose: 'Самовывоз', in: '08:15', out: '08:55', pass: 'ВП-0444' },
];

export default function SecurityPage() {
  return (
    <AppLayout title="Охрана" subtitle="Контроль территории и пропускной режим">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Въездов сегодня" value={PASSES.filter(p => p.type === 'entry').length} icon={<LogIn size={16} />} color="green" />
        <StatCard label="Выездов сегодня" value={PASSES.filter(p => p.type === 'exit').length} icon={<LogOutIcon size={16} />} color="blue" />
        <StatCard label="Посетителей сейчас" value={VISITORS.filter(v => !v.out).length} icon={<Eye size={16} />} color="yellow" />
        <StatCard label="Пропусков выдано" value={PASSES.length} icon={<FileText size={16} />} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-semibold flex items-center gap-2">
              <Shield size={15} className="text-blue-600" /> Журнал транспорта
            </h3>
            <button className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1">
              <Plus size={12} /> Ручной пропуск
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Время</th>
                  <th className="text-left pb-2 font-medium">Машина</th>
                  <th className="text-left pb-2 font-medium">Водитель</th>
                  <th className="text-center pb-2 font-medium">Тип</th>
                  <th className="text-left pb-2 font-medium">Заказ</th>
                  <th className="text-right pb-2 font-medium">Вес</th>
                  <th className="text-left pb-2 font-medium">Охранник</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PASSES.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 text-gray-400 text-xs font-mono">{p.time}</td>
                    <td className="py-2.5 text-gray-800 font-medium font-mono">{p.vehicle}</td>
                    <td className="py-2.5 text-gray-500 text-xs">{p.driver}</td>
                    <td className="py-2.5 text-center">
                      {p.type === 'entry' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700">
                          <LogIn size={11} /> Въезд
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                          <LogOutIcon size={11} /> Выезд
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-gray-400 text-xs font-mono">{p.order}</td>
                    <td className="py-2.5 text-right text-gray-500 text-xs">{p.weight}</td>
                    <td className="py-2.5 text-gray-400 text-xs">{p.approved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
            <Eye size={15} className="text-amber-500" /> Посетители
          </h3>
          <div className="space-y-3">
            {VISITORS.map((v, i) => (
              <div key={i} className={`p-3 rounded-lg border ${v.out ? 'border-gray-100 bg-gray-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{v.name}</p>
                    <p className="text-gray-500 text-xs">{v.company}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{v.purpose}</p>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono border ${v.out ? 'text-gray-500 bg-gray-100 border-gray-200' : 'text-amber-700 bg-amber-100 border-amber-200'}`}>
                    {v.pass}
                  </span>
                </div>
                <div className="flex gap-3 text-xs mt-2">
                  <span className="text-green-600 flex items-center gap-1"><LogIn size={10} />{v.in}</span>
                  {v.out ? (
                    <span className="text-gray-500 flex items-center gap-1"><LogOutIcon size={10} />{v.out}</span>
                  ) : (
                    <span className="text-amber-600">На территории</span>
                  )}
                </div>
              </div>
            ))}
            <button className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors flex items-center justify-center gap-1">
              <Plus size={12} /> Зарегистрировать посетителя
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
