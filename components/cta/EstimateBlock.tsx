"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { trackCtaEvent } from "@/lib/analytics/cta";

const WHAT_OPTIONS = [
  { value: "bot", label: "ИИ-бот" },
  { value: "site", label: "Сайт / лендинг" },
  { value: "n8n", label: "n8n автоматизация" },
  { value: "miniapp", label: "Telegram MiniApp" },
];

const DEADLINE_OPTIONS = [
  { value: "24h", label: "24 часа (MVP)" },
  { value: "3-10", label: "3–10 дней (боевой запуск)" },
];

const INTEGRATIONS_OPTIONS = [
  { value: "0", label: "0" },
  { value: "1-2", label: "1–2" },
  { value: "3+", label: "3+" },
];

function getEstimate(what: string, deadline: string, integrations: string): string {
  if (!what || !deadline) return "Выберите «Что нужно» и «Срок»";
  const d = deadline === "24h" ? "MVP за 24 часа (1 сценарий)" : "боевой запуск 3–10 дней";
  const i = integrations === "3+" ? ", несколько интеграций" : integrations === "1-2" ? ", 1–2 интеграции" : "";
  return `Ориентир: ${d}${i}. MVP и план — после 15-минутного брифа.`;
}

export function EstimateBlock() {
  const [what, setWhat] = useState("");
  const [deadline, setDeadline] = useState("");
  const [integrations, setIntegrations] = useState("");

  const estimate = getEstimate(what, deadline, integrations);

  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-[var(--bg-elevated)]/85 p-6 md:p-8"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">Ориентир по срокам</h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">3 поля — получите примерные сроки и сложность.</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <div>
          <span className="block text-xs text-[var(--text-muted)]">Что нужно?</span>
          <select
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            className="mt-1 rounded-lg border border-white/10 bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)]/50 focus:outline-none"
          >
            <option value="">—</option>
            {WHAT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="block text-xs text-[var(--text-muted)]">Срок</span>
          <select
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 rounded-lg border border-white/10 bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)]/50 focus:outline-none"
          >
            <option value="">—</option>
            {DEADLINE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="block text-xs text-[var(--text-muted)]">Интеграции?</span>
          <select
            value={integrations}
            onChange={(e) => setIntegrations(e.target.value)}
            className="mt-1 rounded-lg border border-white/10 bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)]/50 focus:outline-none"
          >
            <option value="">—</option>
            {INTEGRATIONS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-4 text-sm text-[var(--accent)]">{estimate}</p>
      <Link
        href="/demo"
        onClick={() => trackCtaEvent({ action: "click", label: "Получить бесплатное демо", location: "estimate", href: "/demo" })}
        className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
      >
        Получить бесплатное демо
      </Link>
    </motion.div>
  );
}
