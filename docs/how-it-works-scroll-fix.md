# How-it-works: исправление скролла колесиком (wheel scroll)

## Проблема

На странице `/how-it-works` **не работал скролл колесиком мыши и трекпадом** — критическая ошибка UX. Локально могло работать, на GitHub Pages — нет.

## Причины

1. **Lenis перехватывал wheel**: на GitHub Pages `pathname` = `"/how-it-works/"` (trailing slash), проверка `pathname === "/how-it-works"` не срабатывала → Lenis инициализировался и блокировал нативный скролл.
2. **Вложенный overflow-контейнер**: wheel мог уходить в document вместо внутреннего div.
3. **Старый wheel-handler** на document с `preventDefault` блокировал скролл (удалён ранее).

## Решение (полное переустройство)

1. **ConditionalSmoothScroll**: на `/how-it-works` SmoothScroll (Lenis) вообще не рендерится — Lenis не загружается, нет wheel-перехвата.
2. **SnapStory**: `position: fixed` + `inset`, контейнер занимает весь viewport под header — единственный scroll target.
3. **body overflow: hidden**: при монтировании HowItWorksStory блокируется скролл документа.
4. **Wheel fallback**: `onWheel` на контейнере выполняет `scrollBy` + `preventDefault` — скролл работает даже при капризах браузера.

## Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `components/ui/ConditionalSmoothScroll.tsx` | **Новый**: на `/how-it-works` рендерит children без SmoothScroll |
| `app/layout.tsx` | SmoothScroll заменён на ConditionalSmoothScroll |
| `components/how-it-works/HowItWorksStory.tsx` | body overflow hidden при монтировании |
| `components/how-it-works/SnapStory.tsx` | fixed positioning, wheel handler с scrollBy |

## Как проверить

1. **Колесо мыши**: листает по карточкам, snap фиксирует на карточке.
2. **Трекпад**: плавный скролл, snap на остановке.
3. **PageDown / Space**: нативный скролл и snap.
4. **Мобильный свайп**: touch-scroll работает.
5. **GitHub Pages**: `npm run build` с `GITHUB_PAGES=true`, деплой, проверка на проде.

## Acceptance criteria

- [x] Колесо мыши и трекпад работают на `/how-it-works`
- [x] Scroll-snap сохранён (1 экран = 1 карточка)
- [x] Lenis полностью отключён на странице
- [x] Работает локально и на GitHub Pages
