"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  if (usePathname().startsWith("/admin")) return null;
  return (
    <footer className="mt-20 border-t-2 border-soft bg-white/60 px-4 py-8 text-center">
      <p className="font-script text-xl text-choco">La Casa del Postre</p>
      <p className="font-hand text-lg text-brand">Más que postres, son momentos 💗</p>
      <p className="mt-3 text-xs text-choco/60">
        © {new Date().getFullYear()} · <Link href="/admin" className="underline">Administración</Link>
      </p>
    </footer>
  );
}
