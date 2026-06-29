'use client';

import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0 shadow-sm">
      <div className="flex-1">
        <h1 className="text-gray-800 font-semibold text-base leading-tight">{title}</h1>
        {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск..."
          className="bg-gray-50 border border-gray-200 rounded-md pl-8 pr-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 w-48 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
        />
      </div>

      <span className="text-gray-400 text-xs hidden lg:block">{dateStr}</span>

      <button className="relative w-8 h-8 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors">
        <Bell size={15} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500"></span>
      </button>
    </header>
  );
}
