'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, DollarSign, Briefcase, Factory, Camera,
  FileText, BarChart3, Settings, ChevronDown, ChevronRight,
  BookOpen, PiggyBank, Receipt, FileBarChart2, ShoppingCart,
  Users, UserCog, Shield, Pickaxe, Truck, Scale, Warehouse,
  Wrench, AlertTriangle, LogOut, Building2, Megaphone,
  ScrollText, FlaskConical, HardHat
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_LABELS } from '@/types';
import { useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
  roles?: UserRole[];
}

const ALL: UserRole[] = ['director', 'coo', 'commercial_director', 'financial_director', 'accountant', 'hr', 'quarry_manager', 'marketer'];

const NAV: NavItem[] = [
  {
    label: 'Дашборд',
    href: '/dashboard',
    icon: <LayoutDashboard size={16} />,
    roles: ['director', 'coo'],
  },

  // ─── ФИНАНСЫ ───────────────────────────────────────────────
  {
    label: 'Финансы',
    icon: <DollarSign size={16} />,
    roles: ['director', 'coo', 'financial_director', 'accountant'],
    children: [
      { label: 'Бухгалтерия',        href: '/finance/accounting', icon: <BookOpen size={14} /> },
      { label: 'Финансовый план',     href: '/finance/finances',   icon: <PiggyBank size={14} /> },
      { label: 'Зарплаты',           href: '/finance/salaries',   icon: <Receipt size={14} /> },
      { label: 'Отчёты',             href: '/finance/reports',    icon: <FileBarChart2 size={14} /> },
    ],
  },

  // ─── КОММЕРЦИЯ ─────────────────────────────────────────────
  {
    label: 'Коммерция',
    icon: <Briefcase size={16} />,
    roles: ['director', 'commercial_director', 'marketer'],
    children: [
      { label: 'Заказы (CRM)',   href: '/business/sales',     icon: <ShoppingCart size={14} /> },
      { label: 'Клиенты',       href: '/business/clients',   icon: <Users size={14} /> },
      { label: 'Тендеры',       href: '/business/tenders',   icon: <ScrollText size={14} /> },
      { label: 'Маркетинг',     href: '/business/marketing', icon: <Megaphone size={14} /> },
    ],
  },

  // ─── ПЕРСОНАЛ ──────────────────────────────────────────────
  {
    label: 'Персонал (HR)',
    icon: <UserCog size={16} />,
    roles: ['director', 'hr'],
    children: [
      { label: 'Сотрудники',          href: '/business/hr',    icon: <Users size={14} /> },
      { label: 'Администрирование',   href: '/business/admin', icon: <Shield size={14} /> },
    ],
  },

  // ─── ПРОИЗВОДСТВО ──────────────────────────────────────────
  {
    label: 'Производство',
    icon: <Factory size={16} />,
    roles: ['director', 'coo', 'quarry_manager'],
    children: [
      { label: 'Карьер (добыча)',  href: '/operations/quarry',   icon: <Pickaxe size={14} /> },
      { label: 'Завод (ДСК)',      href: '/operations/factory',  icon: <Building2 size={14} /> },
      { label: 'Техника',          href: '/operations/equipment',icon: <Wrench size={14} /> },
      { label: 'Лаборатория ОКК', href: '/operations/lab',      icon: <FlaskConical size={14} /> },
      { label: 'ОТ и ПБ',         href: '/operations/safety',   icon: <HardHat size={14} /> },
    ],
  },

  // ─── ЛОГИСТИКА ─────────────────────────────────────────────
  {
    label: 'Логистика',
    icon: <Truck size={16} />,
    roles: ['director', 'coo', 'quarry_manager', 'commercial_director'],
    children: [
      { label: 'Диспетчерская', href: '/operations/dispatch',  icon: <Building2 size={14} /> },
      { label: 'Транспорт',     href: '/operations/logistics', icon: <Truck size={14} /> },
      { label: 'Весовая',       href: '/operations/weighing',  icon: <Scale size={14} /> },
      { label: 'Склад',         href: '/operations/warehouse', icon: <Warehouse size={14} /> },
      { label: 'Охрана КПП',    href: '/operations/security',  icon: <AlertTriangle size={14} /> },
    ],
  },

  // ─── STANDALONE ────────────────────────────────────────────
  {
    label: 'Камеры (АРН)',
    href: '/cameras',
    icon: <Camera size={16} />,
    roles: ['director', 'coo', 'quarry_manager', 'commercial_director'],
  },
  {
    label: 'Документы',
    href: '/documents',
    icon: <FileText size={16} />,
    roles: ['director', 'financial_director', 'accountant'],
  },
  {
    label: 'Аналитика',
    href: '/analytics',
    icon: <BarChart3 size={16} />,
    roles: ['director', 'coo', 'commercial_director', 'financial_director'],
  },
  {
    label: 'Настройки',
    href: '/settings',
    icon: <Settings size={16} />,
    roles: ['director', 'hr'],
  },
];

function NavRow({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => {
    if (!item.children) return false;
    return item.children.some(c => c.href && pathname.startsWith(c.href));
  });

  const isActive = item.href ? pathname === item.href : false;
  const isChildActive = item.children?.some(c => c.href && pathname.startsWith(c.href));

  if (item.children?.length) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-2.5 rounded-md text-sm transition-colors
            ${open || isChildActive ? 'text-white bg-white/15 font-medium' : 'text-blue-200 hover:text-white hover:bg-white/10'}`}
          style={{ padding: `7px 10px 7px ${10 + depth * 14}px` }}
        >
          <span className="flex-shrink-0 opacity-80">{item.icon}</span>
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown size={12} className="opacity-60" /> : <ChevronRight size={12} className="opacity-60" />}
        </button>
        {open && (
          <div className="mt-0.5">
            {item.children.map(child => (
              <NavRow key={child.href} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={`flex items-center gap-2.5 rounded-md text-sm transition-colors
        ${isActive
          ? 'text-white bg-white/20 font-medium border-l-2 border-blue-300'
          : 'text-blue-200 hover:text-white hover:bg-white/10'
        }`}
      style={{ padding: `7px 10px 7px ${10 + depth * 14}px` }}
    >
      <span className="flex-shrink-0 opacity-80">{item.icon}</span>
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
  });

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside className="w-60 flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #1a3254 100%)' }}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">VERTEX PLUS KG</p>
            <p className="text-blue-300 text-xs">Добывающая компания</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {visibleNav.map((item, i) => (
          <NavRow key={item.href ?? i} item={item} />
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{user?.name[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
            <p className="text-blue-300 text-xs truncate">{user?.role ? ROLE_LABELS[user.role] : ''}</p>
          </div>
          <button onClick={handleLogout} title="Выйти" className="text-blue-300 hover:text-red-300 transition-colors flex-shrink-0">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
