"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import DessertArt from "./DessertArt";
import CandyShape, { CANDY_COLORS, CANDY_KINDS } from "./CandyShape";

const items = [
  { art: "chocolate", cls: "left-[4%] top-[18%] w-[46%]", delay: 0.2, float: "animate-float", depth: 30 },
  { art: "cheese-frutos", cls: "right-[2%] top-[4%] w-[44%]", delay: 0.4, float: "animate-float-slow", depth: 50 },
  { art: "alfajor-cup", cls: "right-[10%] bottom-[2%] w-[38%]", delay: 0.6, float: "animate-float", depth: 70 },
  { art: "tresleches", cls: "left-[8%] bottom-[0%] w-[32%]", delay: 0.8, float: "animate-float-slow", depth: 40 },
];

const orbit = Array.from({ length: 8 }, (_, i) => ({
  kind: CANDY_KINDS[i % CANDY_KINDS.length],
  color: CANDY_COLORS[i % CANDY_COLORS.length],
  angle: (360 / 8) * i,
  dur: 22 + i,
}));

function Layer({ depth, sx, sy, className, children }: { depth: number; sx: ReturnType<typeof useSpring>; sy: ReturnType<typeof useSpring>; className: string; children: React.ReactNode }) {
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth);
  return (
    <motion.div className={`absolute ${className}`} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

export default function HeroArt() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 15 });
  const sy = useSpring(my, { stiffness: 80, damping: 15 });

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-square w-full max-w-md"
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div
        className="absolute inset-[6%] rounded-full bg-gradient-to-br from-[#ffd23f] via-mid to-[#ff9fc4] shadow-[inset_0_-14px_0_rgba(0,0,0,.08),0_18px_0_rgba(236,79,139,.2)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      />
      {/* dulces orbitando */}
      <div className="absolute inset-0 animate-[spin_30s_linear_infinite]">
        {orbit.map((o) => (
          <span key={o.angle} className="absolute left-1/2 top-1/2 h-9 w-9" style={{ transform: `rotate(${o.angle}deg) translateY(-48%) translateX(0) translate(0,-170px)` }}>
            <motion.span className="block" animate={{ rotate: [-o.angle, -o.angle - 360] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
              <CandyShape kind={o.kind} color={o.color} className="h-9 w-9 drop-shadow-md" />
            </motion.span>
          </span>
        ))}
      </div>
      {items.map((it) => (
        <Layer key={it.art} depth={it.depth} sx={sx} sy={sy} className={it.cls}>
          <motion.div
            initial={{ opacity: 0, scale: 0.2, rotate: -40, y: -200 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            transition={{ delay: it.delay, type: "spring", stiffness: 140, damping: 9 }}
            whileHover={{ scale: 1.15, rotate: 6 }}
          >
            <div className={it.float}>
              <DessertArt art={it.art} className="w-full drop-shadow-[0_12px_14px_rgba(180,60,100,.3)]" />
            </div>
          </motion.div>
        </Layer>
      ))}
      <span className="animate-twinkle absolute right-[4%] top-[46%] text-3xl">✨</span>
      <span className="animate-twinkle absolute left-[2%] top-[6%] text-3xl [animation-delay:.7s]">⭐</span>
      <span className="animate-twinkle absolute bottom-[8%] right-[40%] text-2xl [animation-delay:1.2s]">✨</span>
    </div>
  );
}
