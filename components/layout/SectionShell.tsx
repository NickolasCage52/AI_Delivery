"use client";

import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type Variant = "plain" | "panel" | "grid";
type Bg = "primary" | "secondary" | "fade" | "none";

export function SectionShell({
  id,
  variant = "plain",
  bg = "none",
  className = "",
  children,
}: {
  id?: string;
  variant?: Variant;
  bg?: Bg;
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
    variant === "grid" ? "py-24 md:py-32" : variant === "panel" ? "py-24 md:py-32" : "py-20 md:py-24";

  return (
    <section id={id} className={`relative ${spacing} ${bgClass} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

