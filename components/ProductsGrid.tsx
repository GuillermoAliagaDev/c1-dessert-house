"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/data";

export default function ProductsGrid({ products }: { products: Product[] }) {
  const cats = useMemo(() => ["Todos", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const [cat, setCat] = useState("Todos");
  const shown = cat === "Todos" ? products : products.filter((p) => p.category === cat);

  return (
    <>
      <LayoutGroup>
        <div className="flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className="relative rounded-full px-5 py-2 font-bold text-choco">
              {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className={`relative ${cat === c ? "text-white" : ""}`}>{c}</span>
            </button>
          ))}
        </div>
        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
      {shown.length === 0 && <p className="mt-10 text-center text-foreground/60">Pronto habrá más postres por aquí.</p>}
    </>
  );
}
