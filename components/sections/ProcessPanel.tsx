"use client";

import React, { useCallback, useRef, useLayoutEffect, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/motion";
import { SectionCTA } from "@/components/cta";
import { useQuality } from "@/hooks/useQuality";
import { useInViewport } from "@/hooks/useInViewport";
import { HOME_COPY } from "@/content/site-copy";
import styles from "./process-panel.module.css";

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
    get: "1–2 страницы плана + список интеграций + тайминг 24ч MVP / 3–10 дней боевой запуск",
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
    get: "Рабочая версия MVP",
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
    fromYou: ["Фидбек по MVP", "Назначение ответственных"],
  },
];

const SCROLL_DEBUG = typeof process !== "undefined" && process.env.NEXT_PUBLIC_SCROLL_DEBUG === "1";
const RESIZE_DEBOUNCE_MS = 150;

function ProcessPanelInner() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepElsRef = useRef<HTMLElement[]>([]);
  const panelElsRef = useRef<HTMLElement[]>([]);
  const stackElsRef = useRef<HTMLElement[]>([]);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const lastIndexRef = useRef(-1);
  const beamRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const sectionInView = useInViewport(sectionRef, { rootMargin: "120px", threshold: 0.15 });
  const [connectorAnimate, setConnectorAnimate] = useState(false);

  useEffect(() => {
    if (sectionInView && !connectorAnimate) setConnectorAnimate(true);
  }, [sectionInView, connectorAnimate]);

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
        const offset = depth * 32;
        const translateX = offset;
        const translateY = offset * 0.6;
        const scale = 1 - depth * 0.08;
        const opacity = depth === 1 ? 0.15 : 0.06;
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

  // Populate refs synchronously so GSAP init can use them
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    stepElsRef.current = Array.from(section.querySelectorAll<HTMLElement>("[data-process-step]"));
    panelElsRef.current = Array.from(section.querySelectorAll<HTMLElement>("[data-process-panel]"));
    stackElsRef.current = Array.from(section.querySelectorAll<HTMLElement>("[data-process-stack]"));
    applyActiveIndex(0);
  }, [applyActiveIndex]);

  // Single init: gsap.context + useLayoutEffect, refresh after init and on resize, cleanup via revert()
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced || quality !== "high" || typeof window === "undefined") return;
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    let cancelled = false;
    const run = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      if (cancelled) return;
      const sec = sectionRef.current;
      if (!sec) return;

      const steps = STEPS.length;
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 5%",
          end: `+=${steps * 80}%`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate(self) {
            if (beamRef.current) {
              beamRef.current.style.transform = `scaleX(${self.progress})`;
            }
            const index = Math.min(steps - 1, Math.max(0, Math.floor(self.progress * steps * 1.01)));
            applyActiveIndex(index);
          },
          ...(SCROLL_DEBUG
            ? {
                onEnter: () => console.log("[HowWeWork] onEnter"),
                onLeave: () => console.log("[HowWeWork] onLeave"),
                onRefresh: () => console.log("[HowWeWork] onRefresh"),
              }
            : {}),
        });
        if (SCROLL_DEBUG) {
          console.log("[HowWeWork] init", "ScrollTrigger.getAll().length =", ScrollTrigger.getAll().length);
        }
      }, sectionRef);

      requestAnimationFrame(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
      document.fonts?.ready?.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      let resizeId: ReturnType<typeof setTimeout> | null = null;
      const onResize = () => {
        if (resizeId) clearTimeout(resizeId);
        resizeId = setTimeout(() => {
          resizeId = null;
          if (!cancelled) ScrollTrigger.refresh();
        }, RESIZE_DEBOUNCE_MS);
      };
      window.addEventListener("resize", onResize);

      const cleanup = () => {
        window.removeEventListener("resize", onResize);
        if (resizeId) clearTimeout(resizeId);
        ctx.revert();
        lastIndexRef.current = -1;
      };
      if (cancelled) {
        cleanup();
        return;
      }
      cleanupRef.current = cleanup;
    };

    run();
    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [reduced, quality, applyActiveIndex]);

  const showMotion = !reduced;

  return (
    <section
      id="process"
      ref={sectionRef}
      className={`relative min-h-screen overflow-hidden bg-[var(--bg-primary)] ${styles.section}`}
    >
      <Container className="relative z-10">
        <header className={styles.header}>
          <motion.h2
            className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
            initial={showMotion ? { clipPath: "inset(0 0 100% 0)" } : false}
            animate={showMotion && sectionInView ? { clipPath: "inset(0 0 0% 0)" } : false}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {HOME_COPY.process.title}
          </motion.h2>
          <motion.p
            className="mt-4 text-[var(--text-secondary)]"
            initial={showMotion ? { opacity: 0, y: 16 } : false}
            animate={showMotion && sectionInView ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {HOME_COPY.process.subtitle}
          </motion.p>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr,1.2fr]">
          {/* Left: steps nav + progress beam */}
          <div className={styles.stepsList}>
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
            {/* Mobile: vertical connector */}
            <div className={`${styles.stepsConnector} ${connectorAnimate ? styles.animate : ""}`} aria-hidden>
              <div className={styles.stepsConnectorProgress} />
            </div>
            <div className="space-y-4">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                type="button"
                data-process-step
                data-step-index={i}
                data-active={i === 0 ? "true" : "false"}
                onClick={() => applyActiveIndex(i)}
                className={`${styles.stepCard} w-full rounded-xl border border-white/10 bg-[var(--bg-elevated)]/60 p-4 text-left cursor-default border-white/10 hover:border-[var(--accent)]/20 data-[active=true]:border-[var(--accent)]/40 data-[active=true]:bg-[var(--accent)]/5 data-[active=true]:shadow-[0_0_24px_rgba(139,92,246,0.12)] ${sectionInView ? styles.visible : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${styles.stepIconWrapper} ${styles.stepIcon} flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-sm font-semibold text-[var(--accent)]`}>
                    {s.num}
                  </span>
                  <div>
                    <span className={`${styles.stepTitle} font-semibold text-[var(--text-primary)] min-[768px]:text-base`}>{s.title}</span>
                    <span className="ml-2 text-xs text-[var(--accent)]">{s.time}</span>
                  </div>
                </div>
              </button>
            ))}
            </div>
          </div>

          {/* Right: stack of panels (OS-style) + main card */}
          <div className="relative min-h-[520px] md:min-h-[560px]">
            {/* Stack depth: 1–2 back panels (OS-style) */}
            {!reduced && (
              <div className="absolute right-0 top-0 w-full h-full pointer-events-none overflow-visible" aria-hidden>
                {STEPS.map((s, i) => (
                  <div
                    key={s.panel}
                    data-process-stack
                    data-step-index={i}
                    className="absolute right-0 top-0 w-[calc(100%-24px)] h-[calc(100%-20px)] rounded-2xl border border-white/[0.06] bg-[var(--bg-elevated)]/40 backdrop-blur-sm transition-all duration-300"
                    style={{ opacity: 0, visibility: "hidden", transform: "translate(0px,0px) scale(1)", transformOrigin: "top right" }}
                  >
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <span className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)]">{s.num}</span>
                      <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-muted)]/70">{s.panel}</span>
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
                  className={`${styles.panel} absolute inset-0 p-6 md:p-8`}
                >
                  <p className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
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

                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${styles.ctaBlock} ${sectionInView ? styles.visible : ""} mt-16`}>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] md:text-xl">
            {HOME_COPY.process.ctaTitle}
          </h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)] md:text-base md:opacity-90">
            {HOME_COPY.process.ctaSubtitle}
          </p>
          <SectionCTA
            primary={HOME_COPY.process.ctaPrimary}
            primaryHref="/demo"
            options={[
              { label: HOME_COPY.hero.ctaSecondary, href: "/contact" },
              { label: HOME_COPY.proof.casesLink, href: "/cases" },
              { label: "Показать примеры сценариев", href: "/stack" },
            ]}
            sourcePage="home"
            service="process"
          />
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            {HOME_COPY.process.ctaMicro}
          </p>
        </div>
      </Container>
    </section>
  );
}

export const ProcessPanel = React.memo(ProcessPanelInner);
