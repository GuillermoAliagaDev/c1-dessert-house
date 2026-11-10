"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DessertArt from "./DessertArt";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/data";
import { money } from "@/lib/data";

const PRAISE = ["¡Dulce!", "¡Delicioso!", "¡Genial!", "¡Sabroso!", "¡Divino!", "¡Combo!"];

export default function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [praise, setPraise] = useState<{ id: number; text: string } | null>(null);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: Math.min(index, 8) * 0.05, type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ y: -10, rotate: -1.2, scale: 1.02 }}
      className="card group flex flex-col p-4"
    >
      <div className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-soft to-white">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <DessertArt art={p.art} className="h-4/5 w-4/5 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110" />
        )}
        <AnimatePresence>
          {praise && (
            <motion.span
              key={praise.id}
              initial={{ scale: 0, y: 20, rotate: -12 }}
              animate={{ scale: [0, 1.4, 1], y: -10, rotate: -6 }}
              exit={{ opacity: 0, y: -50, scale: 1.3 }}
              className="candy-title pointer-events-none absolute inset-x-0 top-1/3 z-10 text-center font-script text-3xl"
            >
              {praise.text}
            </motion.span>
          )}
        </AnimatePresence>
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-brand">{p.category}</span>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-choco">{p.name}</h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-foreground/70">{p.description}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="whitespace-nowrap text-lg font-bold text-brand-dark">{money(p.price)}</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="btn !px-4 !py-2 text-sm"
          onClick={() => {
            add({ id: p.id, name: p.name, price: p.price, art: p.art, image: p.image });
            setAdded(true);
            setPraise({ id: Date.now(), text: PRAISE[Math.floor(Math.random() * PRAISE.length)] });
            setTimeout(() => setAdded(false), 1200);
            setTimeout(() => setPraise(null), 1100);
          }}
        >
          {added ? "¡Agregado! ✓" : "Agregar al pedido"}
        </motion.button>
      </div>
    </motion.article>
  );
}
