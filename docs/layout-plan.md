# План новой композиции главной AI Delivery

> Правило: **не больше 2 секций подряд одного типа**. Паттерны A–F чередуются.

---

## Текущий порядок → новый порядок

### Текущий порядок (однотипно)
1. Hero
2. GrowthStory (3 панели)
3. PainSolution (много карточек)
4. AILeveragePanel (табы)
5. Tasks (4 карточки)
6. Products (4 карточки)
7. WhoFits (4 карточки)
8. FeaturedCases (3 карточки)
9. Insights (3 карточки)
10. ProcessPanel (showcase)
11. Integrations (граф + карточки)
12. WhyUs (4 карточки)
13. FAQ
14. CTA
15. Footer

### Новый порядок по паттернам

| # | Секция | Паттерн | Описание |
|---|--------|---------|----------|
| 1 | **Hero** | A (Split) | Текст слева, граф справа. Упростить контент, -30% визуального шума, safe area. |
| 2 | **Integrations (Marquee)** | E | Лёгкая лента логотипов/каналов — сразу после hero для доверия. Краткая версия. |
| 3 | **GrowthStory** | D (Metric wall) | Одна большая метрика + 3 компактных. Dashboard-style, Live badge. |
| 4 | **PainSolution** | C (Timeline) | «Типичная ситуация → мы делаем иначе → в итоге» — stepper с подсветкой. |
| 5 | **AILeveragePanel** | B (Showcase panel) | Уже панель с табами — оставить как есть. |
| 6 | **Tasks + Products** | B (Showcase) | Объединить в одну секцию с табами по направлениям (боты/лендинги/n8n/miniapps). |
| 7 | **WhoFits** | C (Stepper) или A (Split) | Timeline «Кому подходит» или split: текст + компактный список. |
| 8 | **FeaturedCases** | Журнальный | 1 большая карточка + 2 меньшие. Одна кнопка «Смотреть все кейсы →». |
| 9 | **ProcessPanel** | C (Timeline/Stepper) | Уже showcase panel — оставить. |
| 10 | **Integrations (полная)** | A (Split) | Граф слева, справа — компактная таблица/бейджи вместо 5 карточек. |
| 11 | **WhyUs** | Панель/таблица | «Что входит / сроки» — короткая таблица или 2–3 факта без grid 4 карточек. |
| 12 | **Insights** | E (Marquee) или лента | 3 карточки в горизонтальной ленте (scroll на мобилке), не grid. |
| 13 | **FAQ** | F (Accordion) | Уже accordion — ок. |
| 14 | **CTA** | — | Форма. |
| 15 | **Footer** | — | — |

---

## Паттерны секций (референс)

- **A — Split scene**: текст слева, визуал справа.
- **B — Showcase panel**: одна большая панель (табы, OS-style).
- **C — Timeline / Stepper**: нарратив по шагам, подсветка активного.
- **D — Metric wall**: крупные цифры, Live demo, минимальная графика.
- **E — Marquee/Logos/Badges**: лента доверия/интеграций.
- **F — Accordion/FAQ**: раскрывающиеся блоки.

---

## Изменения по приоритету

### P0 (обязательно)
1. Hero: упростить, -30% шума, safe area.
2. GrowthStory: metric wall — 1 большая + 3 компактных.
3. FeaturedCases: журнальный формат (1 большая + 2 меньшие).
4. SectionShell seamless для всех секций.

### P1 (важно)
5. PainSolution: timeline вместо 8 карточек.
6. Tasks + Products: объединить в showcase с табами.
7. Integrations: split + таблица/бейджи вместо 5 карточек.
8. WhyUs: таблица/панель вместо 4 карточек.

### P2 (улучшить)
9. WhoFits: timeline или split.
10. Insights: лента вместо grid.
11. Marquee доверия после hero (если есть логотипы).

---

## SectionShell

- Добавить `seamless` ко всем секциям, где нет жёсткого фона.
- Вариант `bg="fade"` для GrowthStory, PainSolution, FeaturedCases — мягкие переходы.
