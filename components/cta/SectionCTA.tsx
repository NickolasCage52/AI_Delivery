"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLeadModal } from "./LeadModal";
import { trackCtaEvent } from "@/lib/analytics/cta";

const CTA_OPTIONS = [
  { label: "Смотреть кейсы", href: "/cases" },
  { label: "Хочу MVP", href: "/services#miniapps" },
  { label: "Разобрать задачу", href: "/contact" },
];

export function SectionCTA({
  primary = "Получить план внедрения",
  options = CTA_OPTIONS,
  useModal = false,
  primaryHref = "/demo",
  sourcePage,
  service,
}: {
  primary?: string;
  options?: { label: string; href: string }[];
  useModal?: boolean;
  primaryHref?: string;
  sourcePage?: string;
  service?: string;
}) {
  const openModal = useLeadModal();

  const primaryEl =
    primaryHref ? (
      <Link
        href={primaryHref}
        onClick={() => trackCtaEvent({ action: "click", label: primary, location: "section-cta", href: primaryHref })}
        className="rounded-xl bg-gradient-to-r from-[var(--accent)] to-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-[#09040F] shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-200 hover:shadow-[0_0_28px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 min-h-[44px] inline-flex items-center justify-center"
      >
        {primary}
      </Link>
    ) : useModal && openModal ? (
      <button
        type="button"
        onClick={() => {
          trackCtaEvent({ action: "open-modal", label: primary, location: "section-cta" });
          openModal?.({ sourcePage, service });
        }}
        className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] min-h-[44px]"
      >
        {primary}
      </button>
    ) : (
      <Link
        href="#cta"
        className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#09040F] transition-colors hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] min-h-[44px] inline-flex items-center justify-center"
      >
        {primary}
      </Link>
    );

  return (
    <motion.div
      className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-8"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
    >
      {primaryEl}
      {options.slice(0, 3).map((opt) => (
        <a
          key={opt.label}
          href={opt.href}
          onClick={() => trackCtaEvent({ action: "click", label: opt.label, location: "section-cta", href: opt.href })}
          className="rounded-lg border border-[var(--accent)]/40 px-4 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10 min-h-[44px] inline-flex items-center"
        >
          {opt.label}
        </a>
      ))}
    </motion.div>
  );
}
