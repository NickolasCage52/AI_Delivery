"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { submitLead, collectUtm } from "@/lib/lead/submitLead";
import { TelegramLeadButton } from "@/components/cta/TelegramLeadButton";

const IMPROVE_OPTIONS = [
  "Заявки и лиды",
  "Скорость ответа клиентам",
  "Ручная рутина и отчёты",
  "Аналитика",
  "Другое",
] as const;

const CHAOS_OPTIONS = [
  "В мессенджерах / чатах",
  "В таблицах",
  "В CRM",
  "Системы вообще нет",
  "Другое",
] as const;

type Status = "idle" | "loading";

export function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    contact: "",
    task: "",
    improve: "",
    chaos: "",
    agreed: false,
    _hp: "",
  });
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;
    setStatus("loading");
    trackCtaEvent({ action: "submit", label: "Demo Form", location: "demo-page" });
    const result = await submitLead({
      name: form.name,
      contact: form.contact,
      task: form.task,
      improve: form.improve,
      chaos: form.chaos,
      sourcePage: pathname ?? "/demo",
      utm: collectUtm(),
      _hp: form._hp,
    });
    if (result.ok) {
      router.push("/thank-you");
    } else {
      setStatus("idle");
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="sr-only" aria-hidden>
        <label htmlFor="demo-hp">Не заполняйте</label>
        <input id="demo-hp" type="text" tabIndex={-1} autoComplete="off" value={form._hp} onChange={(e) => setForm((f) => ({ ...f, _hp: e.target.value }))} />
      </div>
      <div>
        <label htmlFor="demo-name" className="block text-sm font-medium text-[var(--text-secondary)]">
          Имя
        </label>
        <input
          id="demo-name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
          placeholder="Как к вам обращаться"
        />
      </div>
      <div>
        <label htmlFor="demo-contact" className="block text-sm font-medium text-[var(--text-secondary)]">
          Контакт (Telegram / WhatsApp / Email)
        </label>
        <input
          id="demo-contact"
          type="text"
          required
          value={form.contact}
          onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
          placeholder="@username, +7… или email"
        />
      </div>
      <div>
        <label htmlFor="demo-improve" className="block text-sm font-medium text-[var(--text-secondary)]">
          Что хотите улучшить?
        </label>
        <select
          id="demo-improve"
          value={form.improve}
          onChange={(e) => setForm((f) => ({ ...f, improve: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
        >
          <option value="">Выберите</option>
          {IMPROVE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="demo-chaos" className="block text-sm font-medium text-[var(--text-secondary)]">
          Где сейчас бардак?
        </label>
        <select
          id="demo-chaos"
          value={form.chaos}
          onChange={(e) => setForm((f) => ({ ...f, chaos: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
        >
          <option value="">Выберите</option>
          {CHAOS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="demo-task" className="block text-sm font-medium text-[var(--text-secondary)]">
          Кратко о задаче
        </label>
        <textarea
          id="demo-task"
          rows={4}
          required
          value={form.task}
          onChange={(e) => setForm((f) => ({ ...f, task: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
          placeholder="Бот для входящих, лендинг под трафик, автоматизация CRM…"
        />
      </div>
      <div className="flex items-start gap-3">
        <input
          id="demo-agreed"
          type="checkbox"
          required
          checked={form.agreed}
          onChange={(e) => setForm((f) => ({ ...f, agreed: e.target.checked }))}
          className="mt-1 h-6 w-6 shrink-0 rounded border-white/20 bg-[var(--bg-surface)] text-[var(--accent)] focus:ring-[var(--accent)]"
        />
        <label htmlFor="demo-agreed" className="text-sm text-[var(--text-secondary)]">
          Согласен с{" "}
          <Link href="/privacy" className="text-[var(--accent)] underline hover:no-underline">
            политикой конфиденциальности
          </Link>{" "}
          и использованием{" "}
          <Link href="/cookies" className="text-[var(--accent)] underline hover:no-underline">
            cookies
          </Link>
        </label>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={status === "loading" || !form.agreed}
          className="flex-1 min-h-[48px] rounded-lg bg-[var(--accent)] py-3 text-base font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_24px_rgba(139,92,246,0.35)] disabled:opacity-70"
        >
          {status === "loading" ? "Отправка…" : "Получить бесплатное демо"}
        </button>
        <TelegramLeadButton location="demo-form" className="sm:w-auto" />
      </div>
      <p className="mt-3 text-xs text-[var(--text-muted)]">
        Пришлём рабочий прототип за 24 часа. Нам нужно от вас: описание одного процесса или проблемы, доступы к мессенджеру / CRM (если есть), примеры диалогов.
      </p>
    </form>
  );
}
