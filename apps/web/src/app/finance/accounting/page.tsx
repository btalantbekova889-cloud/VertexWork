'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { ArrowDownLeft, ArrowUpRight, Wallet, CreditCard } from 'lucide-react';

const TRANSACTIONS = [
  { id: 'ПП-12847', type: 'income',  client: 'ТОО "АлтайСтрой"',    desc: 'Оплата за щебень фр.20-40',      amount: 480000,  date: '29.06.2026', method: 'Банк' },
  { id: 'ПП-12846', type: 'expense', client: 'АЗС "Гелиос"',         desc: 'Топливо для техники',             amount: 125000,  date: '29.06.2026', method: 'Банк' },
  { id: 'ПП-12845', type: 'income',  client: 'ИП Казаков В.С.',      desc: 'Предоплата за щебень',            amount: 148000,  date: '28.06.2026', method: 'Касса' },
  { id: 'ПП-12844', type: 'expense', client: 'ТОО "МеханоСервис"',   desc: 'Ремонт экскаватора CAT',          amount: 340000,  date: '28.06.2026', method: 'Банк' },
  { id: 'ПП-12843', type: 'income',  client: 'АО "СтройКонсалт"',   desc: 'Оплата за щебень фр.40-70',      amount: 1050000, date: '27.06.2026', method: 'Банк' },
  { id: 'ПП-12842', type: 'expense', client: 'Зарплата (аванс)',      desc: 'Авансовая выплата сотрудникам',  amount: 890000,  date: '27.06.2026', method: 'Касса' },
];

type Filter = 'all' | 'income' | 'expense';

export default function AccountingPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const shown = filter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.type === filter);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all',     label: 'Все' },
    { key: 'income',  label: 'Приход' },
    { key: 'expense', label: 'Расход' },
  ];

  return (
    <AppLayout title="Бухгалтерия" subtitle="Учёт доходов и расходов">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Баланс (банк)"   value="23 450 000 сом" icon={<CreditCard size={16} />}   color="blue" />
        <StatCard label="Баланс (касса)"  value="1 240 000 сом"  icon={<Wallet size={16} />}       color="green" />
        <StatCard label="Приход сегодня"  value="4 820 000 сом"  change="+12%" positive icon={<ArrowDownLeft size={16} />} color="indigo" />
        <StatCard label="Расход сегодня"  value="1 355 000 сом"  icon={<ArrowUpRight size={16} />} color="red" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">Операции ({shown.length})</h3>
          <div className="flex gap-1">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${filter === f.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left pb-2 font-medium">№</th>
                <th className="text-left pb-2 font-medium">Тип</th>
                <th className="text-left pb-2 font-medium">Контрагент</th>
                <th className="text-left pb-2 font-medium">Описание</th>
                <th className="text-left pb-2 font-medium">Метод</th>
                <th className="text-left pb-2 font-medium">Дата</th>
                <th className="text-right pb-2 font-medium">Сумма</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shown.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 text-gray-400 font-mono text-xs">{t.id}</td>
                  <td className="py-2.5">
                    {t.type === 'income'
                      ? <span className="flex items-center gap-1 text-green-600 text-xs"><ArrowDownLeft size={11} />Приход</span>
                      : <span className="flex items-center gap-1 text-red-600 text-xs"><ArrowUpRight size={11} />Расход</span>}
                  </td>
                  <td className="py-2.5 text-gray-800 font-medium">{t.client}</td>
                  <td className="py-2.5 text-gray-500 text-xs">{t.desc}</td>
                  <td className="py-2.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${t.method === 'Банк' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
                      {t.method}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-400 text-xs">{t.date}</td>
                  <td className={`py-2.5 text-right font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '−'}{t.amount.toLocaleString('ru-RU')} сом
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
