# Performance Audit — AI Delivery (Max‑Smooth Pass)

## Scope
- Страницы: Home (`app/page.tsx`)
- FX: Hero shader, graphs/particles, cursor, scroll‑blur, GSAP scenes
- Аудит по коду + план измерений (React Profiler / Chrome Performance)

> В этой среде нет доступа к браузерным профайлерам. Ниже — кодовый аудит + список того, что измерить в DevTools. После запуска профилей обновить цифры и тайминги.

## Где падает FPS (по коду)
1) **ShaderBackground (WebGL)** — полноэкранный шейдер + DPR.
2) **NeuralGridCanvas** — canvas redraw + сетка.
3) **ScrollVelocityBlur** — `filter: blur()` (хоть и на локальном FX‑слое).
4) **ProcessPanel pinned (ScrollTrigger)** — scrub + pinned layout.
5) **SVG graphs** — `feGaussianBlur`, drop‑shadow, animateMotion.
6) **Header blur** — `backdrop-filter` на фиксированном слое.
7) **Large shadows** — hero/CTA карточки, sticky элементы.
8) **Multiple effects per frame** — shader + canvas + scroll blur + cursor.

## Частые ререндеры на скролле
- На Home нет React‑рендеров в hot‑scroll пути: ScrollTrigger обновляет DOM напрямую.
- Legacy `Process` (не используется на Home) — `setState` в ScrollTrigger.onUpdate (подлежит рефактору).

## Hydration / переключения версии
- HTML/Body имеют `suppressHydrationWarning`.
- DOM‑структура FX слоёв стабильна; изменения в основном по интенсивности.
- Требуется ручная проверка в DevTools: отсутствие hydration warnings и визуальных «переключений».

## Quality / auto‑downgrade
- FPS‑sampling и авто‑downgrade отсутствуют.
- Качество зависит от `prefers-reduced-motion` и параметров устройства/экрана (без динамического понижения по FPS).

## Самые дорогие CSS‑эффекты
- `backdrop-filter` (Header).
- `filter: blur()` на FX‑оверлее (ScrollVelocityBlur).
- `feGaussianBlur` в SVG‑графах.
- Сильные `box-shadow` на карточках и sticky‑CTA.

## Тяжёлые JS‑задачи
- WebGL шейдер отрисовка.
- Canvas сетка + пульс.
- GSAP ScrollTrigger pinned + scrub.
- ResizeObserver для канваса/графов.

## Топ‑3 источника ререндеров (не на scroll) + как снижено
1) `Header` — `IntersectionObserver` меняет activeAnchor → узкая область, без прокрутки, обновления только при смене секции.
2) `BusinessCoverageGraph` — hover state в SVG → локальное состояние, без влияния на страницу.
3) `useQuality` — resize / prefers‑reduced‑motion → дебаунс resize, без FPS‑sampling и без авто‑downgrade.

## ScrollTriggers / pinned scenes
- Pinned: **1** (ProcessPanel, desktop, high).
- Non‑pinned: **1** (TimelineScene progress beam).
- Legacy ScrollScenes / Process не используются в Home.

## Измерения, которые нужно сделать
- React Profiler: убедиться, что Hero/ProcessPanel не ререндерятся на scroll.
- Chrome Performance (5–10s scroll): long tasks в pinned сцене + canvas.
- Coverage/Network: нет догрузок чанков во время скролла.

## План исправлений (в этой итерации)
- Убрать `setState` из ScrollTrigger в `Process`.
- Усилить quality‑levels (high/medium/low) без auto‑off.
- Убрать blur в Header на low, оставить «fake glass» через opacity.
- Уменьшить интенсивность графов/частиц на medium.

## Изменения применены
- `Process`: переключение шагов через data‑attrs + refs, без `setState` в scroll.
- `quality`: добавлен `medium`, выбор по устройству/экрану; без FPS‑sampling.
- Header blur отключается на `low`.
- Графы: меньше packets на `medium` (BusinessCoverageGraph/IntegrationGraph).
