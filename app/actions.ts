"use server";

import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";

export type OrderResult = { ok: true; orderId: number; total: number; receiptToken: string } | { ok: false; error: string };

export async function createOrder(input: {
  customer: string;
  phone: string;
  notes: string;
  items: { id: number; qty: number }[];
}): Promise<OrderResult> {
  const customer = String(input.customer ?? "").trim().slice(0, 80);
  const phone = String(input.phone ?? "").replace(/[^\d+ ]/g, "").trim().slice(0, 20);
  const notes = String(input.notes ?? "").trim().slice(0, 300);
  if (customer.length < 2) return { ok: false, error: "Escribe tu nombre." };
  if (phone.replace(/\D/g, "").length < 7) return { ok: false, error: "Escribe un celular válido." };
  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 30)
    return { ok: false, error: "Tu pedido está vacío." };

  const c = await db();
  const ids = input.items.map((i) => Number(i.id)).filter(Number.isInteger);
  if (ids.length === 0) return { ok: false, error: "Tu pedido está vacío." };
  const res = await c.execute({
    sql: `SELECT id, name, price FROM products WHERE available = 1 AND id IN (${ids.map(() => "?").join(",")})`,
    args: ids,
  });
  const byId = new Map(res.rows.map((r) => [Number(r.id), { name: String(r.name), price: Number(r.price) }]));

  const lines = [];
  for (const it of input.items) {
    const p = byId.get(Number(it.id));
    const qty = Math.floor(Number(it.qty));
    if (!p) return { ok: false, error: "Un producto de tu pedido ya no está disponible. Revisa tu carrito." };
    if (!(qty >= 1 && qty <= 20)) return { ok: false, error: "Cantidad inválida." };
    lines.push({ id: Number(it.id), name: p.name, price: p.price, qty });
  }
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const receiptToken = randomBytes(16).toString("hex");
  const ins = await c.execute({
    sql: "INSERT INTO orders (customer, phone, notes, items, total, receipt_token) VALUES (?,?,?,?,?,?)",
    args: [customer, phone, notes, JSON.stringify(lines), total, receiptToken],
  });
  return { ok: true, orderId: Number(ins.lastInsertRowid), total, receiptToken };
}
