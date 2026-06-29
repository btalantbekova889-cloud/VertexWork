'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { Warehouse, Package, ArrowDownLeft, ArrowUpRight, AlertTriangle } from 'lucide-react';

const STOCK = [
  { material: 'Щебень фр.20-40', balance: 3420, unit: 'т', min: 1000, location: 'Склад А', in_today: 1240, out_today: 580 },
  { material: 'Щебень фр.5-20', balance: 1850, unit: 'т', min: 800, location: 'Склад А', in_today: 680, out_today: 320 },
  { material: 'Щебень фр.40-70', balance: 2100, unit: 'т', min: 500, location: 'Склад Б', in_today: 440, out_today: 200 },
  { material: 'Отсев', balance: 1050, unit: 'т', min: 500, location: 'Склад Б', in_today: 0, out_today: 274 },
  { material: 'Дизельное топливо', balance: 12400, unit: 'л', min: 5000, location: 'Топливная база', in_today: 5000, out_today: 1850 },
  { material: 'Масло моторное', balance: 340, unit: 'л', min: 200, location: 'Склад ГСМ', in_today: 0, out_today: 20 },
];

const MOVEMENTS = [
  { type: 'in', material: 'Щебень фр.20-40', qty: 440, from: 'Карьер №1, блок А-12', time: '09:15', doc: 'ВС-4525' },
  { type: 'out', material: 'Щебень фр.20-40', qty: 120, to: 'ТОО "АлтайСтрой"', time: '08:45', doc: 'ОРД-2847' },
  { type: 'in', material: 'Дизельное топливо', qty: 5000, from: 'АЗС "Гелиос"', time: '08:00', doc: 'ТН-2231' },
  { type: 'out', material: 'Дизельное топливо', qty: 620, to: 'Карьерная техника', time: '07:30', doc: 'РК-445' },
];

export default function WarehousePage() {
  const lowStock = STOCK.filter(s => s.balance < s.min * 1.2);

  return (
    <AppLayout title="Склад" subtitle="Остатки и движение материалов">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Позиций на складе" value={STOCK.length} icon={<Package size={16} />} color="blue" />
        <StatCard label="Приход сегодня" value="6 360 т+л" icon={<ArrowDownLeft size={16} />} color="green" />
        <StatCard label="Расход сегодня" value="3 244 т+л" icon={<ArrowUpRight size={16} />} color="indigo" />
        {lowStock.length > 0 ? (
          <StatCard label="Низкий остаток" value={lowStock.length} icon={<AlertTriangle size={16} />} color="red" />
        ) : (
          <StatCard label="Критических остатков" value="0" color="green" />
        )}
      </div>

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium text-sm">Низкий уровень запасов</p>
            <p className="text-red-500 text-xs">{lowStock.map(s => s.material).join(', ')} — необходимо пополнение</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
            <Warehouse size={15} className="text-blue-600" /> Остатки на складе
          </h3>
          <div className="space-y-3">
            {STOCK.map((s, i) => {
              const pct = Math.min((s.balance / (s.min * 3)) * 100, 100);
              const isLow = s.balance < s.min * 1.2;
              return (
                <div key={i} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-gray-800 text-sm font-medium">{s.material}</p>
                      <p className="text-gray-400 text-xs">{s.location}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isLow ? 'text-red-600' : 'text-gray-800'}`}>
                        {s.balance.toLocaleString('ru-RU')} {s.unit}
                      </p>
                      <div className="flex gap-2 text-xs mt-0.5 justify-end">
                        <span className="text-green-600">+{s.in_today.toLocaleString('ru-RU')}</span>
                        <span className="text-red-500">-{s.out_today.toLocaleString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full ${isLow ? 'bg-red-500' : pct > 60 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Мин: {s.min.toLocaleString('ru-RU')} {s.unit}</span>
                    <span>{Math.round(pct)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4">Движение сегодня</h3>
          <div className="space-y-3">
            {MOVEMENTS.map((m, i) => (
              <div key={i} className="flex gap-3">
                {m.type === 'in' ? (
                  <ArrowDownLeft size={15} className="text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <ArrowUpRight size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-xs font-medium">{m.material}</p>
                  <p className="text-gray-400 text-xs">{m.type === 'in' ? `Из: ${m.from}` : `Кому: ${m.to}`}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className={`text-xs font-bold ${m.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                      {m.type === 'in' ? '+' : '-'}{m.qty.toLocaleString('ru-RU')}
                    </span>
                    <span className="text-gray-400 text-xs">{m.doc}</span>
                    <span className="text-gray-400 text-xs">{m.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
