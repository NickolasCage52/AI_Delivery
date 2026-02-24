"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { useCookieNotice } from "@/hooks/useCookieNotice";
import { HOME_COPY } from "@/content/site-copy";

const btnBase =
  "flex items-center justify-center h-12 rounded-xl text-sm font-semibold transition-colors w-full min-h-[48px]";

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
      { rootMargin: "120% 0px 0px 0px", threshold: 0 }
    );
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  if (!visible || showNotice) return null;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 gap-3 border-t border-white/10 bg-[var(--bg-primary)]/95 px-4 py-4 md:bottom-4 md:left-auto md:right-4 md:max-w-md md:rounded-xl md:border md:border-white/10 md:shadow-[0_0_28px_rgba(139,92,246,0.18),0_0_56px_rgba(139,92,246,0.1)]"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.4 }}
    >
      <Link
        href="/demo"
        onClick={() => trackCtaEvent({ action: "click", label: HOME_COPY.hero.ctaPrimary, location: "sticky", href: "/demo" })}
        className={`${btnBase} bg-[var(--accent)] text-[#09040F] hover:opacity-95`}
      >
        <span className="block text-center leading-tight">{HOME_COPY.hero.ctaPrimary}</span>
      </Link>
      <Link
        href="/#contact"
        onClick={() => trackCtaEvent({ action: "click", label: HOME_COPY.hero.ctaSecondary, location: "sticky", href: "/#contact" })}
        className={`${btnBase} border border-white/25 text-[var(--accent)] hover:bg-white/5`}
      >
        <span className="block text-center leading-tight">{HOME_COPY.hero.ctaSecondary}</span>
      </Link>
    </motion.div>
  );
}
