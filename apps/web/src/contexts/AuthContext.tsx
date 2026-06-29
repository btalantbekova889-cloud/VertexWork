'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ROLE_LABELS } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<UserRole, User> = {
  director: { id: '1', name: 'Асылбек Марупов', role: 'director' },
  commercial_director: { id: '2', name: 'Айгуль Касымова', role: 'commercial_director' },
  accountant: { id: '3', name: 'Нурия Жакупова', role: 'accountant' },
  hr: { id: '4', name: 'Дамир Сейтов', role: 'hr' },
  quarry_manager: { id: '5', name: 'Болат Ержанов', role: 'quarry_manager' },
  dispatcher: { id: '6', name: 'Рустам Ахметов', role: 'dispatcher' },
  logistician: { id: '7', name: 'Сания Бекова', role: 'logistician' },
  weigher: { id: '8', name: 'Марат Дюсупов', role: 'weigher' },
  warehouse_keeper: { id: '9', name: 'Алия Нурланова', role: 'warehouse_keeper' },
  security: { id: '10', name: 'Серик Байжанов', role: 'security' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('vertex_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = (role: UserRole) => {
    const u = MOCK_USERS[role];
    setUser(u);
    localStorage.setItem('vertex_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vertex_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
