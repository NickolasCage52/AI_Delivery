"use client";

import { Button } from "@/components/ui/Button";
import { useLeadModal } from "@/components/cta";
import { trackCtaEvent } from "@/lib/analytics/cta";

export function HeroCTA({
  primary = "Запросить демо и план",
  secondary = "Разобрать задачу за 15 минут",
  secondaryHref = "/contact",
  location = "hero",
  sourcePage,
  service,
}: {
  primary?: string;
  secondary?: string;
  secondaryHref?: string;
  location?: string;
  sourcePage?: string;
  service?: string;
}) {
  const openModal = useLeadModal();

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <Button
        type="button"
        variant="primary"
        size="large"
        onClick={() => {
          trackCtaEvent({ action: "open-modal", label: primary, location });
          openModal?.({ sourcePage, service });
        }}
      >
        {primary}
      </Button>
      <Button
        href={secondaryHref}
        variant="secondary"
        size="large"
        onClick={() => trackCtaEvent({ action: "click", label: secondary, location, href: secondaryHref })}
      >
        {secondary}
      </Button>
    </div>
  );
}
