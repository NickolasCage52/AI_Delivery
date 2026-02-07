export type CtaEvent = {
  action: string;
  label: string;
  location?: string;
  href?: string;
};

export function trackCtaEvent(event: CtaEvent): void {
  if (typeof window === "undefined") return;
  const payload = { event: "cta", ...event };
  const w = window as typeof window & { dataLayer?: unknown[]; plausible?: (name: string, opts?: { props?: object }) => void };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push(payload);
  }
  if (typeof w.plausible === "function") {
    w.plausible("CTA", { props: payload });
  }
}
