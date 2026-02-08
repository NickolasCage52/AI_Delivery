/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Throttle callback to requestAnimationFrame
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rafThrottle<T extends (...args: any[]) => void>(fn: T): T {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  const run = () => {
    if (lastArgs !== null) {
      fn(...lastArgs);
      lastArgs = null;
    }
    rafId = null;
  };
  return ((...args: Parameters<T>) => {
    lastArgs = args;
    if (rafId === null) {
      rafId = requestAnimationFrame(run);
    }
  }) as T;
}
