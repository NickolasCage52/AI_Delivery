# UI fixes & perf report

## Что исправлено
1. Hero tooltip (BusinessCoverageGraph)
   - Glass blur фон, градиентный контур и мягкое свечение без тяжелых box-shadow.
   - Увеличены узлы, добавлен hover/focus ring и доступность с клавиатуры.
2. Hero nodes / hit-area
   - Увеличены размеры узлов и hit-area, добавлены focus состояния.
3. Услуги и пакеты
   - Два слоя контента (default/hover), без наложений и layout shift.
   - Появился явный "Подробнее" для touch и клавиатуры.
4. Сервисы и направления
   - Новые страницы `/directions` и `/directions/[slug]`.
   - Контент вынесен в `content/directions/*.json`.
   - Карточки "Сервисы и направления" ведут на страницы направлений.
5. Как работаем + тяжелые FX
   - Введен `useInViewport` и применен к тяжелым FX и GSAP сценам.
   - Анимации в `Process` и `ScrollScenes` запускаются только в viewport.

## Измененные файлы
- `hooks/useInViewport.ts`
- `components/hero/BusinessCoverageGraph.tsx`
- `components/hero/HeroServiceGraph.tsx`
- `components/hero/HeroIntegrationGraph.tsx`
- `components/stack/IntegrationGraph.tsx`
- `components/fx/SpecularCard.tsx`
- `components/fx/DataStreams.tsx`
- `components/fx/NeuralGridCanvas.tsx`
- `components/fx/ScrollScenes.tsx`
- `components/ui/shader-background.tsx`
- `components/sections/Process.tsx`
- `components/sections/Products.tsx`
- `components/sections/Tasks.tsx`
- `app/directions/page.tsx`
- `app/directions/[slug]/page.tsx`
- `app/sitemap.ts`
- `app/globals.css`
- `lib/content/directions.ts`
- `content/directions/*.json`

## Как проверить
1. Hero
   - Навести на узлы в `BusinessCoverageGraph`: tooltip должен быть стеклянным, читабельным.
   - Проверить hover/focus для узлов: hit-area увеличен, есть ring.
2. Услуги и пакеты
   - Навести на карточку: default текст скрывается, hover слой появляется без наложения.
   - На touch/клавиатуре: доступна ссылка "Подробнее".
3. Сервисы и направления
   - Открыть `/directions` и перейти на `/directions/bots`, `/directions/sites`, `/directions/n8n`, `/directions/miniapps`.
4. Как работаем и FX
   - Пролистать к блоку `#process`: анимация активна в viewport и не грузит вне зоны.
   - Уйти от блока и вернуться: анимации должны возобновиться.

## Команды
- `npm run lint`
- `npm run build && npm run start`
