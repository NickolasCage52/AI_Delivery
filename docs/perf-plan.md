# Perf Plan — AI Delivery

Где могут быть лаги и как их избегаем.

---

## 1. Источники лагов

| Область | Риск | Как избегаем |
|---------|------|----------------|
| **Scroll + React** | setState в scroll/RAF → ререндеры каждый кадр | Только refs / motion values; setState только при смене шага/индекса (throttle по значению) |
| **Blur** | filter: blur() на больших слоях и тексте | Quality levels: low — меньший blur или без; не вешать blur на весь экран |
| **backdrop-blur** | Много слоёв с backdrop-blur в viewport | Уменьшать на medium/low; не накапливать в одной зоне |
| **Canvas** | 60fps redraw без ограничений | DPR clamp (getCanvasDPR), target FPS 30/45 на low/medium, пауза при document.hidden |
| **GSAP ScrollTrigger** | Pin + scrub, несколько триггеров | Один pinned блок (ProcessPanel); onUpdate — только смена step index, не setState на каждый progress; cleanup kill() |
| **Тяжёлые анимации** | Много элементов с filter/box-shadow при скролле | transform + opacity; box-shadow дозированно; prefers-reduced-motion отключает сложное |
| **SpecularCard / mousemove** | setState на каждое движение мыши | useMotionValue + useTransform, обновление через ref, не ререндер |

---

## 2. Quality levels (high / medium / low)

- **Определение:** `lib/perf/quality.ts` — по ширине, hardwareConcurrency, deviceMemory, prefers-reduced-motion.
- **Использование:** FX-компоненты вызывают `useQuality()` и снижают интенсивность:
  - Hero orbs: getHeroBlurClass(quality) — low 40px/32px, medium 60px/48px, high 100px/80px.
  - ScrollVelocityBlur: max blur по quality и isMobile.
  - Canvas: getCanvasDPR(quality), getCanvasTargetFPS(quality).
  - GlowCursor: getGlowCursorScale(quality).
- **Стиль не ломаем:** на low остаётся читаемый интерфейс, без тяжёлых эффектов.

---

## 3. Обязательные правила

- **prefers-reduced-motion:** отключать сложные анимации (pinned, частицы, velocity blur); оставлять простой reveal.
- **Никакого setState на scroll/mousemove** в горячих путях — только refs / motion values.
- **Lenis:** один RAF loop (SmoothScroll) → lenis.raf() затем ScrollTrigger.update() для синхронизации.
- **Canvas/SVG:** DPR clamp, пауза на hidden, не рисовать лишнее на low.

---

## 4. Компоненты под контролем

| Компонент | Мера |
|-----------|------|
| ProcessPanel | setActiveStep только при смене index (lastIndexRef); GSAP cleanup |
| ScrollVelocityBlur | Обновление overlay через ref (style), не setState в RAF |
| NeuralGridCanvas | DPR, FPS cap, visibility pause |
| IntegrationGraph / HeroServiceGraph | SVG + animateMotion; на low — simplified, без data packets |
| SpecularCard | useMotionValue(x,y) + useTransform для highlight |
| GlowCursor | ref + style.setProperty в RAF; отключён на coarse pointer |

---

## 5. Чеклист перед релизом

- [ ] Нет setState в scroll/RAF без throttle по значению
- [ ] Blur только на небольших FX-слоях; quality levels учтены
- [ ] Canvas: DPR clamp, пауза при hidden
- [ ] GSAP: cleanup kill() у всех ScrollTrigger
- [ ] prefers-reduced-motion уменьшает/отключает тяжёлые эффекты
- [ ] Lazy-load медиа при необходимости; оптимизация изображений
