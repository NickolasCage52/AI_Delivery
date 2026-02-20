# Performance Budget — AI Delivery

## Лимиты FX

| Ресурс | Лимит | Примечание |
|--------|-------|------------|
| **Blur** | Локально: header, tooltip, панели ≤ 200px | Не на full-screen |
| **Particles** | 0–3 (quality-based) | packetCount в BusinessCoverageGraph |
| **FPS cap** | 45–50 для фоновых FX | getCanvasTargetFPS(quality) |
| **DPR cap** | max 1.5 на canvas | getCanvasDPR(quality) |
| **Box-shadow** | ≤ 2 слоёв на элемент | Glow через pseudo/opacity |

## Viewport lifecycle

- **Hero FX** (shader, grid, orbs): `useInViewport` + `useFxLifecycle` — pause вне hero
- **BusinessCoverageGraph**: уже использует `useFxLifecycle`
- **ScrollVelocityBlur**: pause при tab hidden
- **GlowCursor**: on-demand rAF (после mousemove), не continuous loop

## RAF inventory (актуальный)

- **rafLoop** (shared): shader-background, ScrollVelocityBlur (когда active)
- **GlowCursor**: on-demand rAF
- **BusinessCoverageGraph**: SVG + CSS animate (packets) — не rAF
- **useScrollProgress**: throttled scroll events

## Quality tiers

- **High**: DPR 1.5, FPS 50, packets 3, полный shader
- **Medium**: DPR 1.25, FPS 45, packets 1, shader opacity 0.55
- **Low**: DPR 1, FPS 30, packets 0, shader opacity 0.35 или отключен
