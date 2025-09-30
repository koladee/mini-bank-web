import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  tx?: any;
};

export default function ReceiptModal({ open, onClose, tx }: Props) {
  if (!open || !tx) return null;
  const amt = Number(tx.amount);
  const meta = tx.meta || {};
  const isExchange = tx.type === 'exchange';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold text-gray-800">Transaction Receipt</h3>
        <div className="space-y-1 text-sm">
          <div><span className="text-gray-500">Reference:</span> <code title={tx.id}>{tx.id}</code></div>
          <div><span className="text-gray-500">Type:</span> <b className="capitalize">{tx.type}</b></div>
          <div><span className="text-gray-500">Amount:</span> {tx.baseCurrency} {Number.isFinite(amt) ? amt.toFixed(2) : String(tx.amount)}</div>
          {isExchange && (
            <>
              <div><span className="text-gray-500">Rate:</span> {meta.rate}</div>
              <div><span className="text-gray-500">To Currency:</span> {meta.toCurrency}</div>
              <div><span className="text-gray-500">Converted:</span> {meta.converted}</div>
            </>
          )}
          <div><span className="text-gray-500">Date:</span> {new Date(tx.createdAt || Date.now()).toLocaleString()}</div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded-md border px-3 py-1 hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
