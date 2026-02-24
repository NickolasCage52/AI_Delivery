# Performance Inventory — AI Delivery

> Инвентаризация rAF, таймеров, ScrollTriggers. Оптимизации и риски.

---

## 1. requestAnimationFrame (rAF)

| Компонент | Назначение | Viewport-aware | Cleanup |
|-----------|------------|----------------|---------|
| **SmoothScroll** | Lenis + ScrollTrigger.update() | — | Да |
| **BusinessCoverageGraph** | Вращение орбиты | Да (`useFxLifecycle`, `useInViewport`) | Да (cancelAnimationFrame) |
| **ShaderBackground** | WebGL plasma | Да (`useFxLifecycle`, `useInViewport`) | Да (unsubscribe rafLoop) |
| **rafLoop** | Общий RAF loop | — | — |
| **useLiveGrowthMetrics** | Tween метрик | Да (`enabled`) | Да |
| **useCountUp** | Count-up анимация | — | Да |
| **GlowCursor** | Курсор glow | — | Да |
| **useScrollProgress** | Scroll progress | — | Да |
| **CursorReactiveGrid** | mousemove → setState | Да (inView) | Да (remove listener) |

~~**Риск**: `CursorReactiveGrid` — `setState({ x, y })` на каждый mousemove при inView → re-render.~~ **Исправлено**: используется `el.style.setProperty("--grid-x", ...)` вместо setState — без re-render.

---

## 2. setInterval / setTimeout

| Компонент | Назначение | Viewport-aware | Cleanup |
|-----------|------------|----------------|---------|
| **GrowthStory** | AutomationScene: activeIndex, LiveStatusTicker | Да (inView) | Да (clearInterval) |
| **GrowthStory** | LiveStatusTicker | — | Да |
| **useTypewriterSequence** | Typewriter timing | Да (inView) | Да |
| **useLiveGrowthMetrics** | scheduleNextTick | Да (enabled) | Да |
| **Typewriter** | Pause/erase phases | — | Да |
| **Header** | hoverTimer (pulse) | — | Да |
| **HeroServiceChips** | highlightTimeout | — | Да |
| **CTA / DemoForm** | Form submit delay | — | — |

**Ок**: таймеры в GrowthStory, useTypewriterSequence, useLiveGrowthMetrics привязаны к `inView`/`enabled` — пауза вне viewport.

---

## 3. ScrollTrigger (GSAP)

| Компонент | Назначение | Cleanup |
|-----------|------------|---------|
| **ProcessPanel** | Pin + scrub, progress beam | Да (gsap.context().revert()) |
| **Process** (legacy) | ScrollTrigger | Да |
| **TimelineScene** | ScrollTrigger | Да |
| **ScrollScenes** | Pin hero | Да |

**Ок**: ProcessPanel — инициализация при `quality === "high"` и desktop, cleanup через `ctx.revert()`. Не убивается при скролле (по fix-how-we-work-autoscroll.md).

---

## 4. mousemove / scroll

| Компонент | Событие | Риск |
|-----------|---------|------|
| **CursorReactiveGrid** | mousemove | setState на каждый move → re-render. Throttle или RAF+ref. |
| **GlowCursor** | mousemove | Подписка в RAF, не setState в hot path (по docs). |

---

## 5. Рекомендации

1. ~~**CursorReactiveGrid**: заменить `setState({ x, y })` на `ref` + `style.setProperty` / CSS vars~~ — **сделано**.
2. **Lenis + ScrollTrigger**: один источник (SmoothScroll) — ок.
3. **GrowthStory / useLiveGrowthMetrics / useTypewriterSequence**: уже пауза вне viewport — ок.
4. **BusinessCoverageGraph / ShaderBackground**: useFxLifecycle + useInViewport — ок.
5. **Не создавать новые RAF/timers** в scroll handler или mousemove без throttle/debounce.

---

## 6. Build / Deploy

- `npm run build` — проверить зелёный.
- `npm run start` — проверить production.
- GitHub Pages / export: проверить `out/` при `output: 'export'`.
