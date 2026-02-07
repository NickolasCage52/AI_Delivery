# AI Delivery — сайт ИИ-агентства (v2)

Одностраничный маркетинговый сайт уровня **Apple / Nothing / Google I/O**: кинематографичный скролл, глубокий свет, «живой» интерфейс. Тёмная премиальная эстетика, неон (cyan/violet) в одной палитре, ощущение «ИИ как ускоритель».

## Установка

```bash
npm install
```

## Команды

```bash
npm run dev
```

```bash
npm run build
npm run start
```

```bash
npm run lint
```

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните значения.

```
NEXT_PUBLIC_FX_DEBUG=1
```

## Деплой

- **Vercel**: подключите репозиторий, сборка `npm run build`, запуск `npm run start`.
- **Self-hosted**: выполните `npm run build`, затем `npm run start` на сервере.

## Стек

- **Next.js 15** (App Router) + TypeScript
- **TailwindCSS** — стили и дизайн-система (v2: #070A0F, #56F0FF, #9B7BFF)
- **Framer Motion** — UI-анимации (reveal, hover, stagger, kinetic typography)
- **GSAP + ScrollTrigger** — pinned-сцены (Hero → тезисы, Timeline beam)
- **Lenis** — плавный скролл (с отключением при `prefers-reduced-motion`)
- **Canvas/SVG** — Neural Grid, Orbit Integrations, Data Streams (лёгкие)

Откройте [http://localhost:3000](http://localhost:3000) после `npm run dev`.

## Структура

- **app/page.tsx** — сборка секций (HeroScene, Products, TimelineScene, PainSolution, Process, Integrations, Cases, FAQ, CTA, Footer)
- **app/layout.tsx** — SmoothScroll, GlowCursor, NoiseOverlay
- **components/sections/** — HeroScene, Products, TimelineScene, PainSolution, Process, Integrations, Cases, FAQ, CTA, Footer, Header
- **components/fx/** — NeuralGridCanvas, NoiseOverlay, GlowCursor, SpecularCard, MagneticButton, ScrollScenes, OrbitIntegrations, DataStreams
- **components/ui/** — Button, Card, Container, SmoothScroll
- **lib/motion/** — useReducedMotion, useScrollProgress, clamp, lerp, rafThrottle
- **docs/competitor-insights.md** — do/don't + решения из таблицы конкурентов
- **docs/design-system.md** — цвета, типографика, компоненты (v2)

## Вау-эффекты (реализовано)

1. **Hero boot sequence** — «Инициализация AI Delivery» → появление заголовка (0.8–1.2s)
2. **Volumetric gradient + bloom** — глубинные слои света
3. **Neural Grid (canvas)** — сетка с импульсами, DPR clamp, pause when tab hidden
4. **Magnetic CTA** — кнопки магнитятся к курсору + glow/scale
5. **ScrollScenes (GSAP pinned)** — Hero распадается на 3 тезиса (48–72ч / 3–5д / 5–7д) при скролле
6. **Timeline progress beam** — световой луч по таймлайну синхронно со скроллом
7. **Specular cards** — подсветка по поверхности при hover + adaptive neon (cyan/violet/lime)
8. **Hover reveal** — второй слой «результат» в карточках через overlay
9. **Kinetic typography** — слова «Лиды / Экономия времени / Тест гипотез» сменяются с эффектом перезаписи
10. **Orbit Integrations** — интеграции как «созвездие», линии при hover
11. **Data Streams** — анимированные пакеты к центру (CRM)
12. **Process stepper** — раскрывающиеся панели с артефактами (бриф, схема, инструкции)
13. **Noise overlay** — слабый анимированный grain
14. **Easter egg** — удержание hover на логотипе 2s → «AI pulse»
15. **GlowCursor** — мягкое пятно за курсором (desktop, reduced-motion off)

## Доступность и производительность

- **prefers-reduced-motion**: отключены тяжёлые fx (pinned, частицы, neural grid, noise, velocity blur)
- **useReducedMotion()** — хук для условного отключения анимаций
- Canvas: devicePixelRatio clamp max 1.5, pause when tab hidden
- Контраст, :focus-visible, формы с валидацией и loading/success

## Контент

Позиционирование, УТП, пакеты, сроки и hero A/B/C из брифа; кейсы помечены как «пример возможного решения».
