'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_LABELS } from '@/types';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';

const ROLES: { role: UserRole; desc: string }[] = [
  { role: 'director', desc: 'Полный доступ ко всей системе' },
  { role: 'commercial_director', desc: 'Продажи, клиенты, цены' },
  { role: 'accountant', desc: 'Финансы, зарплаты, отчеты' },
  { role: 'hr', desc: 'Кадры, доступы, администрирование' },
  { role: 'quarry_manager', desc: 'Карьер, логистика, склад, охрана' },
  { role: 'dispatcher', desc: 'Назначение машин и рейсов' },
  { role: 'logistician', desc: 'Контроль доставки и GPS' },
  { role: 'weigher', desc: 'Весовая, накладные' },
  { role: 'warehouse_keeper', desc: 'Остатки, движение товаров' },
  { role: 'security', desc: 'Вход/выход, камеры, пропуска' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('director');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    login(selectedRole);
    router.push('/dashboard');
  };

  const roleInfo = ROLES.find(r => r.role === selectedRole)!;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xl leading-tight">VERTEX ERP</p>
              <p className="text-slate-400 text-sm">Система управления компанией</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">ERP · CRM · WMS · HRM</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white font-semibold text-xl mb-1">Вход в систему</h2>
          <p className="text-slate-400 text-sm mb-7">Выберите роль и войдите в аккаунт</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                Роль
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoles(!showRoles)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-slate-600 transition-colors focus:outline-none focus:border-cyan-500/50"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{ROLE_LABELS[selectedRole]}</p>
                    <p className="text-slate-500 text-xs">{roleInfo.desc}</p>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${showRoles ? 'rotate-180' : ''}`} />
                </button>

                {showRoles && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-xl max-h-72 overflow-y-auto">
                    {ROLES.map(({ role, desc }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => { setSelectedRole(role); setShowRoles(false); }}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 ${
                          selectedRole === role ? 'bg-slate-700/50' : ''
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          selectedRole === role ? 'bg-cyan-400' : 'bg-slate-600'
                        }`} />
                        <div>
                          <p className="text-white text-sm">{ROLE_LABELS[role]}</p>
                          <p className="text-slate-500 text-xs">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Login */}
            <div>
              <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                Логин
              </label>
              <input
                type="text"
                defaultValue="admin"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 mt-2"
            >
              {loading ? 'Вход...' : 'Войти в систему'}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-6">
            Демо-режим: любой пароль подойдет
          </p>
        </div>
      </div>
    </div>
  );
}
