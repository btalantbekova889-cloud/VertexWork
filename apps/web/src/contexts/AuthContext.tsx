'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { apiFetch, ApiError } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

interface ApiUser {
  id: number;
  login: string;
  name: string;
  role: User['role'];
}

const AuthContext = createContext<AuthContextType | null>(null);

function toUser(apiUser: ApiUser): User {
  return { id: String(apiUser.id), name: apiUser.name, role: apiUser.role };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ user: ApiUser }>('/api/auth/me')
      .then(({ user }) => setUser(toUser(user)))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (loginValue: string, password: string) => {
    const { user } = await apiFetch<{ user: ApiUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login: loginValue, password }),
    });
    setUser(toUser(user));
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
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

export { ApiError };
