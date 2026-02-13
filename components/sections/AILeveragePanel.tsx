"use client";

import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HOME_COPY } from "@/content/site-copy";
import { SectionShell } from "@/components/layout/SectionShell";
import { useReducedMotion } from "@/lib/motion";

type Key = "speed" | "capacity" | "control";

const ITEMS: Array<{
  key: Key;
  title: string;
  subtitle: string;
  points: readonly string[];
}> = [
  {
    key: "speed",
    title: "Скорость",
    subtitle: "Быстрый отклик и быстрые итерации — без потери качества.",
    points: HOME_COPY.leverage.cards[0]?.points ?? [],
  },
  {
    key: "capacity",
    title: "Пропускная способность",
    subtitle: "Команда обрабатывает больше входящих без найма и перегруза.",
    points: HOME_COPY.leverage.cards[1]?.points ?? [],
  },
  {
    key: "control",
    title: "Контроль и измеримость",
    subtitle: "Понятные статусы, KPI и отчётность, чтобы управлять процессом.",
    points: HOME_COPY.leverage.cards[2]?.points ?? [],
  },
];

function Icon({ k }: { k: Key }) {
  const common = "h-8 w-8 rounded-xl border border-white/10 bg-black/20 flex items-center justify-center";
  if (k === "speed")
    return (
      <span className={common} aria-hidden>
        <span className="text-[var(--accent)] text-sm font-semibold">⚡</span>
      </span>
    );
  if (k === "capacity")
    return (
      <span className={common} aria-hidden>
        <span className="text-[var(--accent-pink-strong)] text-sm font-semibold">⤴</span>
      </span>
    );
  return (
    <span className={common} aria-hidden>
      <span className="text-[var(--accent-strong)] text-sm font-semibold">◎</span>
    </span>
  );
}

function MobileAccordion({
  active,
  setActive,
}: {
  active: Key;
  setActive: (k: Key) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="grid gap-3 md:hidden">
      {ITEMS.map((item) => {
        const open = item.key === active;
        return (
          <div key={item.key} className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/55 overflow-hidden">
            <button
              type="button"
              onClick={() => setActive(open ? item.key : item.key)}
              className="w-full px-5 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <Icon k={item.key} />
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.subtitle}</p>
                </div>
              </div>
              <span className="text-[var(--text-muted)]">{open ? "—" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={reduced ? false : { height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="px-5 pb-5 pt-1">
                    <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                      {item.points.map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function AILeveragePanelInner() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Key>("speed");

  const activeItem = useMemo(() => ITEMS.find((i) => i.key === active) ?? ITEMS[0], [active]);

  return (
    <SectionShell id="leverage" variant="panel" bg="primary">
      <motion.h2
        className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {HOME_COPY.leverage.title}
      </motion.h2>
      <motion.p
        className="mt-4 text-[var(--text-secondary)] max-w-3xl"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {HOME_COPY.leverage.subtitle}
      </motion.p>

      <div className="mt-12 hidden md:grid grid-cols-[0.45fr,0.55fr] gap-6">
        {/* Left: segments */}
        <div className="rounded-3xl border border-white/10 bg-[var(--bg-elevated)]/55 p-3">
          {ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActive(item.key)}
                className={`w-full rounded-2xl px-4 py-4 text-left transition-colors ${
                  isActive ? "bg-[var(--accent)]/10" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon k={item.key} />
                  <div className="min-w-0">
                    <p className={`font-semibold ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>{item.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2">{item.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: active panel */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(11,6,32,0.55)] p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-65"
            aria-hidden
            style={{
              background:
                "radial-gradient(680px 260px at 25% 0%, rgba(139,92,246,0.22) 0%, transparent 62%), radial-gradient(540px 240px at 85% 30%, rgba(236,72,153,0.14) 0%, transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">AI leverage</p>
            <div className="mt-3 flex items-center gap-3">
              <Icon k={activeItem.key} />
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">{activeItem.title}</h3>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.key}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="mt-5"
              >
                <p className="text-sm text-[var(--text-secondary)]">{activeItem.subtitle}</p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                  {activeItem.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-10 md:hidden">
        <MobileAccordion active={active} setActive={setActive} />
      </div>
    </SectionShell>
  );
}

export const AILeveragePanel = memo(AILeveragePanelInner);

