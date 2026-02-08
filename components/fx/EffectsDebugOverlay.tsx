"use client";

import { useQuality } from "@/hooks/useQuality";
import { useReducedMotion } from "@/lib/motion";
import { useFxDebugState } from "@/lib/perf/fxDebug";

const FX_DEBUG_ENABLED =
  process.env.NODE_ENV === "development" &&
  (process.env.NEXT_PUBLIC_FX_DEBUG === "1" ||
    process.env.NEXT_PUBLIC_FX_DEBUG === "true" ||
    process.env.NEXT_PUBLIC_FX_DEBUG === "on");

export function EffectsDebugOverlay() {
  const quality = useQuality();
  const reduced = useReducedMotion();
  const fxState = useFxDebugState();

  if (!FX_DEBUG_ENABLED) return null;

  const shaderEnabled = !reduced;
  const headerBlurEnabled = true;

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] rounded-lg border border-white/10 bg-black/70 px-3 py-2 text-[11px] text-white/80 shadow-lg backdrop-blur"
      aria-hidden
    >
      <div className="font-semibold text-white/90">FX Debug</div>
      <div>quality: {quality}</div>
      <div>reduced-motion: {reduced ? "on" : "off"}</div>
      <div>HeroFX: {fxState.heroFx}</div>
      <div>Graph: {fxState.graph}</div>
      <div>Cursor: {fxState.cursor}</div>
      <div>shader: {shaderEnabled ? "on" : "off"}</div>
      <div>header blur: {headerBlurEnabled ? "on" : "off"}</div>
      <div>fps sampler: disabled</div>
    </div>
  );
}
