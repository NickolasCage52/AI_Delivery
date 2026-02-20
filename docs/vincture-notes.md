# Vincture.ru — UX-паттерны для адаптации

> Референс: [vincture.ru](http://vincture.ru) (Vincture | Digital Art & Dev). Анализ для вдохновения, без копирования.

## 1. Hero: «вау»-факторы

- **Типографика**: крупный заголовок, контрастный подзаголовок, воздух между блоками
- **Композиция**: фокус по центру, асимметричный баланс, «живой» фон
- **Фон**: многослойные градиенты, aurora-эффекты, subtle noise
- **Движение**: медленный drift (parallax), не перегружающий экран
- **Сетка**: тонкая динамическая сетка или линии — реагируют на курсор (очень легко)
- **Энергия**: «energy pulse» вокруг ключевого узла

## 2. Микро-интеракции

- **Hover**: lift + glow, не резкий
- **Кнопки**: градиентный неон + inner glow, scale при hover
- **Переходы**: 150–250ms, ease-out
- **Курсор**: dot, instant follow, реакция на интерактивы (scale/glow)
- **Ссылки**: trailing underline вместо статичной линии

## 3. Скролл-нарратив

- Staged/scroll-driven анимации: заголовки секций появляются с задержкой (stagger)
- Подложка/градиент секции плавно меняется при входе
- «Panel reveal»: контент выезжает из мягкой маски/clip-path
- Режиссура: «вау» усиливает смысл, а не затмевает

## 4. Стиль карточек/панелей

- Стекло: `backdrop-blur`, полупрозрачный фон
- Свет: subtle border glow, градиентные обводки
- Сетка: минимальная, для структуры
- «Операционная консоль»: dashboard UI, переключение tabs (Build / Integrate / Launch)

## 5. Уникальные элементы

- Панели вместо однотипных карточек в ряд
- Cross-fade/slide при смене контента
- Консольный вид: «AI Delivery Core» как центральный узел

## 6. Уровень «премиум»

- Ритм: воздух, отступы, читабельность
- Сетка: 12–16 колонок, выравнивание
- Типографика: hierarchy, contrast

## 7. Потенциально тяжёлое

- Canvas/WebGL: shader-background — пауза вне viewport
- Blur: только локально (header, tooltip, панели)
- Particles: минимум или отключение на low-end
- DPR clamp, fps cap 45–50 для фоновых FX

---

## Что переносим в AI Delivery (адаптация)

| Паттерн | Реализация в AI Delivery |
|---------|--------------------------|
| Cinematic hero | Aurora blobs + slow drift, cursor-reactive grid |
| Shimmer/signature | 1–2× scanline по заголовку при загрузке |
| Energy pulse | Subtle pulse вокруг core в BusinessCoverageGraph |
| Signature buttons | Градиентный неон + inner glow + lift |
| Trailing underline | Анимированная линия под ссылками |
| Showcase panel | ProcessPanel как «операционная консоль» |
| Cursor | DOT only, instant follow, scale на hover |
| Page transition | Краткий fade 150ms при смене маршрута |
