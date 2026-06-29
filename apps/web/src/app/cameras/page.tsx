'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, CheckCircle2, ArrowDown, ArrowUp } from 'lucide-react';

const PLATES_DB: Record<string, { driver: string; vehicle: string }> = {
  'A 147 KG': { driver: 'Нурланов Е.',      vehicle: 'КамАЗ 6520'  },
  'B 234 KG': { driver: 'Жаксыбеков А.',   vehicle: 'КамАЗ 6520'  },
  'C 089 KG': { driver: 'Темиров К.',       vehicle: 'КамАЗ 65201' },
  'D 456 KG': { driver: 'Сатыбалдиев О.', vehicle: 'МАЗ 6501'    },
  'E 321 KG': { driver: 'Карибеков Д.',    vehicle: 'КамАЗ 55111' },
};

const LOG = [
  { id: 1,  time: '09:45', cam: 1, plate: 'C 089 KG', dir: 'entry', order: 'ОРД-2850', auth: true  },
  { id: 2,  time: '09:30', cam: 2, plate: 'A 147 KG', dir: 'exit',  order: 'ОРД-2848', auth: true  },
  { id: 3,  time: '09:10', cam: 1, plate: 'B 234 KG', dir: 'entry', order: 'ОРД-2849', auth: true  },
  { id: 4,  time: '08:55', cam: 1, plate: 'G 999 KG', dir: 'entry', order: '—',         auth: false },
  { id: 5,  time: '08:40', cam: 2, plate: 'D 456 KG', dir: 'exit',  order: 'ОРД-2847', auth: true  },
  { id: 6,  time: '08:20', cam: 1, plate: 'E 321 KG', dir: 'entry', order: 'ОРД-2846', auth: true  },
  { id: 7,  time: '07:55', cam: 2, plate: 'A 147 KG', dir: 'exit',  order: 'ОРД-2845', auth: true  },
  { id: 8,  time: '07:40', cam: 1, plate: 'C 089 KG', dir: 'entry', order: 'ОРД-2844', auth: true  },
  { id: 9,  time: '07:20', cam: 2, plate: 'B 234 KG', dir: 'exit',  order: 'ОРД-2843', auth: true  },
  { id: 10, time: '07:05', cam: 1, plate: 'H 777 KG', dir: 'entry', order: '—',         auth: false },
];

const CAM1_CYCLE = ['C 089 KG', 'A 147 KG', 'G 999 KG', 'B 234 KG'];
const CAM2_CYCLE = ['A 147 KG', 'D 456 KG', 'E 321 KG', 'B 234 KG'];

export default function CamerasPage() {
  const { user } = useAuth();
  const [cam1Idx, setCam1Idx] = useState(0);
  const [cam2Idx, setCam2Idx] = useState(0);
  const [displayTime, setDisplayTime] = useState('');

  const cam1Plate = CAM1_CYCLE[cam1Idx];
  const cam2Plate = CAM2_CYCLE[cam2Idx];

  useEffect(() => {
    const update = () => setDisplayTime(
      new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCam1Idx(i => (i + 1) % CAM1_CYCLE.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCam2Idx(i => (i + 1) % CAM2_CYCLE.length), 5500);
    return () => clearInterval(t);
  }, []);

  const isAnalyticsUser = user?.role === 'director' || user?.role === 'commercial_director';

  const renderFeed = (camNum: number, location: string, plate: string) => {
    const info = PLATES_DB[plate];
    const authorized = !!info;
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
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/65 px-3 py-1.5 z-20">
            {authorized ? (
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
        </div>

        {/* Mini stats */}
        <div className="px-3 py-2 flex items-center gap-4 text-xs border-t border-gray-100">
          <span className={`flex items-center gap-1 font-medium ${authorized ? 'text-green-600' : 'text-red-500'}`}>
            {authorized ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
            {authorized ? 'Доступ разрешён' : 'Доступ запрещён'}
          </span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Сегодня: {LOG.filter(l => l.cam === camNum && l.dir === 'entry').length} въезд / {LOG.filter(l => l.cam === camNum && l.dir === 'exit').length} выезд</span>
        </div>
      </div>
    );
  };

  return (
    <AppLayout title="АРН-камеры" subtitle="Автоматическое распознавание номеров — КПП №1">
      {/* 2 cameras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {renderFeed(1, 'Въезд КПП №1', cam1Plate)}
        {renderFeed(2, 'Выезд КПП №1', cam2Plate)}
      </div>

      {/* Log */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-gray-700 font-semibold text-sm">Журнал проезда</h3>
          <span className="text-gray-400 text-xs">{LOG.length} событий за сегодня</span>
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
              {LOG.map(l => {
                const info = PLATES_DB[l.plate];
                return (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-500 font-mono text-xs">{l.time}</td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">CAM-0{l.cam}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono font-bold text-gray-800 text-xs">{l.plate}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {info
                        ? <span className="text-gray-600">{info.driver} · {info.vehicle}</span>
                        : <span className="text-red-500">Неизвестен</span>
                      }
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${l.dir === 'entry' ? 'text-blue-600' : 'text-gray-500'}`}>
                        {l.dir === 'entry' ? <ArrowDown size={11} /> : <ArrowUp size={11} />}
                        {l.dir === 'entry' ? 'Въезд' : 'Выезд'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs font-mono">{l.order}</td>
                    <td className="px-4 py-2.5 text-center">
                      {l.auth
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
      {isAnalyticsUser && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Итого за сегодня</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Въездов',        value: LOG.filter(l => l.dir === 'entry').length, cls: '' },
                { label: 'Выездов',        value: LOG.filter(l => l.dir === 'exit').length,  cls: '' },
                { label: 'Авторизованных', value: LOG.filter(l => l.auth).length,            cls: 'text-green-600 font-semibold' },
                { label: 'Отказов',        value: LOG.filter(l => !l.auth).length,           cls: 'text-red-500 font-semibold' },
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
              {Object.entries(PLATES_DB).map(([plate, info]) => {
                const trips = LOG.filter(l => l.plate === plate).length;
                const maxTrips = 3;
                return (
                  <div key={plate} className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-gray-700 w-20 flex-shrink-0">{plate}</span>
                    <span className="text-gray-400 flex-1 truncate">{info.driver} · {info.vehicle}</span>
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
