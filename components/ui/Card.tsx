"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`rounded-xl border border-white/[0.08] bg-elevated p-6 md:p-8 transition-colors hover:border-accent-cyan/40 hover:shadow-glow/50 ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
