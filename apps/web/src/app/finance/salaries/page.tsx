'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { apiFetch } from '@/lib/api';
import { currentYearMonth, daysInMonth, isWeekend, MONTH_NAMES } from '@/lib/date';
import { Download } from 'lucide-react';

interface Employee {
  id: number;
  fullName: string;
  position: string;
  baseSalary: string;
}

interface AttendanceRecord {
  id: number;
  employeeId: number;
  workDate: string;
}

interface SalaryMonthRow {
  employeeId: number;
  amount: number;
  daysWorked: number;
  isFinal: boolean;
}

export default function SalariesPage() {
  const { year, month } = currentYearMonth();
  const monthDays = daysInMonth(year, month);
  const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

  const [tab, setTab] = useState<'attendance' | 'monthly'>('attendance');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [monthRows, setMonthRows] = useState<SalaryMonthRow[]>([]);
  const [byEmployeeYear, setByEmployeeYear] = useState<Record<number, Record<number, number>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [{ employees }, { records }, { rows }, { byEmployee }] = await Promise.all([
        apiFetch<{ employees: Employee[] }>('/api/employees'),
        apiFetch<{ records: AttendanceRecord[] }>(`/api/attendance?year=${year}&month=${month}`),
        apiFetch<{ rows: SalaryMonthRow[] }>(`/api/salaries/month?year=${year}&month=${month}`),
        apiFetch<{ byEmployee: Record<number, Record<number, number>> }>(`/api/salaries/year?year=${year}`),
      ]);
      setEmployees(employees);
      setRecords(records);
      setMonthRows(rows);
      setByEmployeeYear(byEmployee);
      setError('');
    } catch {
      setError('Не удалось загрузить данные зарплат. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    load();
  }, [load]);

  const attendanceSet = (empId: number) =>
    new Set(
      records
        .filter(r => r.employeeId === empId)
        .map(r => Number(r.workDate.slice(8, 10)))
    );

  const toggleDay = async (empId: number, day: number) => {
    if (isWeekend(year, month, day) || day > monthDays) return;
    const has = attendanceSet(empId).has(day);
    setRecords(prev =>
      has
        ? prev.filter(r => !(r.employeeId === empId && Number(r.workDate.slice(8, 10)) === day))
        : [...prev, { id: -Date.now(), employeeId: empId, workDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` }]
    );
    try {
      await apiFetch('/api/attendance/toggle', {
        method: 'POST',
        body: JSON.stringify({ employeeId: empId, year, month, day }),
      });
      const { rows } = await apiFetch<{ rows: SalaryMonthRow[] }>(`/api/salaries/month?year=${year}&month=${month}`);
      setMonthRows(rows);
    } catch {
      setError('Не удалось сохранить отметку посещаемости.');
      load();
    }
  };

  const getDays = (empId: number) => attendanceSet(empId).size;
  const getMonthAmount = (empId: number) => monthRows.find(r => r.employeeId === empId)?.amount ?? 0;

  const totalCol = (fn: (e: Employee) => number) => employees.reduce((s, e) => s + fn(e), 0);

  if (loading) {
    return (
      <AppLayout title="Зарплаты" subtitle={`Табель и расчёт зарплат — ${MONTH_NAMES[month - 1]} ${year}`}>
        <p className="text-gray-400 text-sm">Загрузка...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Зарплаты" subtitle={`Табель и расчёт зарплат — ${MONTH_NAMES[month - 1]} ${year}`}>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>
      )}

      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('attendance')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === 'attendance' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Посещаемость
        </button>
        <button
          onClick={() => setTab('monthly')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === 'monthly' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Зарплата по месяцам
        </button>
      </div>

      {/* ── TAB 1: Attendance ─────────────────────────────────────── */}
      {tab === 'attendance' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-gray-700 font-semibold text-sm">Табель посещаемости — {MONTH_NAMES[month - 1]} {year}</h3>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-gray-100 border border-gray-200 rounded inline-block" /> выходной
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-blue-600 font-bold text-sm leading-none">✓</span> явился (кликните)
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="text-xs border-collapse" style={{ minWidth: 'max-content' }}>
              <thead>
                <tr>
                  <th
                    className="border border-gray-200 px-2 py-2 text-center text-gray-500 font-medium bg-gray-50"
                    style={{ position: 'sticky', left: 0, zIndex: 3, minWidth: '36px' }}
                  >№</th>
                  <th
                    className="border border-gray-200 px-3 py-2 text-left text-gray-500 font-medium bg-gray-50"
                    style={{ position: 'sticky', left: '36px', zIndex: 3, minWidth: '170px' }}
                  >ФИО</th>
                  {DAYS.map(d => (
                    <th
                      key={d}
                      className={`border border-gray-200 py-2 text-center font-medium ${
                        d > monthDays         ? 'bg-gray-100 text-gray-300'
                        : isWeekend(year, month, d) ? 'bg-red-50 text-red-300'
                        : 'bg-gray-50 text-gray-600'
                      }`}
                      style={{ minWidth: '28px' }}
                    >{d}</th>
                  ))}
                  <th className="border border-gray-200 px-3 py-2 text-center font-semibold bg-blue-50 text-blue-700" style={{ minWidth: '52px' }}>Дней</th>
                  <th className="border border-gray-200 px-3 py-2 text-center font-semibold bg-blue-50 text-blue-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Зарплата</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => {
                  const daysWorked = getDays(emp.id);
                  const salary = getMonthAmount(emp.id);
                  const present = attendanceSet(emp.id);
                  return (
                    <tr key={emp.id}>
                      <td
                        className="border border-gray-200 text-center text-gray-400 py-2 bg-white"
                        style={{ position: 'sticky', left: 0, zIndex: 1 }}
                      >{idx + 1}</td>
                      <td
                        className="border border-gray-200 px-3 py-2 text-gray-800 font-medium whitespace-nowrap bg-white"
                        style={{ position: 'sticky', left: '36px', zIndex: 1 }}
                      >{emp.fullName}</td>
                      {DAYS.map(d => {
                        const weekend = isWeekend(year, month, d);
                        const invalid = d > monthDays;
                        const isPresent = present.has(d);
                        return (
                          <td
                            key={d}
                            onClick={() => toggleDay(emp.id, d)}
                            className={`border border-gray-200 text-center py-2 transition-colors ${
                              weekend || invalid
                                ? 'bg-gray-100 cursor-default'
                                : isPresent
                                  ? 'bg-blue-50 cursor-pointer hover:bg-blue-100'
                                  : 'bg-white cursor-pointer hover:bg-gray-50'
                            }`}
                          >
                            {isPresent && !weekend && !invalid && (
                              <span className="text-blue-600 font-bold leading-none">✓</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="border border-gray-200 text-center font-bold text-gray-700 bg-blue-50 px-2">{daysWorked}</td>
                      <td className="border border-gray-200 text-center font-bold text-blue-700 bg-blue-50 px-3 whitespace-nowrap">
                        {salary.toLocaleString('ru-RU')} сом
                      </td>
                    </tr>
                  );
                })}

                {/* Totals row */}
                <tr className="bg-gray-50">
                  <td
                    className="border border-gray-200 py-2.5 bg-gray-50"
                    style={{ position: 'sticky', left: 0, zIndex: 1 }}
                  />
                  <td
                    className="border border-gray-200 px-3 py-2.5 font-semibold text-gray-600 bg-gray-50"
                    style={{ position: 'sticky', left: '36px', zIndex: 1 }}
                  >ИТОГО</td>
                  {DAYS.map(d => {
                    const weekend = isWeekend(year, month, d);
                    const invalid = d > monthDays;
                    const count   = weekend || invalid ? 0 : employees.filter(e => attendanceSet(e.id).has(d)).length;
                    return (
                      <td key={d} className={`border border-gray-200 text-center py-2.5 text-gray-500 font-medium ${weekend || invalid ? 'bg-gray-100' : 'bg-gray-50'}`}>
                        {count > 0 ? count : ''}
                      </td>
                    );
                  })}
                  <td className="border border-gray-200 text-center font-bold text-gray-700 bg-blue-50 px-2">
                    {totalCol(e => getDays(e.id))}
                  </td>
                  <td className="border border-gray-200 text-center font-bold text-blue-700 bg-blue-50 px-3 whitespace-nowrap">
                    {totalCol(e => getMonthAmount(e.id)).toLocaleString('ru-RU')} сом
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: Monthly salary ─────────────────────────────────── */}
      {tab === 'monthly' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-gray-700 font-semibold text-sm">Зарплата по месяцам — {year}</h3>
            <button className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-500 hover:border-gray-300 flex items-center gap-1.5 transition-colors">
              <Download size={12} /> Экспорт Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="text-xs border-collapse" style={{ minWidth: 'max-content' }}>
              <thead>
                <tr>
                  <th
                    className="border border-gray-200 px-2 py-2 text-center text-gray-500 font-medium bg-gray-50"
                    style={{ position: 'sticky', left: 0, zIndex: 3, minWidth: '36px' }}
                  >№</th>
                  <th
                    className="border border-gray-200 px-3 py-2 text-left text-gray-500 font-medium bg-gray-50"
                    style={{ position: 'sticky', left: '36px', zIndex: 3, minWidth: '170px' }}
                  >ФИО</th>
                  {MONTH_NAMES.map((m, i) => (
                    <th
                      key={m}
                      className={`border border-gray-200 px-4 py-2 text-center whitespace-nowrap ${
                        i + 1 === month ? 'font-semibold bg-blue-50 text-blue-700' : 'font-medium bg-gray-50 text-gray-600'
                      }`}
                      style={{ minWidth: '90px' }}
                    >
                      {m}{i + 1 === month ? ' ✎' : ''}
                    </th>
                  ))}
                  <th className="border border-gray-200 px-4 py-2 text-center font-bold bg-blue-50 text-blue-700 whitespace-nowrap" style={{ minWidth: '110px' }}>Итог {year}</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => {
                  const monthAmounts = MONTH_NAMES.map((_, i) =>
                    i + 1 === month ? getMonthAmount(emp.id) : (byEmployeeYear[emp.id]?.[i + 1] ?? 0)
                  );
                  const total = monthAmounts.reduce((s, v) => s + v, 0);
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td
                        className="border border-gray-200 text-center text-gray-400 py-2.5 bg-white"
                        style={{ position: 'sticky', left: 0, zIndex: 1 }}
                      >{idx + 1}</td>
                      <td
                        className="border border-gray-200 px-3 py-2.5 text-gray-800 font-medium whitespace-nowrap bg-white"
                        style={{ position: 'sticky', left: '36px', zIndex: 1 }}
                      >{emp.fullName}</td>
                      {monthAmounts.map((amount, i) => (
                        <td
                          key={i}
                          className={`border border-gray-200 px-4 py-2.5 text-center ${
                            i + 1 === month ? 'font-semibold text-blue-700 bg-blue-50' : 'text-gray-700'
                          }`}
                        >
                          {amount > 0 ? amount.toLocaleString('ru-RU') : <span className="text-gray-300">—</span>}
                        </td>
                      ))}
                      <td className="border border-gray-200 px-4 py-2.5 text-center font-bold text-blue-700 bg-blue-50">
                        {total.toLocaleString('ru-RU')}
                      </td>
                    </tr>
                  );
                })}

                {/* Totals row */}
                <tr className="bg-gray-50">
                  <td
                    className="border border-gray-200 py-3 bg-gray-50"
                    style={{ position: 'sticky', left: 0, zIndex: 1 }}
                  />
                  <td
                    className="border border-gray-200 px-3 py-3 font-semibold text-gray-600 bg-gray-50"
                    style={{ position: 'sticky', left: '36px', zIndex: 1 }}
                  >ИТОГО</td>
                  {MONTH_NAMES.map((_, i) => {
                    const colTotal = employees.reduce((s, e) => {
                      const amount = i + 1 === month ? getMonthAmount(e.id) : (byEmployeeYear[e.id]?.[i + 1] ?? 0);
                      return s + amount;
                    }, 0);
                    return (
                      <td
                        key={i}
                        className={`border border-gray-200 px-4 py-3 text-center font-semibold ${
                          i + 1 === month ? 'font-bold text-blue-700 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        {colTotal > 0 ? colTotal.toLocaleString('ru-RU') : <span className="text-gray-300">—</span>}
                      </td>
                    );
                  })}
                  <td className="border border-gray-200 px-4 py-3 text-center font-bold text-blue-700 bg-blue-50">
                    {employees.reduce((s, e) => {
                      const monthAmounts = MONTH_NAMES.map((_, i) =>
                        i + 1 === month ? getMonthAmount(e.id) : (byEmployeeYear[e.id]?.[i + 1] ?? 0)
                      );
                      return s + monthAmounts.reduce((a, v) => a + v, 0);
                    }, 0).toLocaleString('ru-RU')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
            {MONTH_NAMES[month - 1]} рассчитывается автоматически из табеля посещаемости. Переключитесь на вкладку «Посещаемость» чтобы внести изменения.
          </p>
        </div>
      )}
    </AppLayout>
  );
}
