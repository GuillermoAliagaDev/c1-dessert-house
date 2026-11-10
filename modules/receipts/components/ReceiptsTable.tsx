"use client";

import { useMemo, useState } from "react";
import type { Receipt, ReceiptStatus } from "../types/receiptTypes";

const STATUS_STYLE: Record<ReceiptStatus, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  pagado: "bg-green-100 text-green-700",
  entregado: "bg-sky-100 text-sky-700",
  cancelado: "bg-red-100 text-red-600",
};
const FILTERS = ["todos", "pendiente", "pagado", "entregado", "cancelado"] as const;
const money = (n: number) => `S/ ${n.toFixed(2)}`;

export default function ReceiptsTable({ receipts }: { receipts: Receipt[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof FILTERS)[number]>("todos");

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return receipts.filter(
      (r) =>
        (status === "todos" || r.status === status) &&
        (!term || r.code.toLowerCase().includes(term) || r.customer.toLowerCase().includes(term) || r.phone.includes(term)),
    );
  }, [receipts, q, status]);

  const collected = receipts.filter((r) => r.status === "pagado" || r.status === "entregado").reduce((s, r) => s + r.total, 0);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4"><p className="text-sm text-foreground/60">Recibos</p><p className="text-2xl font-extrabold text-choco">{receipts.length}</p></div>
        <div className="card p-4"><p className="text-sm text-foreground/60">Cobrado (pagado + entregado)</p><p className="text-2xl font-extrabold text-brand-dark">{money(collected)}</p></div>
        <div className="card p-4"><p className="text-sm text-foreground/60">Por cobrar</p><p className="text-2xl font-extrabold text-amber-600">{money(receipts.filter((r) => r.status === "pendiente").reduce((s, r) => s + r.total, 0))}</p></div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input className="input max-w-xs" placeholder="Buscar por cliente, celular o N°" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar recibos" />
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setStatus(f)} className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize ${status === f ? "bg-brand text-white" : "bg-white text-choco"}`}>{f}</button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {shown.length === 0 && <p className="card p-6 text-center text-foreground/60">No hay recibos que coincidan.</p>}
        {shown.map((r) => (
          <article key={r.id} className="card flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-bold text-choco">
                {r.code} · {r.customer}
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE[r.status]}`}>{r.status}</span>
              </p>
              <p className="text-sm text-foreground/60">{r.dateLabel} · {r.items.reduce((s, i) => s + i.qty, 0)} productos</p>
            </div>
            <strong className="text-lg text-brand-dark">{money(r.total)}</strong>
            <div className="flex gap-2">
              <a href={`/api/recibo/${r.id}`} target="_blank" rel="noreferrer" className="btn btn-ghost !px-4 !py-1.5 text-sm">Ver PDF</a>
              <a href={`/api/recibo/${r.id}?download=1`} className="btn !px-4 !py-1.5 text-sm">Descargar</a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
