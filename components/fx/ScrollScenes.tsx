"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";

const THESES = [
  { label: "48–72 часа", sub: "Быстрый запуск" },
  { label: "3–5 дней", sub: "MiniApp MVP" },
  { label: "5–7 дней", sub: "Под ключ" },
];

/**
 * GSAP ScrollTrigger: pinned hero scene that morphs into 3 theses as user scrolls.
 * Disabled when prefers-reduced-motion.
 */
export function ScrollScenes({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const thesesRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current || !thesesRef.current) return;

    let trigger: { kill: () => void } | null = null;

    const run = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const theses = thesesRef.current;
      if (!section || !theses) return;

      const panels = theses.querySelectorAll("[data-thesis]");
      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          panels.forEach((el, i) => {
            const start = i / 3;
            const end = (i + 1) / 3;
            const t = Math.max(0, Math.min(1, (p - start) / (end - start)));
            (el as HTMLElement).style.opacity = String(0.3 + 0.7 * t);
            (el as HTMLElement).style.transform = `translateY(${20 - 20 * t}px)`;
          });
        },
      }) as unknown as { kill: () => void };
    };

    run();
    return () => {
      trigger?.kill();
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className={`relative ${className}`}>
      {children}
      {!reduced && (
        <div
          ref={thesesRef}
          className="absolute bottom-12 left-0 right-0 flex flex-wrap justify-center gap-6 px-6 md:bottom-16 md:gap-10"
        >
          {THESES.map((t, i) => (
            <div
              key={t.label}
              data-thesis
              className="rounded-xl border border-[#56F0FF]/20 bg-[#0A0F1C]/85 px-5 py-3 text-center transition-opacity duration-300"
              style={{ opacity: i === 0 ? 1 : 0.3 }}
            >
              <span className="block text-lg font-semibold text-[#56F0FF] md:text-xl">
                {t.label}
              </span>
              <span className="text-sm text-[#A7AFC2]">{t.sub}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
