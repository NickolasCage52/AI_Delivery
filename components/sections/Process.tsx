"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/motion";
import { SectionCTA, useLeadModal } from "@/components/cta";

const STEPS = [
  {
    num: 1,
    title: "15 минут бриф",
    what: "Фиксируем задачу и контекст",
    get: "Чёткий scope и договорённости",
    time: "15 мин",
  },
  {
    num: 2,
    title: "План и оценка сроков",
    what: "Схема этапов и дедлайны",
    get: "План с датами и этапами",
    time: "1 день",
  },
  {
    num: 3,
    title: "Сборка и внедрение",
    what: "Сборка под ключ",
    get: "Рабочее решение в вашей среде",
    time: "3–10 дней",
  },
  {
    num: 4,
    title: "Сдача + инструкции",
    what: "Handoff на человека, документация",
    get: "Инструкции и поддержка",
    time: "1 день",
  },
];

const ARTIFACTS = [
  { type: "brief", label: "Бриф", icon: "📋" },
  { type: "scheme", label: "Схема этапов", icon: "▣" },
  { type: "build", label: "Сборка", icon: "⚡" },
  { type: "handoff", label: "Инструкции", icon: "✓" },
];

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepElsRef = useRef<HTMLElement[]>([]);
  const panelElsRef = useRef<HTMLElement[]>([]);
  const lastIndexRef = useRef(-1);
  const reduced = useReducedMotion();
  const openModal = useLeadModal();

  const triggerRef = useRef<{ kill: () => void } | null>(null);

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
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    stepElsRef.current = Array.from(section.querySelectorAll<HTMLElement>("[data-process-step]"));
    panelElsRef.current = Array.from(section.querySelectorAll<HTMLElement>("[data-process-panel]"));
    applyActiveIndex(0);
  }, [applyActiveIndex]);

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;
    const isDesktop = window.innerWidth >= 768;

    const run = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      const steps = STEPS.length;
      const t = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: isDesktop ? "+=400%" : "+=100%",
        pin: isDesktop,
        pinSpacing: isDesktop,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const index = Math.min(steps - 1, Math.max(0, Math.floor(p * steps * 1.02)));
          applyActiveIndex(index);
        },
      });
      triggerRef.current = t as unknown as { kill: () => void };
    };

    run();
    return () => {
      triggerRef.current?.kill?.();
      triggerRef.current = null;
    };
  }, [reduced]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-[#070A0F]"
    >
      <Container className="relative z-10">
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[#E9ECF5]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Как работаем
        </motion.h2>
        <motion.p
          className="mt-4 text-[#A7AFC2] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Минимум созвонов. Под ключ. Handoff на человека с инструкциями.
        </motion.p>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: steps */}
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                data-process-step
                data-step-index={i}
                data-active={i === 0 ? "true" : "false"}
                className="rounded-xl border p-6 transition-all duration-300 border-white/[0.06] bg-[#0E131C]/60 data-[active=true]:border-[#56F0FF]/40 data-[active=true]:bg-[#56F0FF]/5 data-[active=true]:shadow-[0_0_24px_rgba(86,240,255,0.08)]"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                onClick={() => applyActiveIndex(i)}
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#56F0FF]/20 text-[#56F0FF] font-semibold">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#E9ECF5]">{step.title}</h3>
                    <span className="text-xs text-[#56F0FF]">{step.time}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#A7AFC2]">{step.what}</p>
                <p className="mt-1 text-sm font-medium text-[#E9ECF5]">→ {step.get}</p>
                <button
                  type="button"
                  onClick={() => openModal?.()}
                  className="mt-4 rounded-lg border border-[#56F0FF]/40 px-4 py-2 text-sm font-medium text-[#56F0FF] transition-colors hover:bg-[#56F0FF]/10"
                >
                  Начать этот этап
                </button>
              </motion.div>
            ))}
          </div>

          {/* Right: delivery panel (artifacts) */}
          <div className="relative hidden md:block">
            <div className="sticky top-32 rounded-2xl border border-white/[0.08] bg-[#0E131C]/95 p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-[#56F0FF]">
                Операционная панель delivery
              </p>
              <div className="mt-6 relative min-h-[200px] rounded-xl border border-dashed border-white/10 bg-[#0A0F1C]/50 p-8">
                {STEPS.map((step, i) => (
                  <div
                    key={step.num}
                    data-process-panel
                    data-step-index={i}
                    data-active={i === 0 ? "true" : "false"}
                    className="absolute inset-0 flex items-center justify-center text-center transition-all duration-300 opacity-0 scale-[0.98] data-[active=true]:opacity-100 data-[active=true]:scale-100"
                  >
                    <div>
                      <span className="text-4xl">{ARTIFACTS[i]?.icon ?? "▣"}</span>
                      <p className="mt-3 font-semibold text-[#E9ECF5]">
                        {ARTIFACTS[i]?.label ?? step.title}
                      </p>
                      <p className="mt-1 text-sm text-[#A7AFC2]">{step.what}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SectionCTA primary="Запросить демо и план" />
      </Container>
    </section>
  );
}
