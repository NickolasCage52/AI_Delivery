"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";

/**
 * One-time shimmer pass over hero title (vincture-like signature effect).
 */
export function TitleShimmer({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <span className="relative inline-block">
      {children}
      {!done && (
        <motion.span
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 1 }}
          onAnimationComplete={() => setDone(true)}
          aria-hidden
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "40%" }}
          />
        </motion.span>
      )}
    </span>
  );
}
