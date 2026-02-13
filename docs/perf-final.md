# Perf Final — AI Delivery (готово к трафику)

Цель: плавность без “лагов”, эффекты не выключаются внезапно, но **паусятся offscreen** и при скрытой вкладке. Важный контент остаётся SSR‑доступным.

---

## Что сделано (ключевое)

- **Единый rAF‑цикл**: анимации подписываются на общий `rafLoop` (без множества независимых `requestAnimationFrame`).
- **Offscreen = pause**:
  - WebGL shader‑фон (`components/ui/shader-background.tsx`) — пауза через `useInViewport` + `useFxLifecycle`.
  - Тяжёлый GSAP/ScrollTrigger в “Как работаем” (`components/sections/ProcessPanel.tsx`) — инициализация только когда секция в viewport (`useInViewport`), cleanup при уходе.
- **Tab hidden = pause**: `useFxLifecycle` останавливает FX при `document.hidden`.
- **Без state‑лупов на scroll/mousemove**: эффекты используют refs / motion values / throttling (`rafThrottle`), чтобы не вызывать ререндеры.
- **Адаптация качества**: `useQuality` + лимиты DPR/FPS для canvas‑эффектов (без “авто‑отключения”, только мягкое снижение бюджета).

---

## Что проверить перед пушем трафика

- `npm run build` — без ошибок
- `npm run start` — без warnings, проверить Home + /cases + /services
- Пролистать страницу: нет рывков, sticky появляется после ~1–2 экранов

