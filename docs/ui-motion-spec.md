# UI Motion Spec — AI Delivery

## Общие принципы

- **Длительность**: 150–300ms для микро-интеракций, 300–500ms для секций
- **Easing**: `[0.22, 1, 0.36, 1]` (custom ease-out) или `ease-out`
- **Ограничения**: анимации только в viewport, `prefers-reduced-motion` отключает FX

## Hero

| Элемент | Анимация | Длительность | Trigger |
|---------|----------|--------------|---------|
| H1 | opacity 0→1, y 12→0 | 500ms | Mount |
| Subtitle | opacity 0→1, y 8→0 | 400ms, delay 80ms | Mount |
| Bullets | opacity 0→1, x -8→0 | 300ms, stagger 40ms | Mount |
| CTA buttons | opacity 0→1, y 6→0 | 350ms, delay 200ms | Mount |
| Grid/cursor | opacity по позиции курсора | CSS / lightweight | Mouse move |
| Shimmer | 1–2 прохода по заголовку | ~1.5s | Mount, один раз |

## Кнопки

| Вариант | Hover | Active | Focus |
|---------|-------|--------|-------|
| Primary | scale 1.02, shadow glow | scale 0.98 | ring 2px |
| Secondary | bg accent/10, border glow | scale 0.98 | ring 2px |
| Link | trailing underline | — | ring 2px |

## Секции

| Элемент | Анимация | Длительность | Trigger |
|---------|----------|--------------|---------|
| Section title | opacity 0→1, y 16→0 | 400ms | In viewport |
| Panel reveal | clip-path / opacity | 350ms | In viewport |
| Stagger children | opacity 0→1 | 300ms, stagger 60ms | In viewport |

## Page transitions

| Событие | Анимация | Длительность |
|---------|----------|--------------|
| Route change | Fade out → Fade in | 150–180ms |
| Scroll-to-top | Всегда при навигации | 0ms |

## Запрещено

- `filter: blur()` на больших областях
- `box-shadow` с большим spread на многих элементах
- Непрерывные rAF вне viewport
- Анимации > 600ms для интерактивов
