"use client";

import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type Variant = "plain" | "panel" | "grid";
type Bg = "primary" | "secondary" | "fade" | "none";

const seamOverlay =
  " before:content-[''] before:absolute before:left-0 before:right-0 before:top-0 before:h-16 before:bg-gradient-to-b before:from-[var(--bg-primary)] before:to-transparent before:pointer-events-none before:z-0 " +
  " after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-16 after:bg-gradient-to-t after:from-[var(--bg-primary)] after:to-transparent after:pointer-events-none after:z-0 ";

export function SectionShell({
  id,
  variant = "plain",
  bg = "none",
  seamless = false,
  className = "",
  children,
}: {
  id?: string;
  variant?: Variant;
  bg?: Bg;
  /** Soft gradient overlays at top/bottom to blend section edges (no harsh seams) */
  seamless?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const bgClass =
    bg === "primary"
      ? "bg-[var(--bg-primary)]"
      : bg === "secondary"
        ? "bg-[var(--bg-secondary)]/40"
        : bg === "fade"
          ? "bg-[linear-gradient(180deg,rgba(7,0,20,0.10),rgba(7,0,20,0.55),rgba(5,3,10,0.10))]"
          : "";

  const spacing =
    variant === "grid" ? "py-14 md:py-16 lg:py-20" : variant === "panel" ? "py-14 md:py-16 lg:py-20" : "py-14 md:py-16";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${spacing} ${bgClass} ${seamless ? seamOverlay : ""} ${className}`}
    >
      <div className={seamless ? "relative z-[1]" : undefined}>
        <Container>{children}</Container>
      </div>
    </section>
  );
}

