"use client";

import { useEffect } from "react";

const COLORS = ["#ff4d8d", "#ff9f1c", "#ffd23f", "#3ddc97", "#35b8ff", "#a66bff"];

// Al hacer clic salen chispas de colores, como al romper un dulce.
export default function ClickBurst() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onClick = (e: PointerEvent) => {
      for (let i = 0; i < 12; i++) {
        const el = document.createElement("span");
        const size = 6 + Math.random() * 8;
        Object.assign(el.style, {
          position: "fixed",
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: i % 3 === 0 ? "2px" : "50%",
          background: COLORS[i % COLORS.length],
          pointerEvents: "none",
          zIndex: "9999",
          boxShadow: "inset -2px -2px 0 rgba(0,0,0,.15)",
        });
        document.body.appendChild(el);
        const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
        const d = 40 + Math.random() * 50;
        el.animate(
          [
            { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 20}px)) scale(0) rotate(180deg)`, opacity: 0 },
          ],
          { duration: 600 + Math.random() * 200, easing: "cubic-bezier(.2,.8,.3,1)" },
        ).onfinish = () => el.remove();
      }
    };
    window.addEventListener("pointerdown", onClick);
    return () => window.removeEventListener("pointerdown", onClick);
  }, []);
  return null;
}
