"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: number; name: string; price: number; qty: number; art: string; image: string };

type Cart = {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Omit<CartItem, "qty">) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  bump: number;
};

const Ctx = createContext<Cart | null>(null);
const KEY = "casa-del-postre-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [bump, setBump] = useState(0);

  // Leer localStorage solo tras montar evita desajustes de hidratación (SSR no tiene localStorage).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add = useCallback((p: Omit<CartItem, "qty">) => {
    setItems((cur) =>
      cur.some((i) => i.id === p.id)
        ? cur.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, 20) } : i))
        : [...cur, { ...p, qty: 1 }],
    );
    setBump((b) => b + 1);
  }, []);
  const setQty = useCallback(
    (id: number, qty: number) =>
      setItems((cur) =>
        qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 20) } : i)),
      ),
    [],
  );
  const remove = useCallback((id: number) => setItems((cur) => cur.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Cart>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      add,
      setQty,
      remove,
      clear,
      bump,
    }),
    [items, add, setQty, remove, clear, bump],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}
