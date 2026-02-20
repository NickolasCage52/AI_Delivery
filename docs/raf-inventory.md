# RAF inventory

## Before (observed)
- **Shared rafLoop** (`lib/perf/rafLoop.ts`)
  - `SmoothScroll` (Lenis + ScrollTrigger)
  - `shader-background` (WebGL)
  - `NeuralGridCanvas` (canvas)
  - `ScrollVelocityBlur` (blur update)
  - `GlowCursor` (cursor update)
  - `scroll/velocity` (sampling)
- **Local rAF**
  - `useScrollProgress` (throttled)
  - `CursorGlow` (not mounted)
  - focus scheduling in `Header` / `LeadModal`

## After (target)
- **Shared rafLoop** only when active:
  - `shader-background` (paused offscreen / when tab hidden)
  - `NeuralGridCanvas` (paused offscreen / when tab hidden)
  - `ScrollVelocityBlur` + `scroll/velocity` (paused when hidden)
  - `SmoothScroll` (paused when hidden)
- **Local rAF**
  - `GlowCursor` uses **on-demand rAF** (runs only after mousemove, no continuous loop)
  - `useScrollProgress` unchanged (event-scoped)

## Notes
- Offscreen/hidden now stops RAF work via `useFxLifecycle`.
- No redundant per‑FX raf loops while offscreen.

## Vincture-style additions (v2)
- **CursorReactiveGrid**: mousemove-only, no rAF; setState updates mask position (lightweight)
- **TitleShimmer**: one-time framer-motion animation on mount
- **Aurora drift**: CSS keyframes (auroraDrift1/2), respects prefers-reduced-motion
