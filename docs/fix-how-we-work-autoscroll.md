# Fix: “Как работаем” auto-scroll to bottom

## Симптом
После пролистывания секции **«Как работаем»** страница могла **резко прыгать в самый низ**, как будто кто‑то сделал принудительный scroll.

## Причина (точно)
В `components/sections/ProcessPanel.tsx` pinned‑анимация GSAP `ScrollTrigger` создавалась только когда секция попадала в `inView`, а при выходе из viewport эффект делал `trigger.kill()` в cleanup (зависимость от `inView`).

Для pinned‑секции `kill()` убирает spacer/`pinSpacing`, меняет общую высоту документа и браузер **клампит** текущий scrollY к новому максимуму — визуально выглядит как «прыжок к низу страницы».

## Что изменено
- `ProcessPanel`: убран lifecycle “создать при inView → убить при out-of-view”.
  - Теперь `ScrollTrigger` **инициализируется один раз** (при первом входе в viewport и подходящих условиях) и **не убивается** при обычном скролле.
  - `kill()` выполняется только при unmount компонента.
- Аналогично обезопасил pinned‑сцены (`components/fx/ScrollScenes.tsx`, `components/sections/Process.tsx`): триггеры чистятся только на unmount, а не при изменении `inView`.

## Dev-инструментация (по флагу)
Добавлено под `NEXT_PUBLIC_SCROLL_DEBUG=1`:
- логирование `window.scrollTo`
- логирование `Element.scrollIntoView`
- логирование `history.pushState/replaceState` с `#...` и `hashchange`
- логирование `lenis.scrollTo` (обёртка в `SmoothScroll`)

Файлы:
- `lib/scroll/debug.ts`
- подключение в `components/ui/SmoothScroll.tsx`

## Как проверить
1) Dev: запустить `npm run dev` с `NEXT_PUBLIC_SCROLL_DEBUG=1`
2) Медленно проскроллить секцию **«Как работаем»** вниз до выхода из неё
3) Убедиться:
   - нет прыжка в конец страницы
   - в консоли нет логов `scrollTo/scrollIntoView/hashchange`, которые совпадают по времени с “прыжком”
4) Prod-check: `npm run build && npm run start`

