"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/motion";
import { InlineLeadForm, SectionCTA, EstimateBlock } from "@/components/cta";

const STEPS = [
  { range: "48–72 часа", label: "Быстрые запуски", desc: "Лендинг, базовый бот, простая автоматизация, прототип" },
  { range: "3–5 дней", label: "MiniApp MVP", desc: "Telegram MiniApp MVP или продвинутый прототип" },
  { range: "5–7 дней", label: "Бот + интеграции", desc: "Бот с CRM и автоматизация «под ключ»" },
  { range: "7–10 дней", label: "Комплексные решения", desc: "Несколько каналов и интеграций" },
];

export function TimelineScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const triggerRef = useRef<{ kill: () => void } | null>(null);

  useEffect(() => {
    if (reduced || !sectionRef.current || !beamRef.current) return;

    const run = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const beam = beamRef.current;
      if (!section || !beam) return;

      const t = ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        onUpdate: (self) => {
          beam.style.transform = `scaleX(${self.progress})`;
        },
      });
      triggerRef.current = t as unknown as { kill: () => void };
    };

    run();
    return () => {
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
  }, [reduced]);

  return (
    <section id="timeline" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[#E9ECF5]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Сроки — Delivery pipeline
        </motion.h2>
        <motion.p
          className="mt-4 text-[#A7AFC2] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          От быстрого старта за 48 часов до комплексного внедрения за 7–10 дней.
        </motion.p>
        <p className="mt-2 text-sm text-[#7A8299] max-w-2xl">
          Каждый диапазон — это готовый пакет: что входит, что получите, сколько времени.
        </p>

        {/* Progress beam */}
        {!reduced && (
          <div className="relative mt-12 h-1 w-full rounded-full bg-white/5">
            <div
              ref={beamRef}
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#56F0FF] to-[#9B7BFF] transition-transform duration-150 will-change-transform"
              style={{ transform: "scaleX(0)", transformOrigin: "left" }}
            />
          </div>
        )}

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.range}
              className="relative rounded-xl border border-white/[0.06] bg-[#0E131C]/85 p-6 transition-colors hover:border-[#56F0FF]/25"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className="text-2xl font-bold text-[#56F0FF]">{step.range}</span>
              <h3 className="mt-2 font-semibold text-[#E9ECF5]">{step.label}</h3>
              <p className="mt-2 text-sm text-[#A7AFC2]">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 space-y-8">
          <EstimateBlock />
          <InlineLeadForm
            title="Запросить оценку по срокам"
            subtitle="Оставьте контакт — перезвоним и дадим ориентир по срокам и сложности."
          />
        </div>

        <SectionCTA />
      </Container>
    </section>
  );
}
