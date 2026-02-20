"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Page transition: brief fade on route change.
 * Scroll-to-top is handled by ScrollToTopOnRouteChange (Lenis + hash support).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
