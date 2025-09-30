import React, { useEffect, useMemo, useState } from 'react';
import { useTx } from '../context/TransactionsContext';
import { apiFetch } from '../api/client';
import { endpoints } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { useAccounts } from '../context/AccountsContext';
import ReceiptModal from './ReceiptModal';

type Recipient = { id: string; email: string; role: 'user'|'admin' };

const isValidMoney = (s: string) => /^(\d+(\.\d{0,2})?)?$/.test(s);

export default function TransferForm({ onSuccess }: { onSuccess?: () => Promise<void> | void }) {
  const { transfer } = useTx();
  const { token, user } = useAuth();
  const { accounts, refresh: refreshAccounts } = useAccounts();

  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [recipientUserId, setRecipientUserId] = useState(''); 
  const [currency, setCurrency] = useState<'USD'|'EUR'>('USD');
  const [amount, setAmount] = useState<string>(''); // string for UX
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [err, setErr] = useState<string|undefined>();
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTx, setReceiptTx] = useState<any>();

  const currentBalance = useMemo(() => {
    const acc = accounts.find(a => a.currency === currency);
    const val = acc ? Number(acc.balance as any) : NaN;
    return Number.isFinite(val) ? val : undefined;
  }, [accounts, currency]);

  const amountNumber = amount === '' ? NaN : Number(amount);
  const overLimit = useMemo(() => {
    if (currentBalance === undefined) return false;
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) return false;
    return amountNumber > currentBalance;
  }, [amountNumber, currentBalance]);

  useEffect(() => {
    (async () => {
      if (!token) return;
      setLoadingUsers(true);
      try {
        const items = await apiFetch<Recipient[]>(endpoints.users.list(), {}, token);
        setRecipients(items);
      } catch (e:any) { setErr(e.message); }
      finally { setLoadingUsers(false); }
    })();
  }, [token]);

  const onAmountChange = (v: string) => {
    if (isValidMoney(v)) setAmount(v);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(undefined);

    const n = Number(amount);
    if (!recipientUserId) return setErr('Please select a recipient');
    if (!amount || !Number.isFinite(n) || n <= 0) return setErr('Enter a valid positive amount');
    if (overLimit) return setErr('Amount exceeds your available balance');

    const recipEmail = recipients.find(r=>r.id===recipientUserId)?.email || 'recipient';
    const ok = window.confirm(`Confirm transfer of ${currency} ${n.toFixed(2)} to ${recipEmail}?`);
    if (!ok) return;

    setLoading(true);
    try {
      const tx = await transfer(recipientUserId, currency, n, crypto.randomUUID());
      await refreshAccounts();
      setAmount('');
      setRecipientUserId(''); 
      if (onSuccess) await onSuccess();
      // alert('Transfer successful');
      setReceiptTx(tx);
      setShowReceipt(true);
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <>
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600">Recipient</label>
        <select
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-[#4287f5] focus:border-[#4287f5]"
          value={recipientUserId}
          onChange={e=>setRecipientUserId(e.target.value)}
          disabled={loadingUsers}
          required
        >
          <option value="">Select Recipient</option>
          {recipients.map(r => (
            <option key={r.id} value={r.id}>
              {r.email}{user?.id===r.id ? ' (you)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <div className="w-28">
          <label className="block text-sm text-gray-600">Currency</label>
          <select
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-[#4287f5] focus:border-[#4287f5]"
            value={currency}
            onChange={e=>setCurrency(e.target.value as any)}
          >
            <option>USD</option><option>EUR</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm text-gray-600">
            Amount {currentBalance !== undefined && (
              <span className="text-gray-400">• Balance: {currency} {currentBalance.toFixed(2)}</span>
            )}
          </label>
          <input
            className={`w-full rounded-md border p-2 focus:outline-none focus:ring-1
              ${overLimit ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-[#4287f5] focus:border-[#4287f5]'}`}
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={e=>onAmountChange(e.target.value)}
            onKeyDown={(e) => { if (['e','E','+','-'].includes(e.key)) e.preventDefault(); }}
            required
          />
          {overLimit && currentBalance !== undefined && (
            <p className="mt-1 text-xs text-red-600">
              You can&apos;t transfer more than {currency} {currentBalance.toFixed(2)}.
            </p>
          )}
        </div>
      </div>

      {err && <div className="text-sm text-red-600">{err}</div>}

      <button
        className="w-full rounded-md bg-[#4287f5] px-4 py-2 font-medium text-white shadow hover:bg-[#3270d1] disabled:opacity-50"
        disabled={loading || !recipientUserId || overLimit}
      >
        {loading ? 'Transferring…' : 'Transfer'}
      </button>
    </form>
    <ReceiptModal open={showReceipt} onClose={()=>setShowReceipt(false)} tx={receiptTx} />
    </>
  );
}
