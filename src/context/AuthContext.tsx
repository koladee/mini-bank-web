import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { User } from '../types';

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthState>({} as any);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser]   = useState<User|null>(null);
  const [token, setToken] = useState<string|null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (token) {
          const me = await apiFetch<User>(endpoints.auth.me, {}, token);
          setUser(me);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<{accessToken: string}>(endpoints.auth.login, {
      method: 'POST', body: JSON.stringify({ email, password })
    });
    setToken(res.accessToken);
    localStorage.setItem('token', res.accessToken);
    const me = await apiFetch<User>(endpoints.auth.me, {}, res.accessToken);
    setUser(me);
  };

  const register = async (email: string, password: string) => {
    const res = await apiFetch<{accessToken: string}>(endpoints.auth.register, {
      method: 'POST', body: JSON.stringify({ email, password })
    });
    setToken(res.accessToken);
    localStorage.setItem('token', res.accessToken);
    const me = await apiFetch<User>(endpoints.auth.me, {}, res.accessToken);
    setUser(me);
  };

  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('token');
  };

  return <Ctx.Provider value={{ user, token, loading, login, register, logout }}>
    {children}
  </Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
