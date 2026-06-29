'use client';

import { Bell, Search, Wifi } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 gap-4 flex-shrink-0">
      <div className="flex-1">
        <h1 className="text-white font-semibold text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Поиск..."
          className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 w-52 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-1 text-slate-500 text-xs">
        <Wifi size={12} className="text-green-400" />
        <span className="text-slate-400">{timeStr}</span>
        <span className="text-slate-600 mx-1">|</span>
        <span>{dateStr}</span>
      </div>

      <button className="relative w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500"></span>
      </button>
    </header>
  );
}
