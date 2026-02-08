/**
 * Adaptive quality controller for FX (blur, canvas DPR, particles, glow).
 * high = desktop powerful, medium = mid, low = mobile / weak / reduced-motion.
 */

export type QualityLevel = "high" | "medium" | "low";

let cachedLevel: QualityLevel | null = null;

export function getQualityLevel(): QualityLevel {
  if (typeof window === "undefined") return "high";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return "low";

  const width = window.innerWidth;
  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
  const memory = typeof navigator !== "undefined" ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4 : 4;

  const isTiny = width <= 420;
  const isLowEnd = cores <= 4 || memory <= 4;
  const isMid = width <= 960 || isLowEnd;

  if (isTiny) return "low";
  if (isMid) return "medium";
  return "high";
}

/**
 * Returns current quality level. Cached per session; call invalidateQualityCache() after resize/orientation if needed.
 */
export function getQuality(): QualityLevel {
  if (cachedLevel === null) cachedLevel = getQualityLevel();
  return cachedLevel;
}

/**
 * Invalidate cache so next getQuality() / useQuality() re-evaluates (e.g. after resize).
 */
export function invalidateQualityCache(): void {
  cachedLevel = null;
}

/**
 * Canvas DPR clamp by quality. high ≤ 1.5, medium ≤ 1.25, low = 1.
 */
export function getCanvasDPR(quality?: QualityLevel): number {
  const q = quality ?? getQuality();
  const raw = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  if (q === "low") return 1;
  if (q === "medium") return Math.min(1.25, raw);
  return Math.min(1.5, raw);
}

/**
 * Max scroll velocity blur in px. high = 2, medium = 1.5, low = 0 (off).
 * On mobile (isMobile true) cap at 1px for performance.
 */
export function getScrollBlurMax(quality?: QualityLevel, isMobile?: boolean): number {
  const q = quality ?? getQuality();
  if (q === "low") return 0;
  let max = q === "medium" ? 1.5 : 2;
  if (isMobile) max = Math.min(max, 1);
  return max;
}

/**
 * Canvas target FPS. high = 60, medium = 45, low = 30.
 */
export function getCanvasTargetFPS(quality?: QualityLevel): number {
  const q = quality ?? getQuality();
  if (q === "low") return 30;
  if (q === "medium") return 45;
  return 50;
}

/**
 * Reduce hero/glow blur radius (e.g. blur-[100px] → blur-[60px] on medium, [40px] on low).
 */
export function getHeroBlurClass(quality?: QualityLevel): { orb1: string; orb2: string } {
  const q = quality ?? getQuality();
  if (q === "low") return { orb1: "blur-[32px]", orb2: "blur-[24px]" };
  if (q === "medium") return { orb1: "blur-[56px]", orb2: "blur-[44px]" };
  return { orb1: "blur-[80px]", orb2: "blur-[64px]" };
}

/**
 * Glow cursor size / intensity. high = full, medium = smaller, low = off or minimal.
 */
export function getGlowCursorScale(quality?: QualityLevel): number {
  const q = quality ?? getQuality();
  if (q === "low") return 0.5;
  if (q === "medium") return 0.75;
  return 1;
}

