'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { apiFetch } from '@/lib/api';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, Banknote, Users, BarChart2, FileText, BookOpen, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Client { id: number; name: string; debt: number; totalAmount: number; status: string; }
interface HistoryRecord { employeeId: number; year: number; month: number; accrued: number; advance: number; transferred: boolean; }

const TASKS = [
  { id: 1, text: 'Подготовить отчёт за июнь 2026', due: '15.07.2026', done: false },
  { id: 2, text: 'Выплатить зарплаты за июнь', due: '10.07.2026', done: false },
  { id: 3, text: 'Оплатить счёт ТОО "МеханоСервис"', due: '12.07.2026', done: false },
  { id: 4, text: 'Сдать декларацию по НДС', due: '20.07.2026', done: false },
  { id: 5, text: 'Закрытие месяца — июнь', due: '05.07.2026', done: true },
];

const NEWS = [
  { id: 1, title: 'Обновление 1С:Бухгалтерия 3.0.160', date: '08.07.2026', type: 'update' },
  { id: 2, title: 'Сроки сдачи отчётности за 2 кв. 2026', date: '01.07.2026', type: 'info' },
  { id: 3, title: 'Изменения в налоговом законодательстве КР', date: '25.06.2026', type: 'law' },
];

const SALES_DATA = [
  { label: 'с 1 июля', value: 0 },
  { label: 'с 1 января', value: 47600000 },
  { label: 'Июнь', value: 6840000 },
  { label: 'Январь–Июнь', value: 47600000 },
];

function Widget({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc', borderRadius: 2 }}>
      <div className="px-3 py-1.5 border-b font-semibold text-xs flex items-center gap-1.5"
        style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
        {title}
      </div>
      <div className={`p-3 ${className}`}>
        {children}
      </div>
    </div>
  );
}

export default function AccountingHomePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [tasks, setTasks] = useState(TASKS);

  useEffect(() => {
    apiFetch<{ clients: Client[] }>('/api/clients').then(({ clients }) => setClients(clients)).catch(() => {});
    apiFetch<{ history: HistoryRecord[] }>('/api/salaries/history?year=2026').then(({ history }) => setHistory(history)).catch(() => {});
  }, []);

  const totalDebt = clients.reduce((s, c) => s + (c.debt || 0), 0);
  const debtorsCount = clients.filter(c => c.debt > 0).length;

  const juneHistory = history.filter(h => h.month === 6);
  const juneAccrued = juneHistory.reduce((s, h) => s + h.accrued, 0);
  const juneAdvance = juneHistory.reduce((s, h) => s + h.advance, 0);
  const juneBalance = juneAccrued - juneAdvance;
  const junePaid = juneHistory.filter(h => h.transferred).length;
  const junePending = juneHistory.filter(h => !h.transferred && h.accrued > 0).length;

  const pendingTasks = tasks.filter(t => !t.done).length;
  const doneTasks = tasks.filter(t => t.done).length;

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <AppLayout title="Начальная страница" subtitle="1С:Бухгалтерия предприятия 3.0">

      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold" style={{ color: '#1b3a6b' }}>Начальная страница</h2>
        <span className="text-xs" style={{ color: '#999' }}>Vertex Plus KG · Июль 2026</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* ── Column 1 ──────────────────────────────────────────────── */}
        <div className="space-y-3">

          {/* Остатки денежных средств */}
          <Widget title="Остатки денежных средств">
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#eee' }}>
                <span className="text-xs" style={{ color: '#555' }}>Касса</span>
                <span className="text-sm font-bold" style={{ color: '#1b3a6b' }}>1 240 000</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#eee' }}>
                <span className="text-xs" style={{ color: '#555' }}>Банк</span>
                <span className="text-sm font-bold" style={{ color: '#1b3a6b' }}>23 450 000</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-semibold" style={{ color: '#333' }}>Итого</span>
                <span className="text-base font-extrabold" style={{ color: '#f5821f' }}>24 690 000 сом</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="p-2 rounded text-center" style={{ background: '#f0f7e8', border: '1px solid #c5e0a0' }}>
                <ArrowDownLeft size={14} className="mx-auto mb-0.5" style={{ color: '#4a9c2c' }} />
                <div className="text-xs font-bold" style={{ color: '#4a9c2c' }}>+480 000</div>
                <div className="text-xs" style={{ color: '#888' }}>Приход сегодня</div>
              </div>
              <div className="p-2 rounded text-center" style={{ background: '#fdf0f0', border: '1px solid #e0a0a0' }}>
                <ArrowUpRight size={14} className="mx-auto mb-0.5" style={{ color: '#c03030' }} />
                <div className="text-xs font-bold" style={{ color: '#c03030' }}>−125 000</div>
                <div className="text-xs" style={{ color: '#888' }}>Расход сегодня</div>
              </div>
            </div>
          </Widget>

          {/* Покупатели */}
          <Widget title="Покупатели">
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#eee' }}>
                <span className="text-xs" style={{ color: '#555' }}>Задолженность</span>
                <span className="text-sm font-bold text-red-600">{totalDebt.toLocaleString('ru-RU')}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#eee' }}>
                <span className="text-xs" style={{ color: '#555' }}>Должников</span>
                <span className="text-sm font-bold" style={{ color: '#1b3a6b' }}>{debtorsCount}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs" style={{ color: '#555' }}>Счета не оплачено</span>
                <span className="text-sm font-bold text-amber-600">2 100 000</span>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {clients.filter(c => c.debt > 0).slice(0, 3).map(c => (
                <div key={c.id} className="flex justify-between items-center text-xs">
                  <span className="truncate" style={{ color: '#444', maxWidth: 130 }}>{c.name}</span>
                  <span className="font-semibold text-red-600">{c.debt.toLocaleString('ru-RU')}</span>
                </div>
              ))}
            </div>
          </Widget>

        </div>

        {/* ── Column 2 ──────────────────────────────────────────────── */}
        <div className="space-y-3">

          {/* Продажи */}
          <Widget title="Продажи">
            <div className="space-y-2">
              {SALES_DATA.map(row => (
                <div key={row.label} className="flex justify-between items-center py-1 border-b last:border-0" style={{ borderColor: '#eee' }}>
                  <span className="text-xs" style={{ color: '#555' }}>{row.label}</span>
                  <span className="text-sm font-bold" style={{ color: '#1b3a6b' }}>
                    {row.value > 0 ? row.value.toLocaleString('ru-RU') : '—'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 rounded" style={{ background: '#dde8f5', border: '1px solid #bcd' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={13} style={{ color: '#1b3a6b' }} />
                <span className="text-xs font-semibold" style={{ color: '#1b3a6b' }}>Динамика продаж</span>
              </div>
              <div className="flex gap-1 items-end h-8">
                {[3, 5, 4, 6, 5, 7].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 4}px`, background: '#1b3a6b', opacity: 0.6 + i * 0.07 }} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {['Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'].map(m => (
                  <span key={m} className="text-xs" style={{ color: '#888', fontSize: 9 }}>{m}</span>
                ))}
              </div>
            </div>
          </Widget>

          {/* Зарплата за июнь */}
          <Widget title="Зарплата и кадры — Июнь 2026">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: '#555' }}>Начислено</span>
                <span className="text-sm font-bold" style={{ color: '#333' }}>{juneAccrued.toLocaleString('ru-RU')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: '#555' }}>Аванс</span>
                <span className="text-sm font-bold" style={{ color: '#888' }}>{juneAdvance.toLocaleString('ru-RU')}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t" style={{ borderColor: '#eee' }}>
                <span className="text-xs font-semibold" style={{ color: '#333' }}>К выплате</span>
                <span className="text-base font-extrabold" style={{ color: '#f5821f' }}>{juneBalance.toLocaleString('ru-RU')} сом</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 p-2 rounded text-center" style={{ background: '#f0f7e8', border: '1px solid #c5e0a0' }}>
                <CheckCircle2 size={14} className="mx-auto mb-0.5" style={{ color: '#4a9c2c' }} />
                <div className="text-sm font-bold" style={{ color: '#4a9c2c' }}>{junePaid}</div>
                <div className="text-xs" style={{ color: '#888' }}>Выплачено</div>
              </div>
              <div className="flex-1 p-2 rounded text-center" style={{ background: '#fff8e8', border: '1px solid #e0c080' }}>
                <Clock size={14} className="mx-auto mb-0.5" style={{ color: '#b07000' }} />
                <div className="text-sm font-bold" style={{ color: '#b07000' }}>{junePending}</div>
                <div className="text-xs" style={{ color: '#888' }}>Ожидает</div>
              </div>
            </div>
          </Widget>

        </div>

        {/* ── Column 3 ──────────────────────────────────────────────── */}
        <div className="space-y-3">

          {/* Задачи */}
          <Widget title={`Задачи (${pendingTasks} активных)`}>
            <div className="space-y-1">
              {tasks.map(task => (
                <div key={task.id}
                  className="flex items-start gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors"
                  style={{ background: task.done ? '#f5f5f5' : '#fffef0', border: '1px solid', borderColor: task.done ? '#ddd' : '#e0c070' }}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.done
                    ? <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#4a9c2c' }} />
                    : <Clock size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#b07000' }} />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-tight" style={{ color: task.done ? '#999' : '#333', textDecoration: task.done ? 'line-through' : 'none' }}>
                      {task.text}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#aaa', fontSize: 10 }}>до {task.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </Widget>

          {/* Новости */}
          <Widget title="Новости и обновления">
            <div className="space-y-2">
              {NEWS.map(n => (
                <div key={n.id} className="py-1.5 border-b last:border-0" style={{ borderColor: '#eee' }}>
                  <div className="flex items-start gap-1.5">
                    <span className="text-xs px-1 rounded flex-shrink-0 mt-0.5"
                      style={{
                        background: n.type === 'update' ? '#dde8f5' : n.type === 'law' ? '#fdf0f0' : '#f0f7e8',
                        color: n.type === 'update' ? '#1b3a6b' : n.type === 'law' ? '#c03030' : '#4a9c2c',
                        fontSize: 9,
                        padding: '1px 4px',
                      }}>
                      {n.type === 'update' ? 'ОБН' : n.type === 'law' ? 'ЗАКОН' : 'СРОК'}
                    </span>
                    <p className="text-xs" style={{ color: '#333' }}>{n.title}</p>
                  </div>
                  <p className="text-xs mt-0.5 ml-7" style={{ color: '#aaa', fontSize: 10 }}>{n.date}</p>
                </div>
              ))}
            </div>
          </Widget>

          {/* Методическая поддержка */}
          <Widget title="Методическая поддержка">
            <div className="space-y-1">
              {[
                { icon: <BookOpen size={12} />, label: 'Справочник бухгалтера' },
                { icon: <FileText size={12} />, label: 'Налоговый кодекс КР' },
                { icon: <BarChart2 size={12} />, label: 'Формы отчётности' },
                { icon: <Users size={12} />, label: 'Консультации (Хелплайн)' },
              ].map((item, i) => (
                <button key={i}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors"
                  style={{ color: '#1b3a6b', fontSize: 12 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#dde8f5')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ color: '#1b3a6b' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </Widget>

        </div>
      </div>
    </AppLayout>
  );
}
