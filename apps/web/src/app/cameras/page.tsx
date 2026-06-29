'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Camera, Maximize2, WifiOff, Wifi } from 'lucide-react';

const CAMERAS = [
  { id: 'CAM-01', name: 'Въезд на карьер', location: 'КПП №1', status: 'online', recording: true },
  { id: 'CAM-02', name: 'Весовая площадка', location: 'Весовая', status: 'online', recording: true },
  { id: 'CAM-03', name: 'Карьер — блок А', location: 'Карьер №1', status: 'online', recording: true },
  { id: 'CAM-04', name: 'Карьер — блок Б', location: 'Карьер №1', status: 'online', recording: true },
  { id: 'CAM-05', name: 'Склад материалов', location: 'Склад А', status: 'offline', recording: false },
  { id: 'CAM-06', name: 'Парковка техники', location: 'База техники', status: 'online', recording: true },
  { id: 'CAM-07', name: 'Офис — коридор', location: 'Офис', status: 'online', recording: true },
  { id: 'CAM-08', name: 'Периметр север', location: 'Забор', status: 'online', recording: true },
];

export default function CamerasPage() {
  return (
    <AppLayout title="Камеры" subtitle="Видеонаблюдение в режиме реального времени">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {CAMERAS.filter(c => c.status === 'online').length} онлайн
          </span>
          {CAMERAS.some(c => c.status === 'offline') && (
            <span className="flex items-center gap-1.5 text-xs text-red-400">
              <WifiOff size={12} />
              {CAMERAS.filter(c => c.status === 'offline').length} недоступно
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
            2×2
          </button>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            4×2
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CAMERAS.map(cam => (
          <div key={cam.id} className={`rounded-xl border overflow-hidden group cursor-pointer ${
            cam.status === 'offline' ? 'border-red-500/20' : 'border-slate-800 hover:border-slate-600'
          } transition-colors`}>
            {/* Camera view */}
            <div className="aspect-video bg-slate-900 relative">
              {cam.status === 'online' ? (
                <>
                  {/* Simulated camera view */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(6,182,212,0.15) 0%, transparent 60%)`
                    }} />
                    {/* Scanlines effect */}
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                    }} />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-green-400 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      REC
                    </div>
                    <div className="absolute top-2 right-2 text-slate-500 text-xs font-mono">
                      {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <Maximize2 size={24} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <WifiOff size={24} className="text-red-400" />
                  <p className="text-red-400 text-xs">Нет сигнала</p>
                </div>
              )}
            </div>

            {/* Camera info */}
            <div className="p-3 bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-xs font-medium leading-tight">{cam.name}</p>
                  <p className="text-slate-500 text-xs">{cam.location} · {cam.id}</p>
                </div>
                {cam.status === 'online' ? (
                  <Wifi size={12} className="text-green-400 flex-shrink-0" />
                ) : (
                  <WifiOff size={12} className="text-red-400 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
