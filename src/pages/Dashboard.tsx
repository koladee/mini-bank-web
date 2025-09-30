import { useAccounts } from '../context/AccountsContext';
import BalanceCard from '../components/BalanceCard';
import TransferForm from '../components/TransferForm';
import ExchangeForm from '../components/ExchangeForm';
import { useTx } from '../context/TransactionsContext';
import React, { useEffect, useState } from 'react';
import TxTable from '../components/TxTable';
import Loading from '../components/Loading';

export default function Dashboard() {
  const { accounts, refresh } = useAccounts();
  const { exchange, list } = useTx();
  const [recent, setRecent] = useState<any[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [err, setErr] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        setLoadingRecent(true);
        setErr(undefined);
        const r = await list(undefined, 1, 5);
        setRecent(r.items);
      } catch (e: any) {
        setErr(e.message || 'Failed to load recent transactions');
      } finally {
        setLoadingRecent(false);
      }
    })();
  }, []);

  return (
    <div className="p-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map(a => (
            <div key={a.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <BalanceCard acc={a} />
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">Transfer</h2>
            <TransferForm onSuccess={async () => {
              await refresh();
              setLoadingRecent(true);
              try {
                const r = await list(undefined, 1, 5);
                setRecent(r.items);
              } finally {
                setLoadingRecent(false);
              }
            }}/>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">Exchange</h2>
            <ExchangeForm
              onSubmit={async (from, amount) => {
                const tx = await exchange(from, amount, crypto.randomUUID());
                await refresh();
                setLoadingRecent(true);
                const r = await list(undefined, 1, 5);
                setRecent(r.items);
                setLoadingRecent(false);
                // alert('Exchange complete');
                return tx;
              }}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Recent Transactions</h2>
          {loadingRecent ? (
            <Loading label="Loading recent transactions…" />
          ) : err ? (
            <div className="text-sm text-red-600">{err}</div>
          ) : (
            <TxTable items={recent} />
          )}
        </div>
      </div>
    </div>
  );
}
