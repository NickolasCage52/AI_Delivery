# Hero Graph Orbital — документация

## Обзор

Hero-граф (`BusinessCoverageGraph`) интегрирует механики из **RadialOrbitalTimeline**: орбитальное вращение, фокус на узле, подсветка связанных узлов и карточка с Connected nodes.

## Что взяли из RadialOrbitalTimeline

| Функция | Реализация |
|--------|------------|
| **Авто-вращение орбиты** | `autoRotate` + rAF, обновление `rotationAngleRef` |
| **Клик по узлу → раскрытие карточки** | `activeNodeId`, только одна карточка |
| **Подсветка связанных узлов/линий** | `relatedIds` → `highlightedIds`, подсветка edges и узлов |
| **Центрирование на узле** | `centerViewOnNode(id)` → `targetRotationRef = 270 - baseAngle`, плавная интерполяция |
| **Клик по фону → сброс** | `handleBackgroundClick`: `activeNodeId=null`, `autoRotate=true` |
| **Data-модель узла с связями** | `HeroNode` в `lib/hero/graph.ts`: `id`, `title`, `description`, `relatedIds`, `energy`, `cta` |

## Оптимизации для FPS

### 1. rAF без лишних re-render

- **Проблема**: В оригинале вращение через `setInterval(50ms)` + `setRotationAngle` → до 20 обновлений React state в секунду.
- **Решение**:
  - `rotationAngleRef.current` обновляется в rAF;
  - DOM обновляется напрямую через `g.setAttribute('transform', ...)` на wrapper `<g>`;
  - React state (`activeNodeId`, `autoRotate`) обновляется только при действиях пользователя.

### 2. Offscreen pause

- **useInViewport** + **useFxLifecycle**;
- `!inView || !fx.isActive` → `cancelAnimationFrame`, rAF не выполняется;
- Пакеты `animateMotion` отключаются при `!fx.isActive` (через `showPackets`).

### 3. Карточка без лагов

- `bg-black/70` + `backdrop-blur-md` — локальный blur, не на весь экран;
- Контент не рендерится каждый кадр, только при `activeNodeId`.

### 4. Мобильная адаптация

- На `compact` (size ≤ 440): карточка ниже/по центру;
- Увеличен `hitRadius` для узлов;
- Меньше декоративных пакетов на low quality.

## Как проверить

1. **FPS**
   - Chrome DevTools → Performance → Record при скролле и кликах;
   - Не должно быть рывков, стабильный FPS.

2. **Карточка 20 раз**
   - Открывать/закрывать карточку 20 раз;
   - Нет деградации производительности.

3. **Offscreen**
   - Скролл вниз (hero вне viewport) → rAF остановлен;
   - Скролл назад → вращение возобновляется.

4. **Build**
   ```bash
   npm run build && npm run start
   ```

## Файлы

- `lib/hero/graph.ts` — типы `HeroNode`, данные `HERO_NODES`, `HERO_EDGES`
- `components/hero/BusinessCoverageGraph.tsx` — основной компонент
- `app/globals.css` — `@keyframes pulse-ring` для related highlight
