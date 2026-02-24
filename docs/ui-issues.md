# UI Issues — AI Delivery: однотипность и перегруз

> Инвентаризация секций главной и проблем по однотипности, перегрузу и CTA.

---

## 1. Секции с одинаковой структурой (grid карточек)

| Секция | Проблема |
|--------|----------|
| **PainSolution** | 3 карточки FLOW (grid-cols-3) + 2 карточки «Без/С AI Delivery» + карточка «Артефакты» + карточка «Результат» + карточка «Запустим» = 8 карточек/панелей подряд с `rounded-2xl border border-white/10 bg-[var(--bg-elevated)]`. |
| **Tasks** | 4 карточки в grid — `rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/55`. |
| **Products** | 4 SpecularCard в grid — повтор паттерна Tasks. |
| **Integrations** | 4 STACK_BLOCKS в grid + 1 «Что получаете» — 5 карточек с одинаковым стилем. |
| **WhyUs** | 2x2 grid карточек с `rounded-2xl border border-white/10`. |
| **WhoFits** | 4 сегмента + 1 «Кому НЕ подходит» — все `rounded-2xl border border-white/10`. |
| **FeaturedCases** | 3 карточки SpecularCard в grid. |
| **Insights** | 3 SpecularCard в grid. |

**Итог**: 8+ секций подряд выглядят как «grid карточек» с одинаковыми рамками, blur, spacing.

---

## 2. Перегруз на main screen (Hero)

- **Контент**: H1 + subtitle + 3 bullets + offerNote + 2 CTA + scroll hint — много элементов.
- **Визуал**: ShaderBackground + CursorReactiveGrid + Aurora blobs + base grid + BusinessCoverageGraph — 5+ слоёв эффектов.
- **Карточка под текст**: `rounded-2xl border border-white/[0.08] bg-black/50 backdrop-blur-sm` — создаёт ощущение «карточки в hero», тогда как hero должен быть «сценой», не карточкой.

---

## 3. CTA — избыток и однотипность

- Hero: 2 CTA.
- PainSolution: 2 ссылки в конце.
- GrowthStory: ссылка на кейсы.
- Tasks: «Все услуги и пакеты».
- Products: 4× CTA «Подробнее» + «Все услуги».
- FeaturedCases: «Смотреть все кейсы».
- ProcessPanel: SectionCTA с 3 опциями.
- Integrations: 3 ссылки.
- CTA (форма): основной CTA.

**Проблема**: много «Подробнее», «Все услуги», «Смотреть кейсы» — однотипные вторичные CTA, размывают главный путь.

---

## 4. Нет «вау» и смысла в некоторых блоках

- **GrowthStory**: BuildScene + AutomationScene + MetricsScene — хорошо, но 3 «панели» подряд (`rounded-xl border border-white/[0.06]`) выглядят похоже.
- **AILeveragePanel**: уже панель с табами — хорошо, отличается.
- **ProcessPanel**: OS-style showcase — хорошо, отличается.
- **FeaturedCases**: просто grid 3 карточки — нет журнального формата.
- **Insights**: grid 3 карточек — нет отличия от FeaturedCases.

---

## 5. Рамки и бордеры

- Почти везде: `border border-white/10` или `border-white/[0.06]`.
- Нет смысловой дифференциации — рамка не подчёркивает важность, а просто «декор».

---

## 6. Фоновые градиенты

- Многие секции: `radial-gradient(900px 400px at X% Y%, rgba(139,92,246,0.06)...` — повторяется.
- **SectionShell** с `seamless` — есть, но не везде используется.

---

## Рекомендации (кратко)

1. **Hero**: упростить контент, уменьшить визуальный шум на 30–40%, усилить safe area для текста.
2. **PainSolution**: заменить часть grid на split или timeline.
3. **Tasks + Products**: объединить или сделать один showcase с табами.
4. **FeaturedCases**: журнальный формат — 1 большая + 2 меньшие.
5. **Integrations**: split (граф слева) + компактная таблица/бейджи справа вместо 5 карточек.
6. **WhoFits**: timeline или accordion вместо 4 одинаковых карточек.
7. **CTA**: консолидировать — один главный путь, меньше повторяющихся ссылок.
8. **SectionShell seamless**: применить ко всем секциям для мягких швов.
9. **Бордеры**: убрать там, где не дают смысла; оставить только для панелей/выделения.
