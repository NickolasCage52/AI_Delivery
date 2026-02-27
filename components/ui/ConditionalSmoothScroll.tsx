"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";

function isHowItWorksPath(path: string | null): boolean {
  if (!path) return false;
  const normalized = path.replace(/\/$/, "");
  return normalized === "/how-it-works";
}

/**
 * Wraps children with SmoothScroll EXCEPT on /how-it-works.
 * На how-it-works Lenis полностью не загружается — свой scroll-snap контейнер.
 */
export function ConditionalSmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const skipLenis = isHowItWorksPath(pathname);

  if (skipLenis) {
    return <>{children}</>;
  }

  return <SmoothScroll>{children}</SmoothScroll>;
}
