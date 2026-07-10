'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ChevronRight } from 'lucide-react';

interface SubItem {
  label: string;
  href: string;
  divider?: false;
}

interface DividerItem {
  divider: true;
  label: string;
}

type PanelItem = SubItem | DividerItem;

interface Module {
  id: string;
  label: string;
  matchPaths: string[];
  items: PanelItem[];
}

const MODULES: Module[] = [
  {
    id: 'main',
    label: 'Главное',
    matchPaths: ['/accounting/home', '/accounting'],
    items: [
      { label: 'Начальная страница', href: '/accounting/home' },
      { label: 'Задачи', href: '/accounting/home' },
      { label: 'Новости', href: '/accounting/home' },
    ],
  },
  {
    id: 'rukovoditel',
    label: 'Руководителю',
    matchPaths: ['/accounting/monitor', '/accounting/analysis'],
    items: [
      { label: 'Монитор основных показателей', href: '/accounting/home' },
      { label: 'Финансовый анализ', href: '/accounting/home' },
      { label: 'Монитор налогов и отчётности', href: '/accounting/home' },
      { divider: true, label: 'Продажи' },
      { label: 'Продажи по контрагентам', href: '/accounting/home' },
      { label: 'Продажи по товарам', href: '/accounting/home' },
      { divider: true, label: 'Денежные средства' },
      { label: 'Платёжный календарь', href: '/accounting/home' },
      { label: 'Движение денежных средств', href: '/accounting/home' },
      { divider: true, label: 'Общие показатели' },
      { label: 'Доходы и расходы', href: '/accounting/home' },
      { label: 'Планирование', href: '/accounting/home' },
    ],
  },
  {
    id: 'bank',
    label: 'Банк и касса',
    matchPaths: ['/finance/accounting', '/finance/finances'],
    items: [
      { label: 'Банковские выписки', href: '/finance/accounting' },
      { label: 'Кассовые операции', href: '/finance/accounting' },
      { divider: true, label: 'Создать' },
      { label: 'Платёжное поручение', href: '/finance/accounting' },
      { label: 'Поступление на р/с', href: '/finance/accounting' },
      { label: 'Авансовый отчёт', href: '/finance/accounting' },
      { divider: true, label: 'Прочее' },
      { label: 'Финансовый план', href: '/finance/finances' },
    ],
  },
  {
    id: 'sales',
    label: 'Продажи',
    matchPaths: ['/business/sales', '/business/clients'],
    items: [
      { label: 'Заказы покупателей', href: '/business/sales' },
      { label: 'Клиенты', href: '/business/clients' },
      { divider: true, label: 'Создать' },
      { label: 'Счёт покупателю', href: '/business/sales' },
      { label: 'Реализация', href: '/business/sales' },
    ],
  },
  {
    id: 'purchases',
    label: 'Покупки',
    matchPaths: ['/accounting/purchases'],
    items: [
      { label: 'Поступление товаров', href: '/accounting/home' },
      { label: 'Счета поставщиков', href: '/accounting/home' },
      { divider: true, label: 'Создать' },
      { label: 'Поступление (акт, накладная)', href: '/accounting/home' },
      { label: 'Возврат поставщику', href: '/accounting/home' },
    ],
  },
  {
    id: 'warehouse',
    label: 'Склад',
    matchPaths: ['/operations/warehouse'],
    items: [
      { label: 'Склад', href: '/operations/warehouse' },
      { label: 'Перемещение товаров', href: '/operations/warehouse' },
      { label: 'Инвентаризация товаров', href: '/operations/warehouse' },
    ],
  },
  {
    id: 'production',
    label: 'Производство',
    matchPaths: ['/operations/quarry', '/operations/factory'],
    items: [
      { label: 'Производство (ДСК)', href: '/operations/factory' },
      { label: 'Карьер', href: '/operations/quarry' },
      { divider: true, label: 'Документы' },
      { label: 'Выпуск продукции', href: '/accounting/home' },
      { label: 'Затраты на производство', href: '/accounting/home' },
    ],
  },
  {
    id: 'os',
    label: 'ОС и НМА',
    matchPaths: ['/operations/equipment'],
    items: [
      { label: 'Основные средства', href: '/operations/equipment' },
      { label: 'Амортизация', href: '/accounting/home' },
      { divider: true, label: 'Создать' },
      { label: 'Принятие к учёту ОС', href: '/accounting/home' },
      { label: 'Ликвидация ОС', href: '/accounting/home' },
    ],
  },
  {
    id: 'salary',
    label: 'Зарплата и кадры',
    matchPaths: ['/finance/salaries', '/business/hr'],
    items: [
      { label: 'Зарплата', href: '/finance/salaries' },
      { divider: true, label: 'Кадровый учёт' },
      { label: 'Сотрудники', href: '/business/hr' },
      { label: 'Кадровые документы', href: '/documents' },
      { divider: true, label: 'Отчёты' },
      { label: 'Расчётные листки', href: '/finance/salaries' },
      { label: 'Анализ зарплаты', href: '/finance/salaries' },
    ],
  },
  {
    id: 'operations',
    label: 'Операции',
    matchPaths: ['/accounting/operations'],
    items: [
      { label: 'Операции, введённые вручную', href: '/accounting/home' },
      { label: 'Закрытие месяца', href: '/accounting/home' },
      { divider: true, label: 'Прочее' },
      { label: 'Регламентные операции', href: '/accounting/home' },
      { label: 'Типовые операции', href: '/accounting/home' },
    ],
  },
  {
    id: 'reports',
    label: 'Отчёты',
    matchPaths: ['/finance/reports'],
    items: [
      { divider: true, label: 'Стандартные отчёты' },
      { label: 'Оборотно-сальдовая ведомость', href: '/finance/reports' },
      { label: 'ОСВ по счёту', href: '/finance/reports' },
      { label: 'Анализ счёта', href: '/finance/reports' },
      { label: 'Карточка счёта', href: '/finance/reports' },
      { label: 'Главная книга', href: '/finance/reports' },
      { divider: true, label: 'Анализ учёта' },
      { label: 'Анализ учёта по НДС', href: '/finance/reports' },
      { label: 'Проследяемость', href: '/finance/reports' },
      { divider: true, label: '1С-Отчётность' },
      { label: 'Регламентированные отчёты', href: '/finance/reports' },
    ],
  },
  {
    id: 'directories',
    label: 'Справочники',
    matchPaths: ['/accounting/directories'],
    items: [
      { label: 'Организации', href: '/accounting/home' },
      { label: 'Контрагенты', href: '/business/clients' },
      { label: 'Номенклатура', href: '/accounting/home' },
      { label: 'Сотрудники', href: '/business/hr' },
      { label: 'Банковские счета', href: '/finance/accounting' },
      { label: 'Статьи доходов и расходов', href: '/accounting/home' },
    ],
  },
  {
    id: 'admin',
    label: 'Администрирование',
    matchPaths: ['/settings', '/business/admin'],
    items: [
      { label: 'Настройки программы', href: '/settings' },
      { label: 'Пользователи и права', href: '/business/admin' },
      { divider: true, label: 'Обслуживание' },
      { label: 'Резервное копирование', href: '/accounting/home' },
      { label: 'Журнал регистрации', href: '/accounting/home' },
    ],
  },
];

interface AccountingLayoutProps {
  children: React.ReactNode;
}

export default function AccountingLayout({ children }: AccountingLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const detectModule = () => {
    for (const mod of MODULES) {
      if (mod.matchPaths.some(p => pathname.startsWith(p))) return mod.id;
    }
    return 'main';
  };

  const [activeModule, setActiveModule] = useState(detectModule);

  useEffect(() => {
    setActiveModule(detectModule());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const currentMod = MODULES.find(m => m.id === activeModule) ?? MODULES[0];

  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f0f0f0' }}>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-1 flex-shrink-0"
        style={{ background: '#1b3a6b', minHeight: 32 }}>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm" style={{ color: '#f5821f' }}>1С</span>
          <span className="text-xs" style={{ color: '#c5d4e8' }}>
            :Бухгалтерия предприятия 3.0 — <span className="font-medium text-white">Vertex Plus KG</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: '#8ba5cc' }}>{dateStr}</span>
          <span className="text-xs font-medium text-white">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: '#8ba5cc' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8ba5cc')}
          >
            <LogOut size={12} /> Выйти
          </button>
        </div>
      </div>

      {/* ── Module tabs ──────────────────────────────────────────────────── */}
      <div className="flex flex-shrink-0 overflow-x-auto border-b"
        style={{ background: '#d4d0c8', borderColor: '#999' }}>
        {MODULES.map(mod => (
          <button
            key={mod.id}
            onClick={() => {
              setActiveModule(mod.id);
              const first = mod.items.find((i): i is SubItem => !('divider' in i));
              if (first) router.push(first.href);
            }}
            className="px-3 py-1.5 text-xs whitespace-nowrap border-r transition-colors font-medium"
            style={{
              borderColor: '#bbb',
              background: activeModule === mod.id ? '#fff' : 'transparent',
              color: activeModule === mod.id ? '#000' : '#333',
              borderBottom: activeModule === mod.id ? '2px solid #f5821f' : '2px solid transparent',
            }}
          >
            {mod.label}
          </button>
        ))}
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        <div className="flex-shrink-0 overflow-y-auto border-r"
          style={{ width: 220, background: '#fff', borderColor: '#ccc' }}>
          <div className="py-1">
            {currentMod.items.map((item, idx) => {
              if ('divider' in item && item.divider) {
                return (
                  <div key={idx} className="px-3 pt-3 pb-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#999' }}>
                      {item.label}
                    </span>
                  </div>
                );
              }
              const si = item as SubItem;
              const isActive = pathname === si.href || (si.href !== '/accounting/home' && pathname.startsWith(si.href));
              return (
                <Link
                  key={idx}
                  href={si.href}
                  className="flex items-center gap-1 px-3 py-1 text-xs transition-colors"
                  style={{
                    color: isActive ? '#1b3a6b' : '#333',
                    background: isActive ? '#dde8f5' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    borderLeft: isActive ? '3px solid #1b3a6b' : '3px solid transparent',
                  }}
                >
                  {isActive && <ChevronRight size={10} className="flex-shrink-0" style={{ color: '#1b3a6b' }} />}
                  {si.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4" style={{ background: '#f0f0f0' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
