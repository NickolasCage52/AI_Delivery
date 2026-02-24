import { z } from "zod";

/** Цель обращения */
export const LeadGoalEnum = z.enum([
  "leads",      // Лиды и заявки
  "support",    // Поддержка клиентов
  "automation", // Автоматизация
  "miniapp",    // Telegram MiniApp
  "site",       // Сайт/лендинг
  "other",
]);

/** Услуга / тип продукта */
export const LeadServiceEnum = z.enum([
  "bots",       // Боты
  "sites",      // Сайты/лендинги
  "n8n",        // n8n автоматизация
  "miniapps",   // Telegram MiniApp
  "unsure",
]);

/** Сроки */
export const LeadDeadlineEnum = z.enum([
  "48-72",      // 48–72 часа
  "3-5",        // 3–5 дней
  "5-7",        // 5–7 дней
  "7-10",       // 7–10 дней
  "unsure",
]);

/** Источник заявки */
export const LeadSourceEnum = z.enum(["website", "telegram"]);

/**
 * Единая схема заявки — для сайта и Telegram-бота.
 * API принимает как канонические поля (goal, service, deadline),
 * так и legacy (task, need, sphere, timeline и т.д.) для обратной совместимости.
 */
export const LeadSchema = z
  .object({
    // Основные
    name: z.string().max(80).trim().optional(),
    contact: z.string().min(3, "Контакт обязателен").max(120).trim(),
    message: z.string().max(2000).trim().optional(),

    // Канонические (бот)
    goal: LeadGoalEnum.optional(),
    service: LeadServiceEnum.optional(),
    deadline: LeadDeadlineEnum.optional(),

    // Legacy (сайт)
    task: z.string().max(2000).trim().optional(),
    need: z.string().max(2000).trim().optional(),
    sphere: z.string().max(200).trim().optional(),
    niche: z.string().max(200).trim().optional(),
    timeline: z.string().max(200).trim().optional(),
    improve: z.string().max(200).trim().optional(),
    chaos: z.string().max(200).trim().optional(),

    // Мета
    source: LeadSourceEnum.default("website"),
    sourcePage: z.string().max(256).default("/"),
    formId: z.string().max(64).optional(),
    utm: z.record(z.string(), z.string()).optional(),
    createdAt: z.string().datetime().optional(),

  // Honeypot (reject если заполнен — спам)
  honeypot: z.string().max(0).optional(),
  _hp: z.string().max(0).optional(),
  website: z.string().max(0).optional(),
  company: z.string().max(0).optional(),
  })
  .transform((data) => {
    const msg = data.message ?? data.task ?? data.need ?? "";
    return {
      ...data,
      message: msg,
    };
  });

export type LeadPayload = z.infer<typeof LeadSchema>;

/** Нормализованный payload для отправки в Telegram */
export type NormalizedLead = {
  name: string;
  contact: string;
  message: string;
  goal?: string;
  service?: string;
  deadline?: string;
  sphere?: string;
  timeline?: string;
  improve?: string;
  chaos?: string;
  source: "website" | "telegram";
  sourcePage: string;
  utm?: Record<string, string>;
  createdAt: string;
  /** Telegram: @username, userId */
  telegramUser?: string;
};

/** Маппинг goal → человекопонятный текст */
export const GOAL_LABELS: Record<string, string> = {
  leads: "Лиды и заявки",
  support: "Поддержка клиентов",
  automation: "Автоматизация",
  miniapp: "Telegram MiniApp",
  site: "Сайт/лендинг",
  other: "Другое",
};

/** Маппинг service → человекопонятный текст */
export const SERVICE_LABELS: Record<string, string> = {
  bots: "Бот",
  sites: "Сайт/лендинг",
  n8n: "n8n автоматизация",
  miniapps: "Telegram MiniApp",
  unsure: "Не уверен",
};

/** Маппинг deadline → человекопонятный текст */
export const DEADLINE_LABELS: Record<string, string> = {
  "48-72": "48–72 часа",
  "3-5": "3–5 дней",
  "5-7": "5–7 дней",
  "7-10": "7–10 дней",
  unsure: "Не срочно",
};
