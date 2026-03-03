"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { useLeadForm } from "@/hooks/useLeadForm";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { HOME_COPY } from "@/content/site-copy";
import { TelegramLeadButton } from "@/components/cta/TelegramLeadButton";
import { FormStatus } from "@/components/forms/FormStatus";

export function CTA() {
  const [niche, setNiche] = useState("");
  const [need, setNeed] = useState("");
  const [deadline, setDeadline] = useState("");
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
    reset,
  } = useLeadForm({
    source: "home_cta",
  });

  const pathname = usePathname();

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <Container>
        <motion.div
          className="mx-auto max-w-2xl rounded-2xl border border-[var(--accent)]/30 bg-[var(--bg-elevated)] p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
            {HOME_COPY.finalCta.title}
          </h2>
          <p className="mt-3 text-[var(--text-secondary)]">
            {HOME_COPY.finalCta.subtitle}
          </p>
          <div className="mt-2 text-sm text-[var(--text-muted)] space-y-1">
            {HOME_COPY.finalCta.noteLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          {status === "success" ? (
            <motion.div
              className="mt-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-[var(--accent-pink-strong)] font-medium">
                ✅ Заявка отправлена!
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Мы напишем вам в ближайшее время.
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Что дальше: в течение рабочего дня напишем или позвоним. Пришлём рабочий прототип (1 сценарий) в течение 24 часов и план внедрения под вашу задачу.
              </p>
              <button
                type="button"
                onClick={reset}
                className="btn-glow mt-4 rounded-lg border border-[var(--accent)]/40 py-2.5 px-4 text-sm font-medium text-[var(--accent)]"
              >
                Отправить ещё одну заявку
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                trackCtaEvent({ action: "submit", label: "Home CTA", location: "home-final" });
                handleSubmit(e, {
                  niche,
                  need,
                  timeline: deadline,
                  sourcePage: pathname ?? "/",
                  _hp: hp,
                });
              }}
              className="mt-8 space-y-4"
            >
              <FormStatus variant={status === "error" ? "error" : "idle"} message={errorMessage} />
              <div className="sr-only" aria-hidden>
                <label htmlFor="cta-hp">Не заполняйте</label>
                <input id="cta-hp" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
              </div>
              <input type="hidden" name="sourcePage" value={pathname ?? "/"} />
              <input type="hidden" name="service" value="general" />
              <div>
                <label htmlFor="cta-name" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Ваше имя
                </label>
                <input
                  id="cta-name"
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
              <PhoneInput value={phone} onChange={setPhone} label="Телефон" id="cta-phone" />
              <div>
                <label htmlFor="cta-niche" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Ниша / чем занимаетесь
                </label>
                <input
                  id="cta-niche"
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
                  placeholder="Кратко"
                />
              </div>
              <div>
                <label htmlFor="cta-need" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Что нужно
                </label>
                <textarea
                  id="cta-need"
                  rows={3}
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
                  placeholder="Лендинг, бот, автоматизация..."
                />
              </div>
              <div>
                <label htmlFor="cta-deadline" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Желаемые сроки
                </label>
                <input
                  id="cta-deadline"
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
                  placeholder="Например: до конца месяца"
                />
              </div>
              <p className="form-disclaimer">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  политикой конфиденциальности
                </a>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={status === "loading" || !isValid}
                  className="flex-1 sm:flex-initial min-h-[52px]"
                >
                  {status === "loading" ? "Отправляю..." : "Получить бесплатное демо"}
                </Button>
                <TelegramLeadButton location="home-cta" className="sm:w-auto" />
              </div>
            </form>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
