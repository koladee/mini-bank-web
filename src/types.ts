export type Currency = 'USD' | 'EUR';
export type TxType = 'transfer' | 'exchange';

export interface User { id: string; email: string; role: 'user'|'admin'; }
export interface Account { id: string; currency: Currency; balance: number; }
export interface Transaction {
  id: string; type: TxType; status: 'committed'|'failed';
  initiatorUserId: string; baseCurrency: Currency; amount: number;
  meta?: any; createdAt: string;
}
