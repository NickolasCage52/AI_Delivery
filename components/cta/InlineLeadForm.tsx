"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLeadModal } from "./LeadModal";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { useLeadForm } from "@/hooks/useLeadForm";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { TelegramLeadButton } from "./TelegramLeadButton";
import { FormStatus } from "@/components/forms/FormStatus";

export function InlineLeadForm({
  title = "Запросить оценку",
  subtitle = "Оставьте контакт — перезвоним и дадим ориентир по срокам и стоимости.",
  compact = false,
}: {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const openModal = useLeadModal();
  const [hp, setHp] = React.useState("");
  const {
    name,
    setName,
    phone,
    setPhone,
    status,
    errorMessage,
    isValid,
    handleSubmit,
    reset,
  } = useLeadForm({ source: "inline_form" });

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-6 text-center"
      >
        <p className="text-[var(--accent-pink-strong)] font-medium">
          ✅ Заявка отправлена!
        </p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Мы напишем вам в ближайшее время.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-3 text-sm text-[var(--accent)] hover:underline"
        >
          Отправить ещё одну заявку
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
      <form
        onSubmit={(e) => {
          trackCtaEvent({ action: "submit", label: "InlineLeadForm", location: "inline" });
          handleSubmit(e, { sourcePage: pathname ?? "/", _hp: hp });
        }}
        className="mt-4 flex flex-col gap-3"
      >
        <div className="sr-only" aria-hidden>
          <label htmlFor="inline-hp">Не заполняйте</label>
          <input id="inline-hp" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </div>
        <FormStatus variant={status === "error" ? "error" : "idle"} message={errorMessage} className="w-full" />
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:items-end">
          <div className="flex-1 min-w-[140px]">
            <label htmlFor="inline-name" className="block text-sm font-medium text-[var(--text-secondary)]">
              Ваше имя
            </label>
            <input
              id="inline-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван"
              inputMode="text"
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-2.5 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px] sm:min-h-[44px]"
            />
          </div>
          <div className="flex-1 min-w-0">
            <PhoneInput value={phone} onChange={setPhone} label="Телефон" id="inline-phone" />
          </div>
          <button
            type="submit"
            disabled={status === "loading" || !isValid}
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-base font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_16px_rgba(139,92,246,0.35)] disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] sm:min-h-[48px] shrink-0"
          >
            {status === "loading" ? "Отправляю..." : "Отправить"}
          </button>
        </div>
        <p className="form-disclaimer">
          Нажимая кнопку, вы соглашаетесь с{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            политикой конфиденциальности
          </a>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <TelegramLeadButton location="inline-form" className="shrink-0" />
          <span className="text-xs text-[var(--text-muted)]">
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
          </span>
        </div>
      </form>
    </motion.div>
  );
}
