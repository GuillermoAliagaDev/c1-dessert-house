"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { useCart } from "./CartProvider";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/pedido", label: "Pedidos" },
  { href: "/contacto", label: "Nosotros" },
];

export default function Header() {
  const path = usePathname();
  const { count, bump } = useCart();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-3xl border-2 border-soft bg-white/90 px-4 py-2 shadow-[0_10px_30px_-18px_rgba(210,58,119,.6)] backdrop-blur">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Logo />
          <span className="leading-tight">
            <span className="block font-script text-lg text-choco">La Casa del Postre</span>
            <span className="block font-hand text-sm text-brand">Postres que hacen la vida más dulce</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className="relative rounded-full px-4 py-2 text-sm font-bold">
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <span className={`relative ${active ? "text-white" : "text-choco hover:text-brand"}`}>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/pedido" aria-label={`Carrito, ${count} productos`} className="relative grid h-11 w-11 place-items-center rounded-full bg-soft text-xl">
            <motion.span key={bump} initial={{ scale: 1 }} animate={{ scale: [1, 1.4, 1], rotate: [0, -12, 0] }}>🛍️</motion.span>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-soft text-xl md:hidden" aria-label="Menú" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border-2 border-soft bg-white p-3 md:hidden"
          >
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`rounded-2xl px-4 py-3 font-bold ${path === l.href ? "bg-brand text-white" : "text-choco"}`}>
                {l.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
