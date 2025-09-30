import type { Account } from '../types';

export default function BalanceCard({ acc }: { acc: Account }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <div className="text-sm text-gray-500">{acc.currency} Wallet</div>
      <div className="text-2xl font-semibold mt-1 text-[#4287f5]">
        {acc.currency} {Number(acc.balance).toFixed(2)}
      </div>
    </div>
  );
}
