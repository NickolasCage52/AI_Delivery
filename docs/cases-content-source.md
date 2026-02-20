# Источник контента кейсов (Cases Content Source)

## 1. Где хранятся данные и ассеты

### Исходный лендинг: «Упаковка кейсов лендинг»

- **Расположение:** `Упаковка кейсов лендинг/Упаковка кейсов лендинг/`
- **Входной файл:** `index.html` — разметка страницы, контент подставляется из JS.
- **Скрипты:**
  - `assets/js/cases.js` — **основной источник данных**: массив `CASES`, фильтры `FILTERS`, рендер карточек и детальной страницы кейса, галерея, форма заявки.
  - `assets/js/leads.js` — отправка заявок (не переносится в основной сайт как есть).
- **Стили:** `assets/css/styles.css`
- **Изображения:** `assets/images/cases/`
  - Имена файлов: `case-01.png` … `case-06.png`, для каждого кейса также `case-XX-2.png`, `case-XX-3.png`, `case-XX-4.png`, `case-XX-5.png` (галерея).
  - В лендинге в карточке показываются только 1-е, 4-е и 5-е фото (остальные не используются в сетке).

В лендинге **нет** отдельных файлов данных (`data.json`, `cases.json`, `config.js`): всё задано в `assets/js/cases.js` в константе `CASES`.

---

## 2. Как устроены ссылки на кейсы

- **В лендинге:**
  - Список: якорь `#cases`, карточки ведут на `./?case=<slug>` (одна страница, переключение по query).
  - «Подробнее о кейсе» → `./?case=<slug>`.
  - «Ссылка на проект» → внешний URL (`projectUrl` / `caseUrl`): GitHub Pages, Telegram-бот, клиентский сайт и т.д.
- **В основном сайте (целевая схема):**
  - «Подробнее о кейсе» → внутренний маршрут `/cases/<slug>` (например `/cases/b2b-sales-automation`).
  - «Ссылка на проект» → без изменений, внешний URL (опционально можно скрыть, если проекта нет).
  - Все CTA «Открыть кейс» ведут на `/cases/<slug>`.

---

## 3. Какие изображения используются и их пути

| Кейс (slug)                  | Обложка (cover)   | Галерея (в лендинге отображаются 1, 4, 5) |
|----------------------------|-------------------|-------------------------------------------|
| miniapp-mvp-online-school  | case-02.png       | case-02.png, case-02-4.png, case-02-5.png |
| b2b-sales-automation       | case-03.png       | case-03.png, case-03-4.png, case-03-5.png |
| modular-houses-website    | case-04.png       | case-04.png, case-04-4.png, case-04-5.png |
| retro-lamps-website       | case-05.png       | case-05.png, case-05-4.png, case-05-5.png |
| seafood-order-automation  | case-06.png       | case-06.png, case-06-4.png, case-06-5.png |
| cleaning-company-website | case-01.png       | case-01.png, case-01-4.png, case-01-5.png |

В основном сайте пути к файлам из `public`:

- Обложка: `/cases-landing/case-XX.png`
- Галерея: `/cases-landing/case-XX.png`, `/cases-landing/case-XX-2.png`, … `/cases-landing/case-XX-5.png`

Используются только локальные пути; ссылок на домен GitHub Pages в данных нет.

---

## 4. Порядок кейсов в лендинге

В `cases.js` массив `CASES` задан в таком порядке (именно он используется на странице):

1. `miniapp-mvp-online-school` (case-02)
2. `b2b-sales-automation` (case-03)
3. `modular-houses-website` (case-04)
4. `retro-lamps-website` (case-05)
5. `seafood-order-automation` (case-06)
6. `cleaning-company-website` (case-01)

На странице `/cases` в основном сайте порядок карточек совпадает с этим списком (источник — `content/cases-landing/cases.json`).

---

## 5. Как обновлять контент

- **Тексты и структура кейсов:** правки в `content/cases-landing/cases.json`. Формат полей описан в этом файле и в типах в `components/cases-landing/cases-data.ts` (или в lib, которая читает JSON).
- **Изображения:** заменить или добавить файлы в `public/cases-landing/`. Имена должны совпадать с путями в `cases.json` (например `coverImage` и элементы `gallery` / `images`).
- **Новый кейс:** добавить объект в массив в `cases.json`, положить картинки в `public/cases-landing/`, при необходимости обновить фильтры (категории) на странице `/cases`.
- После изменений пересобрать проект: `npm run build`.

---

## 6. Откуда что взято (кратко)

| Что            | Источник в лендинге        | В основном сайте                    |
|----------------|----------------------------|-------------------------------------|
| Список кейсов  | `CASES` в `assets/js/cases.js` | `content/cases-landing/cases.json`  |
| Фильтры        | `FILTERS` в `cases.js`     | Константа в коде (cases-data / компонент) |
| Тексты, KPI    | Поля объектов в `CASES`    | Те же поля в `cases.json`           |
| Пути к картинкам | `./assets/images/cases/...` | `/cases-landing/...` (файлы в `public/cases-landing/`) |
| Ссылка «Подробнее» | `./?case=<slug>`        | `/cases/<slug>`                     |
| Ссылка на проект | `projectUrl` / `caseUrl`  | Без изменений (внешний URL)         |
