"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/brand/LogoMark";

export function Header() {
  const [logoHover, setLogoHover] = useState(false);
  const [pulse, setPulse] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLogoEnter = () => {
    setLogoHover(true);
    hoverTimer.current = setTimeout(() => setPulse(true), 2000);
  };
  const onLogoLeave = () => {
    setLogoHover(false);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setPulse(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#070A0F]/90">
      <Container>
        <div className="flex h-16 items-center justify-between md:h-18">
          <a
            href="#"
            className="relative flex items-center gap-2.5 text-lg font-semibold text-[#E9ECF5] transition-colors hover:text-[#56F0FF]/90"
            onMouseEnter={onLogoEnter}
            onMouseLeave={onLogoLeave}
            onFocus={onLogoEnter}
            onBlur={onLogoLeave}
          >
            <LogoMark size={28} hover={logoHover} className="shrink-0" />
            <span className="relative">
              AI Delivery
              {pulse && (
                <motion.span
                  className="absolute -inset-2 rounded-lg bg-[#56F0FF]/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.5, 0], scale: [1, 1.5] }}
                  transition={{ duration: 0.6 }}
                  aria-hidden
                />
              )}
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#products" className="text-[#A7AFC2] hover:text-[#56F0FF] transition-colors">
              Услуги
            </a>
            <a href="#timeline" className="text-[#A7AFC2] hover:text-[#56F0FF] transition-colors">
              Сроки
            </a>
            <a
              href="#cta"
              className="rounded-lg bg-[#56F0FF]/10 px-4 py-2 text-[#56F0FF] hover:bg-[#56F0FF]/20 transition-colors"
            >
              Связаться
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}
