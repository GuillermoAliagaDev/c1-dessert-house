"use client";

import { useEffect, useState } from "react";
import CandyShape, { CANDY_COLORS, CANDY_KINDS, type CandyKind } from "./CandyShape";

type Item = { kind: CandyKind; color: string; left: number; size: number; dur: number; delay: number; spin: number; sway: number };

// Dulces que flotan hacia arriba (como burbujas de Candy Crush).
export default function Candies({ count = 16 }: { count?: number }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- aleatorio solo en cliente (evita desajuste de hidratación)
    setItems(
      Array.from({ length: count }, (_, i) => ({
        kind: CANDY_KINDS[i % CANDY_KINDS.length],
        color: CANDY_COLORS[(i * 5) % CANDY_COLORS.length],
        left: (i * 61) % 100,
        size: 22 + ((i * 13) % 30),
        dur: 14 + ((i * 7) % 12),
        delay: -((i * 3.7) % 20),
        spin: i % 2 ? 360 : -360,
        sway: 20 + ((i * 11) % 40),
      })),
    );
  }, [count]);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((c, i) => (
        <span
          key={i}
          className="candy-rise"
          style={{ left: `${c.left}%`, width: c.size, height: c.size, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`, ["--spin" as string]: `${c.spin}deg`, ["--sway" as string]: `${c.sway}px` }}
        >
          <CandyShape kind={c.kind} color={c.color} className="h-full w-full opacity-70" />
        </span>
      ))}
    </div>
  );
}
