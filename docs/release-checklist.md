# Release Checklist — AI Delivery

## Build / Runtime
- [x] `npm run build`
- [x] `npm run start` (порт 3005)
- [ ] Нет 404 на `/_next/static/*`

## Hydration / визуальные переключения
- [ ] Нет hydration warnings в консоли
- [ ] Hero/шапка не «переключаются» после гидрации

## Функциональные проверки
- [ ] Форма отправки ведёт на `/thank-you`
- [ ] Все CTA ведут туда, куда обещают
- [ ] Мобильная версия: без лагов и без «мертвых» кликов

## Perf‑гарантии (код)
- [x] Нет FPS‑auto‑downgrade (quality без sampling)
- [x] Единый rAF loop для FX/scroll
- [x] Нет setState в scroll/mousemove/RAF hot‑путях
