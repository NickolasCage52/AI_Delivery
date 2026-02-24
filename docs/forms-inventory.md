# Инвентаризация форм (Forms Inventory)

Все формы сайта AI Delivery отправляют заявки в Telegram через `POST /api/lead`. Интеграция завершена.

---

## 1. DemoForm

| Поле | Описание |
|------|----------|
| **Путь** | `components/sections/DemoForm.tsx` |
| **Страница** | `/demo` |
| **Поля** | `name`, `contact`, `improve`, `chaos`, `task`, `agreed` |
| **Куда отправляет** | `POST /api/lead` → Telegram |
| **UX после submit** | `router.push("/thank-you")` |
| **Аналитика** | `trackCtaEvent({ action: "submit", label: "Demo Form", location: "demo-page" })` |

---

## 2. ContactForm

| Поле | Описание |
|------|----------|
| **Путь** | `components/sections/ContactForm.tsx` |
| **Страница** | `/contact` (sourcePage="contact"), может использоваться с другими sourcePage |
| **Поля** | `name`, `contact`, `task`, `sphere`, `timeline` |
| **Куда отправляет** | `POST /api/lead` → Telegram |
| **UX после submit** | `router.push("/thank-you")` |
| **Аналитика** | `trackCtaEvent({ action: "submit", label: "Contact Form", location: "contact-page" })` |

---

## 3. CTA (главная страница)

| Поле | Описание |
|------|----------|
| **Путь** | `components/sections/CTA.tsx` |
| **Страница** | `/` (#contact), sourcePage="home" |
| **Поля** | `name`, `contact`, `niche`, `need`, `deadline` |
| **Куда отправляет** | `POST /api/lead` → Telegram |
| **UX после submit** | Success state → `router.push("/thank-you")` через 400ms |
| **Аналитика** | `trackCtaEvent({ action: "submit", label: "Home CTA", location: "home-final" })` |

---

## 4. LeadModal (глобальная модалка)

| Поле | Описание |
|------|----------|
| **Путь** | `components/cta/LeadModal.tsx` |
| **Страница** | Глобально (pathname берётся из `context.sourcePage` или `window.location.pathname`) |
| **Поля** | `name`, `contact`, `need`, `sphere`, `timeline` |
| **Куда отправляет** | `POST /api/lead` → Telegram |
| **UX после submit** | Success state, кнопка «Перейти на страницу Спасибо» |
| **Аналитика** | `trackCtaEvent({ action: "submit", label: "LeadModal", location: "modal" })` |

---

## 5. InlineLeadForm

| Поле | Описание |
|------|----------|
| **Путь** | `components/cta/InlineLeadForm.tsx` |
| **Страница** | TimelineScene (главная), sourcePage из pathname |
| **Поля** | `name`, `contact` |
| **Куда отправляет** | `POST /api/lead` → Telegram |
| **UX после submit** | Inline success + «Отправить ещё» |
| **Аналитика** | `trackCtaEvent({ action: "submit", label: "InlineLeadForm", location: "inline" })` |

---

## 6. CTAFormBlock (страница кейсов)

| Поле | Описание |
|------|----------|
| **Путь** | `components/cases-landing/CasesShowcase.tsx` → функция `CTAFormBlock` |
| **Страница** | `/cases` |
| **Поля** | `name`, `contact`, `message`, `company` (honeypot) |
| **Куда отправляет** | `POST /api/lead` → Telegram |
| **UX после submit** | Success + reset формы |
| **Валидация** | Имя 2–60, контакт 3–80, сообщение 10–2000, honeypot `company` |
| **Аналитика** | Отсутствует |

---

## Сводка

| № | Компонент | Страница | Есть honeypot | Редирект/UX |
|---|-----------|----------|---------------|-------------|
| 1 | DemoForm | /demo | Да (_hp) | → /thank-you |
| 2 | ContactForm | /contact | Да (_hp) | → /thank-you |
| 3 | CTA | / | Да (_hp) | success → /thank-you |
| 4 | LeadModal | глобально | Да (_hp) | success + кнопка |
| 5 | InlineLeadForm | / (TimelineScene) | Да (_hp) | success inline |
| 6 | CTAFormBlock | /cases | Да (company) | success + reset |

---

## Унифицированный интерфейс для submitLead

Все формы передают в `submitLead` объект:

```ts
{
  name: string;
  contact: string;
  task?: string;        // или need, message
  sphere?: string;      // или niche
  timeline?: string;    // или deadline
  improve?: string;     // DemoForm
  chaos?: string;       // DemoForm
  sourcePage: string;   // pathname
  utm?: Record<string, string>;
  honeypot?: string;    // если заполнен — reject
}
```
