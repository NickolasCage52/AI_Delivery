import type { NormalizedLead } from "./schema";
import { GOAL_LABELS, SERVICE_LABELS, DEADLINE_LABELS } from "./schema";

const EMPTY_VALUES = ["—", "-", "н/д", "не указано", ""];

function isEmpty(value: string | null | undefined): boolean {
  if (value == null) return true;
  const s = String(value).trim().toLowerCase();
  return !s || EMPTY_VALUES.includes(s);
}

/** Добавить строку только если значение есть */
function line(label: string, value: string | null | undefined): string {
  if (isEmpty(value)) return "";
  return `${label}: ${String(value).trim()}`;
}

/** Добавить секцию только если в ней есть хоть одна непустая строка */
function section(header: string, lines: string[]): string {
  const filled = lines.filter(Boolean);
  if (filled.length === 0) return "";
  return [header, ...filled].join("\n");
}

function truncate(text: string, max = 600): string {
  const s = String(text || "").trim();
  return s.length > max ? s.slice(0, max) + "…" : s;
}

function formatDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Формирует текст заявки для Telegram.
 * Показывает только заполненные поля — пустые строки и placeholder ("—") не выводятся.
 */
export function formatLeadForTelegram(lead: NormalizedLead): string {
  const header =
    lead.source === "telegram"
      ? "🟣 Новая заявка — Telegram"
      : "🟣 Новая заявка — AI Delivery";

  const typeRequest = lead.improve || lead.chaos || (lead.service ? SERVICE_LABELS[lead.service] ?? lead.service : "") || (lead.goal ? GOAL_LABELS[lead.goal] : "") || "";
  const deadlineText = lead.deadline
    ? (DEADLINE_LABELS[lead.deadline] ?? lead.deadline)
    : lead.timeline;
  const description = truncate(lead.message);

  const parts: string[] = [
    header,
    section("👤 Контакты", [line("Имя", lead.name), line("Контакт", lead.contact)]),
    section("📋 Что нужно", [
      line("Тип/запрос", typeRequest || undefined),
      line("Описание", description || undefined),
      line("Сфера/ниша", lead.sphere),
      line("Сроки", deadlineText),
    ]),
    section("📍 Источник", [
      line("Страница", lead.sourcePage),
      line("Отправитель", lead.telegramUser),
      ...(lead.utm && Object.keys(lead.utm).length > 0
        ? [`UTM: ${JSON.stringify(lead.utm)}`]
        : []),
    ]),
    `🕐 ${formatDate(lead.createdAt)}`,
  ];

  const text = parts.filter(Boolean).join("\n\n");
  // Telegram limit 4096 bytes (UTF-8)
  return text.length > 4090 ? text.slice(0, 4087) + "…" : text;
}
