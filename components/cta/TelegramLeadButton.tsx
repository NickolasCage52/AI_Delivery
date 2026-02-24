"use client";

import { trackCtaEvent } from "@/lib/analytics/cta";
import { TELEGRAM_LEAD_BOT_URL } from "@/lib/constants/telegram";

type Variant = "secondary" | "outline" | "ghost";

export function TelegramLeadButton({
  label = "Оставить в Telegram",
  variant = "secondary",
  className = "",
  location = "form",
}: {
  label?: string;
  variant?: Variant;
  className?: string;
  location?: string;
}) {
  const baseClass =
    "min-h-[44px] inline-flex items-center justify-center rounded-lg border transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50";
  const variantClass =
    variant === "secondary"
      ? "btn-glow border-[var(--accent)]/40 px-4 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10"
      : variant === "outline"
        ? "btn-glow border-white/20 px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
        : "btn-glow border-transparent px-4 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10";

  return (
    <a
      href={TELEGRAM_LEAD_BOT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClass} ${variantClass} w-full sm:w-auto ${className}`}
      onClick={() =>
        trackCtaEvent({
          action: "click",
          label: "Telegram Lead Button",
          location,
          href: TELEGRAM_LEAD_BOT_URL,
        })
      }
    >
      {label}
    </a>
  );
}
