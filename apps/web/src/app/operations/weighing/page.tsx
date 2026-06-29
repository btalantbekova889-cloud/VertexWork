'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Scale, FileText, Truck, Plus, CheckCircle2 } from 'lucide-react';

const WEIGHINGS = [
  { id: 'ВС-4525', vehicle: 'A 147 KZ', driver: 'Нурланов Е.', order: 'ОРД-2847', material: 'Щебень фр.20-40', gross: 53.4, tare: 24.2, net: 29.2, time: '08:45', status: 'done' },
  { id: 'ВС-4524', vehicle: 'B 234 KZ', driver: 'Жаксыбеков А.', order: 'ОРД-2846', material: 'Щебень фр.5-20', gross: 54.8, tare: 24.6, net: 30.2, time: '08:30', status: 'done' },
  { id: 'ВС-4523', vehicle: 'C 089 KZ', driver: 'Темиров К.', order: 'ОРД-2848', material: 'Щебень фр.20-40', gross: 58.1, tare: 25.4, net: 32.7, time: '08:15', status: 'done' },
  { id: 'ВС-4522', vehicle: 'D 456 KZ', driver: 'Сатыбалдиев О.', order: 'ОРД-2845', material: 'Отсев', gross: 51.2, tare: 23.8, net: 27.4, time: '07:55', status: 'done' },
];

export default function WeighingPage() {
  const totalNet = WEIGHINGS.reduce((s, w) => s + w.net, 0);

  return (
    <AppLayout title="Весовая" subtitle="Взвешивание машин и оформление накладных">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Взвешиваний сегодня" value={WEIGHINGS.length} icon={<Scale size={18} />} color="cyan" />
        <StatCard label="Перевезено нетто" value={`${totalNet.toFixed(1)} т`} icon={<Truck size={18} />} color="blue" />
        <StatCard label="Накладных выдано" value={WEIGHINGS.length} icon={<FileText size={18} />} color="green" />
        <StatCard label="Среднее нетто" value={`${(totalNet / WEIGHINGS.length).toFixed(1)} т`} color="purple" />
      </div>

      {/* New weighing button */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Новое взвешивание</h3>
            <p className="text-slate-400 text-sm mt-1">Сканируйте или введите номер машины</p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="A 000 KZ"
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 w-36 focus:outline-none focus:border-cyan-500/50 transition-colors uppercase"
            />
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2">
              <Scale size={14} /> Взвесить
            </button>
          </div>
        </div>
      </div>

      {/* Weighing log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Журнал взвешиваний</h3>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
            <FileText size={12} /> Печать реестра
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left py-2 pb-3 font-medium">Накладная</th>
                <th className="text-left py-2 pb-3 font-medium">Машина</th>
                <th className="text-left py-2 pb-3 font-medium">Водитель</th>
                <th className="text-left py-2 pb-3 font-medium">Заказ</th>
                <th className="text-left py-2 pb-3 font-medium">Материал</th>
                <th className="text-right py-2 pb-3 font-medium">Брутто</th>
                <th className="text-right py-2 pb-3 font-medium">Тара</th>
                <th className="text-right py-2 pb-3 font-medium">Нетто</th>
                <th className="text-left py-2 pb-3 font-medium">Время</th>
                <th className="text-center py-2 pb-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {WEIGHINGS.map(w => (
                <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 text-slate-400 font-mono text-xs">{w.id}</td>
                  <td className="py-3 text-white font-medium font-mono">{w.vehicle}</td>
                  <td className="py-3 text-slate-300 text-xs">{w.driver}</td>
                  <td className="py-3 text-slate-400 text-xs font-mono">{w.order}</td>
                  <td className="py-3 text-slate-300 text-xs">{w.material}</td>
                  <td className="py-3 text-right text-slate-400">{w.gross} т</td>
                  <td className="py-3 text-right text-slate-400">{w.tare} т</td>
                  <td className="py-3 text-right text-cyan-400 font-bold">{w.net} т</td>
                  <td className="py-3 text-slate-500 text-xs">{w.time}</td>
                  <td className="py-3 text-center">
                    <CheckCircle2 size={14} className="text-green-400 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-700">
                <td colSpan={7} className="py-3 text-slate-400 font-medium text-xs">ИТОГО нетто:</td>
                <td className="py-3 text-right text-cyan-400 font-bold">{totalNet.toFixed(1)} т</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
