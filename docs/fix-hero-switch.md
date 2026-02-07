# Fix Report — Hero/Header Switch

## Причина
- Клиентский `ShaderBackground` мог возвращать `null` после гидрации (при `prefers-reduced-motion` или `quality === "low"`), из‑за чего структура DOM отличалась от SSR и React пересоздавал поддерево. На слабых устройствах это выглядело как «переключение» версии Hero/шапки.
- Service Worker / PWA не обнаружены.

## Что изменено
- `components/ui/shader-background.tsx`: всегда рендерит `<canvas>` (DOM остаётся стабильным), а не удаляется. Эффект просто выключается по opacity, а render‑loop не запускается при `reduced/low`.
- Добавлены dev‑логи для диагностики рендера:  
  - `components/sections/HeroScene.tsx`  
  - `components/layout/Header.tsx`  
  - `components/sections/Hero.tsx` (legacy)  
  - `components/sections/Header.tsx` (legacy)

## Как проверить
1) Откройте `/` и проверьте консоль:  
   - Должны быть логи `[HeroScene] render` и `[Header] render`.  
   - Не должно быть логов `[Legacy Hero]` / `[Legacy Header]`.
2) Проверьте визуально: не должно быть переключения «новый → старый».
3) Проверьте консоль на `hydration` warnings (их быть не должно).
