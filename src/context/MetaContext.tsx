import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { endpoints } from '../api/endpoints';
import { useAuth } from './AuthContext';

type MetaState = { rates?: { USD_EUR: number }; refresh: () => Promise<void> };
const Ctx = createContext<MetaState>({} as any);

export const MetaProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { token } = useAuth();
  const [rates, setRates] = useState<{USD_EUR: number} | undefined>();

  const refresh = async () => {
    if (!token) return;
    const r = await apiFetch<{USD_EUR:number}>(endpoints.meta.rates, {}, token);
    setRates(r);
  };

  useEffect(() => { refresh(); }, [token]);

  return <Ctx.Provider value={{ rates, refresh }}>{children}</Ctx.Provider>;
};

export const useMeta = () => useContext(Ctx);
