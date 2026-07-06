'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { apiFetch } from '@/lib/api';
import { currentYearMonth, daysInMonth, MONTH_NAMES } from '@/lib/date';
import { CheckCircle2, Download, Send } from 'lucide-react';

interface Employee { id: number; fullName: string; position: string; baseSalary: string; }

interface SalaryMonthRow { employeeId: number; amount: number; daysWorked: number; isFinal: boolean; }

interface HistoryRecord {
  id: number; employeeId: number; year: number; month: number;
  baseSalary: number; totalDays: number; workedDays: number;
  accrued: number; advance: number; transferred: boolean;
}

const HISTORY_MONTHS = [3, 4, 5, 6];

export default function SalariesPage() {
  const { year, month } = currentYearMonth();
  const monthDays = daysInMonth(year, month);

  const [tab, setTab] = useState<'current' | 'history'>('history');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [monthRows, setMonthRows] = useState<SalaryMonthRow[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [histMonth, setHistMonth] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transferring, setTransferring] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const [{ employees }, { rows }, { history }] = await Promise.all([
        apiFetch<{ employees: Employee[] }>('/api/employees'),
        apiFetch<{ rows: SalaryMonthRow[] }>(`/api/salaries/month?year=${year}&month=${month}`),
        apiFetch<{ history: HistoryRecord[] }>(`/api/salaries/history?year=${year}`),
      ]);
      setEmployees(employees);
      setMonthRows(rows);
      setHistory(history);
      setError('');
    } catch {
      setError('Не удалось загрузить данные зарплат.');
    } finally { setLoading(false); }
  }, [year, month]);

  useEffect(() => { load(); }, [load]);

  const handleTransfer = async (employeeId: number, hYear: number, hMonth: number) => {
    setTransferring(employeeId);
    try {
      await apiFetch('/api/salaries/transfer', {
        method: 'POST',
        body: JSON.stringify({ employeeId, year: hYear, month: hMonth }),
      });
      await load();
    } finally { setTransferring(null); }
  };

  const getRow = (empId: number) => monthRows.find(r => r.employeeId === empId);

  const getHist = (empId: number, m: number) =>
    history.find(h => h.employeeId === empId && h.month === m);

  const histMonthData = employees.map(emp => {
    const h = getHist(emp.id, histMonth);
    return { emp, h: h ?? null };
  });

  const histTotalAccrued  = histMonthData.reduce((s, x) => s + (x.h?.accrued  ?? 0), 0);
  const histTotalAdvance  = histMonthData.reduce((s, x) => s + (x.h?.advance  ?? 0), 0);
  const histTotalBalance  = histMonthData.reduce((s, x) => s + ((x.h?.accrued ?? 0) - (x.h?.advance ?? 0)), 0);

  if (loading) {
    return (
      <AppLayout title="Зарплаты" subtitle={`Расчёт и выплата зарплат — ${MONTH_NAMES[month - 1]} ${year}`}>
        <p className="text-gray-400 text-sm">Загрузка...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Зарплаты" subtitle={`Расчёт и выплата зарплат — ${MONTH_NAMES[month - 1]} ${year}`}>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>
      )}

      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setTab('history')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === 'history' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          История выплат
        </button>
        <button onClick={() => setTab('current')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === 'current' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          {MONTH_NAMES[month - 1]} {year}
        </button>
      </div>

      {/* ── TAB: История выплат ─────────────────────────────────────────── */}
      {tab === 'history' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-gray-700 font-semibold text-sm">Ведомость выплат — {year}</h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {HISTORY_MONTHS.map(m => (
                  <button key={m} onClick={() => setHistMonth(m)}
                    className={`text-xs px-2.5 py-1 rounded border transition-colors ${histMonth === m ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                    {MONTH_NAMES[m - 1]}
                  </button>
                ))}
              </div>
              <button className="text-xs px-2.5 py-1 rounded border border-gray-200 text-gray-500 hover:border-gray-300 flex items-center gap-1 transition-colors">
                <Download size={11} /> Экспорт
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 font-medium">№</th>
                  <th className="text-left px-4 py-2.5 font-medium">ФИО</th>
                  <th className="text-left px-4 py-2.5 font-medium">Должность</th>
                  <th className="text-right px-4 py-2.5 font-medium">Оклад</th>
                  <th className="text-center px-4 py-2.5 font-medium">Раб.дней</th>
                  <th className="text-center px-4 py-2.5 font-medium">Отраб.</th>
                  <th className="text-right px-4 py-2.5 font-medium">Начислено</th>
                  <th className="text-right px-4 py-2.5 font-medium">Аванс</th>
                  <th className="text-right px-4 py-2.5 font-medium bg-blue-50 text-blue-700">К выплате</th>
                  <th className="text-center px-4 py-2.5 font-medium">Статус</th>
                  <th className="text-center px-4 py-2.5 font-medium">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {histMonthData.map(({ emp, h }, idx) => {
                  const balance = (h?.accrued ?? 0) - (h?.advance ?? 0);
                  const busy = transferring === emp.id;
                  const noWork = !h || h.accrued === 0;
                  return (
                    <tr key={emp.id} className={`hover:bg-gray-50 transition-colors ${noWork ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-2.5 text-gray-800 font-medium whitespace-nowrap">{emp.fullName}</td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs whitespace-nowrap">{emp.position}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">
                        {h ? h.baseSalary.toLocaleString('ru-RU') : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-center text-gray-500">{h?.totalDays ?? '—'}</td>
                      <td className="px-4 py-2.5 text-center text-gray-700 font-medium">{h?.workedDays ?? 0}</td>
                      <td className="px-4 py-2.5 text-right text-gray-800 font-semibold">
                        {h?.accrued ? h.accrued.toLocaleString('ru-RU') : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-500">
                        {h?.advance ? h.advance.toLocaleString('ru-RU') : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold bg-blue-50">
                        {noWork ? <span className="text-gray-300">—</span> :
                          <span className={balance < 0 ? 'text-red-600' : 'text-blue-700'}>
                            {balance.toLocaleString('ru-RU')}
                          </span>}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {noWork ? <span className="text-gray-300 text-xs">—</span> :
                          h?.transferred
                            ? <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                                <CheckCircle2 size={10} /> Выплачено
                              </span>
                            : <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">Ожидает</span>}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {!noWork && !h?.transferred && balance > 0 && (
                          <button
                            onClick={() => handleTransfer(emp.id, year, histMonth)}
                            disabled={busy}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 transition-colors">
                            <Send size={10} />{busy ? '…' : 'Перевести'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td colSpan={6} className="px-4 py-2.5 font-semibold text-gray-600 text-xs">ИТОГО</td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-800">{histTotalAccrued.toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-500">{histTotalAdvance.toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-blue-700 bg-blue-50">{histTotalBalance.toLocaleString('ru-RU')}</td>
                  <td colSpan={2} className="px-4 py-2.5 text-center text-xs text-gray-400">
                    {histMonthData.filter(x => x.h?.transferred).length} из {histMonthData.filter(x => x.h && x.h.accrued > 0).length} выплачено
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
            Данные зарплат рассчитаны на основании табеля посещаемости. Нажмите «Перевести» чтобы отметить выплату.
          </p>
        </div>
      )}

      {/* ── TAB: Текущий месяц ─────────────────────────────────────────── */}
      {tab === 'current' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-gray-700 font-semibold text-sm">Расчет — {MONTH_NAMES[month - 1]} {year} <span className="text-gray-400 font-normal text-xs">(промежуточный)</span></h3>
            <span className="text-xs text-gray-400">Дней в месяце: {monthDays} · Рассчитывается автоматически</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 font-medium">№</th>
                  <th className="text-left px-4 py-2.5 font-medium">ФИО</th>
                  <th className="text-left px-4 py-2.5 font-medium">Должность</th>
                  <th className="text-right px-4 py-2.5 font-medium">Оклад</th>
                  <th className="text-center px-4 py-2.5 font-medium">Дней/мес</th>
                  <th className="text-center px-4 py-2.5 font-medium">Отраб.</th>
                  <th className="text-right px-4 py-2.5 font-medium bg-blue-50 text-blue-700">Начислено</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map((emp, idx) => {
                  const row = getRow(emp.id);
                  const salary = row?.amount ?? 0;
                  const days   = row?.daysWorked ?? 0;
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-2.5 text-gray-800 font-medium whitespace-nowrap">{emp.fullName}</td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs whitespace-nowrap">{emp.position}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">
                        {Number(emp.baseSalary).toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2.5 text-center text-gray-500">{monthDays}</td>
                      <td className="px-4 py-2.5 text-center font-medium text-gray-700">{days}</td>
                      <td className="px-4 py-2.5 text-right font-bold bg-blue-50">
                        {salary > 0
                          ? <span className="text-blue-700">{salary.toLocaleString('ru-RU')} сом</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td colSpan={6} className="px-4 py-2.5 font-semibold text-gray-600 text-xs">ИТОГО</td>
                  <td className="px-4 py-2.5 text-right font-bold text-blue-700 bg-blue-50">
                    {employees.reduce((s, e) => s + (getRow(e.id)?.amount ?? 0), 0).toLocaleString('ru-RU')} сом
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
            Промежуточный расчёт на текущую дату. Посещаемость отмечает начальник карьера. Выплаты производятся после закрытия месяца.
          </p>
        </div>
      )}
    </AppLayout>
  );
}
