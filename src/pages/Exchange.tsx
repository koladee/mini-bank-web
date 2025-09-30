import React from 'react';
import ExchangeForm from '../components/ExchangeForm';
import { useAccounts } from '../context/AccountsContext';
import { useTx } from '../context/TransactionsContext';

export default function Exchange() {
  const { refresh } = useAccounts();
  const { exchange } = useTx();

  return (
    <div className="p-4">
      <div className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-semibold text-gray-800">Exchange</h1>
        <ExchangeForm
          onSubmit={async (from, amount) => {
            await exchange(from, amount, crypto.randomUUID());
            await refresh();
            alert('Exchange complete');
          }}
        />
      </div>
    </div>
  );
}
