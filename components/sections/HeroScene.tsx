"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/fx/MagneticButton";
import ShaderBackground from "@/components/ui/shader-background";
import { BusinessCoverageGraph } from "@/components/hero/BusinessCoverageGraph";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/motion";
import { getHeroBlurClass } from "@/lib/perf/quality";
import { useQuality } from "@/hooks/useQuality";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { HOME_COPY } from "@/content/site-copy";

const HERO = HOME_COPY.hero;

const HeroFXLayer = memo(function HeroFXLayer() {
  const quality = useQuality();
  const blurClass = getHeroBlurClass(quality);
  const shaderOpacity =
    quality === "low" ? "opacity-[0.35]" : quality === "medium" ? "opacity-[0.55]" : "opacity-[0.65]";
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]"
        aria-hidden
      />
      {/* Subtle grid only in hero (depth, not cyberpunk) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at 40% 35%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at 40% 35%, black 0%, transparent 70%)",
        }}
      />
      <div
        className={`pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/[0.08] ${blurClass.orb1}`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute right-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[var(--accent-pink)]/[0.05] ${blurClass.orb2}`}
        aria-hidden
      />
      <ShaderBackground className={`absolute inset-0 z-0 h-full w-full ${shaderOpacity}`} />
    </>
  );
});

const HeroContent = memo(function HeroContent() {
  const reduced = useReducedMotion();

  return (
    <>
      <Container className="relative z-10 py-24 md:py-32 flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
        {/* Left: copy */}
        <div className="flex-1 max-w-2xl order-2 lg:order-1">
          <div className="relative rounded-3xl border border-white/10 bg-black/40 p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <motion.h1
              className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {HERO.title}
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-[var(--text-primary)]/80 md:text-xl max-w-xl leading-relaxed"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              {HERO.subtitle}
            </motion.p>
            <motion.p
              className="mt-4 text-xs font-medium text-[var(--text-muted)]"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 }}
            >
              {HERO.speedLine}
            </motion.p>
            {/* Benefit bullets */}
            <ul className="mt-6 md:mt-8 space-y-2 max-w-lg">
              {HERO.bullets.map((b, i) => (
                <motion.li
                  key={b}
                  className="flex items-center gap-2 text-sm text-[var(--text-primary)]/75"
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.12 + i * 0.04 }}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                  {b}
                </motion.li>
              ))}
            </ul>
            <motion.p
              className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {HERO.offerNote}
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <MagneticButton
                href="/demo"
                variant="primary"
                size="large"
                onClick={() => trackCtaEvent({ action: "click", label: HERO.ctaPrimary, location: "hero", href: "/demo" })}
              >
                {HERO.ctaPrimary}
              </MagneticButton>
              <MagneticButton href="/#cases" variant="secondary" size="large">
                {HERO.ctaSecondary}
              </MagneticButton>
            </motion.div>
          </div>
        </div>

        {/* Right: integration graph (brand visual) */}
        <div className="flex-shrink-0 flex items-center justify-center order-1 lg:order-2 w-full mx-auto lg:mx-0 lg:flex-1">
          <BusinessCoverageGraph />
        </div>
      </Container>

      {!reduced && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <span className="text-xs uppercase tracking-widest">Листайте</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-8 w-5 rounded-full border-2 border-current flex justify-center pt-1"
          >
            <motion.span className="h-1.5 w-1 rounded-full bg-current" />
          </motion.div>
        </motion.div>
      )}
    </>
  );
});

export function HeroScene() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-[var(--bg-primary)]">
      <HeroFXLayer />
      <HeroContent />
    </section>
  );
}
