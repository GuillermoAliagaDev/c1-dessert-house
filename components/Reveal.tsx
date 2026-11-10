"use client";

import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  x = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  x?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
