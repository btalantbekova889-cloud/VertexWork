'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Scale, FileText, Truck, CheckCircle2 } from 'lucide-react';

interface Weighing { id: number; weighId: string; vehicle: string; driver: string; order: string; material: string; gross: number; tare: number; net: number; time: string; status: string; }

const INITIAL: Weighing[] = [
  { id: 1, weighId: 'ВС-4525', vehicle: 'A 147 KG', driver: 'Нурланов Е.',    order: 'ОРД-2847', material: 'Щебень фр.20-40', gross: 53.4, tare: 24.2, net: 29.2, time: '08:45', status: 'done' },
  { id: 2, weighId: 'ВС-4524', vehicle: 'B 234 KG', driver: 'Жаксыбеков А.',  order: 'ОРД-2846', material: 'Щебень фр.5-20',  gross: 54.8, tare: 24.6, net: 30.2, time: '08:30', status: 'done' },
  { id: 3, weighId: 'ВС-4523', vehicle: 'C 089 KG', driver: 'Темиров К.',      order: 'ОРД-2848', material: 'Щебень фр.20-40', gross: 58.1, tare: 25.4, net: 32.7, time: '08:15', status: 'done' },
  { id: 4, weighId: 'ВС-4522', vehicle: 'D 456 KG', driver: 'Сатыбалдиев О.', order: 'ОРД-2845', material: 'Отсев',           gross: 51.2, tare: 23.8, net: 27.4, time: '07:55', status: 'done' },
];

const MATERIALS = ['Щебень фр.20-40', 'Щебень фр.5-20', 'Щебень фр.40-70', 'Отсев', 'Песок строительный'];

export default function WeighingPage() {
  const [weighings, setWeighings] = useState<Weighing[]>(INITIAL);
  const [vehicle,   setVehicle]   = useState('');
  const [driver,    setDriver]    = useState('');
  const [order,     setOrder]     = useState('');
  const [material,  setMaterial]  = useState(MATERIALS[0]);
  const [gross,     setGross]     = useState('');
  const [tare,      setTare]      = useState('');
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    fetch('/api/weighings')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.weighings) && d.weighings.length) setWeighings(d.weighings); })
      .catch(() => {});
  }, []);

  const handleWeigh = async () => {
    if (!vehicle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/weighings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle, driver, order, material, gross: Number(gross) || 0, tare: Number(tare) || 0 }),
      });
      const data = await res.json();
      if (data.weighing) setWeighings(prev => [data.weighing, ...prev]);
      setVehicle(''); setDriver(''); setOrder(''); setGross(''); setTare('');
    } finally { setSaving(false); }
  };

  const totalNet = weighings.reduce((s, w) => s + w.net, 0);

  return (
    <AppLayout title="Весовая" subtitle="Взвешивание машин и оформление накладных">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Взвешиваний сегодня" value={weighings.length}                                                     icon={<Scale size={16} />}    color="blue" />
        <StatCard label="Перевезено нетто"     value={`${totalNet.toFixed(1)} т`}                                          icon={<Truck size={16} />}    color="indigo" />
        <StatCard label="Накладных выдано"     value={weighings.length}                                                     icon={<FileText size={16} />} color="green" />
        <StatCard label="Среднее нетто"        value={weighings.length ? `${(totalNet / weighings.length).toFixed(1)} т` : '—'} color="purple" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
        <h3 className="text-gray-700 font-semibold mb-3">Новое взвешивание</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Машина *</label>
            <input value={vehicle} onChange={e => setVehicle(e.target.value.toUpperCase())}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors uppercase"
              placeholder="A 000 KG" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Водитель</label>
            <input value={driver} onChange={e => setDriver(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="Нурланов Е." />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Заказ</label>
            <input value={order} onChange={e => setOrder(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="ОРД-2847" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Материал</label>
            <select value={material} onChange={e => setMaterial(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 transition-colors">
              {MATERIALS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Брутто (т)</label>
            <input value={gross} onChange={e => setGross(e.target.value)} type="number" step="0.1"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="53.4" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Тара (т)</label>
            <input value={tare} onChange={e => setTare(e.target.value)} type="number" step="0.1"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="24.2" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          {gross && tare ? (
            <p className="text-sm text-gray-600">Нетто: <span className="font-bold text-gray-900">{Math.max(0, Number(gross) - Number(tare)).toFixed(1)} т</span></p>
          ) : <div />}
          <button onClick={handleWeigh} disabled={saving || !vehicle.trim()}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2">
            <Scale size={14} />{saving ? 'Сохранение...' : 'Взвесить'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">Журнал взвешиваний</h3>
          <button onClick={() => window.print()}
            className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors flex items-center gap-1">
            <FileText size={12} /> Печать реестра
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Накладная</th>
                <th className="text-left pb-2 font-medium">Машина</th>
                <th className="text-left pb-2 font-medium">Водитель</th>
                <th className="text-left pb-2 font-medium">Заказ</th>
                <th className="text-left pb-2 font-medium">Материал</th>
                <th className="text-right pb-2 font-medium">Брутто</th>
                <th className="text-right pb-2 font-medium">Тара</th>
                <th className="text-right pb-2 font-medium">Нетто</th>
                <th className="text-left pb-2 font-medium">Время</th>
                <th className="text-center pb-2 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {weighings.map(w => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 text-gray-400 font-mono text-xs">{w.weighId}</td>
                  <td className="py-2.5 text-gray-800 font-medium font-mono">{w.vehicle}</td>
                  <td className="py-2.5 text-gray-500 text-xs">{w.driver}</td>
                  <td className="py-2.5 text-gray-400 text-xs font-mono">{w.order}</td>
                  <td className="py-2.5 text-gray-500 text-xs">{w.material}</td>
                  <td className="py-2.5 text-right text-gray-500">{w.gross} т</td>
                  <td className="py-2.5 text-right text-gray-500">{w.tare} т</td>
                  <td className="py-2.5 text-right text-gray-900 font-bold">{w.net} т</td>
                  <td className="py-2.5 text-gray-400 text-xs">{w.time}</td>
                  <td className="py-2.5 text-center"><CheckCircle2 size={14} className="text-green-500 mx-auto" /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200">
                <td colSpan={7} className="py-2.5 text-gray-600 font-medium text-xs">ИТОГО нетто:</td>
                <td className="py-2.5 text-right text-gray-900 font-bold">{totalNet.toFixed(1)} т</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
