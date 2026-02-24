"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLeadModal } from "./LeadModal";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { submitLead, collectUtm } from "@/lib/lead/submitLead";
import { TelegramLeadButton } from "./TelegramLeadButton";

type Status = "idle" | "loading" | "success";

export function InlineLeadForm({
  title = "Запросить оценку",
  subtitle = "Оставьте контакт — перезвоним и дадим ориентир по срокам и стоимости.",
  compact = false,
}: {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [_hp, setHp] = useState("");
  const openModal = useLeadModal();
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    trackCtaEvent({ action: "submit", label: "InlineLeadForm", location: "inline" });
    const result = await submitLead({
      name,
      contact,
      sourcePage: pathname ?? "/",
      utm: collectUtm(),
      _hp,
    });
    if (result.ok) {
      setStatus("success");
      setName("");
      setContact("");
    } else {
      setStatus("idle");
      alert(result.error);
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-6 text-center"
      >
        <p className="text-[var(--accent-pink-strong)]">Спасибо! Мы свяжемся с вами в ближайшее время.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-3 text-sm text-[var(--accent)] hover:underline"
        >
          Отправить ещё
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-[var(--bg-elevated)]/85 p-6 md:p-8"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      {!compact && <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-3">
        <div className="sr-only" aria-hidden>
          <label htmlFor="inline-hp">Не заполняйте</label>
          <input id="inline-hp" type="text" tabIndex={-1} autoComplete="off" value={_hp} onChange={(e) => setHp(e.target.value)} />
        </div>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя"
          className="rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 md:min-w-[140px]"
        />
        <input
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Telegram / почта / телефон"
          className="flex-1 min-w-0 rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_16px_rgba(139,92,246,0.35)] disabled:opacity-70"
        >
          {status === "loading" ? "…" : "Отправить"}
        </button>
        <TelegramLeadButton location="inline-form" className="shrink-0" />
      </form>
      <p className="mt-3 text-xs text-[var(--text-muted)]">
        Или{" "}
        <button
          type="button"
          onClick={() => {
            trackCtaEvent({ action: "open-modal", label: "InlineLeadForm", location: "inline" });
            openModal?.();
          }}
          className="text-[var(--accent)] hover:underline"
        >
          открыть полную форму
        </button>
      </p>
    </motion.div>
  );
}
