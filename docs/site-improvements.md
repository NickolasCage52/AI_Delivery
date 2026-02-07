# Site Improvements — AI Delivery (implemented)

Список реально внедрённых улучшений UI/UX, перфоманса и визуала.

---

## Курсор и микровзаимодействия

1. **GlowCursor → osu-style**: ядро — маленькая точка 2–4px с ярким неон-свечением; оболочка — тонкое кольцо 18–26px с полупрозрачным stroke и мягким glow. Вместо одного большого blur-пятна.
2. **Курсор: hover по кликабельным**: при наведении на ссылки/кнопки кольцо слегка увеличивается (scale 1.18) и усиливается opacity/glow. Определение через `elementFromPoint` + селектор `a, button, [role=button], [href]`.
3. **Курсор: click pulse**: при клике кольцо анимирует короткий pulse (scale 1 → 1.5 → 1.6, opacity fade). Класс `cursor-ring-pulse`, keyframes в `globals.css`.
4. **Курсор: без setState в RAF**: позиция и hover-состояние обновляются в `requestAnimationFrame` через refs и `style.setProperty` / `classList`; один `transform: translate3d(x,y,0)` и `will-change: transform` на обёртке.
5. **Курсор отключён на touch/coarse**: проверка `matchMedia('(pointer: coarse)')` и состояние `isCoarse` — на тач-устройствах компонент не рендерится.

---

## Интеграционный граф и бренд

6. **IntegrationGraph (SVG)**: единый компонент графа «AI в центре + узлы по кругу» (n8n, Telegram, CRM, Sheets, WhatsApp, Сайт, Аналитика). Чистый SVG, ровная геометрия, единый stroke.
7. **Граф: дыхание центра**: центральный узел AI с лёгкой анимацией scale/opacity (keyframes `integrationBreath`) при quality !== low.
8. **Граф: data packets**: маленькие точки, движущиеся по линиям центр→узел (`animateMotion`), только в variant full и при не-low quality; ограничено 4 пакетами.
9. **Граф: hover по узлу**: при наведении подсвечиваются связанные линии (stroke и strokeWidth). Только в variant full.
10. **LogoMark**: упрощённая иконка-логотип — центральный круг + 4 узла + 4 линии; читается в 24–32px. Компонент `components/brand/LogoMark.tsx`.
11. **Header: логотип AI Delivery**: слева в шапке — LogoMark + текст «AI Delivery»; при hover mark чуть ярче (`hover` prop), переход по цвету текста на cyan.
12. **Hero: граф как фон**: на главном экране граф выведен как подложка с низкой непрозрачностью (12–14%), лёгкий blur (1–2px) на контейнере графа; variant minimal (без data packets и breathing на фоне); на low quality — simplified.

---

## Скролл и анимации

13. **Scroll velocity blur на мобилке**: раньше эффект был только на desktop; теперь включён и на мобильных с ограничением max blur 1px (`getScrollBlurMax(quality, isMobile)`). Desktop 2px / 1.5px, mobile cap 1px.
14. **Lenis + ScrollTrigger**: в одном RAF-цикле SmoothScroll после `lenis.raf(time)` вызывается `ScrollTrigger.update()`, чтобы pinned-сцены (ProcessPanel) синхронно обновлялись с плавным скроллом.
15. **ProcessPanel: плавная смена панели**: при смене шага контент панели анимируется с `initial={{ opacity: 0, x: 12 }}` → `animate={{ opacity: 1, x: 0 }}`, transition 0.3s с ease [0.22, 1, 0.36, 1]. Без AnimatePresence; только transform/opacity.

---

## Качество и перфоманс

16. **Quality controller**: уровень high/medium/low по ширине, ядрам, памяти и prefers-reduced-motion; используется в Hero blur, canvas DPR, scroll blur max, GlowCursor scale, ProcessPanel filter blur.
17. **Граф лёгкий по DOM**: один SVG, минимум групп; анимации через opacity/transform и SVG `animateMotion`; data packets ограничены.
18. **prefers-reduced-motion**: учтён в quality (low), в GlowCursor (не показываем), в ScrollVelocityBlur (не запускаем), в Hero/ProcessPanel анимациях (initial: false или упрощённые варианты).

---

## Глубина и типографика

19. **Depth в Hero**: слои градиентов + орбы с адаптивным blur по quality; граф на фоне добавляет глубину без перегруза.
20. **Кнопки и CTA**: MagneticButton в Hero; SectionCTA в секциях; фокус-состояния через `:focus-visible` в globals.css (outline accent-cyan).
21. **Карточки ProcessPanel**: стек «задних» панелей с transform/scale по глубине; основная карточка с border и тенью glow; кнопка CTA с hover shadow.

---

## Документация и аудит

22. **perf-audit.md**: обновлён с учётом osu-курсора, mobile scroll blur, Lenis+ScrollTrigger; список исправлений актуален.
23. **site-improvements.md**: этот файл — перечень внедрённых улучшений для прозрачности и приёмки.

---

## Итог

- Курсор: osu-style точка + кольцо, hover/click, без setState в RAF, отключён на coarse.
- Интеграционный граф: SVG, дыхание, data packets, hover; LogoMark в Header; граф как фон Hero.
- Скролл: velocity blur и на мобилке (≤1px); Lenis + ScrollTrigger.update() в одном RAF.
- ProcessPanel: плавный переход панели по шагам.
- Quality controller и prefers-reduced-motion учтены по всему сайту.
