"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`rounded-xl border border-white/[0.06] bg-white/[0.04] transition-colors hover:border-[#56F0FF]/25 hover:bg-white/[0.05] ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
