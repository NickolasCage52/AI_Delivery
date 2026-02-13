"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCookieNotice } from "@/hooks/useCookieNotice";

export function CookieNotice() {
  const { showNotice, dismiss } = useCookieNotice();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && showNotice) dismiss();
    },
    [showNotice, dismiss]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {showNotice && (
        <motion.div
          role="status"
          aria-label="Уведомление об использовании cookies"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[50] px-4 pb-4 md:px-6 md:pb-6 md:left-auto md:right-6 md:bottom-6 md:max-w-md"
        >
          <div className="rounded-2xl border border-white/15 bg-[rgba(11,6,32,0.92)] px-4 py-4 shadow-[0_0_40px_rgba(139,92,246,0.15)] backdrop-blur-xl md:px-5 md:py-5">
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                  Используем cookies для работы сайта и аналитики. Продолжая, вы
                  соглашаетесь с{" "}
                  <Link
                    href="/cookies"
                    className="text-[var(--accent)] underline hover:no-underline"
                  >
                    политикой cookies
                  </Link>{" "}
                  и{" "}
                  <Link
                    href="/privacy"
                    className="text-[var(--accent)] underline hover:no-underline"
                  >
                    политикой конфиденциальности
                  </Link>
                  .
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={dismiss}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
                  >
                    Понятно
                  </button>
                  <Link
                    href="/cookies"
                    className="min-h-[44px] inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Закрыть"
                className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)] transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
