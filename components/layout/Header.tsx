"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogoMark } from "@/components/brand/LogoMark";
import { Container } from "@/components/ui/Container";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { useQuality } from "@/hooks/useQuality";
import { CTA_PRIMARY, CTA_PRIMARY_HEADER, CTA_SECONDARY, CTA_SECONDARY_HEADER } from "@/lib/constants/messaging";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/ui/scrollLock";

const ROUTES = [
  { label: "Главная", href: "/" },
  { label: "Услуги", href: "/services" },
  { label: "Как это работает", href: "/how-it-works" },
  { label: "Кейсы", href: "/cases" },
  { label: "Insights", href: "/insights" },
  { label: "О нас", href: "/about" },
  { label: "Контакты", href: "/contact" },
  { label: "Стек", href: "/stack" },
];

const HOME_ANCHORS = [
  { label: "Цифры", id: "proof" },
  { label: "Результаты", id: "results" },
  { label: "Услуги", id: "services" },
  { label: "Кому подходит", id: "who-fits" },
  { label: "Кейсы", id: "cases" },
  { label: "Insights", id: "insights" },
  { label: "Процесс", id: "process" },
  { label: "FAQ", id: "faq" },
  { label: "Контакты", id: "contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState("results");
  const quality = useQuality();

  const menuRef = useRef<HTMLElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const isHome = pathname === "/";
  const blurClass = quality === "low" ? "backdrop-blur-sm" : "backdrop-blur-md";
  const mobileHeaderBg = quality === "low" ? "bg-[rgba(6,6,10,0.95)]" : "bg-[rgba(10,6,20,0.72)]";
  const headerBg = quality === "low" ? "md:bg-[var(--bg-primary)]/95" : "md:bg-[var(--bg-primary)]/80";
  const subHeaderBg = quality === "low" ? "bg-[var(--bg-primary)]/85" : "bg-[var(--bg-primary)]/60";
  const mobileMenuBg = quality === "low" ? "bg-[rgba(6,6,10,0.96)]" : "bg-[rgba(10,6,20,0.86)]";
  const mobileMenuBlur = quality === "low" ? "backdrop-blur-md" : "backdrop-blur-2xl backdrop-saturate-150";

  useEffect(() => {
    if (!isHome) return;
    const sections = HOME_ANCHORS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveAnchor(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.2, 0.5, 0.75] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!mobileOpen || typeof document === "undefined") return;
    lockBodyScroll();
    lastActiveRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const menu = menuRef.current;

    const getFocusable = (el: HTMLElement) =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((node) => !node.hasAttribute("disabled") && !node.getAttribute("aria-hidden"));

    const focusFirst = () => {
      if (!menu) return;
      const focusables = getFocusable(menu);
      (focusables[0] ?? menu).focus();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab" || !menu) return;
      const focusables = getFocusable(menu);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const raf = window.requestAnimationFrame(focusFirst);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      unlockBodyScroll();
      lastActiveRef.current?.focus();
    };
  }, [mobileOpen]);

  const anchorLinks = useMemo(
    () =>
      HOME_ANCHORS.map((a) => ({
        ...a,
        href: `/#${a.id}`,
        active: activeAnchor === a.id,
      })),
    [activeAnchor]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 ${mobileHeaderBg} ${headerBg} ${blurClass}`}
    >
      <Container>
        <div className="flex h-14 items-center justify-between md:h-16">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 text-lg font-semibold text-[var(--text-primary)]">
            <LogoMark size={26} hover={false} className="shrink-0" />
            <span>AI Delivery</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 shrink min-w-0">
            {ROUTES.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition-colors lg:text-[13px] ${
                    isActive ? "text-[var(--accent)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                  {isActive && <span className="absolute bottom-1 left-2 right-2 h-px bg-[var(--accent)]/70" aria-hidden />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href={pathname === "/" ? "/#contact" : "/contact"}
              onClick={() => {
                trackCtaEvent({ action: "click", label: CTA_SECONDARY, location: "header", href: pathname === "/" ? "/#contact" : "/contact" });
              }}
              className="btn-glow whitespace-nowrap rounded-lg border border-[var(--accent)]/40 px-3 py-1.5 text-xs font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10 lg:text-[13px] lg:px-3.5"
            >
              {CTA_SECONDARY_HEADER}
            </Link>
            <Link
              href="/demo"
              onClick={() => trackCtaEvent({ action: "click", label: CTA_PRIMARY, location: "header", href: "/demo" })}
              className="whitespace-nowrap rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] lg:text-[13px] lg:px-3.5"
            >
              {CTA_PRIMARY_HEADER}
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg text-[var(--text-primary)] hover:bg-white/5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Открыть меню"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
          >
            <span className={`block h-0.5 w-6 bg-current transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </Container>

      {isHome && (
        <div className={`hidden md:block border-t border-white/5 ${subHeaderBg}`}>
          <Container>
            <div className="flex items-center gap-3 py-2 text-xs text-[var(--text-secondary)]">
              {anchorLinks.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    item.active ? "bg-white/10 text-[var(--text-primary)]" : "hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={`fixed inset-0 top-14 md:hidden z-[60] bg-black/40`}
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              ref={menuRef}
              className={`flex flex-col gap-1 p-6 pt-4 border border-white/10 ${mobileMenuBg} ${mobileMenuBlur}`}
              tabIndex={-1}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {ROUTES.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl py-3 px-4 text-[var(--text-primary)] font-medium hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isHome && (
                <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
                  {anchorLinks.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="block rounded-xl py-2 px-4 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
                <Link
                  href={isHome ? "/#contact" : "/contact"}
                  onClick={() => {
                    trackCtaEvent({ action: "click", label: CTA_SECONDARY, location: "mobile-menu", href: isHome ? "/#contact" : "/contact" });
                    setMobileOpen(false);
                  }}
                  className="rounded-xl border border-[var(--accent)]/40 py-3 px-4 text-center text-sm font-medium text-[var(--accent)]"
                >
                  {CTA_SECONDARY}
                </Link>
                <Link
                  href="/demo"
                  onClick={() => {
                    trackCtaEvent({ action: "click", label: CTA_PRIMARY, location: "mobile-menu", href: "/demo" });
                    setMobileOpen(false);
                  }}
                  className="rounded-xl bg-[var(--accent)] py-3 px-4 text-center text-sm font-semibold text-[#09040F]"
                >
                  {CTA_PRIMARY}
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
