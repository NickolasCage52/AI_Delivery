"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { useLeadForm } from "@/hooks/useLeadForm";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { TelegramLeadButton } from "@/components/cta/TelegramLeadButton";
import { FormStatus } from "@/components/forms/FormStatus";

export function ContactForm({ sourcePage, service }: { sourcePage?: string; service?: string }) {
  const pathname = usePathname();
  const [task, setTask] = useState("");
  const [sphere, setSphere] = useState("");
  const [timeline, setTimeline] = useState("");
  const [hp, setHp] = useState("");

  const {
    name,
    setName,
    phone,
    setPhone,
    status,
    errorMessage,
    isValid,
    handleSubmit,
  } = useLeadForm({
    source: sourcePage ?? "contact_page",
  });

  const canSubmit = isValid && task.trim().length >= 10;

  if (status === "success") {
    return (
      <div className="rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-6 text-center">
        <p className="text-[var(--accent-pink-strong)] font-medium">
          ✅ Заявка отправлена!
        </p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Мы напишем вам в ближайшее время.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        trackCtaEvent({ action: "submit", label: "Contact Form", location: "contact-page" });
        handleSubmit(e, {
          task,
          sphere: sphere || undefined,
          timeline: timeline || undefined,
          sourcePage: sourcePage ?? pathname ?? "/contact",
          _hp: hp,
        });
      }}
      className="space-y-4"
    >
      <div className="sr-only" aria-hidden>
        <label htmlFor="contact-hp">Не заполняйте</label>
        <input id="contact-hp" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>
      <input type="hidden" name="sourcePage" value={sourcePage ?? ""} />
      <input type="hidden" name="service" value={service ?? ""} />
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--text-secondary)]">
          Ваше имя
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          inputMode="text"
          autoComplete="name"
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
          placeholder="Иван"
        />
      </div>
      <PhoneInput value={phone} onChange={setPhone} label="Телефон" id="contact-phone" />
      <div>
        <label htmlFor="contact-task" className="block text-sm font-medium text-[var(--text-secondary)]">
          Коротко о задаче
        </label>
        <textarea
          id="contact-task"
          rows={3}
          required
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
          placeholder="Лендинг, бот, автоматизация..."
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="contact-sphere" className="block text-sm font-medium text-[var(--text-secondary)]">
            Сфера / ниша (опционально)
          </label>
          <input
            id="contact-sphere"
            type="text"
            value={sphere}
            onChange={(e) => setSphere(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
            placeholder="E‑commerce, услуги, образование..."
          />
        </div>
        <div>
          <label htmlFor="contact-timeline" className="block text-sm font-medium text-[var(--text-secondary)]">
            Желаемые сроки (опционально)
          </label>
          <input
            id="contact-timeline"
            type="text"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
            placeholder="48–72 часа / 3–5 дней / 7–10 дней"
          />
        </div>
      </div>
      <FormStatus variant={status === "error" ? "error" : "idle"} message={errorMessage} />
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "loading" || !canSubmit}
          className="flex-1 min-h-[52px] sm:min-h-[48px] rounded-lg bg-[var(--accent)] py-3 text-base font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_24px_rgba(139,92,246,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Отправляю..." : "Отправить"}
        </button>
        <TelegramLeadButton location="contact-form" className="sm:w-auto" />
      </div>
      <p className="form-disclaimer">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  );
}
