# Release-ready checklist

Перед пушем в GitHub и деплоем убедитесь, что выполнены шаги ниже.

## Сборка и запуск

```bash
npm run build
npm run start
```

- `npm run build` должен завершиться без ошибок (TypeScript, ESLint, Next.js).
- `npm run start` поднимает production-сервер на `http://localhost:3000`.

## Что проверено в этом релизе

1. **Scroll-to-top при навигации**
   - Компонент `components/behavior/ScrollToTopOnRouteChange.tsx`: при смене маршрута страница скроллится вверх.
   - При наличии `#hash` в URL выполняется скролл к якорю (с retry через rAF).
   - При наличии Lenis используется `lenis.scrollTo(0, { immediate: true })`, иначе `window.scrollTo(0, 0)`.
   - В layout подключён внутри `<SmoothScroll>`; `history.scrollRestoration = 'manual'`.

2. **Мягкие переходы между секциями (seamless)**
   - В `SectionShell` добавлен проп `seamless`: градиентные overlay сверху/снизу (::before / ::after) для сглаживания границ.
   - Применён к секциям: GrowthStory (`#proof`), AILeveragePanel (`#leverage`).

3. **Automation in motion — подсветка потока**
   - В блоке «Automation in motion» (Лид → Бот → CRM → Отчёты):
     - Каждые ~2.8 с по очереди подсвечивается узел и ведущая к нему стрелка.
     - Одна «точка-пакет» перемещается к активному узлу (только при `inView`).
     - Анимация приостанавливается вне viewport (IntersectionObserver через `inView`).
     - При `prefers-reduced-motion`: движение отключено, остаётся статичная подсветка active state.

## Чеклист перед пушем

- [ ] `npm run build` — без ошибок
- [ ] `npm run start` — приложение открывается, нет 404 на `/_next/static/*`
- [ ] Нет hydration warnings в консоли браузера
- [ ] Скролл: после перехода по ссылке (Услуги/Кейсы и т.д.) страница открывается сверху
- [ ] Секции: нет резких «швов» между блоками (проверить скролл после Hero, вокруг GrowthStory)
- [ ] Блок «Automation in motion»: при скролле к блоку виден поочерёдный пульс по цепочке и точка-пакет
- [ ] Мобилка: нет горизонтального overflow, sticky-элементы не конфликтуют
- [ ] В репозитории нет лишних build-artifacts (`.next`, `node_modules` в `.gitignore`)

## .gitignore

Проверено наличие:

- `.next`, `out`, `build`, `dist`
- `node_modules`
- `.env*` (с исключением `!.env.example` при необходимости)

## Деплой

После пуша в GitHub сборка и деплой зависят от вашей CI/CD (Vercel, GitHub Actions и т.д.). Убедитесь, что в CI выполняется `npm ci && npm run build`.
