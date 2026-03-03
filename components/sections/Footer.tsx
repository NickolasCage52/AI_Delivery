"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/seo/metadata";

const companyLinks = [
  { label: "О нас", href: "/about" },
  { label: "Как мы работаем", href: "/how-it-works" },
  { label: "Кейсы", href: "/cases" },
  { label: "Контакты", href: "/contact" },
];

const servicesLinks = [
  { label: "Telegram-боты", href: "/services#bots" },
  { label: "Telegram MiniApps", href: "/services#miniapps" },
  { label: "Автоматизации (n8n)", href: "/services#n8n" },
  { label: "Сайты и SaaS", href: "/services#sites" },
];

const resourcesLinks = [
  { label: "Получить демо", href: "/demo", accent: true },
  { label: "Стек технологий", href: "/stack" },
  { label: "FAQ", href: "/#faq" },
  { label: "Политика конфиденциальности", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

export function Footer() {
  const [openCol, setOpenCol] = useState<string | null>(null);
  const toggle = useCallback((id: string) => {
    setOpenCol((prev) => (prev === id ? null : id));
  }, []);

  return (
    <footer className="footer-root">
      <div className="footer-inner">
        <div className="footer-cta-row">
          <div className="footer-cta-row-left">
            <h3 className="footer-cta-title">Готовы начать?</h3>
            <p className="footer-cta-sub">Бесплатный прототип за 24 часа.</p>
          </div>
          <div className="footer-cta-row-right">
            <Button href="/demo" variant="primary" size="default" className="footer-cta-btn">
              Получить бесплатный MVP
            </Button>
          </div>
        </div>

        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-brand-logo">AI Delivery</span>
            <p className="footer-brand-tagline">
              Лиды 24/7, экономия времени — автоматизация под ключ.
            </p>
            <ul className="footer-benefits">
              <li className="footer-benefit-item">MVP за 24 часа</li>
              <li className="footer-benefit-item">Интеграции под ключ</li>
              <li className="footer-benefit-item">Поддержка на запуске</li>
            </ul>
          </div>

          <FooterColumn
            id="company"
            title="Компания"
            openCol={openCol}
            toggle={toggle}
            links={companyLinks}
          />

          <FooterColumn
            id="services"
            title="Услуги"
            openCol={openCol}
            toggle={toggle}
            links={servicesLinks}
          />

          <FooterColumn
            id="resources"
            title="Ресурсы"
            openCol={openCol}
            toggle={toggle}
            links={resourcesLinks}
            linkAccents={["Получить демо"]}
          />

          <div className="footer-col">
            <button
              type="button"
              className="footer-col-header"
              onClick={() => toggle("contacts")}
              aria-expanded={openCol === "contacts"}
              aria-controls="footer-col-contacts"
              id="footer-col-contacts-toggle"
            >
              <span className="footer-col-title">Контакты</span>
              <svg
                className={`footer-col-chevron ${openCol === "contacts" ? "expanded" : ""}`}
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              id="footer-col-contacts"
              className={`footer-col-content ${openCol !== "contacts" && openCol !== null ? "collapsed" : ""}`}
              role="region"
              aria-labelledby="footer-col-contacts-toggle"
            >
              <a
                href={siteConfig.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-row"
                aria-label="Telegram"
              >
                <TelegramIcon />
                <span>@ai_delivery</span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="footer-contact-row"
                aria-label="Email"
              >
                <EmailIcon />
                <span>{siteConfig.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} AI Delivery. Все права защищены.
          </p>
          <div className="footer-legal">
            <Link href="/privacy" className="footer-legal-link">
              Политика конфиденциальности
            </Link>
            <span className="footer-legal-sep" aria-hidden> · </span>
            <Link href="/cookies" className="footer-legal-link">
              Cookies
            </Link>
            <span className="footer-legal-sep" aria-hidden> · </span>
            <span className="footer-copyright">Не публичная оферта</span>
          </div>
          <div className="footer-social">
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Telegram"
            >
              <TelegramIcon />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="footer-social-icon"
              aria-label="Email"
            >
              <EmailIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  id,
  title,
  openCol,
  toggle,
  links,
  linkAccents = [],
}: {
  id: string;
  title: string;
  openCol: string | null;
  toggle: (id: string) => void;
  links: Array<{ label: string; href: string; accent?: boolean }>;
  linkAccents?: string[];
}) {
  const isCollapsed = openCol !== null && openCol !== id;
  const accentSet = new Set(linkAccents);

  return (
    <div className="footer-col">
      <button
        type="button"
        className="footer-col-header"
        onClick={() => toggle(id)}
        aria-expanded={openCol === id}
        aria-controls={`footer-col-${id}`}
        id={`footer-col-${id}-toggle`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle(id);
          }
        }}
      >
        <span className="footer-col-title">{title}</span>
        <svg
          className={`footer-col-chevron ${openCol === id ? "expanded" : ""}`}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id={`footer-col-${id}`}
        className={`footer-col-content ${isCollapsed ? "collapsed" : ""}`}
        role="region"
        aria-labelledby={`footer-col-${id}-toggle`}
      >
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`footer-link ${item.accent || accentSet.has(item.label) ? "footer-link-accent" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
