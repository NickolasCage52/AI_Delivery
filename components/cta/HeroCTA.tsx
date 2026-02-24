"use client";

import { Button } from "@/components/ui/Button";
import { useLeadModal } from "@/components/cta";
import { trackCtaEvent } from "@/lib/analytics/cta";

export function HeroCTA({
  primary = "Получить план внедрения",
  secondary = "Разобрать задачу",
  secondaryHref = "/contact",
  primaryHref = "/demo",
  location = "hero",
  sourcePage,
  service,
}: {
  primary?: string;
  secondary?: string;
  secondaryHref?: string;
  primaryHref?: string;
  location?: string;
  sourcePage?: string;
  service?: string;
}) {
  const openModal = useLeadModal();

  const primaryEl = primaryHref ? (
    <Button
      href={primaryHref}
      variant="primary"
      size="large"
      onClick={() => trackCtaEvent({ action: "click", label: primary, location, href: primaryHref })}
    >
      {primary}
    </Button>
  ) : (
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
  );

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {primaryEl}
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
