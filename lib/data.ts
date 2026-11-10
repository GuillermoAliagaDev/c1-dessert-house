import { db } from "./db";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  art: string;
  image: string;
  available: boolean;
  featured: boolean;
};

export type OrderItem = { id: number; name: string; price: number; qty: number };

export type Order = {
  id: number;
  customer: string;
  phone: string;
  notes: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
};

export type Settings = Record<string, string>;

const toProduct = (r: Record<string, unknown>): Product => ({
  id: Number(r.id),
  name: String(r.name),
  description: String(r.description),
  price: Number(r.price),
  category: String(r.category),
  art: String(r.art),
  image: String(r.image),
  available: Number(r.available) === 1,
  featured: Number(r.featured) === 1,
});

export async function getProducts(onlyAvailable = true): Promise<Product[]> {
  const c = await db();
  const res = await c.execute(
    `SELECT * FROM products ${onlyAvailable ? "WHERE available = 1" : ""} ORDER BY id`,
  );
  return res.rows.map((r) => toProduct(r as unknown as Record<string, unknown>));
}

export async function getSettings(): Promise<Settings> {
  const c = await db();
  const res = await c.execute("SELECT key, value FROM settings");
  return Object.fromEntries(res.rows.map((r) => [String(r.key), String(r.value)]));
}

export async function getOrders(): Promise<Order[]> {
  const c = await db();
  const res = await c.execute("SELECT * FROM orders ORDER BY id DESC LIMIT 100");
  return res.rows.map((r) => ({
    id: Number(r.id),
    customer: String(r.customer),
    phone: String(r.phone),
    notes: String(r.notes),
    items: JSON.parse(String(r.items)),
    total: Number(r.total),
    status: String(r.status),
    created_at: String(r.created_at),
  }));
}

export const money = (n: number) => `S/ ${n.toFixed(2)}`;
