"use client";

import { memo, useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import s from "./how-it-works.module.css";

function AmbientLightInner({ activeIndex }: { activeIndex: number }) {
  const [flash, setFlash] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 600);
    return () => clearTimeout(t);
  }, [activeIndex, reduced]);

  if (reduced || !flash) return null;

  return (
    <div
      className={`fixed inset-0 top-16 pointer-events-none z-[50] ${s.hiwAmbientFlash}`}
      aria-hidden
    />
  );
}

export const AmbientLight = memo(AmbientLightInner);
