/**
 * Generates and updates a series of values that only grow (monotonic),
 * for sparklines that always go "up" (business growth feel).
 * Values are normalized in [0, 1] for easy SVG mapping.
 *
 * IMPORTANT: Initial series must be deterministic (no Math.random) so SSR and
 * client render the same path and avoid hydration mismatch.
 */

const MIN_POINTS = 12;
const MAX_POINTS = 18;
const POINT_COUNT_DETERMINISTIC = 14;
const STEP_MIN = 0.06;
const STEP_MAX = 0.16;

function randomStep(): number {
  return STEP_MIN + Math.random() * (STEP_MAX - STEP_MIN);
}

/** Deterministic "step" for initial series: same output for same seed. */
function deterministicStep(seed: number, index: number): number {
  const t = (seed * 7 + index * 11) % 100;
  return STEP_MIN + (t / 100) * (STEP_MAX - STEP_MIN);
}

/**
 * Build initial series deterministically from seed. Same seed => same array.
 * Used for SSR and first client render to avoid hydration mismatch.
 * Series is clearly rising (visible growth from left to right).
 */
export function getInitialUpOnlySeriesDeterministic(
  seed: number,
  pointCount: number = POINT_COUNT_DETERMINISTIC
): number[] {
  const arr: number[] = [];
  let v = 0.18 + (seed % 5) * 0.02;
  const count = Math.min(MAX_POINTS, Math.max(1, pointCount));
  for (let i = 0; i < count; i++) {
    arr.push(v);
    v = Math.min(1, v + deterministicStep(seed, i));
  }
  return arr;
}

/** Build initial series: strictly non-decreasing (uses random — client-only). */
function createInitialSeries(pointCount: number): number[] {
  const arr: number[] = [];
  let v = 0.2 + Math.random() * 0.2;
  for (let i = 0; i < pointCount; i++) {
    arr.push(v);
    v = Math.min(1, v + randomStep());
  }
  return arr;
}

export type UpOnlySeriesOptions = {
  /** Max number of points to keep (sliding window) */
  maxPoints?: number;
  /** Initial number of points */
  initialCount?: number;
};

export type UpOnlySeriesState = {
  values: number[];
  push: () => void;
  reset: () => void;
};

/**
 * Returns a state object: values array (0..1) and push/reset.
 * push() adds one new point: next = min(1, last + rand(0.01..0.06)).
 * Keeps last maxPoints points.
 */
export function createUpOnlySeries(
  options: UpOnlySeriesOptions = {}
): UpOnlySeriesState {
  const maxPoints = options.maxPoints ?? 18;
  const initialCount = Math.min(
    maxPoints,
    options.initialCount ?? MIN_POINTS + Math.floor(Math.random() * (MAX_POINTS - MIN_POINTS + 1))
  );

  let values = createInitialSeries(initialCount);

  function push(): void {
    const last = values[values.length - 1] ?? 0.5;
    const next = Math.min(1, last + randomStep());
    values = [...values.slice(1), next].slice(-maxPoints);
  }

  function reset(): void {
    const count = Math.min(
      maxPoints,
      MIN_POINTS + Math.floor(Math.random() * (MAX_POINTS - MIN_POINTS + 1))
    );
    values = createInitialSeries(count);
  }

  return {
    get values() {
      return values;
    },
    push,
    reset,
  };
}

/**
 * @deprecated Use getInitialUpOnlySeriesDeterministic(seed) for SSR-safe initial state.
 * Random initial series — client-only (causes hydration mismatch if used in initial state).
 */
export function getInitialUpOnlySeries(
  pointCount: number = POINT_COUNT_DETERMINISTIC
): number[] {
  return createInitialSeries(Math.min(18, pointCount));
}

/**
 * Given current series and maxPoints, returns new series with one more point (up-only), sliding window.
 */
export function advanceUpOnlySeries(
  current: number[],
  maxPoints: number = 18
): number[] {
  const last = current[current.length - 1] ?? 0.5;
  const next = Math.min(1, last + randomStep());
  return [...current.slice(1), next].slice(-maxPoints);
}
