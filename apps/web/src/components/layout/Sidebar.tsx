'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, DollarSign, Briefcase, Factory, Camera,
  FileText, BarChart3, Settings, ChevronDown, ChevronRight,
  BookOpen, PiggyBank, Receipt, FileBarChart2, ShoppingCart,
  Users, UserCog, Shield, Pickaxe, Truck, Scale, Warehouse,
  Wrench, Lock, LogOut, Building2
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
  roles?: UserRole[];
}

const NAV: NavItem[] = [
  {
    label: 'Дашборд',
    href: '/dashboard',
    icon: <LayoutDashboard size={18} />,
    roles: ['director'],
  },
  {
    label: 'Finance Core',
    icon: <DollarSign size={18} />,
    roles: ['director', 'accountant'],
    children: [
      { label: 'Бухгалтерия', href: '/finance/accounting', icon: <BookOpen size={16} /> },
      { label: 'Финансы', href: '/finance/finances', icon: <PiggyBank size={16} /> },
      { label: 'Зарплаты', href: '/finance/salaries', icon: <Receipt size={16} /> },
      { label: 'Отчеты', href: '/finance/reports', icon: <FileBarChart2 size={16} /> },
    ],
  },
  {
    label: 'Business Control',
    icon: <Briefcase size={18} />,
    roles: ['director', 'commercial_director', 'hr'],
    children: [
      { label: 'Продажи (CRM)', href: '/business/sales', icon: <ShoppingCart size={16} />, roles: ['director', 'commercial_director'] },
      { label: 'Клиенты', href: '/business/clients', icon: <Users size={16} />, roles: ['director', 'commercial_director'] },
      { label: 'HR', href: '/business/hr', icon: <UserCog size={16} />, roles: ['director', 'hr'] },
      { label: 'Администрирование', href: '/business/admin', icon: <Shield size={16} />, roles: ['director', 'hr'] },
    ],
  },
  {
    label: 'Operations Hub',
    icon: <Factory size={18} />,
    roles: ['director', 'quarry_manager', 'dispatcher', 'logistician', 'weigher', 'warehouse_keeper', 'security'],
    children: [
      { label: 'Карьер (добыча)', href: '/operations/quarry', icon: <Pickaxe size={16} />, roles: ['director', 'quarry_manager'] },
      { label: 'Диспетчерская', href: '/operations/dispatch', icon: <Building2 size={16} />, roles: ['director', 'quarry_manager', 'dispatcher'] },
      { label: 'Логистика', href: '/operations/logistics', icon: <Truck size={16} />, roles: ['director', 'quarry_manager', 'logistician'] },
      { label: 'Весовая', href: '/operations/weighing', icon: <Scale size={16} />, roles: ['director', 'quarry_manager', 'weigher'] },
      { label: 'Склад', href: '/operations/warehouse', icon: <Warehouse size={16} />, roles: ['director', 'quarry_manager', 'warehouse_keeper'] },
      { label: 'Техника', href: '/operations/equipment', icon: <Wrench size={16} />, roles: ['director', 'quarry_manager'] },
      { label: 'Охрана', href: '/operations/security', icon: <Lock size={16} />, roles: ['director', 'quarry_manager', 'security'] },
    ],
  },
  { label: 'Камеры', href: '/cameras', icon: <Camera size={18} />, roles: ['director', 'security', 'quarry_manager'] },
  { label: 'Документы', href: '/documents', icon: <FileText size={18} />, roles: ['director', 'accountant', 'commercial_director'] },
  { label: 'Аналитика', href: '/analytics', icon: <BarChart3 size={18} />, roles: ['director', 'accountant', 'commercial_director', 'quarry_manager'] },
  { label: 'Настройки', href: '/settings', icon: <Settings size={18} />, roles: ['director', 'hr'] },
];

function NavItemRow({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => {
    if (!item.children) return false;
    return item.children.some(c => c.href && pathname.startsWith(c.href));
  });

  const isActive = item.href ? pathname === item.href : false;
  const hasChildren = !!item.children?.length;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${open ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {open && (
          <div className="mt-0.5">
            {item.children!.map(child => (
              <NavItemRow key={child.href} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={`flex items-center gap-3 py-2 rounded-lg text-sm transition-colors
        ${isActive
          ? 'text-white bg-cyan-500/20 border border-cyan-500/30'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      style={{ paddingLeft: `${12 + depth * 16}px`, paddingRight: '12px' }}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const visibleNav = NAV.filter(item => {
    if (!item.roles || !user) return true;
    return item.roles.includes(user.role);
  }).map(item => ({
    ...item,
    children: item.children?.filter(child => {
      if (!child.roles || !user) return true;
      return child.roles.includes(user.role);
    }),
  }));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">VERTEX ERP</p>
            <p className="text-slate-500 text-xs">Управление компанией</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {visibleNav.map((item, i) => (
          <NavItemRow key={item.href ?? i} item={item} />
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{user?.name[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
            <p className="text-slate-500 text-xs truncate">{user?.role ? {
              director: 'Ген. директор',
              commercial_director: 'Комм. директор',
              accountant: 'Бухгалтер',
              hr: 'HR',
              quarry_manager: 'Нач. карьера',
              dispatcher: 'Диспетчер',
              logistician: 'Логист',
              weigher: 'Весовщик',
              warehouse_keeper: 'Кладовщик',
              security: 'Охрана',
            }[user.role] : ''}</p>
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
