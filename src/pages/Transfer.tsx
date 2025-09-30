import React from 'react';
import TransferForm from '../components/TransferForm';
import { useAccounts } from '../context/AccountsContext';

export default function Transfer() {
  const { refresh } = useAccounts();
  return (
    <div className="p-4">
      <div className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-semibold text-gray-800">Transfer</h1>
        <TransferForm onSuccess={async ()=>{ await refresh(); }} />
      </div>
    </div>
  );
}
