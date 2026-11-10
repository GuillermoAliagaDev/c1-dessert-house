"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import DessertArt from "./DessertArt";
import { useCart } from "./CartProvider";
import { createOrder } from "@/app/actions";
import { money } from "@/lib/data";

type Props = { yapeNumber: string; yapeName: string; qr: string; whatsapp: string };
const RECENT_KEY = "casa-del-postre-orders";
type RecentOrder = { id: number; token: string; total: number };
type Done = { orderId: number; total: number; customer: string; token: string };

export default function Checkout({ yapeNumber, yapeName, qr, whatsapp }: Props) {
  const { items, total, setQty, remove, clear } = useCart();
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza con localStorage tras montar
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
    } catch {}
  }, [done]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      const r = await createOrder({ customer, phone, notes, items: items.map((i) => ({ id: i.id, qty: i.qty })) });
      if (!r.ok) return setError(r.error);
      setDone({ orderId: r.orderId, total: r.total, customer, token: r.receiptToken });
      try {
        const prev: RecentOrder[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
        localStorage.setItem(RECENT_KEY, JSON.stringify([{ id: r.orderId, token: r.receiptToken, total: r.total }, ...prev].slice(0, 5)));
      } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
      clear();
    });
  }

  if (done) {
    const msg = `Hola! Soy ${done.customer}. Hice el pedido #${done.orderId} por ${money(done.total)} y ya pagué con Yape. Adjunto mi captura 💗`;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto max-w-md p-6 text-center">
        <div className="animate-pop text-5xl">🎉</div>
        <h2 className="mt-2 font-script text-3xl text-choco">¡Pedido #{done.orderId} recibido!</h2>
        <p className="mt-1 text-foreground/70">Ahora paga con Yape para confirmarlo.</p>

        <p className="mt-5 text-sm font-bold uppercase tracking-wide text-brand">Total a yapear</p>
        <p className="text-4xl font-extrabold text-brand-dark">{money(done.total)}</p>

        <div className="mx-auto mt-4 w-56 rounded-3xl border-4 border-[#742284] bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt={`QR para yapear a ${yapeNumber}`} className="w-full" />
          <p className="mt-1 text-xs font-bold text-[#742284]">Escanea con Yape</p>
        </div>

        <p className="mt-4 text-foreground/70">o yapea al número</p>
        <button
          className="mt-1 rounded-2xl bg-soft px-5 py-2 text-2xl font-extrabold tracking-wider text-choco"
          onClick={() => {
            navigator.clipboard?.writeText(yapeNumber).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
        >
          {yapeNumber} <span className="text-sm">{copied ? "✓ copiado" : "📋"}</span>
        </button>
        <p className="mt-1 text-sm text-foreground/60">a nombre de {yapeName}</p>

        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer" className="btn mt-6 w-full !bg-[#25d366]">
          Ya pagué · Enviar captura por WhatsApp
        </a>
        <Link href={`/seguimiento/${done.orderId}?t=${done.token}`} className="btn btn-ghost mt-3 w-full">🔎 Ver el estado de mi pedido</Link>
        <a href={`/api/recibo/${done.orderId}?t=${done.token}&download=1`} className="btn btn-ghost mt-3 w-full">📄 Descargar recibo (PDF)</a>
        <p className="mt-1 text-xs text-foreground/50">Guarda tu recibo: también es tu comprobante del pedido.</p>
        <Link href="/productos" className="mt-3 block text-sm font-bold text-brand underline">Seguir viendo postres</Link>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <div className="animate-float text-6xl">🧁</div>
        <p className="mt-3 font-script text-2xl text-choco">Tu pedido está vacío</p>
        <p className="mt-1 text-foreground/70">Agrega algo dulce para empezar.</p>
        <Link href="/productos" className="btn mt-5">Ver productos</Link>
        {recent.length > 0 && (
          <div className="mt-6 border-t-2 border-soft pt-4 text-left">
            <p className="font-bold text-choco">Tus pedidos recientes</p>
            <ul className="mt-2 space-y-1">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link className="font-bold text-brand underline" href={`/seguimiento/${o.id}?t=${o.token}`}>
                    Pedido R-{String(o.id).padStart(6, "0")} · {money(o.total)} — ver estado
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="card p-4 sm:p-6">
        <ul className="divide-y-2 divide-soft">
          <AnimatePresence initial={false}>
            {items.map((i) => (
              <motion.li key={i.id} layout exit={{ opacity: 0, x: 60 }} className="flex items-center gap-3 py-3">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-soft">
                  {i.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <DessertArt art={i.art} className="h-14 w-14" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-choco">{i.name}</p>
                  <p className="text-sm font-bold text-brand-dark">{money(i.price)}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-soft p-1">
                  <button aria-label="Menos" className="h-8 w-8 rounded-full bg-white font-bold" onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                  <span className="w-6 text-center font-bold">{i.qty}</span>
                  <button aria-label="Más" className="h-8 w-8 rounded-full bg-white font-bold" onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                </div>
                <button aria-label={`Quitar ${i.name}`} className="grid h-9 w-9 place-items-center rounded-full text-brand hover:bg-soft" onClick={() => remove(i.id)}>🗑️</button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <form onSubmit={submit} className="card h-fit space-y-4 p-5 sm:p-6">
        <h2 className="font-script text-2xl text-choco">Resumen del pedido</h2>
        <div className="flex items-center justify-between border-t-2 border-soft pt-3 text-xl font-extrabold">
          <span>Total</span>
          <motion.span key={total} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-brand-dark">{money(total)}</motion.span>
        </div>
        <label className="block text-sm font-bold">Tu nombre
          <input className="input mt-1" value={customer} onChange={(e) => setCustomer(e.target.value)} required maxLength={80} autoComplete="name" />
        </label>
        <label className="block text-sm font-bold">Tu celular
          <input className="input mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel" maxLength={20} autoComplete="tel" />
        </label>
        <label className="block text-sm font-bold">Notas (opcional)
          <textarea className="input mt-1" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} placeholder="Fecha de entrega, dedicatoria…" />
        </label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-2 text-sm font-bold text-red-600">{error}</p>}
        <button className="btn w-full" disabled={pending}>{pending ? "Enviando…" : "Confirmar pedido y pagar con Yape"}</button>
      </form>
    </div>
  );
}
