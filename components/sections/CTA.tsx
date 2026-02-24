"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { submitLead, collectUtm } from "@/lib/lead/submitLead";
import { HOME_COPY } from "@/content/site-copy";
import { TelegramLeadButton } from "@/components/cta/TelegramLeadButton";

type Status = "idle" | "loading" | "success" | "error";

export function CTA() {
  const [status, setStatus] = useState<Status>("idle");
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    niche: "",
    need: "",
    deadline: "",
    _hp: "",
  });
  const pathname = usePathname();
  const sourcePage = "home";
  const service = "general";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    trackCtaEvent({ action: "submit", label: "Home CTA", location: "home-final" });
    const result = await submitLead({
      name: form.name,
      contact: form.contact,
      niche: form.niche,
      need: form.need,
      timeline: form.deadline,
      sourcePage: pathname ?? "/",
      utm: collectUtm(),
      _hp: form._hp,
    });
    if (result.ok) {
      setStatus("success");
      setForm({ name: "", contact: "", niche: "", need: "", deadline: "", _hp: "" });
      setTimeout(() => router.push("/thank-you"), 400);
    } else {
      setStatus("error");
      alert(result.error);
    }
  };

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
                Спасибо! Мы свяжемся с вами в ближайшее время.
              </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Что дальше: в течение рабочего дня напишем или позвоним. Пришлём рабочий прототип (1 сценарий) в течение 24 часов и план внедрения под вашу задачу.
                </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="sr-only" aria-hidden>
                <label htmlFor="cta-hp">Не заполняйте</label>
                <input id="cta-hp" type="text" tabIndex={-1} autoComplete="off" value={form._hp} onChange={(e) => setForm((f) => ({ ...f, _hp: e.target.value }))} />
              </div>
              <input type="hidden" name="sourcePage" value={sourcePage} />
              <input type="hidden" name="service" value={service} />
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Имя
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
                  placeholder="Как к вам обращаться"
                />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Контакт (Telegram / почта / телефон)
                </label>
                <input
                  id="contact"
                  type="text"
                  required
                  value={form.contact}
                  onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
                  placeholder="@username или +7..."
                />
              </div>
              <div>
                <label htmlFor="niche" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Ниша / чем занимаетесь
                </label>
                <input
                  id="niche"
                  type="text"
                  value={form.niche}
                  onChange={(e) => setForm((f) => ({ ...f, niche: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
                  placeholder="Кратко"
                />
              </div>
              <div>
                <label htmlFor="need" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Что нужно
                </label>
                <textarea
                  id="need"
                  rows={3}
                  value={form.need}
                  onChange={(e) => setForm((f) => ({ ...f, need: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
                  placeholder="Лендинг, бот, автоматизация..."
                />
              </div>
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Желаемые сроки
                </label>
                <input
                  id="deadline"
                  type="text"
                  value={form.deadline}
                  onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
                  placeholder="Например: до конца месяца"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={status === "loading"}
                  className="flex-1 sm:flex-initial"
                >
                  {status === "loading" ? "Отправка…" : "Получить бесплатное демо"}
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
