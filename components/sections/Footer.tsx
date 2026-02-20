"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 md:py-16 bg-[var(--bg-primary)]">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xl font-semibold text-[var(--text-primary)]">AI Delivery</span>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              ИИ‑решения под ключ за 3–10 дней
            </p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm">
            <Link href="/services" className="link-trailing text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Услуги
            </Link>
            <Link href="/cases" className="link-trailing text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Кейсы
            </Link>
            <Link href="/about" className="link-trailing text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              О нас
            </Link>
            <Link href="/stack" className="link-trailing text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Стек
            </Link>
            <Link href="/contact" className="link-trailing text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Контакты
            </Link>
            <Link href="/demo" className="link-trailing text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Демо
            </Link>
            <Link href="/#process" className="link-trailing text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Процесс
            </Link>
            <Link href="/privacy" className="link-trailing text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Конфиденциальность
            </Link>
            <Link href="/cookies" className="link-trailing text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Cookies
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} AI Delivery. Боты • сайты • Telegram MiniApps • n8n‑автоматизации.
        </p>
      </Container>
    </footer>
  );
}
