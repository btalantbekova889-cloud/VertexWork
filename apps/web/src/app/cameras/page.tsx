'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { AlertTriangle, CheckCircle2, ArrowDown, ArrowUp } from 'lucide-react';

interface EmployeeWithPlate {
  id: number;
  fullName: string;
  position: string;
  plate: { plate: string; vehicle: string | null } | null;
}

interface CameraEvent {
  id: number;
  cameraId: number;
  location: string | null;
  plate: string;
  direction: 'entry' | 'exit';
  isAuth: boolean;
  orderNo: string | null;
  createdAt: string;
}

interface CameraStats {
  entries: number;
  exits: number;
  authorized: number;
  denied: number;
}

const POLL_MS = 6000;

export default function CamerasPage() {
  const { user } = useAuth();
  const [displayTime, setDisplayTime] = useState('');
  const [employees, setEmployees] = useState<EmployeeWithPlate[]>([]);
  const [events, setEvents] = useState<CameraEvent[]>([]);
  const [stats, setStats] = useState<CameraStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAnalyticsUser = user?.role === 'director' || user?.role === 'commercial_director';

  const load = useCallback(async () => {
    try {
      const [{ employees }, { events }] = await Promise.all([
        apiFetch<{ employees: EmployeeWithPlate[] }>('/api/employees'),
        apiFetch<{ events: CameraEvent[] }>('/api/cameras/log?limit=50'),
      ]);
      setEmployees(employees);
      setEvents(events);
      if (isAnalyticsUser) {
        const stats = await apiFetch<CameraStats>('/api/cameras/stats');
        setStats(stats);
      }
      setError('');
    } catch {
      setError('Не удалось загрузить данные камер. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalyticsUser]);

  useEffect(() => {
    load();
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    const update = () => setDisplayTime(
      new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const plateInfo = (plate: string) => {
    const emp = employees.find(e => e.plate?.plate === plate);
    return emp ? { driver: emp.fullName, vehicle: emp.plate?.vehicle ?? '—' } : null;
  };

  const renderFeed = (camNum: number, location: string) => {
    const event = events.find(e => e.cameraId === camNum);
    const plate = event?.plate ?? null;
    const authorized = event?.isAuth ?? false;
    const info = plate ? plateInfo(plate) : null;
    const borderColor = authorized ? '#4ade80' : '#f87171';

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <span className="text-gray-700 text-sm font-semibold">CAM-0{camNum}</span>
            <span className="text-gray-400 text-xs">· {location}</span>
          </div>
          <span className="text-gray-400 text-xs font-mono">{displayTime}</span>
        </div>

        {/* Feed */}
        <div className="relative bg-gray-900" style={{ aspectRatio: '16/9' }}>
          <div className="camera-scan" />

          {/* REC badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-[10px] font-mono tracking-widest">REC</span>
          </div>

          {/* Camera number */}
          <div className="absolute top-2 right-2 text-gray-400 text-[10px] font-mono z-20">
            АРН · КПП-{camNum}
          </div>

          {/* Plate targeting */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            {!plate ? (
              <p className="text-gray-500 text-xs font-mono tracking-widest">ОЖИДАНИЕ ТРАНСПОРТА…</p>
            ) : (
              <div className="relative">
                {/* Corner brackets */}
                <div className="absolute -top-3 -left-3 w-5 h-5" style={{ borderTop: `2px solid ${borderColor}`, borderLeft: `2px solid ${borderColor}` }} />
                <div className="absolute -top-3 -right-3 w-5 h-5" style={{ borderTop: `2px solid ${borderColor}`, borderRight: `2px solid ${borderColor}` }} />
                <div className="absolute -bottom-3 -left-3 w-5 h-5" style={{ borderBottom: `2px solid ${borderColor}`, borderLeft: `2px solid ${borderColor}` }} />
                <div className="absolute -bottom-3 -right-3 w-5 h-5" style={{ borderBottom: `2px solid ${borderColor}`, borderRight: `2px solid ${borderColor}` }} />

                {/* Plate box */}
                <div
                  className="px-5 py-2 flex items-center justify-center"
                  style={{ border: `2px solid ${borderColor}`, minWidth: '180px', background: 'rgba(0,0,0,0.45)' }}
                >
                  <span className="text-white font-mono font-bold text-xl tracking-[0.2em]">{plate}</span>
                </div>

                {/* Status label */}
                <p
                  className="text-center mt-2 text-[11px] font-mono font-semibold tracking-widest"
                  style={{ color: borderColor }}
                >
                  {authorized ? '● АВТОРИЗОВАН' : '● НЕТ В БАЗЕ'}
                </p>
              </div>
            )}
          </div>

          {/* Bottom info bar */}
          {plate && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/65 px-3 py-1.5 z-20">
              {authorized && info ? (
                <div className="text-xs">
                  <span className="text-green-400 font-medium">{info.driver}</span>
                  <span className="text-gray-400 mx-2">·</span>
                  <span className="text-gray-300">{info.vehicle}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertTriangle size={10} />
                  <span>Номер не в базе — автоматический сигнал охране</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mini stats */}
        <div className="px-3 py-2 flex items-center gap-4 text-xs border-t border-gray-100">
          <span className={`flex items-center gap-1 font-medium ${authorized ? 'text-green-600' : 'text-red-500'}`}>
            {authorized ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
            {plate ? (authorized ? 'Доступ разрешён' : 'Доступ запрещён') : 'Нет данных'}
          </span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">
            Сегодня: {events.filter(e => e.cameraId === camNum && e.direction === 'entry').length} въезд / {events.filter(e => e.cameraId === camNum && e.direction === 'exit').length} выезд
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AppLayout title="АРН-камеры" subtitle="Автоматическое распознавание номеров — КПП №1">
        <p className="text-gray-400 text-sm">Загрузка...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="АРН-камеры" subtitle="Автоматическое распознавание номеров — КПП №1">
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>
      )}

      {/* 2 cameras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {renderFeed(1, 'Въезд КПП №1')}
        {renderFeed(2, 'Выезд КПП №1')}
      </div>

      {/* Log */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-gray-700 font-semibold text-sm">Журнал проезда</h3>
          <span className="text-gray-400 text-xs">{events.length} событий за сегодня</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-4 py-2.5 font-medium">Время</th>
                <th className="text-left px-4 py-2.5 font-medium">Камера</th>
                <th className="text-left px-4 py-2.5 font-medium">Номер</th>
                <th className="text-left px-4 py-2.5 font-medium">Водитель / ТС</th>
                <th className="text-left px-4 py-2.5 font-medium">Направление</th>
                <th className="text-left px-4 py-2.5 font-medium">Заказ</th>
                <th className="text-center px-4 py-2.5 font-medium">Доступ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map(e => {
                const info = plateInfo(e.plate);
                return (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-500 font-mono text-xs">
                      {new Date(e.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">CAM-0{e.cameraId}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono font-bold text-gray-800 text-xs">{e.plate}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {info
                        ? <span className="text-gray-600">{info.driver} · {info.vehicle}</span>
                        : <span className="text-red-500">Неизвестен</span>
                      }
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${e.direction === 'entry' ? 'text-blue-600' : 'text-gray-500'}`}>
                        {e.direction === 'entry' ? <ArrowDown size={11} /> : <ArrowUp size={11} />}
                        {e.direction === 'entry' ? 'Въезд' : 'Выезд'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs font-mono">{e.orderNo ?? '—'}</td>
                    <td className="px-4 py-2.5 text-center">
                      {e.isAuth
                        ? <span className="text-xs px-1.5 py-0.5 rounded border text-green-700 bg-green-50 border-green-200">Разрешён</span>
                        : <span className="text-xs px-1.5 py-0.5 rounded border text-red-700 bg-red-50 border-red-200">Отказано</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics — director / commercial only */}
      {isAnalyticsUser && stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Итого за сегодня</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Въездов',        value: stats.entries,    cls: '' },
                { label: 'Выездов',        value: stats.exits,      cls: '' },
                { label: 'Авторизованных', value: stats.authorized, cls: 'text-green-600 font-semibold' },
                { label: 'Отказов',        value: stats.denied,     cls: 'text-red-500 font-semibold' },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{r.label}</span>
                  <span className={r.cls || 'text-gray-800 font-semibold'}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-2">
            <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Активность транспорта</h4>
            <div className="space-y-2.5">
              {employees.filter(e => e.plate).map(e => {
                const trips = events.filter(ev => ev.plate === e.plate?.plate).length;
                const maxTrips = 3;
                return (
                  <div key={e.id} className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-gray-700 w-20 flex-shrink-0">{e.plate?.plate}</span>
                    <span className="text-gray-400 flex-1 truncate">{e.fullName} · {e.plate?.vehicle}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400 rounded-full"
                          style={{ width: `${Math.min((trips / maxTrips) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-500 w-12">{trips} рейс{trips === 1 ? '' : trips < 5 ? 'а' : 'ов'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
