"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { useLeadForm } from "@/hooks/useLeadForm";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { TelegramLeadButton } from "@/components/cta/TelegramLeadButton";
import { FormStatus } from "@/components/forms/FormStatus";

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

export function DemoForm() {
  const pathname = usePathname();
  const [task, setTask] = useState("");
  const [improve, setImprove] = useState("");
  const [chaos, setChaos] = useState("");
  const [agreed, setAgreed] = useState(false);
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
  } = useLeadForm({ source: "demo_page" });

  const canSubmit = isValid && agreed && task.trim().length >= 10;

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
        trackCtaEvent({ action: "submit", label: "Demo Form", location: "demo-page" });
        handleSubmit(e, {
          task,
          improve,
          chaos,
          sourcePage: pathname ?? "/demo",
          _hp: hp,
        });
      }}
      className="space-y-4"
    >
      <div className="sr-only" aria-hidden>
        <label htmlFor="demo-hp">Не заполняйте</label>
        <input id="demo-hp" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>
      <div>
        <label htmlFor="demo-name" className="block text-sm font-medium text-[var(--text-secondary)]">
          Ваше имя
        </label>
        <input
          id="demo-name"
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
      <PhoneInput value={phone} onChange={setPhone} label="Телефон" id="demo-phone" />
      <div>
        <label htmlFor="demo-improve" className="block text-sm font-medium text-[var(--text-secondary)]">
          Что хотите улучшить?
        </label>
        <select
          id="demo-improve"
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
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
          value={chaos}
          onChange={(e) => setChaos(e.target.value)}
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
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
          placeholder="Бот для входящих, лендинг под трафик, автоматизация CRM…"
        />
      </div>
      <div className="flex items-start gap-3">
        <input
          id="demo-agreed"
          type="checkbox"
          required
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
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
      <FormStatus variant={status === "error" ? "error" : "idle"} message={errorMessage} />
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={status === "loading" || !canSubmit}
          className="flex-1 min-h-[52px] sm:min-h-[48px] rounded-lg bg-[var(--accent)] py-3 text-base font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_24px_rgba(139,92,246,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Отправляю..." : "Получить бесплатное демо"}
        </button>
        <TelegramLeadButton location="demo-form" className="sm:w-auto" />
      </div>
      <p className="form-disclaimer">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer">
          политикой конфиденциальности
        </a>
      </p>
      <p className="mt-3 text-xs text-[var(--text-muted)]">
        Пришлём рабочий прототип за 24 часа. Нам нужно от вас: описание одного процесса или проблемы, доступы к мессенджеру / CRM (если есть), примеры диалогов.
      </p>
    </form>
  );
}
