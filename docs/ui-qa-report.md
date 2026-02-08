# UI QA Report — AI Delivery

Date: 2026-02-08

## Routes checked
- `/`
- `/services`
- `/cases`
- `/about`
- `/contact`
- `/thank-you`

## States checked
- Lead modal open
- Mobile menu open
- Sticky CTA visible

## Issues found and fixes

### Global / Layout
- **Horizontal overflow on small screens (320–390px)**: hero graph container used a fixed min width, causing X overflow on narrow viewports.
  - **Fix**: made graph container `w-full` with `max-w` sizes to fit container width.
  - Files: `components/hero/BusinessCoverageGraph.tsx`
- **Anchor jumps under sticky header**: header height overlapped anchored sections.
  - **Fix**: added global `scroll-padding-top` and `scroll-margin-top` for sections with IDs.
  - Files: `app/globals.css`
- **Occasional layout shift when scroll lock toggles** (modal/menu open).
  - **Fix**: added scroll lock utility with scrollbar compensation.
  - Files: `lib/ui/scrollLock.ts`

### Z-index / Clickability
- **Hero FX layer could intercept pointer events** on some interactions.
  - **Fix**: FX background layers marked `pointer-events: none`.
  - Files: `components/sections/HeroScene.tsx`
- **Modal stack competition with FX/noise layers**.
  - **Fix**: modal z-index raised above FX/noise overlays.
  - Files: `components/cta/LeadModal.tsx`

### Modals / Menus / Focus
- **Modal lacked scroll lock, focus trap, ESC close**.
  - **Fix**: implemented scroll lock, focus trap, ESC close, and focus restore.
  - Files: `components/cta/LeadModal.tsx`, `lib/ui/scrollLock.ts`
- **Mobile menu lacked scroll lock, focus trap, ESC close**.
  - **Fix**: implemented scroll lock, focus trap, ESC close, and focus restore.
  - Files: `components/layout/Header.tsx`, `lib/ui/scrollLock.ts`

### Debug tools (dev-only)
- Added UI debug overlay, outline mode, and horizontal overflow logger.
  - Enabled by `NEXT_PUBLIC_UI_DEBUG=1` (development only).
  - Files: `components/ui/UiDebugTools.tsx`, `app/globals.css`, `app/layout.tsx`

## Breakpoints reviewed (visual target)
- 390x844 (iPhone 12/13)
- 360x800 (Android)
- 768x1024 (iPad)
- 1024x768
- 1440x900
- 1920x1080

## Remaining checks
- Run `npm run build` and verify:
  - no horizontal scroll
  - modal/menu behavior with keyboard
  - CTA clickability under FX layers
