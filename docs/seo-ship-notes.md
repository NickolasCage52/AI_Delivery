# SEO Ship Notes

## Что сделано
- Добавлены SEO‑хелперы (metadata + schema) и JSON‑LD.
- Настроены `robots.txt`, `sitemap.xml`, OG‑изображение и canonical.
- Добавлены `/insights` и 5 материалов с SSR‑контентом.
- Усилена внутренняя перелинковка (Home/Services/Cases/Insights).
- Добавлены скрытые поля `sourcePage`/`service` в ключевые формы.

## Проверки
- `npm run build`
- `npm run start -- -p 3100`

## Примечания
- Порты `3000` и `3001` были заняты, запуск сделан на `3100`.
- В `npm audit` есть 1 critical vulnerability (не исправлялось).
