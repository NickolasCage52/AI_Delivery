"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ai-delivery-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"cyan" | "violet">("cyan");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const fromQuery = params?.get("theme") === "violet" ? "violet" : null;
    const fromStorage = (typeof window !== "undefined" && (window.localStorage.getItem(STORAGE_KEY) as "violet" | null)) || null;
    const next = fromQuery ?? fromStorage ?? "cyan";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next === "violet" ? "violet" : "");
    if (fromQuery && typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, fromQuery);
  }, []);

  const toggle = () => {
    const next = theme === "cyan" ? "violet" : "cyan";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next === "violet" ? "violet" : "");
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, next);
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-6 right-6 z-[998] rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs text-[var(--text-muted)] shadow-lg transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)] md:bottom-8 md:right-8"
      aria-label="Переключить тему: Cyan / Violet"
      title="Theme: Cyan vs Violet (dev)"
    >
      Theme: {theme === "cyan" ? "Cyan" : "Violet"}
    </button>
  );
}
