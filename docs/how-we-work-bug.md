# «Как работаем» — scroll-анимация «через раз»

## Локализация

- **Компонент секции:** `components/sections/ProcessPanel.tsx`
- **Заголовок секции:** «Как работаем» (копия из `content/site-copy.ts` → `HOME_COPY.process.title`)
- **Инициализация GSAP/ScrollTrigger:** в `useEffect` при условиях `inView && !reduced && quality === "high" && isDesktop`
- **Lenis:** провайдер и RAF в `components/ui/SmoothScroll.tsx` — в одном кадре вызываются `lenis.raf(time)` и `scrollTrigger?.update()`
- **IntersectionObserver:** `useInViewport(sectionRef)` — от него зависела инициализация (триггер создавался только при `inView === true`)

## Как создаются триггеры

- Один `ScrollTrigger.create()` с опциями: `trigger: section`, `start: "top top"`, `end: "+=400%"` (5 шагов × 80%), `pin: true`, `pinSpacing: true`, `scrub: 1`
- В `onUpdate` обновляются: прогресс-бар (beam), активный шаг и панели (через `applyActiveIndex`)
- Cleanup при unmount: `triggerRef.current?.kill()` в отдельном `useEffect` с пустым массивом зависимостей

## Почему срабатывало «через раз»

1. **Инициализация завязана на `inView`**  
   Триггер создавался только когда секция уже в viewport. IntersectionObserver срабатывает асинхронно; при быстрой навигации или первом рендере `inView` мог быть ещё `false` → эффект выходил без создания триггера. При следующем заходе или скролле условие выполнялось и анимация появлялась.

2. **`useEffect` вместо `useLayoutEffect`**  
   Инициализация шла после отрисовки. К моменту вызова размеры/шрифты могли быть не готовы → ScrollTrigger считал start/end по «сырому» layout и pin вёл себя нестабильно.

3. **ScrollTrigger в SmoothScroll подгружался асинхронно**  
   `setFrameReady(true)` вызывался сразу после инициализации Lenis; `import("gsap/ScrollTrigger")` шёл в фоне. В первые кадры RAF вызывал `lenis.raf()` и `scrollTrigger?.update()`, но `scrollTrigger` был ещё `null` → обновление триггеров не вызывалось и синхрон с Lenis ломался.

4. **Нет refresh после init и при resize**  
   После создания триггера не вызывался `ScrollTrigger.refresh()`, не было отложенного refresh по `document.fonts.ready` и при resize → при подгрузке шрифтов/картинок или смене размера окна расчёт pin был неверным.

5. **Нет изоляции через `gsap.context()`**  
   Cleanup делался только через `trigger.kill()`. Все создания внутри секции не откатывались одним вызовом `revert()`, что при повторных mount/unmount (например, Strict Mode) могло оставлять «висящие» триггеры или дубли.

## Что изменено

- **ProcessPanel**
  - Инициализация перенесена в `useLayoutEffect` (один раз при наличии секции и условиях quality/desktop).
  - Убрана зависимость от `inView` для создания триггера — триггер создаётся при mount, если секция в DOM.
  - Вся инициализация GSAP/ScrollTrigger обёрнута в `gsap.context((self) => { ... }, sectionRef)`; в cleanup вызывается `ctx.revert()`.
  - После создания триггера: `requestAnimationFrame(() => ScrollTrigger.refresh())` и `document.fonts?.ready?.then(() => ScrollTrigger.refresh())`.
  - Добавлен debounced `resize` → `ScrollTrigger.refresh()` (150 ms).
  - Под флагом `NEXT_PUBLIC_SCROLL_DEBUG=1`: логи «HowWeWork init», количество триггеров, опционально onEnter/onLeave/onRefresh.

- **SmoothScroll**
  - Перед `setFrameReady(true)` выполняется `await` для Lenis, gsap и `gsap/ScrollTrigger`; плагин регистрируется через `gsap.registerPlugin(ScrollTrigger)`, при необходимости вызывается `gsap.ticker.lagSmoothing(0)`. С первого кадра RAF вызывает `ScrollTrigger.update()` после `lenis.raf(time)`, так что Lenis и ScrollTrigger работают из одного источника и синхронны.

## Как проверить

1. **Сборка:** `npm run build && npm run start` (или `npm run dev`).
2. Открыть главную, доскроллить до «Как работаем» — пин и смена шагов работают.
3. Обновить страницу, стоя на середине секции — анимация не ломается.
4. Перейти на другую страницу и обратно — секция снова работает.
5. Изменить размер окна (в т.ч. до мобильной ширины) — после resize анимация или мобильный вариант ведут себя стабильно.
6. **Отладка:** при `NEXT_PUBLIC_SCROLL_DEBUG=1` в консоли при инициализации секции появляются логи:
   - `[HowWeWork] init` и `ScrollTrigger.getAll().length = N`;
   - при срабатывании триггера — `onEnter` / `onLeave` / `onRefresh` (если добавлены в create).
