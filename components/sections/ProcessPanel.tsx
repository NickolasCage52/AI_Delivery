"use client";

import React, { useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/motion";
import { SectionCTA, useLeadModal } from "@/components/cta";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { useQuality } from "@/hooks/useQuality";

const STEPS = [
  {
    num: 1,
    title: "Бриф и цель",
    panel: "Brief",
    what: [
      "Фиксируем цель (лиды / экономия времени / гипотеза)",
      "Проверяем канал и ограничения",
      "Определяем метрики успеха",
    ],
    get: "Краткий scope + рекомендации по MVP",
    time: "15–30 минут",
    fromYou: ["Ниша", "Примеры запросов или оффера", "Контакт для согласований"],
  },
  {
    num: 2,
    title: "План внедрения",
    panel: "Plan",
    what: [
      "Архитектура и сценарии",
      "Интеграции и риски",
      "План работ",
    ],
    get: "1–2 страницы плана + список интеграций + тайминг 48–72ч / 3–5 / 5–7 / 7–10 дней",
    time: "2–6 часов",
    fromYou: ["Подтверждение scope", "Доступы к ключевым системам (если нужно)"],
  },
  {
    num: 3,
    title: "Сборка MVP",
    panel: "Build",
    what: [
      "Прототип / бот / лендинг / miniapp",
      "База знаний и сценарии",
    ],
    get: "Рабочая версия + демо",
    time: "1–5 дней (по пакету)",
    fromYou: ["Доступы при необходимости", "Материалы: контент, логотипы"],
  },
  {
    num: 4,
    title: "Интеграции и автоматизация",
    panel: "Integrations",
    what: [
      "CRM / Sheets / уведомления / аналитика",
      "n8n-пайплайн",
    ],
    get: "End-to-end поток лидов, меньше рутины",
    time: "1–3 дня",
    fromYou: ["Доступы к CRM / каналам", "Согласование ролей"],
  },
  {
    num: 5,
    title: "Handoff и запуск",
    panel: "Handoff",
    what: [
      "Тесты и полировка",
      "Инструкции и handoff на человека",
    ],
    get: "Доступы, документация, видео/гайд, поддержка на старт",
    time: "2–8 часов",
    fromYou: ["Фидбек по демо", "Назначение ответственных"],
  },
];

function ProcessPanelInner() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepElsRef = useRef<HTMLElement[]>([]);
  const panelElsRef = useRef<HTMLElement[]>([]);
  const stackElsRef = useRef<HTMLElement[]>([]);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const openModal = useLeadModal();
  const triggerRef = useRef<{ kill: () => void } | null>(null);
  const lastIndexRef = useRef(-1);
  const beamRef = useRef<HTMLDivElement>(null);

  const applyActiveIndex = useCallback((index: number) => {
    if (index === lastIndexRef.current) return;
    lastIndexRef.current = index;
    stepElsRef.current.forEach((el) => {
      const stepIndex = Number(el.dataset.stepIndex || 0);
      el.dataset.active = stepIndex === index ? "true" : "false";
    });
    panelElsRef.current.forEach((el) => {
      const stepIndex = Number(el.dataset.stepIndex || 0);
      el.dataset.active = stepIndex === index ? "true" : "false";
    });
    stackElsRef.current.forEach((el) => {
      const stepIndex = Number(el.dataset.stepIndex || 0);
      const depth = index - stepIndex;
      if (depth >= 1 && depth <= 2) {
        const translateX = depth * 12;
        const translateY = depth * 8;
        const scale = 1 - depth * 0.02;
        const opacity = 0.4 - depth * 0.1;
        el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(5 - depth);
        el.style.visibility = "visible";
      } else {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
      }
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    stepElsRef.current = Array.from(section.querySelectorAll<HTMLElement>("[data-process-step]"));
    panelElsRef.current = Array.from(section.querySelectorAll<HTMLElement>("[data-process-panel]"));
    stackElsRef.current = Array.from(section.querySelectorAll<HTMLElement>("[data-process-stack]"));
    applyActiveIndex(0);
  }, [applyActiveIndex]);

  useEffect(() => {
    if (reduced || quality === "low" || typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop || quality !== "high") return;

    const run = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      const steps = STEPS.length;
      const t = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: isDesktop ? `+=${steps * 80}%` : "+=50%",
        pin: isDesktop,
        pinSpacing: isDesktop,
        scrub: 1,
        onUpdate: (self) => {
          if (beamRef.current) {
            beamRef.current.style.transform = `scaleX(${self.progress})`;
          }
          const index = Math.min(steps - 1, Math.max(0, Math.floor(self.progress * steps * 1.01)));
          applyActiveIndex(index);
        },
      });
      triggerRef.current = t as unknown as { kill: () => void };
    };

    run();
    return () => {
      triggerRef.current?.kill?.();
      triggerRef.current = null;
      lastIndexRef.current = -1;
    };
  }, [applyActiveIndex, reduced, quality]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[var(--bg-primary)] py-24 md:py-32"
    >
      <Container className="relative z-10">
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Как работаем
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Минимум созвонов. Под ключ. Handoff на человека с инструкциями.
        </motion.p>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr,1.2fr]">
          {/* Left: steps nav + progress beam */}
          <div className="space-y-4">
            {!reduced && quality === "high" && (
              <div className="mb-6 h-1 w-full rounded-full bg-white/5 overflow-visible">
                <div
                  ref={beamRef}
                  className="h-full rounded-full relative will-change-transform"
                  style={{
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    background: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 60%, #F472B6 100%)",
                    boxShadow: "0 0 12px rgba(139,92,246,0.35)",
                  }}
                />
              </div>
            )}
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                type="button"
                data-process-step
                data-step-index={i}
                data-active={i === 0 ? "true" : "false"}
                onClick={() => applyActiveIndex(i)}
                className="w-full rounded-xl border p-4 text-left transition-all border-white/10 bg-[var(--bg-elevated)]/60 hover:border-[var(--accent)]/20 data-[active=true]:border-[var(--accent)]/40 data-[active=true]:bg-[var(--accent)]/5 data-[active=true]:shadow-[0_0_24px_rgba(139,92,246,0.12)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-sm font-semibold text-[var(--accent)]">
                    {s.num}
                  </span>
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">{s.title}</span>
                    <span className="ml-2 text-xs text-[var(--accent)]">{s.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: stack of panels (OS-style) + main card */}
          <div className="relative min-h-[520px] md:min-h-[560px]">
            {/* Stack depth: 1–2 back panels (OS-style) */}
            {!reduced && (
              <div className="absolute right-0 top-0 w-full h-full pointer-events-none" aria-hidden>
                {STEPS.map((s, i) => (
                  <div
                    key={s.panel}
                    data-process-stack
                    data-step-index={i}
                    className="absolute right-0 top-0 h-full w-full rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/50 transition-all duration-300"
                    style={{ opacity: 0, visibility: "hidden", transform: "translate(0px,0px) scale(1)" }}
                  >
                    <div className="p-4">
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]/60">{s.panel}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="relative min-h-[520px] md:min-h-[560px] rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/95 shadow-[0_0_40px_rgba(139,92,246,0.08)] z-10 overflow-hidden">
              {STEPS.map((step, i) => (
                <div
                  key={step.panel}
                  data-process-panel
                  data-step-index={i}
                  data-active={i === 0 ? "true" : "false"}
                  className="absolute inset-0 p-6 md:p-8 transition-all duration-300 opacity-0 translate-x-4 pointer-events-none data-[active=true]:opacity-100 data-[active=true]:translate-x-0 data-[active=true]:pointer-events-auto"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                    Операционная панель Delivery — {step.panel}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">{step.title}</h3>

                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-[var(--text-secondary)]">Что делаем</h4>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[var(--text-primary)]">
                        {step.what.map((w) => (
                          <li key={w}>{w}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[var(--text-secondary)]">Что получаете</h4>
                      <p className="mt-2 text-sm text-[var(--text-primary)]">{step.get}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[var(--text-secondary)]">Срок</h4>
                      <p className="mt-2 text-sm text-[var(--accent)]">{step.time}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[var(--text-secondary)]">Что нужно от вас</h4>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[var(--text-primary)]">
                        {step.fromYou.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Mini pipeline graph for Integrations step */}
                  {i === 3 && !reduced && (
                    <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-medium text-[var(--text-secondary)] mb-3">Pipeline</p>
                      <svg viewBox="0 0 200 64" className="w-full h-16 text-[var(--accent)]" aria-hidden>
                        <defs>
                          <linearGradient id="pipe-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.6" />
                          </linearGradient>
                        </defs>
                        <path d="M 30 32 L 60 32" stroke="url(#pipe-grad)" strokeWidth="2" fill="none" />
                        <path d="M 70 32 L 95 20" stroke="url(#pipe-grad)" strokeWidth="2" fill="none" />
                        <path d="M 70 32 L 95 32" stroke="url(#pipe-grad)" strokeWidth="2" fill="none" />
                        <path d="M 70 32 L 95 44" stroke="url(#pipe-grad)" strokeWidth="2" fill="none" />
                        <circle cx="30" cy="32" r="10" fill="#0B0620" stroke="#8B5CF6" strokeWidth="1.5" className="drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]" />
                        <circle cx="70" cy="32" r="10" fill="#0B0620" stroke="#F472B6" strokeWidth="1.5" className="drop-shadow-[0_0_6px_rgba(244,114,182,0.4)]" />
                        <circle cx="95" cy="20" r="8" fill="#0B0620" stroke="#8B5CF6" strokeWidth="1" />
                        <circle cx="95" cy="32" r="8" fill="#0B0620" stroke="#8B5CF6" strokeWidth="1" />
                        <circle cx="95" cy="44" r="8" fill="#0B0620" stroke="#8B5CF6" strokeWidth="1" />
                        <text x="30" y="36" textAnchor="middle" fontSize="8" fill="#8B5CF6">n8n</text>
                        <text x="70" y="36" textAnchor="middle" fontSize="8" fill="#F472B6">Flow</text>
                        <text x="95" y="17" textAnchor="middle" fontSize="6" fill="#A1A1B5">CRM</text>
                        <text x="95" y="35" textAnchor="middle" fontSize="6" fill="#A1A1B5">Sheets</text>
                        <text x="95" y="47" textAnchor="middle" fontSize="6" fill="#A1A1B5">TG</text>
                      </svg>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      trackCtaEvent({ action: "open-modal", label: "План внедрения", location: "process-panel" });
                      openModal?.();
                    }}
                    className="mt-8 w-full rounded-xl bg-[var(--accent)] py-3 font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_24px_rgba(139,92,246,0.35)]"
                  >
                    Запросить демо и план
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SectionCTA primary="Запросить демо и план" />
      </Container>
    </section>
  );
}

export const ProcessPanel = React.memo(ProcessPanelInner);
