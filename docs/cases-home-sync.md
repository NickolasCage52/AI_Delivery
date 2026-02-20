# Синхронизация кейсов: главная и /cases

## Проблема (до изменений)

- **Главная страница** (`app/page.tsx`) показывала кейсы из **старого источника**: `getAllCases()` из `lib/content/cases.ts` → чтение `content/cases/*.json` (формат `CaseStudy`: 3 кейса — fintech-lead-bot, miniapp-mvp-catalog, service-automation-pipeline).
- **Страница /cases** брала данные из **другого источника**: `getCasesLanding()` из `lib/content/cases-landing.ts` → `content/cases-landing/cases.json` (6 кейсов из лендинга).
- В итоге на главной отображались **другие** кейсы, чем на полной странице кейсов; единого источника правды не было.

## Решение

### Единый источник данных

- **Один источник:** `content/cases-landing/cases.json`.
- **Единый data-access модуль:** `lib/cases/getCases.ts`:
  - `getAllCases(): Case[]` — все кейсы (для /cases и sitemap).
  - `getFeaturedCases(limit: number): Case[]` — до `limit` кейсов для главной: сначала с `featured: true`, при нехватке — первые по порядку из списка.
  - `getCaseBySlug(slug: string): Case | null` — один кейс по slug (для /cases/[slug] и карточек).

### Featured-кейсы на главной

- В `cases.json` у части кейсов добавлено поле **`featured: true`** (первые 2–3 для блока на главной).
- На главной используется секция **FeaturedCases**: 2–3 карточки из `getFeaturedCases(3)`, заголовок «Кейсы: было → сделали → стало», подзаголовок «Оцифрованный эффект за 4–7 дней», одна CTA «Смотреть все кейсы» → `/cases`, в карточках «Открыть кейс» → `/cases/[slug]`.

### Что поменяли в коде

| Место | Было | Стало |
|-------|------|--------|
| Главная | `getAllCases()` из `lib/content/cases`, компонент `Cases`, 3 кейса формата CaseStudy | `getFeaturedCases(3)` из `lib/cases/getCases`, компонент `FeaturedCases`, те же кейсы, что на /cases |
| /cases | `getCasesLanding()` из `lib/content/cases-landing` | `getAllCases()` из `lib/cases/getCases` (или реэкспорт через cases-landing) |
| Компонент на главной | `Cases` (CaseStudy, «Обезличенный кейс») | `FeaturedCases` (Case из cases.json, премиальные карточки, ссылки на /cases/[slug]) |

### Обратная совместимость

- `lib/content/cases-landing.ts` оставлен: реэкспортирует данные из `lib/cases/getCases.ts`, чтобы страница /cases и [slug] не ломались.
- Старый `lib/content/cases.ts` (CaseStudy, content/cases/*.json) по-прежнему используется только для **трёх** детальных страниц кейсов (fintech-lead-bot, miniapp-mvp-catalog, service-automation-pipeline). Для главной и для списка на /cases он больше не используется.

## Итог

- На главной и на /cases отображаются **одни и те же** кейсы из `content/cases-landing/cases.json`.
- Нет захардкоженных кейсов на главной.
- «Смотреть все кейсы» ведёт на `/cases`, «Открыть кейс» — на `/cases/[slug]`.
