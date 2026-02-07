# FX always-on: disable auto downgrade

## Root cause
- `hooks/useQuality.ts` sampled FPS via shared RAF loop and downgraded to `low`/`medium` after ~1s on slow frames.
- Это могло ослаблять blur/FX со временем и создавать ощущение «исчезновения».

## Changes made
- `hooks/useQuality.ts`:
  - removed FPS sampling/downgrade logic.
  - keep quality in sync only with `prefers-reduced-motion` and resize.
- `lib/perf/quality.ts`:
  - quality выбирается по устройству/экрану (high/medium/low), но без авто‑понижения по FPS.
  - `prefers-reduced-motion` всегда → `low`.
- `components/fx/EffectsDebugOverlay.tsx` + `app/layout.tsx`:
  - optional dev overlay to confirm quality/effects state.

## How to verify
1. Dev overlay (optional):
   - Run with `NEXT_PUBLIC_FX_DEBUG=1` in dev.
   - Confirm: `quality: high|medium|low`, `shader: on`, `header blur: on (если не low)`, `fps sampler: disabled`.
2. Manual check:
   - Load the site, stay on the page 1–3 minutes, scroll around.
   - Ensure hero shader animation and header blur remain visible and do not disappear.
3. Production build:
   - `npm run build && npm run start`
   - Repeat the manual check in the production server.
