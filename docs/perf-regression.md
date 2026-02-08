# Perf regression triage

## Hero FX inventory (current)
- **WebGL shader background**: `components/ui/shader-background.tsx` (animated canvas).
- **BusinessCoverageGraph**: `components/hero/BusinessCoverageGraph.tsx` (SVG graph + animateMotion packets).
- **Hero orbs/blur layers**: `components/sections/HeroScene.tsx` (large blur layers + shader opacity).
- **Scroll indicator motion**: `HeroScene` (Framer Motion, light).

## Active rAF loops (before fixes)
- **Shared rafLoop** (`lib/perf/rafLoop.ts`) with subscribers:
  - `SmoothScroll` (Lenis + ScrollTrigger)
  - `shader-background` (WebGL render)
  - `NeuralGridCanvas` (canvas render, if mounted)
  - `ScrollVelocityBlur` (blur update)
  - `GlowCursor` (cursor update)
  - `lib/scroll/velocity` (scroll velocity sampling)
- **Local rAF**:
  - `lib/motion/useScrollProgress.ts` (throttled, non-persistent)
  - `components/ui/CursorGlow.tsx` (separate cursor, not mounted)
  - `Header.tsx` / `LeadModal.tsx` (one-off focus scheduling)

## Duplicate loops / conflicts
- No hard duplicate loops inside hero FX (shader/canvas already share rafLoop).
- Always-on loops still existed even offscreen:
  - `ScrollVelocityBlur` + `scroll/velocity` kept rafLoop running while idle.
  - `SmoothScroll` rafLoop always active.
  - `shader-background`/`NeuralGridCanvas` kept rafLoop active when tab hidden (render short‑circuited but loop kept ticking).

## Cursor dot regression (root causes)
- `GlowCursor` rendered **only when** `!prefers-reduced-motion` and **only** on `md+` width (`hidden md:block`).
- Coarse pointer detection could keep cursor off when `matchMedia` not reevaluated.
- Z‑index below noise overlay could visually mute the dot.

## viewport / IO usage
- `useInViewport` existed, but defaults were **200px / 0.15**, and **document.hidden** did not stop raf loops.
- Some FX paused via inView checks, but loops continued in background.
