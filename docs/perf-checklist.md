# Performance checklist — AI Delivery

Краткий чеклист, чтобы не сломать плавность при доработках.

## Не делать

- **setState в scroll/RAF** — не вызывать `setState` внутри `requestAnimationFrame` или в обработчике скролла без троттлинга по значению (только при реальном изменении).
- **filter: blur на больших блоках** — не вешать `blur` на весь экран или на контейнеры с текстом; только на небольших FX-слоях.
- **Backdrop blur вне Header** — `backdrop-filter` только в Header, и только на high/medium.
- **Лишние box-shadow** — избегать тяжёлых теней с большим размытием на скроллящемся контенте; предпочитать псевдоэлемент + градиент.
- **Canvas без ограничений** — не использовать `devicePixelRatio` без clamp (использовать `getCanvasDPR(quality)`); на low/medium ограничивать FPS (30/45).
- **GSAP ScrollTrigger без cleanup** — всегда вызывать `trigger.kill()` в cleanup useEffect; не создавать триггеры при каждом ререндере.
- **Слушатели scroll/mouse без passive** — для scroll использовать `{ passive: true }`; для mousemove — raf-throttle.

## Делать

- **Качество** — FX-компоненты должны читать `useQuality()` (из `hooks/useQuality.ts`) и уменьшать blur/DPR/particles на low/medium.
- **MotionValues вместо setState** — для курсора/скролла/мыши использовать `useMotionValue` + `useTransform` или обновление через ref (style), чтобы не дёргать ререндеры.
- **Только transform и opacity** — анимации через `transform` и `opacity` (не layout-triggering: top/left/width/height).
- **visibilitychange** — в canvas/RAF-циклах при `document.hidden` не рисовать и не обновлять тяжёлое.
- **React.memo для тяжёлых секций** — Products, ProcessPanel, Integrations уже обёрнуты в memo; новые тяжёлые списки — тоже.

## Файлы

- `lib/perf/quality.ts` — уровень качества, getCanvasDPR, getScrollBlurMax, getHeroBlurClass, getGlowCursorScale.
- `hooks/useQuality.ts` — hook качества (debounced resize + FPS sampling).
- `lib/perf/rafLoop.ts` — общий RAF (rafLoopSubscribe) для будущего объединения тиков.
- `lib/scroll/velocity.ts` — скорость скролла (без React), пауза при document.hidden.
