"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";

const CHIPS = [
  { label: "Боты", id: "bots" },
  { label: "Сайты", id: "sites" },
  { label: "Telegram MiniApps", id: "miniapps" },
  { label: "n8n-автоматизации", id: "n8n" },
];

const DESKTOP_POSITIONS = [
  { left: "88%", top: "22%" },
  { left: "5%", top: "38%" },
  { left: "82%", top: "55%" },
  { left: "8%", top: "70%" },
];

function Chip({
  label,
  id,
  scrollToSection,
  onChipHighlight,
  reduced,
}: {
  label: string;
  id: string;
  scrollToSection: (id: string) => void;
  onChipHighlight?: (chipId: string) => void;
  reduced: boolean;
}) {
  const handleClick = () => {
    scrollToSection(id);
    onChipHighlight?.(id);
  };
  return (
    <motion.button
      type="button"
      className="rounded-full border border-[#56F0FF]/25 bg-[#0A0F1C]/92 px-4 py-2 text-sm font-medium text-[#56F0FF] transition-all hover:border-[#56F0FF]/50 hover:shadow-[0_0_20px_rgba(86,240,255,0.15)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      {...(!reduced && {
        animate: { opacity: 1, scale: 1, y: [0, -4, 0] },
        transition: { y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } },
      })}
      onClick={handleClick}
    >
      {label}
    </motion.button>
  );
}

type HeroServiceChipsProps = {
  onChipHighlight?: (chipId: string) => void;
};

export function HeroServiceChips({ onChipHighlight }: HeroServiceChipsProps = {}) {
  const reduced = useReducedMotion();
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("section-highlight");
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = setTimeout(() => {
      el.classList.remove("section-highlight");
      highlightTimeoutRef.current = null;
    }, 800);
  }, []);

  if (reduced) {
    return (
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="rounded-full border border-[#56F0FF]/30 bg-[#56F0FF]/5 px-4 py-2 text-sm font-medium text-[#56F0FF] transition-colors hover:bg-[#56F0FF]/10"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(c.id);
              onChipHighlight?.(c.id);
            }}
          >
            {c.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile: inline grid */}
      <div className="flex flex-wrap gap-2 md:hidden">
        {CHIPS.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            id={c.id}
            scrollToSection={scrollToSection}
            onChipHighlight={onChipHighlight}
            reduced={false}
          />
        ))}
      </div>
      {/* Desktop: constellation (absolute inside hero) */}
      <div className="relative hidden min-h-[140px] md:block">
        {CHIPS.map((c, i) => (
          <div
            key={c.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: DESKTOP_POSITIONS[i].left, top: DESKTOP_POSITIONS[i].top }}
          >
            <Chip label={c.label} id={c.id} scrollToSection={scrollToSection} onChipHighlight={onChipHighlight} reduced={false} />
          </div>
        ))}
      </div>
    </>
  );
}
