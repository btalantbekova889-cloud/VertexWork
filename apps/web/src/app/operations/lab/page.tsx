'use client';

import AppLayout from '@/components/layout/AppLayout';
import { FlaskConical, CheckCircle2, XCircle } from 'lucide-react';

const TESTS = [
  { date: '01.07.2026', material: 'Щебень фр. 20-40', batch: 'БП-2026-112', prochnost: 'М1200', moroz: 'F150', plashch: '0.4%', result: 'pass' },
  { date: '01.07.2026', material: 'Щебень фр. 5-20',  batch: 'БП-2026-111', prochnost: 'М1000', moroz: 'F100', plashch: '0.6%', result: 'pass' },
  { date: '30.06.2026', material: 'Отсев',             batch: 'БП-2026-110', prochnost: '—',     moroz: '—',    plashch: '1.8%', result: 'pass' },
  { date: '30.06.2026', material: 'Щебень фр. 40-70', batch: 'БП-2026-109', prochnost: 'М800',  moroz: 'F100', plashch: '2.1%', result: 'fail' },
  { date: '29.06.2026', material: 'Песок строит.',    batch: 'БП-2026-108', prochnost: '—',     moroz: '—',    plashch: '0.3%', result: 'pass' },
];

export default function LabPage() {
  return (
    <AppLayout title="Лаборатория ОКК" subtitle="Отдел контроля качества — испытания продукции по ГОСТ">
      <div className="p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Лаборатория ОКК — Отдел контроля качества</h1>
          <p className="text-sm text-gray-500 mt-0.5">Испытания продукции на соответствие ГОСТ 8267-93, ГОСТ 8736-2014</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Испытаний за месяц', value: '47',   sub: 'партий проверено' },
            { label: 'Прошли контроль',    value: '44',   sub: '93.6% годных' },
            { label: 'Не прошли',          value: '3',    sub: 'отправлено на доработку' },
            { label: 'Сертификатов',       value: '12',   sub: 'действующих ГОСТ' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <FlaskConical size={15} className="text-gray-500" />
            <h2 className="font-semibold text-gray-800 text-sm">Результаты испытаний</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Дата', 'Материал', 'Партия', 'Прочность', 'Морозост.', 'Лещадность', 'ГОСТ'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TESTS.map(t => (
                <tr key={t.batch} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{t.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{t.material}</td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-700">{t.batch}</td>
                  <td className="px-4 py-3 text-gray-600">{t.prochnost}</td>
                  <td className="px-4 py-3 text-gray-600">{t.moroz}</td>
                  <td className="px-4 py-3 text-gray-600">{t.plashch}</td>
                  <td className="px-4 py-3">
                    {t.result === 'pass'
                      ? <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded"><CheckCircle2 size={11} /> Соотв.</span>
                      : <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded"><XCircle size={11} /> Не соотв.</span>
                    }
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
