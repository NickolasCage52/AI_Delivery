# Аудит верстки и улучшения (Layout & Hero)

## 1. Обнаруженные проблемы верстки

### Сетка и контейнеры
1. **Container** — на мобиле только `px-6 md:px-8`; на узких экранах (360–390px) мало воздуха, нет отдельного `px-4` для small.
2. **Разные вертикальные отступы секций**: часть секций `py-24 md:py-32`, часть `py-20 md:py-24`, PainSolution `py-24 md:py-32` — нет единого ритма (py-14–16 mobile, py-20–24 desktop).
3. **SectionShell** — варианты `plain`/`panel`/`grid` дают одинаковый или близкий spacing; «plain» визуально не отличается от «panel» по воздуху.
4. **FeaturedCases** — своя секция с `py-24 md:py-32` и своим градиентным фоном; ритм совпадает, но дублирование стилей.
5. **Header** — двойное использование Container (основной + в мобильном меню); ок, но стоит проверить единый max-width.

### Типографика и читабельность
6. **Нет явного ограничения ширины текста** для длинных абзацев — в Hero и секциях используется `max-w-2xl`/`max-w-xl` выборочно; нет токена типа `max-w-[58ch]` для основного описания.
7. **Lead-текст** — в Hero `text-lg md:text-xl`, в других секциях разный размер; нет единой шкалы lead (18–20px).
8. **Размеры h1/h2/h3** — заданы через утилиты (text-3xl, text-4xl, md:text-5xl); глобально в globals.css только семейство шрифтов для h1–h3, шкала не зафиксирована в одном месте.
9. **Blur на тексте** — в Hero текст в карточке с `drop-shadow`, глобально blur на тексте не применяется; градиенты/орбы позади могут снижать контраст — нужна «safe area» под текст.

### Карточки и визуальный шум
10. **Hero** — большая карточка с border, bg-black/40, shadow; плюс градиент, орбы, сетка, шейдер — визуально перегружено.
11. **Карточки внутри карточек** — PainSolution: три карточки с border в секции с фоном; FeaturedCases: SpecularCard с градиентом — нормально, но плотность рамок высокая.
12. **Секции без SectionShell** — PainSolution, FeaturedCases, Cases, Insights, CTA, FAQ используют напрямую Container и свои классы фона; нет единого варианта (plain/panel/grid).
13. **Интеграции / BuildToMetrics** — много визуальных слоёв (градиенты, код, NumbersProof); не урезать, но можно ослабить интенсивность фона.

### Адаптив
14. **overflow-x** — в globals и body стоит `overflow-x: hidden`; нужно проверить секции с grid/flex на min-width (flex без min-w-0 может давать overflow).
15. **Длинные слова** — не везде есть `break-words`/`overflow-wrap` для длинных URL или терминов.
16. **Tap targets** — кнопки и ссылки в хедере/футере нужно проверить на минимум 44px по высоте/области нажатия.
17. **Sticky CTA / Cookie notice** — проверить z-index относительно модалок и хедера; не должны перекрывать контент неправильно.

### Main screen (Hero) — перегруз
18. **Контент Hero**: H1 + subtitle + speedLine + **5 bullets** + offerNote + 2 CTA + scroll hint — на первом экране слишком много текста; оставить 3 буллета, остальное перенести ниже или сократить.
19. **Слои FX**: градиент фона → статичная сетка → CursorReactiveGrid → два aurora-орба (blur) → ShaderBackground (WebGL). Всего 5 визуальных слоёв; интенсивность орбов и шейдера можно снизить на 25–40%.
20. **Нет «safe area» под текст** — затемняющая подложка/градиент под левым блоком слабая (только карточка bg-black/40); при ярком шейдере текст может теряться.
21. **ShaderBackground** — уже привязан к viewport (useInViewport + useFxLifecycle), при уходе Hero из вьюпорта останавливается — ок. FPS cap 50 для high, DPR clamp — ок. Дополнительно можно чуть снизить opacity слоя.
22. **CursorReactiveGrid** — использует useInViewport, при не inView opacity 0 — ок. Можно снизить opacity с 0.18 до ~0.12.
23. **BusinessCoverageGraph** — SVG + animateMotion, не rAF; useFxLifecycle уже отключает пакеты вне viewport — ок.
24. **Единый RAF** — один rafLoop в shader; лишних циклов не найдено.

### Прочие баги
25. **z-index** — проверить порядок: header, sticky CTA, cookie notice, modals, tooltips (например граф в Hero показывает tooltip с z-20).
26. **Scroll-to-top** — при смене маршрута (PageTransition) проверить, что скролл сбрасывается.
27. **Focus/hover** — единообразие :focus-visible и hover состояний по кнопкам и ссылкам.

---

## 2. Файлы и секции для правок

| Файл / зона | Что правим |
|-------------|------------|
| `components/ui/Container.tsx` | Добавить px-4 для mobile, единый max-width 1280px |
| `components/layout/SectionShell.tsx` | Единый ритм: plain py-14 md:py-16, panel/grid py-20 md:py-24 |
| `app/globals.css` | Токен max-width текста (опционально), ослабить .aurora-bg если мешает |
| `components/sections/HeroScene.tsx` | Меньше контента (3 bullets), safe-area под текст, ослабить FX (орбы, сетка, shader opacity) |
| `components/ui/shader-background.tsx` | Уже viewport + visibility; при желании чуть снизить opacity |
| `components/hero/CursorReactiveGrid.tsx` | Снизить opacity слоя |
| `content/site-copy.ts` | Hero.bullets — использовать только первые 3 в Hero, остальное для «ниже» или не показывать в первом экране |
| Секции с прямым py-* | Привести к одному ритму где используем SectionShell или явно py-14/20 |
| Header / StickyCTA / CookieNotice | Проверить z-index и tap targets |

---

## 3. Что сделано (после правок)

- **Container**: mobile `px-4`, tablet `px-6`, desktop `px-8`; max-width 1280px.
- **SectionShell**: единый вертикальный ритм (plain 14/16, panel/grid 20/24).
- **Hero**: на первом экране только H1 + один абзац + до 3 bullets + 2 CTA; speedLine/offerNote визуально облегчены или перенесены; под текстом усилена safe-area (градиент).
- **Hero FX**: ослаблена интенсивность орбов и статичной сетки; снижена opacity шейдера; CursorReactiveGrid менее контрастный.
- **Hero FX lifecycle**: без изменений — работа только в viewport уже реализована (ShaderBackground, Graph).
- **Типографика**: у основного описания в Hero и секциях задан max-w для читабельности (например max-w-[62ch]).
- **Адаптив**: добавлен min-w-0 у колонки с графом в Hero; z-index: CookieNotice z-[60], header z-50, Sticky CTA z-40.
- **Build**: `npm run build` проходит успешно.
