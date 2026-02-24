import type { NormalizedLead } from "./schema";
import { GOAL_LABELS, SERVICE_LABELS, DEADLINE_LABELS } from "./schema";

function truncate(text: string, max = 600): string {
  const s = String(text || "").trim();
  return s.length > max ? s.slice(0, max) + "…" : s;
}

/**
 * Формирует текст заявки для Telegram.
 * Единый формат для сайта и бота.
 */
export function formatLeadForTelegram(lead: NormalizedLead): string {
    const header = lead.source === "telegram" ? "🟣 Новая заявка — Telegram" : "🟣 Новая заявка — AI Delivery";

  const serviceText = lead.service ? (SERVICE_LABELS[lead.service] ?? lead.service) : "";
  const typeRequest = lead.improve || lead.chaos || serviceText || (lead.goal ? GOAL_LABELS[lead.goal] : "") || "";
  const deadlineText = lead.deadline ? (DEADLINE_LABELS[lead.deadline] ?? lead.deadline) : lead.timeline || "—";

  const parts: string[] = [
    header,
    "",
    "👤 Контакты",
    `Имя: ${lead.name || "—"}`,
    `Контакт: ${lead.contact}`,
    "",
    "📋 Что нужно",
  ];

  if (typeRequest) parts.push(`Тип/запрос: ${typeRequest}`);
  parts.push(`Описание: ${truncate(lead.message) || "—"}`);
  if (lead.sphere) parts.push(`Сфера/ниша: ${lead.sphere}`);
  parts.push(`Сроки: ${deadlineText}`);
  parts.push("");

  parts.push("📍 Источник");
  parts.push(`Страница: ${lead.sourcePage}`);

  if (lead.telegramUser) {
    parts.push(`Отправитель: ${lead.telegramUser}`);
  }

  if (lead.utm && Object.keys(lead.utm).length > 0) {
    parts.push(`UTM: ${JSON.stringify(lead.utm)}`);
  }

  parts.push("");
  parts.push(`🕐 ${lead.createdAt.replace("T", " ").slice(0, 16)}`);

  const full = parts.join("\n");
  // Telegram limit 4096 bytes (UTF-8)
  return full.length > 4090 ? full.slice(0, 4087) + "…" : full;
}
