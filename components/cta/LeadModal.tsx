"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { useLeadForm } from "@/hooks/useLeadForm";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/ui/scrollLock";
import { TelegramLeadButton } from "./TelegramLeadButton";
import { FormStatus } from "@/components/forms/FormStatus";

type LeadModalContextType = ((context?: { sourcePage?: string; service?: string }) => void) | null;

const LeadModalContext = createContext<LeadModalContextType>(null);

export function useLeadModal() {
  return useContext(LeadModalContext);
}

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [context, setContext] = useState({ sourcePage: "", service: "" });
  const [showMore, setShowMore] = useState(false);
  const [need, setNeed] = useState("");
  const [sphere, setSphere] = useState("");
  const [timeline, setTimeline] = useState("");
  const [hp, setHp] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  const pathname = usePathname();
  const sourcePage = context.sourcePage || pathname || "/";

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
    source: "lead_modal",
    onSuccess: () => {},
  });

  useEffect(() => setMounted(true), []);

  const openModal = useCallback((payload?: { sourcePage?: string; service?: string }) => {
    const sp =
      payload?.sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "");
    setContext({ sourcePage: sp, service: payload?.service ?? "" });
    setClosing(false);
    setOpen(true);
    trackCtaEvent({ action: "open-modal", label: "LeadModal", location: "global" });
  }, []);

  const closeModal = useCallback(() => {
    setClosing(true);
  }, []);

  const handleExitComplete = useCallback(() => {
    setOpen(false);
    setClosing(false);
    setTimeout(() => {
      reset();
      setNeed("");
      setSphere("");
      setTimeline("");
      setShowMore(false);
    }, 0);
  }, [reset]);

  const visible = open || closing;
  useEffect(() => {
    if (!visible || typeof document === "undefined") return;
    lockBodyScroll();
    lastActiveRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const modal = modalRef.current;
    const getFocusable = (el: HTMLElement) =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((node) => !node.hasAttribute("disabled") && !node.getAttribute("aria-hidden"));

    const focusFirst = () => {
      if (!modal) return;
      const focusables = getFocusable(modal);
      (focusables[0] ?? modal).focus();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeModal();
        return;
      }
      if (e.key !== "Tab" || !modal) return;
      const focusables = getFocusable(modal);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const raf = window.requestAnimationFrame(focusFirst);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      unlockBodyScroll();
      lastActiveRef.current?.focus();
    };
  }, [visible, closeModal]);

  const modalContent =
    mounted && typeof document !== "undefined" && visible ? (
      <motion.div
        key="lead-modal"
        className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
        initial={false}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onAnimationComplete={closing ? handleExitComplete : undefined}
      >
        <div
          className="absolute inset-0 bg-black/70"
          style={{ opacity: closing ? 0 : 1 }}
          onClick={closeModal}
          aria-hidden
        />
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
          tabIndex={-1}
          className="relative z-[1201] w-full max-w-md rounded-2xl border border-white/10 bg-[var(--bg-elevated)] p-6 shadow-xl md:p-8"
          initial={closing ? false : { opacity: 0, scale: 0.96, y: -10 }}
          animate={
            closing
              ? { opacity: 0, scale: 0.96, y: -10 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h3 id="lead-modal-title" className="text-xl font-semibold text-[var(--text-primary)]">
              Получить план внедрения
            </h3>
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Оставьте контакт — разберём задачу и предложим реалистичный план со сроками, стеком и ожидаемыми метриками.
          </p>

          {status === "success" ? (
            <motion.div
              className="mt-6 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-[var(--accent-pink-strong)] font-medium">
                ✅ Заявка отправлена!
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Мы напишем вам в ближайшее время. В течение рабочего дня напишем или позвоним. Пришлём MVP (рабочий прототип) за 24 часа и план внедрения.
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={reset}
                  className="flex-1 rounded-lg border border-[var(--accent)]/40 py-2.5 text-sm font-medium text-[var(--accent)]"
                >
                  Отправить ещё
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-white/20 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-white/5"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                trackCtaEvent({ action: "submit", label: "LeadModal", location: "modal" });
                handleSubmit(e, {
                  need,
                  sphere: sphere || undefined,
                  timeline: timeline || undefined,
                  sourcePage,
                  _hp: hp,
                });
              }}
              className="mt-6 space-y-4"
            >
              <FormStatus variant={status === "error" ? "error" : "idle"} message={errorMessage} />
              <div className="sr-only" aria-hidden>
                <label htmlFor="modal-hp">Не заполняйте</label>
                <input id="modal-hp" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
              </div>
              <input type="hidden" name="sourcePage" value={context.sourcePage} />
              <input type="hidden" name="service" value={context.service} />
              <div>
                <label htmlFor="modal-name" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Ваше имя
                </label>
                <input
                  id="modal-name"
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
              <PhoneInput value={phone} onChange={setPhone} label="Телефон" id="modal-phone" />
              <div>
                <label htmlFor="modal-need" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Что нужно
                </label>
                <input
                  id="modal-need"
                  type="text"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 min-h-[48px]"
                  placeholder="Лендинг, бот, автоматизация..."
                />
              </div>
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {showMore ? "Скрыть доп. поля" : "Добавить детали (опционально)"}
              </button>
              {showMore && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="modal-sphere" className="block text-sm font-medium text-[var(--text-secondary)]">
                      Сфера / ниша
                    </label>
                    <input
                      id="modal-sphere"
                      type="text"
                      value={sphere}
                      onChange={(e) => setSphere(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
                      placeholder="E‑commerce, услуги, образование..."
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-timeline" className="block text-sm font-medium text-[var(--text-secondary)]">
                      Желаемые сроки
                    </label>
                    <input
                      id="modal-timeline"
                      type="text"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-surface)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50"
                      placeholder="48–72 часа / 3–5 дней / 7–10 дней"
                    />
                  </div>
                </div>
              )}
              <p className="form-disclaimer">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  политикой конфиденциальности
                </a>
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={status === "loading" || !isValid}
                    className="flex-1 min-h-[52px] rounded-lg bg-[var(--accent)] py-3 font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Отправляю..." : "Отправить"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-white/20 px-4 py-3 text-[var(--text-secondary)] hover:bg-white/5"
                  >
                    Отмена
                  </button>
                </div>
                <TelegramLeadButton location="lead-modal" variant="outline" />
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    ) : null;

  return (
    <LeadModalContext.Provider value={openModal}>
      {children}
      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </LeadModalContext.Provider>
  );
}
