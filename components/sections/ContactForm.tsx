"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { submitLead, collectUtm } from "@/lib/lead/submitLead";
import { TelegramLeadButton } from "@/components/cta/TelegramLeadButton";
import { FormStatus } from "@/components/forms/FormStatus";

type Status = "idle" | "loading" | "error";

export function ContactForm({ sourcePage, service }: { sourcePage?: string; service?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submittedRef = useRef(false);
  const [form, setForm] = useState({ name: "", contact: "", task: "", sphere: "", timeline: "", _hp: "" });
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittedRef.current) return;
    submittedRef.current = true;
    setStatus("loading");
    setErrorMessage("");
    trackCtaEvent({ action: "submit", label: "Contact Form", location: "contact-page" });
    const result = await submitLead({
      name: form.name,
      contact: form.contact,
      task: form.task,
      sphere: form.sphere,
      timeline: form.timeline,
      sourcePage: sourcePage ?? pathname ?? "/contact",
      formId: "contact_page",
      utm: collectUtm(),
      _hp: form._hp,
    });
    if (result.ok) {
      router.push("/thank-you");
    } else {
      submittedRef.current = false;
      setStatus("error");
      setErrorMessage(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="sr-only" aria-hidden>
        <label htmlFor="contact-hp">Не заполняйте</label>
        <input id="contact-hp" type="text" tabIndex={-1} autoComplete="off" value={form._hp} onChange={(e) => setForm((f) => ({ ...f, _hp: e.target.value }))} />
      </div>
      <input type="hidden" name="sourcePage" value={sourcePage ?? ""} />
      <input type="hidden" name="service" value={service ?? ""} />
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--text-secondary)]">
          Имя
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
          placeholder="Как к вам обращаться"
        />
      </div>
      <div>
        <label htmlFor="contact-contact" className="block text-sm font-medium text-[var(--text-secondary)]">
          Контакт (Telegram / почта / телефон)
        </label>
        <input
          id="contact-contact"
          type="text"
          required
          value={form.contact}
          onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
          placeholder="@username или +7..."
        />
      </div>
      <div>
        <label htmlFor="contact-task" className="block text-sm font-medium text-[var(--text-secondary)]">
          Коротко о задаче
        </label>
        <textarea
          id="contact-task"
          rows={3}
          required
          value={form.task}
          onChange={(e) => setForm((f) => ({ ...f, task: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
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
            value={form.sphere}
            onChange={(e) => setForm((f) => ({ ...f, sphere: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
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
            value={form.timeline}
            onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
            placeholder="48–72 часа / 3–5 дней / 7–10 дней"
          />
        </div>
      </div>
      <FormStatus variant={status === "error" ? "error" : "idle"} message={errorMessage} />
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-1 min-h-[48px] rounded-lg bg-[var(--accent)] py-3 text-base font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_24px_rgba(139,92,246,0.35)] disabled:opacity-70"
        >
          {status === "loading" ? "Отправка…" : "Отправить"}
        </button>
        <TelegramLeadButton location="contact-form" className="sm:w-auto" />
      </div>
    </form>
  );
}
