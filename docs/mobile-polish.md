# Mobile polish — отчёт

Отчёт о проверке и адаптации сайта для мобильных устройств (390px / 360px).

## Проверенные страницы

- `/` — главная
- `/services` — услуги
- `/cases` — кейсы
- `/about` — о нас
- `/contact` — контакты
- `/demo` — запросить демо
- `/privacy` — политика конфиденциальности
- `/cookies` — политика cookies
- `/directions`, `/directions/[slug]`, `/insights`, `/stack`

## Выполненные исправления

### 1. Cookie notice (плашка)

- **Компонент**: `components/legal/CookieNotice.tsx`
- **Мобильная адаптация**:
  - Full-width снизу на мобилках (`px-4 pb-4`)
  - На desktop — карточка справа внизу (`md:right-6 md:bottom-6 md:max-w-md`)
  - Кнопки в 2 строки при необходимости (`flex-wrap gap-3`)
  - Tap-targets ≥44px: кнопка «Понятно» и крестик
  - Sticky CTA скрывается, когда показан cookie notice (нет перекрытия)
  - z-index 50 — выше sticky CTA (40)

### 2. Sticky CTA

- Скрывается при показе cookie notice
- На мобилках full-width, кнопки компактные
- Primary CTA ведёт на `/demo`

### 3. Typography и tap targets

- **Body**: `font-size: 16px` в `globals.css` — читабельность на мобилках
- **Формы** (ContactForm, DemoForm):
  - `min-h-[48px]` для inputs и кнопок
  - `text-base` для полей ввода
- **SectionCTA**: primary и secondary кнопки `min-h-[44px]`
- **EstimateBlock**: кнопка «Запросить демо и план» `min-h-[44px]`
- **Header**: мобильное меню — кнопки с достаточным padding (`py-3 px-4`)

### 4. Layout и overflow

- `html`, `body`: `overflow-x: hidden` — нет горизонтального скролла
- Container: padding 16px на мобилках (`px-4`)

### 5. Специфика компонентов

- **SpecularCard**: hover-эффекты имеют touch fallback — на touch-устройствах `group-focus-within` обеспечивает доступ к контенту
- **Модалка LeadModal**: остаётся доступной (кнопка «Разобрать задачу»), адаптирована под мобилки

### 6. Footer

- Добавлены ссылки на `/privacy` и `/cookies`
- Flex-wrap для навигации — корректный перенос на узких экранах

### 7. Новые страницы (/demo, /privacy, /cookies)

- Mobile-first: grid переходит в одну колонку на мобилках
- Форма DemoForm: крупные поля, чекбокс с достаточной областью клика

## Рекомендации для ручной проверки

1. **390px / 360px**: проверить на iPhone SE, узких Android
2. **Cookie notice**: Incognito → появился → закрыть → refresh → не появляется
3. **Storage**: очистить `localStorage` → notice снова появляется
4. **Sticky CTA + cookie notice**: при первом заходе CTA не показывается, пока notice открыт; после закрытия notice CTA появляется при скролле
