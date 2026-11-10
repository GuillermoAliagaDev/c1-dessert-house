"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Receipt, ReceiptStatus } from "../types/receiptTypes";

const STEPS: { key: ReceiptStatus; icon: string; title: string; text: string }[] = [
  { key: "pendiente", icon: "🕒", title: "Pedido recibido", text: "Esperando tu pago con Yape." },
  { key: "pagado", icon: "💜", title: "Pago confirmado", text: "Estamos preparando tus postres." },
  { key: "entregado", icon: "🎉", title: "Entregado", text: "¡Que lo disfrutes!" },
];
const money = (n: number) => `S/ ${n.toFixed(2)}`;

export default function OrderStatusTracker({ receipt, token, whatsapp }: { receipt: Receipt; token: string; whatsapp: string }) {
  const router = useRouter();
  const cancelled = receipt.status === "cancelado";
  const current = STEPS.findIndex((s) => s.key === receipt.status);

  // Se actualiza solo mientras el pedido siga en curso.
  useEffect(() => {
    if (receipt.status === "entregado" || cancelled) return;
    const t = setInterval(() => router.refresh(), 15000);
    return () => clearInterval(t);
  }, [receipt.status, cancelled, router]);

  const msg = `Hola! Consulto por mi pedido ${receipt.code} (${money(receipt.total)}).`;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="card p-6 text-center">
        <p className="font-hand text-2xl text-brand">Pedido</p>
        <h1 className="candy-title font-script text-4xl">{receipt.code}</h1>
        <p className="mt-1 text-sm text-foreground/60">{receipt.customer} · {receipt.dateLabel}</p>
      </div>

      <div className="card p-6">
        {cancelled ? (
          <div className="text-center">
            <div className="text-5xl">😢</div>
            <p className="mt-2 font-script text-2xl text-red-600">Pedido cancelado</p>
            <p className="mt-1 text-foreground/70">Si crees que es un error, escríbenos por WhatsApp.</p>
          </div>
        ) : (
          <ol className="space-y-5">
            {STEPS.map((s, i) => {
              const done = i < current || receipt.status === "entregado";
              const active = i === current;
              return (
                <motion.li key={s.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex items-center gap-4">
                  <span
                    className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl ${
                      done || active ? "bg-brand shadow-[0_5px_0_#b82a67]" : "bg-soft opacity-60"
                    } ${active ? "animate-jelly" : ""}`}
                  >
                    {done ? "✓" : s.icon}
                  </span>
                  <div>
                    <p className={`font-bold ${done || active ? "text-choco" : "text-foreground/40"}`}>{s.title}</p>
                    <p className={`text-sm ${done || active ? "text-foreground/70" : "text-foreground/30"}`}>{s.text}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-script text-xl text-choco">Tu pedido</h2>
        <ul className="mt-3 divide-y-2 divide-soft">
          {receipt.items.map((i) => (
            <li key={i.id} className="flex justify-between py-2">
              <span>{i.qty} × {i.name}</span>
              <span className="font-bold">{money(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t-2 border-soft pt-3 text-xl font-extrabold">
          <span>Total</span><span className="text-brand-dark">{money(receipt.total)}</span>
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <a href={`/api/recibo/${receipt.id}?t=${token}&download=1`} className="btn">📄 Descargar recibo</a>
        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer" className="btn !bg-[#25d366]">Escribir por WhatsApp</a>
      </div>
    </div>
  );
}
