# Forms Reliability Audit

Аудит форм и исправления для гарантированной доставки заявок в Telegram.

---

## 1. Инвентаризация форм

| № | Компонент | Файл | Страница | formId | Поля | Endpoint | Success UX | Error UX |
|---|-----------|------|----------|--------|------|----------|------------|----------|
| 1 | DemoForm | `components/sections/DemoForm.tsx` | /demo | demo_page | name, contact, task, improve, chaos, _hp | POST /api/lead | redirect /thank-you | alert() |
| 2 | ContactForm | `components/sections/ContactForm.tsx` | /contact | contact_page | name, contact, task, sphere, timeline, _hp | POST /api/lead | redirect /thank-you | alert() |
| 3 | CTA | `components/sections/CTA.tsx` | / (#contact) | home_cta | name, contact, niche, need, deadline→timeline, _hp | POST /api/lead | success block → /thank-you | alert() |
| 4 | LeadModal | `components/cta/LeadModal.tsx` | глобально | lead_modal | name, contact, need, sphere, timeline, _hp | POST /api/lead | success блок + кнопка | alert() |
| 5 | InlineLeadForm | `components/cta/InlineLeadForm.tsx` | / (и др.) | inline_form | name, contact, _hp | POST /api/lead | success inline | alert() |
| 6 | CTAFormBlock | `components/cases-landing/CasesShowcase.tsx` | /cases | cases_form | name, contact, message, company (hp) | POST /api/lead | success + reset | inline red text (formStatus) |

---

## 2. Причины «Ошибка отправки»

### 2.1 Идентифицированные проблемы

| Причина | Где | Исправление |
|---------|-----|-------------|
| Разный UX ошибок | DemoForm, ContactForm, CTA, LeadModal, InlineLeadForm показывают `alert()`; CTAFormBlock — inline красный текст | Единый FormStatus компонент |
| Нет таймаута fetch | submitLead.ts | AbortController + 15s timeout |
| Нет ретрая при сетевых сбоях | submitLead.ts | Retry 1x для 502/503/504/network |
| API возвращает `{ error }` без кода | route.ts | Стандартизировать: `{ ok, code, message, leadId }` |
| Telegram API: нет экранирования | formatTelegram/sendToTelegram | HTML mode или escape Markdown спецсимволов |
| Telegram: длина > 4096 | formatTelegram | truncate до 4096 |
| Нет leadId для отладки | route.ts | uuid в каждом запросе, логировать |
| Модалка может размонтироваться до fetch | LeadModal | Нет — handleSubmit не отменяется при закрытии, но лучше не закрывать до завершения |
| content-type | submitLead | Уже есть application/json ✓ |
| Rate limit 5/10min | route.ts | Может быть жёстко для легитимных пользователей — оставить, но код RATE_LIMIT |
| Honeypot: CTAFormBlock шлёт `message`, schema ожидает task/need | schema transform | transform объединяет message ?? task ?? need ✓ |
| formId/sourcePage | Все формы | Добавить formId, использовать usePathname для sourcePage |

### 2.2 Откуда берётся «Ошибка отправки»

- `submitLead`: при `!res.ok` возвращает `data.error ?? "Ошибка отправки"`. Если backend отдаёт не-JSON или пустое тело, `data.error` = undefined → «Ошибка отправки».
- Backend при fail Telegram: `{ ok: false, error: "Ошибка отправки. Попробуйте позже." }` — ок, но без code и leadId.
- res.json().catch(() => ({})) — при невалидном JSON → {} → «Ошибка отправки».

---

## 3. Реализованные исправления

1. **lib/lead/errors.ts** — типизированные коды ошибок (VALIDATION_ERROR, RATE_LIMIT, TELEGRAM_FAILED, NETWORK_ERROR, TIMEOUT, UNKNOWN)
2. **lib/lead/submitLead.ts** — таймаут 15s, retry 1x для 502/503/504/network, строгий контракт `{ ok, code?, message?, leadId? }`
3. **components/forms/FormStatus.tsx** — единый UI для success/error + ссылка «Оставить заявку в Telegram»
4. **app/api/lead/route.ts** — leadId (uuid), коды VALIDATION_ERROR, RATE_LIMIT, TELEGRAM_FAILED, логи (LEAD_DEBUG)
5. **lib/lead/schema.ts** — formId опционально
6. **lib/lead/sendToTelegram.ts** — truncate 4096 в formatTelegram, возврат SendResult с деталями ошибки
7. **lib/lead/formatTelegram.ts** — truncate итогового сообщения до 4090 символов (лимит Telegram)
8. Все 6 форм — formId, sourcePage, FormStatus, submittedRef (двойной submit), убран alert()
9. **docs/leads-e2e-check.md** — чеклист для E2E проверки
