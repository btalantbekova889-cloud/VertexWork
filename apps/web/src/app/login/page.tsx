'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_LABELS } from '@/types';
import { Eye, EyeOff, ChevronDown, Check } from 'lucide-react';

const ROLES: { role: UserRole; desc: string }[] = [
  { role: 'director', desc: 'Полный доступ — контроль всей компании' },
  { role: 'commercial_director', desc: 'Продажи, клиенты, цены, планы' },
  { role: 'accountant', desc: 'Финансы, зарплаты, налоги, отчёты' },
  { role: 'hr', desc: 'Кадры, доступы, настройки системы' },
  { role: 'quarry_manager', desc: 'Карьер, логистика, склад, охрана' },
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
    await new Promise(r => setTimeout(r, 500));
    login(selectedRole);
    router.push('/dashboard');
  };

  const roleInfo = ROLES.find(r => r.role === selectedRole)!;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-700 mb-4 shadow">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <h1 className="text-gray-900 font-bold text-2xl">VERTEX ERP</h1>
          <p className="text-gray-500 text-sm mt-1">Система управления компанией</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
          <h2 className="text-gray-800 font-semibold text-lg mb-1">Вход в систему</h2>
          <p className="text-gray-400 text-sm mb-5">Выберите вашу роль и введите пароль</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1.5">Роль</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoles(!showRoles)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{ROLE_LABELS[selectedRole]}</p>
                    <p className="text-gray-400 text-xs">{roleInfo.desc}</p>
                  </div>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${showRoles ? 'rotate-180' : ''}`} />
                </button>

                {showRoles && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg overflow-hidden z-50 shadow-lg">
                    {ROLES.map(({ role, desc }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => { setSelectedRole(role); setShowRoles(false); }}
                        className={`w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 ${selectedRole === role ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex-1">
                          <p className="text-gray-800 text-sm font-medium">{ROLE_LABELS[role]}</p>
                          <p className="text-gray-400 text-xs">{desc}</p>
                        </div>
                        {selectedRole === role && <Check size={14} className="text-blue-600 flex-shrink-0" />}
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
                defaultValue="admin"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm mt-1"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-4">Демо-режим: любой пароль</p>
        </div>
      </div>
    </div>
  );
}
