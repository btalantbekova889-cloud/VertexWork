'use client';

import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { ArrowDownLeft, ArrowUpRight, Wallet, CreditCard } from 'lucide-react';

const TRANSACTIONS = [
  { id: 'ПП-12847', type: 'income', client: 'ТОО "АлтайСтрой"', desc: 'Оплата за щебень фр.20-40', amount: 480000, date: '29.06.2026', method: 'Банк' },
  { id: 'ПП-12846', type: 'expense', client: 'АЗС "Гелиос"', desc: 'Топливо для техники', amount: 125000, date: '29.06.2026', method: 'Банк' },
  { id: 'ПП-12845', type: 'income', client: 'ИП Казаков В.С.', desc: 'Предоплата за щебень', amount: 148000, date: '28.06.2026', method: 'Касса' },
  { id: 'ПП-12844', type: 'expense', client: 'ТОО "МеханоСервис"', desc: 'Ремонт экскаватора CAT', amount: 340000, date: '28.06.2026', method: 'Банк' },
  { id: 'ПП-12843', type: 'income', client: 'АО "СтройКонсалт"', desc: 'Оплата за щебень фр.40-70', amount: 1050000, date: '27.06.2026', method: 'Банк' },
  { id: 'ПП-12842', type: 'expense', client: 'Зарплата (аванс)', desc: 'Авансовая выплата сотрудникам', amount: 890000, date: '27.06.2026', method: 'Касса' },
];

export default function AccountingPage() {
  return (
    <AppLayout title="Бухгалтерия" subtitle="Учет доходов и расходов">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Баланс банк" value="23 450 000 ₸" icon={<CreditCard size={18} />} color="cyan" />
        <StatCard label="Баланс касса" value="1 240 000 ₸" icon={<Wallet size={18} />} color="green" />
        <StatCard label="Приход сегодня" value="4 820 000 ₸" change="+12%" positive icon={<ArrowDownLeft size={18} />} color="blue" />
        <StatCard label="Расход сегодня" value="1 355 000 ₸" icon={<ArrowUpRight size={18} />} color="red" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Операции</h3>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors">Все</button>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">Приход</button>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">Расход</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left py-2 pb-3 font-medium">№</th>
                <th className="text-left py-2 pb-3 font-medium">Тип</th>
                <th className="text-left py-2 pb-3 font-medium">Контрагент</th>
                <th className="text-left py-2 pb-3 font-medium">Описание</th>
                <th className="text-left py-2 pb-3 font-medium">Метод</th>
                <th className="text-left py-2 pb-3 font-medium">Дата</th>
                <th className="text-right py-2 pb-3 font-medium">Сумма</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {TRANSACTIONS.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 text-slate-400 font-mono text-xs">{t.id}</td>
                  <td className="py-3">
                    {t.type === 'income' ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs">
                        <ArrowDownLeft size={12} /> Приход
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-xs">
                        <ArrowUpRight size={12} /> Расход
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-white font-medium">{t.client}</td>
                  <td className="py-3 text-slate-400">{t.desc}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.method === 'Банк' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{t.method}</span>
                  </td>
                  <td className="py-3 text-slate-400 text-xs">{t.date}</td>
                  <td className={`py-3 text-right font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('ru-RU')} ₸
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
