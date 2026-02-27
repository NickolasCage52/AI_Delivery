# How-it-works: исправление скролла колесиком (wheel scroll)

## Проблема

На странице `/how-it-works` **не работал скролл колесиком мыши и трекпадом** — критическая ошибка UX.

## Причина

**Сценарий B — wheel перехвачен preventDefault**

В `components/how-it-works/SnapStory.tsx` был обработчик `wheel` на `document` с опциями `{ passive: false, capture: true }`:

```js
document.addEventListener("wheel", onWheel, { passive: false, capture: true });
```

Обработчик:
1. При `e.target` внутри контейнера — вручную делал `el.scrollTop += e.deltaY`
2. Вызывал `e.preventDefault()` и `e.stopPropagation()` — **блокировал нативный скролл**
3. Ручное изменение `scrollTop` конфликтовало с нативным `scroll-snap`

В результате колесо и трекпад **никогда не инициировали скролл** — браузерный обработчик по умолчанию отключался до того, как событие достигало scroll-контейнера.

## Решение

1. **Удалён** весь `useEffect` с wheel-слушателем — нативный скролл снова работает.
2. **Добавлены** `tabIndex={0}` и `role="region"` на scroll-контейнер — для фокуса, доступности и стабильного получения wheel (сценарий D).
3. Lenis уже **отключён** на `/how-it-works` в `components/ui/SmoothScroll.tsx` (`skipLenis = pathname === "/how-it-works"`) — конфликтов нет.

## Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `components/how-it-works/SnapStory.tsx` | Удалён wheel listener с preventDefault; добавлены tabIndex, role, aria-label |

## Как проверить

1. **Колесо мыши**: листает по карточкам, snap фиксирует на карточке.
2. **Трекпад**: плавный скролл, snap на остановке.
3. **PageDown / Space**: нативный скролл и snap.
4. **Мобильный свайп**: touch-scroll работает (overflow-y-auto + -webkit-overflow-scrolling: touch).
5. **Нет** горизонтального скролла, **нет** залипания на последней карточке.

```bash
npm run build && npm run start
```

## Acceptance criteria (выполнены)

- [x] Колесо мыши и трекпад работают на `/how-it-works`
- [x] Scroll-snap сохранён (1 экран = 1 карточка)
- [x] Нет preventDefault-блокировок, нет конфликтов с Lenis/ScrollTrigger
- [x] Build зелёный
