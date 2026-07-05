'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, ApiError } from '@/contexts/AuthContext';
import { UserRole, ROLE_LABELS } from '@/types';
import { Eye, EyeOff, ChevronDown, Check } from 'lucide-react';

type RoleEntry = { role: UserRole; desc: string; login: string };

const ALL_ROLES: RoleEntry[] = [
  { role: 'director',            desc: 'Полный доступ — стратегическое управление',  login: 'director' },
  { role: 'coo',                 desc: 'Производство, карьер, ОТ и ПБ, логистика',   login: 'coo' },
  { role: 'commercial_director', desc: 'Продажи, клиенты, тендеры, маркетинг',       login: 'commercial' },
  { role: 'financial_director',  desc: 'Финансовый план, P&L, бюджет, налоги',       login: 'findirector' },
  { role: 'hr',                  desc: 'Кадры, посещаемость, доступы, найм',         login: 'hr' },
  { role: 'lawyer',              desc: 'Договоры, правовые вопросы',                 login: 'lawyer' },
  { role: 'it_specialist',       desc: 'ИТ-инфраструктура, системы, доступы',        login: 'it' },
  { role: 'marketer',            desc: 'Маркетинг, реклама, аналитика',              login: 'marketer' },
  { role: 'sales_manager',       desc: 'Работа с клиентами, заказы, CRM',            login: 'sales' },
  { role: 'logist',              desc: 'Транспортная логистика, отгрузки',           login: 'logist' },
  { role: 'tender_specialist',   desc: 'Государственные и коммерческие тендеры',     login: 'tender' },
  { role: 'operator',            desc: 'Диспетчер, ввод данных, телефония',          login: 'operator' },
  { role: 'accountant',          desc: 'Бухгалтерия, зарплаты, отчётность',          login: 'accountant' },
  { role: 'purchaser',           desc: 'Закупки материалов и оборудования',          login: 'zakup' },
  { role: 'smm_manager',         desc: 'Социальные сети, контент-план',              login: 'smm' },
  { role: 'content_marketer',    desc: 'Контент для маркетинга и рекламы',           login: 'content' },
  { role: 'office_admin',        desc: 'Делопроизводство, административная работа',  login: 'admin' },
  { role: 'production_director', desc: 'Завод (ДСК), оборудование, ОТ и ПБ',        login: 'proddirector' },
  { role: 'quarry_manager',      desc: 'Карьер, добыча, склад, охрана КПП',         login: 'quarry' },
  { role: 'logistics_head',      desc: 'Весовая, транспорт, диспетчерская',          login: 'loghead' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('director');
  const [loginValue, setLoginValue] = useState('director');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginValue, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось войти. Проверьте соединение с сервером.');
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = ALL_ROLES.find(r => r.role === selectedRole)!;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-900 mb-4">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <h1 className="text-gray-900 font-bold text-2xl tracking-tight">VERTEX ERP</h1>
          <p className="text-gray-500 text-sm mt-1">Система управления компанией</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-gray-800 font-semibold text-base mb-1">Вход в систему</h2>
          <p className="text-gray-400 text-sm mb-5">Выберите роль и введите пароль</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1.5">Роль</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoles(!showRoles)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                >
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{ROLE_LABELS[selectedRole]}</p>
                    <p className="text-gray-400 text-xs">{roleInfo.desc}</p>
                  </div>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${showRoles ? 'rotate-180' : ''}`} />
                </button>

                {showRoles && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg overflow-hidden z-50 shadow-lg max-h-80 overflow-y-auto">
                    {ALL_ROLES.map(({ role, desc }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role);
                          setLoginValue(ALL_ROLES.find(r => r.role === role)!.login);
                          setShowRoles(false);
                        }}
                        className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 border-b border-gray-100 last:border-0 ${selectedRole === role ? 'bg-gray-50' : ''}`}
                      >
                        <div className="flex-1">
                          <p className="text-gray-800 text-sm font-medium">{ROLE_LABELS[role]}</p>
                          <p className="text-gray-400 text-xs">{desc}</p>
                        </div>
                        {selectedRole === role && <Check size={14} className="text-gray-600 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Login */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1.5">Логин</label>
              <input
                type="text"
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors mt-1"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
