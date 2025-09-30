import React, { createContext, useContext, useState } from 'react';
import { apiFetch } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { Transaction, TxType } from '../types';
import { useAuth } from './AuthContext';

type TxState = {
  list: (type?: TxType, page?: number, limit?: number) => Promise<{items:Transaction[], total:number, page:number, limit:number}>;
  transfer: (recipientUserId: string, currency: 'USD'|'EUR', amount: number, idempotencyKey?: string) => Promise<Transaction>;
  exchange: (fromCurrency: 'USD'|'EUR', amount: number, idempotencyKey?: string) => Promise<Transaction>;
};

const Ctx = createContext<TxState>({} as any);

export const TransactionsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { token } = useAuth();

  const list = async (type?: TxType, page=1, limit=10) =>
    apiFetch<{items:Transaction[], total:number, page:number, limit:number}>(endpoints.tx.list(type, page, limit), {}, token!);

  const transfer = async (recipientUserId: string, currency: 'USD'|'EUR', amount: number, idempotencyKey?: string) =>
    apiFetch<Transaction>(endpoints.tx.transfer, { method: 'POST', body: JSON.stringify({ recipientUserId, currency, amount, idempotencyKey }) }, token!);

  const exchange = async (fromCurrency: 'USD'|'EUR', amount: number, idempotencyKey?: string) =>
    apiFetch<Transaction>(endpoints.tx.exchange, { method: 'POST', body: JSON.stringify({ fromCurrency, amount, idempotencyKey }) }, token!);

  return <Ctx.Provider value={{ list, transfer, exchange }}>{children}</Ctx.Provider>;
};

export const useTx = () => useContext(Ctx);
