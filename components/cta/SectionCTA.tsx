"use client";

import { motion } from "framer-motion";
import { useLeadModal } from "./LeadModal";
import { trackCtaEvent } from "@/lib/analytics/cta";

const CTA_OPTIONS = [
  { label: "Показать кейсы", href: "/cases" },
  { label: "Хочу MVP", href: "/services#miniapps" },
  { label: "Разобрать задачу", href: "/contact" },
];

export function SectionCTA({
  primary = "Запросить демо и план",
  options = CTA_OPTIONS,
  useModal = true,
  sourcePage,
  service,
}: {
  primary?: string;
  options?: { label: string; href: string }[];
  useModal?: boolean;
  sourcePage?: string;
  service?: string;
}) {
  const openModal = useLeadModal();

  return (
    <motion.div
      className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-8"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
    >
      {useModal && openModal ? (
        <button
          type="button"
          onClick={() => {
            trackCtaEvent({ action: "open-modal", label: primary, location: "section-cta" });
            openModal?.({ sourcePage, service });
          }}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
        >
          {primary}
        </button>
      ) : (
        <a
          href="#cta"
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
        >
          {primary}
        </a>
      )}
      {options.slice(0, 3).map((opt) => (
        <a
          key={opt.label}
          href={opt.href}
          onClick={() => trackCtaEvent({ action: "click", label: opt.label, location: "section-cta", href: opt.href })}
          className="rounded-lg border border-[var(--accent)]/40 px-4 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
        >
          {opt.label}
        </a>
      ))}
    </motion.div>
  );
}
