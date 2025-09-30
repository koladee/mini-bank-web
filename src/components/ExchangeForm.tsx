import React, { useMemo, useState } from 'react';
import { useMeta } from '../context/MetaContext';
import ReceiptModal from './ReceiptModal';

const isValidMoney = (s: string) => /^(\d+(\.\d{0,2})?)?$/.test(s);

export default function ExchangeForm({ onSubmit }: { onSubmit: (from:'USD'|'EUR', amount:number)=>Promise<void> }) {
  const [from, setFrom] = useState<'USD'|'EUR'>('USD');
  const [amount, setAmount] = useState<string>(''); // string for UX
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTx, setReceiptTx] = useState<any>();
  const { rates } = useMeta();
  const rate = rates?.USD_EUR ?? 0.92;

  const numAmount = amount === '' ? NaN : Number(amount);

  const preview = useMemo(() => {
    if (!rate || !Number.isFinite(numAmount) || numAmount <= 0) return '-';
    if (from === 'USD') return `${(numAmount * rate).toFixed(2)} EUR`;
    return `${(numAmount / rate).toFixed(2)} USD`;
  }, [from, numAmount, rate]);

  const onAmountChange = (v: string) => {
    if (isValidMoney(v)) setAmount(v);
  };

  return (
    <>
    <form
      onSubmit={async (e)=> {
        e.preventDefault();
        if (!Number.isFinite(numAmount) || numAmount <= 0) return;

        const msg = from === 'USD'
          ? `Confirm exchange of USD ${numAmount.toFixed(2)} to EUR at rate ${rate}?`
          : `Confirm exchange of EUR ${numAmount.toFixed(2)} to USD at rate ${rate}?`;
        if (!window.confirm(msg)) return;
        const tx = await onSubmit(from, numAmount);
        setAmount('');            
        setFrom('USD');
        setShowReceipt(true);
        setReceiptTx(tx);
      }}
      className="space-y-2"
    >
      <div className="flex gap-2">
        <select
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-[#4287f5] focus:border-[#4287f5]"
          value={from}
          onChange={e=>setFrom(e.target.value as any)}
        >
          <option>USD</option><option>EUR</option>
        </select>
        <input
          className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-[#4287f5] focus:border-[#4287f5]"
          inputMode="decimal"
          placeholder="Amount"
          value={amount}
          onChange={e=>onAmountChange(e.target.value)}
          onKeyDown={(e) => {
            if (['e','E','+','-'].includes(e.key)) e.preventDefault();
          }}
          required
        />
      </div>
      <div className="text-sm text-gray-600">
        Converted preview: <b>{preview}</b> <span className="text-gray-400">(rate {rate})</span>
      </div>
      <button className="mt-17 w-full rounded-md bg-[#4287f5] px-4 py-2 font-medium text-white shadow hover:bg-[#3270d1]">
        Exchange
      </button>
    </form>
    <ReceiptModal open={showReceipt} onClose={()=>setShowReceipt(false)} tx={receiptTx} />
    </>
  );
}
