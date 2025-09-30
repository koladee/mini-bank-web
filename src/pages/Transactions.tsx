import React, { useEffect, useState } from 'react';
import { useTx } from '../context/TransactionsContext';
import TxTable from '../components/TxTable';
import Loading from '../components/Loading';

export default function Transactions() {
  const { list } = useTx();
  const [type, setType] = useState<string>('');
  const [page, setPage] = useState(1);
  const [resp, setResp] = useState<{items:any[], total:number, page:number, limit:number}>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>();

  const load = async () => {
    try {
      setLoading(true);
      setErr(undefined);
      const r = await list(type as any || undefined, page, 10);
      setResp(r);
    } catch (e: any) {
      setErr(e.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [type, page]);

  return (
    <div className="p-4">
      <div className="mx-auto max-w-5xl space-y-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Filter</label>
          <select
            className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-[#4287f5] focus:border-[#4287f5]"
            value={type}
            onChange={e=>setType(e.target.value)}
          >
            <option value="">All</option>
            <option value="transfer">Transfer</option>
            <option value="exchange">Exchange</option>
          </select>
        </div>

        {loading ? (
          <Loading label="Loading transactions…" />
        ) : err ? (
          <div className="text-sm text-red-600">{err}</div>
        ) : resp ? (
          <>
            <TxTable items={resp.items} />
            <div className="mt-3 flex items-center gap-2">
              <button
                className="rounded-md border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
                disabled={page<=1}
                onClick={()=>setPage(p=>p-1)}
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">Page {page}</span>
              <button
                className="rounded-md border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
                disabled={(resp.page*resp.limit)>=resp.total}
                onClick={()=>setPage(p=>p+1)}
              >
                Next
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
