"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { useCookieNotice } from "@/hooks/useCookieNotice";
import { HOME_COPY } from "@/content/site-copy";

export function StickyCTA() {
  const { showNotice } = useCookieNotice();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const trigger = document.getElementById("sticky-cta-trigger");
    if (!trigger) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      // Show after ~1–2 screens (no scroll listeners)
      { rootMargin: "120% 0px 0px 0px", threshold: 0 }
    );
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  if (!visible || showNotice) return null;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-3 border-t border-white/10 bg-[var(--bg-primary)]/95 px-4 py-3 md:bottom-4 md:left-auto md:right-4 md:max-w-sm md:rounded-xl md:border md:border-white/10 md:shadow-[0_0_24px_rgba(139,92,246,0.12)]"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.4 }}
    >
      <span className="hidden text-xs text-[var(--text-secondary)] md:inline">{HOME_COPY.hero.offerNote}</span>
      <Link
        href="/demo"
        onClick={() => trackCtaEvent({ action: "click", label: HOME_COPY.hero.ctaPrimary, location: "sticky", href: "/demo" })}
        className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
      >
        {HOME_COPY.hero.ctaPrimary}
      </Link>
      <Link
        href="/#cases"
        onClick={() => trackCtaEvent({ action: "click", label: HOME_COPY.hero.ctaSecondary, location: "sticky", href: "/#cases" })}
        className="rounded-lg border border-[var(--accent)]/50 px-4 py-2.5 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
      >
        {HOME_COPY.hero.ctaSecondary}
      </Link>
    </motion.div>
  );
}
