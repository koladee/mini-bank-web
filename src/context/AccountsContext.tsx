import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { Account } from '../types';
import { useAuth } from './AuthContext';

type AccountsState = {
  accounts: Account[];
  refresh: () => Promise<void>;
};

const Ctx = createContext<AccountsState>({} as any);

export const AccountsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);

  const refresh = async () => {
    if (!token) return;
    const list = await apiFetch<Account[]>(endpoints.accounts.list, {}, token);
    setAccounts(list);
  };

  useEffect(() => { refresh(); }, [token]);

  return <Ctx.Provider value={{ accounts, refresh }}>{children}</Ctx.Provider>;
};

export const useAccounts = () => useContext(Ctx);
