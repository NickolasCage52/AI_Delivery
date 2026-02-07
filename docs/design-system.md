# Design System — AI Delivery (Violet/Pink)

Тёмная премиальная эстетика с фиолетово‑розовым неоном, аккуратные блики и глубина. Мягкие градиенты, строгая сетка, «Apple‑level motion» без тяжёлых фильтров.

---

## Цвета и токены

### Базовые фоны
- **--bg-primary**: `#05030A` — основной фон
- **--bg-secondary**: `#070014` — второй слой/градиент
- **--bg-elevated**: `#0B0620` — карточки, панели
- **--bg-surface**: `#12082A` — hover/подложки

### Акценты
- **--accent**: `#8B5CF6` — фиолетовый
- **--accent-strong**: `#A78BFA` — яркий фиолетовый
- **--accent-pink**: `#EC4899` — розовый
- **--accent-pink-strong**: `#F472B6` — яркий розовый

### Текст
- **--text-primary**: `#F3F4F6`
- **--text-secondary**: `#A1A1B5`
- **--text-muted**: `#7C7C96`

### Границы и свечение
- **--border-default**: `rgba(255,255,255,0.08)`
- **--glow-violet**: `0 0 24px rgba(139,92,246,0.25)`
- **--glow-pink**: `0 0 24px rgba(236,72,153,0.22)`

---

## Типографика

```css
font-family: ui-sans-serif, system-ui, -apple-system, "SF Pro Display", "SF Pro Text", Inter, Arial, sans-serif;
```

- **H1**: 3rem–4.5rem, 700, tracking‑tight, line‑height 1.05
- **H2**: 2.25rem–3rem, 600
- **H3**: 1.25rem–1.5rem, 600
- **Body**: 1rem, line‑height 1.6
- **Small**: 0.875rem, text‑muted

---

## Сетка и отступы

- **Container**: max‑width 1280px, padding 1.5rem (md: 2rem)
- **Секции**: padding‑y 5–8rem (mobile меньше)
- **Grid**: 12 columns desktop, 6 tablet, 4 mobile

---

## Компоненты

- **Primary CTA** — фиолетовый с розовым glow
- **Secondary CTA** — прозрачный с фиолетовой обводкой
- **SpecularCard** — мягкий блик, псевдо‑элемент, без heavy blur
- **ServiceGraph** — SVG‑граф с data‑packet анимацией
- **Storyboard Panel** — pinned панель с шагами и артефактами
- **Case Artifact** — макет скриншота/дашборда (градиент + UI‑плашки)

---

## Motion принципы

- Только transform/opacity; без layout‑thrash
- Pinned сцен 1–2 максимум
- prefers‑reduced‑motion: выключаем pinned/particles/velocity blur
- Нет setState на scroll/mousemove — только refs/raf

---

## Доступность

- Контраст ≥ 4.5:1
- :focus-visible с акцентом
- Формы с label/aria и понятной валидацией
