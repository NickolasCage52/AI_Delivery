# AI Delivery — сайт ИИ-агентства (v2)

Одностраничный маркетинговый сайт уровня **Apple / Nothing / Google I/O**: кинематографичный скролл, глубокий свет, «живой» интерфейс. Тёмная премиальная эстетика, неон (cyan/violet) в одной палитре, ощущение «ИИ как ускоритель».

## Как запустить

```bash
npm install
cp .env.example .env.local   # опционально
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Режим разработки (hot reload) |
| `npm run build` | Сборка для production |
| `npm run start` | Запуск production-сервера после `build` |
| `npm run lint` | Проверка ESLint |
| `npm run typecheck` | Проверка TypeScript |

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и при необходимости заполните:

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `NEXT_PUBLIC_FX_DEBUG` | Overlay для отладки анимаций (dev) | — |
| `NEXT_PUBLIC_UI_DEBUG` | Панель отладки UI (dev) | — |
| `NEXT_PUBLIC_SCROLL_DEBUG` | Отладка скролла (dev) | — |
| `NEXT_PUBLIC_BASE_PATH` | Базовый путь для поддиректории | — |
| `NEXT_PUBLIC_SITE_URL` | URL сайта (SEO, sitemap) | `https://ai-delivery.studio` |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram-бота (заявки) | — |
| `TELEGRAM_CHAT_ID` | Chat ID для заявок | — |

Все переменные опциональны, кроме **Leads to Telegram**: для работы форм заявок нужны `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`. Подробнее — в [docs/telegram-setup.md](docs/telegram-setup.md).

## Leads to Telegram

Все формы сайта (главная, демо, контакты, кейсы, модалки) отправляют заявки в Telegram-чат через `POST /api/lead`. Для настройки:

1. Создайте бота через [@BotFather](https://t.me/BotFather), получите токен.
2. Узнайте Chat ID (личный чат, группа или канал) — см. [docs/telegram-setup.md](docs/telegram-setup.md).
3. Добавьте в `.env.local`: `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.
4. Защита: honeypot, rate limit (5 запросов / 10 мин), валидация Zod.

## Деплой

- **Vercel**: подключите репозиторий, сборка `npm run build`, запуск `npm run start`. Добавьте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в настройках Environment Variables.
- **Self-hosted**: выполните `npm run build`, затем `npm run start` на сервере.

## Стек

- **Next.js 15** (App Router) + TypeScript
- **TailwindCSS** — стили и дизайн-система (v2: #070A0F, #56F0FF, #9B7BFF)
- **Framer Motion** — UI-анимации (reveal, hover, stagger, kinetic typography)
- **GSAP + ScrollTrigger** — pinned-сцены (Hero → тезисы, Timeline beam)
- **Lenis** — плавный скролл (с отключением при `prefers-reduced-motion`)
- **Canvas/SVG** — Neural Grid, Orbit Integrations, Data Streams (лёгкие)

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
