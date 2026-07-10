'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ChevronRight } from 'lucide-react';

interface SubItem { label: string; href: string; }
interface DividerItem { divider: true; label: string; }
type PanelItem = SubItem | DividerItem;

interface Module {
  id: string;
  label: string;
  matchPaths: string[];
  defaultHref: string;
  items: PanelItem[];
}

const MODULES: Module[] = [
  {
    id: 'main', label: 'Главное',
    matchPaths: ['/accounting/home'],
    defaultHref: '/accounting/home',
    items: [
      { label: 'Начальная страница', href: '/accounting/home' },
      { label: 'Задачи', href: '/accounting/home' },
      { label: 'Новости', href: '/accounting/home' },
    ],
  },
  {
    id: 'rukovoditel', label: 'Руководителю',
    matchPaths: ['/accounting/monitor'],
    defaultHref: '/accounting/monitor',
    items: [
      { label: 'Монитор основных показателей', href: '/accounting/monitor' },
      { label: 'Финансовый анализ', href: '/accounting/monitor' },
      { label: 'Монитор налогов и отчётности', href: '/accounting/tax-reports' },
      { divider: true, label: 'Продажи' },
      { label: 'Продажи по контрагентам', href: '/business/clients' },
      { label: 'Продажи по товарам', href: '/business/sales' },
      { divider: true, label: 'Денежные средства' },
      { label: 'Платёжный календарь', href: '/accounting/monitor' },
      { label: 'Движение денежных средств', href: '/finance/accounting' },
      { divider: true, label: 'Общие показатели' },
      { label: 'Доходы и расходы', href: '/accounting/monitor' },
      { label: 'Планирование', href: '/accounting/monitor' },
    ],
  },
  {
    id: 'bank', label: 'Банк и касса',
    matchPaths: ['/finance/accounting', '/finance/finances'],
    defaultHref: '/finance/accounting',
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
    id: 'sales', label: 'Продажи',
    matchPaths: ['/business/sales', '/business/clients', '/business/tenders'],
    defaultHref: '/business/sales',
    items: [
      { label: 'Заказы покупателей', href: '/business/sales' },
      { label: 'Клиенты', href: '/business/clients' },
      { label: 'Тендеры', href: '/business/tenders' },
      { divider: true, label: 'Создать' },
      { label: 'Счёт покупателю', href: '/business/sales' },
      { label: 'Реализация товаров', href: '/business/sales' },
    ],
  },
  {
    id: 'purchases', label: 'Покупки',
    matchPaths: ['/accounting/purchases'],
    defaultHref: '/accounting/purchases',
    items: [
      { label: 'Поступление товаров', href: '/accounting/purchases' },
      { label: 'Счета поставщиков', href: '/accounting/purchases' },
      { divider: true, label: 'Создать' },
      { label: 'Поступление (акт, накладная)', href: '/accounting/purchases' },
      { label: 'Возврат поставщику', href: '/accounting/purchases' },
      { label: 'Корректировка долга', href: '/accounting/purchases' },
    ],
  },
  {
    id: 'warehouse', label: 'Склад',
    matchPaths: ['/operations/warehouse'],
    defaultHref: '/operations/warehouse',
    items: [
      { label: 'Склад', href: '/operations/warehouse' },
      { label: 'Перемещение товаров', href: '/operations/warehouse' },
      { label: 'Инвентаризация товаров', href: '/operations/warehouse' },
      { label: 'Списание товаров', href: '/operations/warehouse' },
    ],
  },
  {
    id: 'production', label: 'Производство',
    matchPaths: ['/operations/factory', '/operations/quarry'],
    defaultHref: '/operations/factory',
    items: [
      { label: 'Производство (ДСК)', href: '/operations/factory' },
      { label: 'Карьер', href: '/operations/quarry' },
      { divider: true, label: 'Документы' },
      { label: 'Выпуск продукции', href: '/operations/factory' },
      { label: 'Затраты производства', href: '/accounting/monitor' },
    ],
  },
  {
    id: 'os', label: 'ОС и НМА',
    matchPaths: ['/operations/equipment'],
    defaultHref: '/operations/equipment',
    items: [
      { label: 'Основные средства', href: '/operations/equipment' },
      { label: 'Амортизация (авто)', href: '/accounting/monitor' },
      { divider: true, label: 'Создать' },
      { label: 'Принятие к учёту ОС', href: '/operations/equipment' },
      { label: 'Ликвидация ОС', href: '/operations/equipment' },
      { label: 'Перемещение ОС', href: '/operations/equipment' },
    ],
  },
  {
    id: 'salary', label: 'Зарплата и кадры',
    matchPaths: ['/finance/salaries', '/business/hr', '/documents'],
    defaultHref: '/finance/salaries',
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
    id: 'operations', label: 'Операции',
    matchPaths: ['/accounting/operations'],
    defaultHref: '/accounting/operations',
    items: [
      { label: 'Операции, введённые вручную', href: '/accounting/operations' },
      { label: 'Закрытие месяца', href: '/accounting/operations' },
      { divider: true, label: 'Прочее' },
      { label: 'Регламентные операции', href: '/accounting/operations' },
      { label: 'Типовые операции', href: '/accounting/operations' },
      { label: 'Исправительные проводки', href: '/accounting/operations' },
    ],
  },
  {
    id: 'reports', label: 'Отчёты',
    matchPaths: ['/finance/reports'],
    defaultHref: '/finance/reports',
    items: [
      { divider: true, label: 'Стандартные отчёты' },
      { label: 'Оборотно-сальдовая ведомость', href: '/finance/reports' },
      { label: 'ОСВ по счёту', href: '/finance/reports' },
      { label: 'Анализ счёта', href: '/finance/reports' },
      { label: 'Карточка счёта', href: '/finance/reports' },
      { label: 'Главная книга', href: '/finance/reports' },
      { divider: true, label: 'Налоговая отчётность' },
      { label: 'Налоговая отчётность (все)', href: '/accounting/tax-reports' },
      { label: 'НДС — Форма 300.00', href: '/accounting/tax-reports' },
      { label: 'КПН — Форма 100.00', href: '/accounting/tax-reports' },
      { label: 'ИПН и ОПВ — Форма 200.00', href: '/accounting/tax-reports' },
      { label: 'Социальный налог (СН)', href: '/accounting/tax-reports' },
      { divider: true, label: 'Анализ учёта' },
      { label: 'Анализ учёта по НДС', href: '/finance/reports' },
      { label: 'Проследяемость', href: '/finance/reports' },
      { divider: true, label: '1С-Отчётность' },
      { label: 'Регламентированные отчёты', href: '/accounting/tax-reports' },
    ],
  },
  {
    id: 'directories', label: 'Справочники',
    matchPaths: ['/accounting/directories'],
    defaultHref: '/accounting/directories',
    items: [
      { label: 'Организации', href: '/accounting/directories' },
      { label: 'Контрагенты', href: '/business/clients' },
      { label: 'Номенклатура', href: '/accounting/directories' },
      { label: 'Сотрудники', href: '/business/hr' },
      { label: 'Банковские счета', href: '/finance/accounting' },
      { label: 'Статьи доходов и расходов', href: '/accounting/directories' },
      { label: 'Валюты', href: '/accounting/directories' },
    ],
  },
  {
    id: 'tax', label: 'Налоги',
    matchPaths: ['/accounting/tax-reports'],
    defaultHref: '/accounting/tax-reports',
    items: [
      { label: 'Налоговая отчётность', href: '/accounting/tax-reports' },
      { divider: true, label: 'Декларации' },
      { label: 'НДС — Форма 300.00', href: '/accounting/tax-reports' },
      { label: 'КПН — Форма 100.00', href: '/accounting/tax-reports' },
      { label: 'ИПН и ОПВ — Форма 200.00', href: '/accounting/tax-reports' },
      { label: 'Социальный налог', href: '/accounting/tax-reports' },
      { label: 'ОПВ (пенсионные взносы)', href: '/accounting/tax-reports' },
      { divider: true, label: 'Сроки' },
      { label: 'Налоговый календарь', href: '/accounting/monitor' },
      { label: 'Монитор налогов', href: '/accounting/monitor' },
    ],
  },
  {
    id: 'admin', label: 'Администрирование',
    matchPaths: ['/settings', '/business/admin'],
    defaultHref: '/settings',
    items: [
      { label: 'Настройки программы', href: '/settings' },
      { label: 'Пользователи и права', href: '/business/admin' },
      { divider: true, label: 'Обслуживание' },
      { label: 'Резервное копирование', href: '/settings' },
      { label: 'Журнал регистрации', href: '/settings' },
      { label: 'Удаление помеченных', href: '/settings' },
    ],
  },
];

interface AccountingLayoutProps { children: React.ReactNode; }

export default function AccountingLayout({ children }: AccountingLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const detectModule = (path: string) => {
    for (const mod of MODULES) {
      if (mod.matchPaths.some(p => path === p || path.startsWith(p + '/'))) return mod.id;
    }
    if (path === '/accounting/home' || path.startsWith('/accounting/home')) return 'main';
    return 'main';
  };

  const [activeModule, setActiveModule] = useState(() => detectModule(pathname));

  useEffect(() => { setActiveModule(detectModule(pathname)); }, [pathname]);

  const handleLogout = async () => { await logout(); router.push('/login'); };

  const currentMod = MODULES.find(m => m.id === activeModule) ?? MODULES[0];

  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f0f0f0' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-1 flex-shrink-0"
        style={{ background: '#1b3a6b', minHeight: 32 }}>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm" style={{ color: '#f5821f' }}>1С</span>
          <span className="text-xs" style={{ color: '#c5d4e8' }}>
            :Бухгалтерия предприятия 3.0 —
          </span>
          <span className="text-xs font-semibold text-white">Vertex Plus KG</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: '#8ba5cc' }}>{dateStr}</span>
          <span className="text-xs font-medium text-white">{user?.name}</span>
          <button onClick={handleLogout}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: '#8ba5cc' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8ba5cc')}>
            <LogOut size={12} /> Выйти
          </button>
        </div>
      </div>

      {/* Module tabs */}
      <div className="flex flex-shrink-0 border-b overflow-x-auto" style={{ background: '#d4d0c8', borderColor: '#999' }}>
        {MODULES.map(mod => (
          <button key={mod.id}
            onClick={() => { setActiveModule(mod.id); router.push(mod.defaultHref); }}
            className="px-3 py-1.5 text-xs whitespace-nowrap border-r font-medium transition-colors"
            style={{
              borderColor: '#bbb',
              background: activeModule === mod.id ? '#fff' : 'transparent',
              color: activeModule === mod.id ? '#000' : '#333',
              borderBottom: activeModule === mod.id ? '2px solid #f5821f' : '2px solid transparent',
            }}>
            {mod.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="flex-shrink-0 overflow-y-auto border-r py-1"
          style={{ width: 220, background: '#fff', borderColor: '#ccc' }}>
          {currentMod.items.map((item, idx) => {
            if ('divider' in item && item.divider) {
              return (
                <div key={idx} className="px-3 pt-3 pb-0.5">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#999', fontSize: 10 }}>
                    {item.label}
                  </span>
                </div>
              );
            }
            const si = item as SubItem;
            const isActive = pathname === si.href ||
              (si.href !== '/accounting/home' && si.href.length > 1 && pathname.startsWith(si.href));
            return (
              <Link key={idx} href={si.href}
                className="flex items-center gap-1 px-3 py-1 text-xs transition-colors"
                style={{
                  color: isActive ? '#1b3a6b' : '#333',
                  background: isActive ? '#dde8f5' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive ? '3px solid #1b3a6b' : '3px solid transparent',
                }}>
                {isActive && <ChevronRight size={10} style={{ color: '#1b3a6b', flexShrink: 0 }} />}
                {si.label}
              </Link>
            );
          })}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4" style={{ background: '#f0f0f0' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
