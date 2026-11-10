import { timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/data";
import { toReceipt } from "../mappers/receiptMapper";
import type { Receipt, ShopInfo } from "../types/receiptTypes";

export async function listReceipts(): Promise<Receipt[]> {
  const c = await db();
  const res = await c.execute("SELECT * FROM orders ORDER BY id DESC");
  return res.rows.map((r) => toReceipt(r as unknown as Record<string, unknown>));
}

export async function findReceipt(id: number): Promise<Receipt | null> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM orders WHERE id = ?", args: [id] });
  return res.rows[0] ? toReceipt(res.rows[0] as unknown as Record<string, unknown>) : null;
}

export function tokenMatches(receipt: Receipt, token: string) {
  const a = Buffer.from(receipt.token);
  const b = Buffer.from(token);
  return a.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

export async function getShopInfo(): Promise<ShopInfo> {
  const s = await getSettings();
  return {
    name: "La Casa del Postre",
    address: s.address,
    whatsapp: s.whatsapp,
    yapeNumber: s.yape_number,
    yapeName: s.yape_name,
  };
}
