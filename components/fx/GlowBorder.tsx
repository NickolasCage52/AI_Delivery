"use client";

import { ReactNode } from "react";

export function GlowBorder({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-xl p-px ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(86,240,255,0.2) 0%, rgba(155,123,255,0.1) 50%, transparent 100%)",
        boxShadow: "0 0 20px rgba(86,240,255,0.08)",
      }}
    >
      <div className="rounded-[calc(theme(borderRadius.xl)-1px)] bg-[#0E131C] p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
