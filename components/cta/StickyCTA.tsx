"use client";

import { motion } from "framer-motion";
import { useLeadModal } from "./LeadModal";
import { useEffect, useState } from "react";
import { trackCtaEvent } from "@/lib/analytics/cta";

export function StickyCTA() {
  const openModal = useLeadModal();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const trigger = document.getElementById("sticky-cta-trigger");
    if (!trigger) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-20% 0px 0px 0px", threshold: 0.1 }
    );
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-3 border-t border-white/10 bg-[var(--bg-primary)]/95 px-4 py-3 md:bottom-4 md:left-auto md:right-4 md:max-w-sm md:rounded-xl md:border md:border-white/10 md:shadow-[0_0_24px_rgba(139,92,246,0.12)]"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.4 }}
    >
      <span className="hidden text-xs text-[var(--text-secondary)] md:inline">Пилот от 48 ч</span>
      <button
        type="button"
        onClick={() => {
          trackCtaEvent({ action: "open-modal", label: "Запросить демо и план", location: "sticky" });
          openModal?.();
        }}
        className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
      >
        Запросить демо
      </button>
      <a
        href="/#cases"
        onClick={() => trackCtaEvent({ action: "click", label: "Смотреть кейсы", location: "sticky", href: "/#cases" })}
        className="rounded-lg border border-[var(--accent)]/50 px-4 py-2.5 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
      >
        Смотреть кейсы
      </a>
    </motion.div>
  );
}
