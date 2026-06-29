'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Download } from 'lucide-react';

const EMPLOYEES = [
  { id: 1, name: 'Ержанов Болат',     position: 'Начальник карьера', base: 45000 },
  { id: 2, name: 'Ахметов Рустам',   position: 'Диспетчер',         base: 28000 },
  { id: 3, name: 'Сейтов Марат',     position: 'Весовщик',          base: 20000 },
  { id: 4, name: 'Нурланов Ерлан',   position: 'Водитель',          base: 22000 },
  { id: 5, name: 'Жаксыбеков Айдан', position: 'Водитель',          base: 22000 },
  { id: 6, name: 'Касымова Айгуль',  position: 'Менеджер продаж',   base: 30000 },
  { id: 7, name: 'Жакупова Нурия',   position: 'Бухгалтер',         base: 35000 },
];

// June 2026: Mon 1 – Tue 30; weekends: 6,7,13,14,20,21,27,28
const JUNE_DAYS = 30;
const WEEKENDS = new Set([6, 7, 13, 14, 20, 21, 27, 28]);
const WORKING_DAYS_NORM = 22;

const INIT_ATTENDANCE: Record<number, number[]> = {
  1: [1,2,3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29,30],      // 22
  2: [1,2,3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29],          // 21
  3: [1,2,3,4,5,8,9,10,11,12,15,16,17,18,22,23,24,25,26,29,30],          // 21
  4: [1,2,3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29,30],      // 22
  5: [1,2,3,4,5,8,9,10,11,12,15,16,17,18,22,23,24,25,26,29],             // 20
  6: [1,2,3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29,30],      // 22
  7: [1,2,3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29,30],      // 22
};

const APRIL: Record<number, number> = { 1: 42000, 2: 28000, 3: 18200, 4: 22000, 5: 20000, 6: 30000, 7: 35000 };
const MAY:   Record<number, number> = { 1: 45000, 2: 28000, 3: 20000, 4: 22000, 5: 22000, 6: 30000, 7: 35000 };

const MONTHS_AFTER = ['Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

type AttendanceMap = Record<number, Set<number>>;

export default function SalariesPage() {
  const [tab, setTab] = useState<'attendance' | 'monthly'>('attendance');
  const [attendance, setAttendance] = useState<AttendanceMap>(() =>
    Object.fromEntries(
      Object.entries(INIT_ATTENDANCE).map(([k, v]) => [Number(k), new Set(v)])
    )
  );

  const toggleDay = (empId: number, day: number) => {
    if (WEEKENDS.has(day) || day > JUNE_DAYS) return;
    setAttendance(prev => {
      const s = new Set(prev[empId]);
      s.has(day) ? s.delete(day) : s.add(day);
      return { ...prev, [empId]: s };
    });
  };

  const getDays = (empId: number) => attendance[empId]?.size ?? 0;
  const getJune = (emp: typeof EMPLOYEES[0]) =>
    Math.round((emp.base / WORKING_DAYS_NORM) * getDays(emp.id));

  const totalCol = (fn: (e: typeof EMPLOYEES[0]) => number) =>
    EMPLOYEES.reduce((s, e) => s + fn(e), 0);

  return (
    <AppLayout title="Зарплаты" subtitle="Табель и расчёт зарплат — Июнь 2026">
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
            <h3 className="text-gray-700 font-semibold text-sm">Табель посещаемости — Июнь 2026</h3>
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
                        WEEKENDS.has(d)    ? 'bg-red-50 text-red-300'
                        : d > JUNE_DAYS   ? 'bg-gray-100 text-gray-300'
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
                {EMPLOYEES.map((emp, idx) => {
                  const daysWorked = getDays(emp.id);
                  const salary = getJune(emp);
                  return (
                    <tr key={emp.id}>
                      <td
                        className="border border-gray-200 text-center text-gray-400 py-2 bg-white"
                        style={{ position: 'sticky', left: 0, zIndex: 1 }}
                      >{idx + 1}</td>
                      <td
                        className="border border-gray-200 px-3 py-2 text-gray-800 font-medium whitespace-nowrap bg-white"
                        style={{ position: 'sticky', left: '36px', zIndex: 1 }}
                      >{emp.name}</td>
                      {DAYS.map(d => {
                        const weekend   = WEEKENDS.has(d);
                        const invalid   = d > JUNE_DAYS;
                        const present   = attendance[emp.id]?.has(d);
                        return (
                          <td
                            key={d}
                            onClick={() => toggleDay(emp.id, d)}
                            className={`border border-gray-200 text-center py-2 transition-colors ${
                              weekend || invalid
                                ? 'bg-gray-100 cursor-default'
                                : present
                                  ? 'bg-blue-50 cursor-pointer hover:bg-blue-100'
                                  : 'bg-white cursor-pointer hover:bg-gray-50'
                            }`}
                          >
                            {present && !weekend && !invalid && (
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
                    const weekend = WEEKENDS.has(d);
                    const invalid = d > JUNE_DAYS;
                    const count   = weekend || invalid ? 0 : EMPLOYEES.filter(e => attendance[e.id]?.has(d)).length;
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
                    {totalCol(getJune).toLocaleString('ru-RU')} сом
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
            <h3 className="text-gray-700 font-semibold text-sm">Зарплата по месяцам — 2026</h3>
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
                  <th className="border border-gray-200 px-4 py-2 text-center font-medium bg-gray-50 text-gray-600 whitespace-nowrap" style={{ minWidth: '90px' }}>Апрель</th>
                  <th className="border border-gray-200 px-4 py-2 text-center font-medium bg-gray-50 text-gray-600 whitespace-nowrap" style={{ minWidth: '90px' }}>Май</th>
                  <th className="border border-gray-200 px-4 py-2 text-center font-semibold bg-blue-50 text-blue-700 whitespace-nowrap" style={{ minWidth: '90px' }}>Июнь ✎</th>
                  {MONTHS_AFTER.map(m => (
                    <th key={m} className="border border-gray-200 px-4 py-2 text-center font-medium bg-gray-50 text-gray-400 whitespace-nowrap" style={{ minWidth: '90px' }}>{m}</th>
                  ))}
                  <th className="border border-gray-200 px-4 py-2 text-center font-bold bg-blue-50 text-blue-700 whitespace-nowrap" style={{ minWidth: '110px' }}>Итог 2026</th>
                </tr>
              </thead>
              <tbody>
                {EMPLOYEES.map((emp, idx) => {
                  const june  = getJune(emp);
                  const total = (APRIL[emp.id] || 0) + (MAY[emp.id] || 0) + june;
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td
                        className="border border-gray-200 text-center text-gray-400 py-2.5 bg-white"
                        style={{ position: 'sticky', left: 0, zIndex: 1 }}
                      >{idx + 1}</td>
                      <td
                        className="border border-gray-200 px-3 py-2.5 text-gray-800 font-medium whitespace-nowrap bg-white"
                        style={{ position: 'sticky', left: '36px', zIndex: 1 }}
                      >{emp.name}</td>
                      <td className="border border-gray-200 px-4 py-2.5 text-center text-gray-700">
                        {(APRIL[emp.id] || 0).toLocaleString('ru-RU')}
                      </td>
                      <td className="border border-gray-200 px-4 py-2.5 text-center text-gray-700">
                        {(MAY[emp.id] || 0).toLocaleString('ru-RU')}
                      </td>
                      <td className="border border-gray-200 px-4 py-2.5 text-center font-semibold text-blue-700 bg-blue-50">
                        {june.toLocaleString('ru-RU')}
                      </td>
                      {MONTHS_AFTER.map(m => (
                        <td key={m} className="border border-gray-200 px-4 py-2.5 text-center text-gray-300">—</td>
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
                  <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                    {EMPLOYEES.reduce((s, e) => s + (APRIL[e.id] || 0), 0).toLocaleString('ru-RU')}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                    {EMPLOYEES.reduce((s, e) => s + (MAY[e.id] || 0), 0).toLocaleString('ru-RU')}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-center font-bold text-blue-700 bg-blue-50">
                    {totalCol(getJune).toLocaleString('ru-RU')}
                  </td>
                  {MONTHS_AFTER.map(m => (
                    <td key={m} className="border border-gray-200 px-4 py-3 text-center text-gray-300">—</td>
                  ))}
                  <td className="border border-gray-200 px-4 py-3 text-center font-bold text-blue-700 bg-blue-50">
                    {EMPLOYEES.reduce((s, e) => {
                      const june = getJune(e);
                      return s + (APRIL[e.id] || 0) + (MAY[e.id] || 0) + june;
                    }, 0).toLocaleString('ru-RU')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
            Июнь рассчитывается автоматически из табеля посещаемости. Переключитесь на вкладку «Посещаемость» чтобы внести изменения.
          </p>
        </div>
      )}
    </AppLayout>
  );
}
