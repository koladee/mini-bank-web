import React from 'react';
import type { Transaction } from '../types';
import { useAuth } from '../context/AuthContext';

export default function TxTable({ items }: { items: Transaction[] }) {
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-[#4287f5]">
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Currency</th>
            <th className="p-2">Reference</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((tx) => {
            const raw = (tx as any).amount;
            const amt = Number(raw);
            const amtStr = Number.isFinite(amt) ? amt.toFixed(2) : String(raw);

            const isTransfer = tx.type === 'transfer';
            const isDebit = isTransfer && user && tx.initiatorUserId === user.id;
            const isCredit = isTransfer && user && tx.initiatorUserId !== user.id;

            const amountDisplay = isTransfer
              ? `${isCredit ? '+' : '-'}${amtStr}`
              : amtStr;

            const amountClass = isCredit
              ? 'text-green-600'
              : isDebit
              ? 'text-red-600'
              : 'text-gray-800';

            const shortRef = tx.id.length > 10 ? `${tx.id.slice(0, 8)}…` : tx.id;

            return (
              <tr key={tx.id} className="border-t">
                <td className="p-2 capitalize">
                  {tx.type}
                </td>
                <td className={`p-2 font-medium ${amountClass}`}>
                  {amountDisplay}
                </td>
                <td className="p-2">{tx.baseCurrency}</td>
                <td className="p-2">
                  <code className="text-xs" title={tx.id}>{shortRef}</code>
                </td>
                <td className="p-2">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
