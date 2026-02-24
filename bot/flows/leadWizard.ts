/**
 * Wizard-флоу сбора заявки в боте.
 */

import { Composer, Markup } from "telegraf";
import type { Context } from "telegraf";
import {
  getState,
  setState,
  clearState,
  type LeadWizardState,
} from "../lib/stateStore";
import { sendLeadToChat } from "../lib/telegram";
import {
  isLeadRateLimited,
  recordLead,
  isFlooding,
  recordMessage,
  resetMessageCount,
} from "../lib/antispam";
import { normalizeLead } from "../../lib/lead/normalize";
import { SERVICE_LABELS, DEADLINE_LABELS } from "../../lib/lead/schema";

const STEPS = ["name", "contact", "service", "deadline", "message", "confirm"] as const;

const SERVICE_OPTIONS = [
  { label: "Бот", value: "bots" },
  { label: "Сайт/лендинг", value: "sites" },
  { label: "n8n автоматизация", value: "n8n" },
  { label: "Telegram MiniApp", value: "miniapps" },
  { label: "Не уверен", value: "unsure" },
] as const;

const DEADLINE_OPTIONS = [
  { label: "48–72 часа", value: "48-72" },
  { label: "3–5 дней", value: "3-5" },
  { label: "5–7 дней", value: "5-7" },
  { label: "7–10 дней", value: "7-10" },
  { label: "Не срочно", value: "unsure" },
] as const;

function getUserId(ctx: Context): number | null {
  return ctx.from?.id ?? null;
}

function formatSummary(state: LeadWizardState, username?: string): string {
  const lines: string[] = [
    "📋 Проверьте заявку:",
    "",
    `Имя: ${state.name || "—"}`,
    `Контакт: ${state.contact || "—"}`,
    `Услуга: ${state.service ? SERVICE_LABELS[state.service] || state.service : "—"}`,
    `Сроки: ${state.deadline ? DEADLINE_LABELS[state.deadline] || state.deadline : "—"}`,
    `Описание: ${(state.message || "—").slice(0, 200)}${(state.message?.length ?? 0) > 200 ? "…" : ""}`,
  ];
  return lines.join("\n");
}

export const leadWizard = new Composer();

async function startLeadFlow(ctx: Context): Promise<void> {
  const userId = getUserId(ctx);
  if (!userId) return;

  if (isLeadRateLimited(userId)) {
    await ctx.reply(
      "⚠️ Вы отправили слишком много заявок. Подождите около 30 минут и попробуйте снова.",
      { reply_markup: { remove_keyboard: true } }
    );
    return;
  }

  clearState(userId);
  setState(userId, { step: 0 });
  resetMessageCount(userId);

  await ctx.reply("Как к вам обращаться?", {
    reply_markup: Markup.inlineKeyboard([
      [Markup.button.callback("Пропустить", "skip_name")],
      [Markup.button.callback("Отмена", "cancel_wizard")],
    ]),
  });
}

export { startLeadFlow };

// /lead — запуск формы
leadWizard.command("lead", startLeadFlow);

// Обработка callback для skip/cancel
leadWizard.action("skip_name", async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;
  await ctx.answerCbQuery();
  setState(userId, { step: 1, name: undefined });
  await sendContactStep(ctx, userId);
});

leadWizard.action("cancel_wizard", async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;
  await ctx.answerCbQuery();
  clearState(userId);
  await ctx.editMessageReplyMarkup(undefined);
  await ctx.reply("Заявка отменена.", { reply_markup: { remove_keyboard: true } });
});

leadWizard.action(/^service_(.+)$/, async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;
  const service = (ctx.match as RegExpMatchArray)[1];
  await ctx.answerCbQuery();
  setState(userId, { step: 2, service });
  await sendDeadlineStep(ctx, userId);
});

leadWizard.action(/^deadline_(.+)$/, async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;
  const deadline = (ctx.match as RegExpMatchArray)[1];
  await ctx.answerCbQuery();
  setState(userId, { step: 3, deadline });
  await sendMessageStep(ctx, userId);
});

leadWizard.action("confirm_send", async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;

  const state = getState(userId);
  if (!state || !state.contact) {
    await ctx.answerCbQuery();
    await ctx.reply("Ошибка: контакт не указан. Начните заново — /lead");
    clearState(userId);
    return;
  }

  if (isLeadRateLimited(userId)) {
    await ctx.answerCbQuery();
    await ctx.reply("⚠️ Слишком много заявок. Подождите около 30 минут.");
    clearState(userId);
    return;
  }

  const username = ctx.from?.username
    ? `@${ctx.from.username}`
    : `id${userId}`;
  const telegramUser = `${username} (${userId})`;

  const payload = {
    name: state.name,
    contact: state.contact,
    message: state.message,
    service: state.service as "bots" | "sites" | "n8n" | "miniapps" | "unsure" | undefined,
    deadline: state.deadline as "48-72" | "3-5" | "5-7" | "7-10" | "unsure" | undefined,
    source: "telegram" as const,
    sourcePage: "telegram",
  };

  const normalized = normalizeLead(payload, telegramUser);
  const sent = await sendLeadToChat(normalized);

  await ctx.answerCbQuery();
  clearState(userId);

  if (sent) {
    recordLead(userId);
    await ctx.reply(
      "✅ Заявка отправлена!\n\nМы зададим 2–3 уточняющих вопроса и вернёмся с планом.",
      { reply_markup: { remove_keyboard: true } }
    );
  } else {
    await ctx.reply(
      "❌ Ошибка отправки. Попробуйте позже или напишите нам напрямую.",
      { reply_markup: { remove_keyboard: true } }
    );
  }
});

leadWizard.action("confirm_edit", async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;
  await ctx.answerCbQuery();
  clearState(userId);
  setState(userId, { step: 0 });
  await ctx.reply("Начнём заново. Как к вам обращаться?", {
    reply_markup: Markup.keyboard([
      [Markup.button.callback("Пропустить", "skip_name")],
      [Markup.button.callback("Отмена", "cancel_wizard")],
    ]).resize(),
  });
});

async function sendContactStep(ctx: Context, userId: number) {
  const username = ctx.from?.username;
  const buttons: ReturnType<typeof Markup.button.callback>[][] = [
    [Markup.button.callback("Ввести телефон", "contact_phone")],
    [Markup.button.callback("Ввести email", "contact_email")],
  ];
  if (username) {
    buttons.unshift([Markup.button.callback(`Использовать @${username}`, `use_tg_${username}`)]);
  }
  buttons.push([Markup.button.callback("Отмена", "cancel_wizard")]);

  await ctx.reply("Как с вами связаться? Выберите или введите контакт:", {
    reply_markup: Markup.inlineKeyboard(buttons),
  });
}

async function sendDeadlineStep(ctx: Context, userId: number) {
  await ctx.reply("Желаемые сроки?", {
    reply_markup: Markup.inlineKeyboard(
      DEADLINE_OPTIONS.map((o) => [
        Markup.button.callback(o.label, `deadline_${o.value}`),
      ])
    ),
  });
}

async function sendMessageStep(ctx: Context, userId: number) {
  await ctx.reply("Опишите задачу (можно кратко):", {
    reply_markup: Markup.inlineKeyboard([
      [Markup.button.callback("Отмена", "cancel_wizard")],
    ]),
  });
}

async function sendConfirmStep(ctx: Context, state: LeadWizardState) {
  const username = ctx.from?.username;
  const summary = formatSummary(state, username);

  await ctx.reply(summary, {
    reply_markup: Markup.inlineKeyboard([
      [Markup.button.callback("Отправить", "confirm_send")],
      [Markup.button.callback("Изменить", "confirm_edit")],
    ]),
  });
}

// Обработка контакта
leadWizard.action("contact_phone", async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;
  await ctx.answerCbQuery();
  setState(userId, { contact: "__PHONE__" });
  await ctx.reply("Введите номер телефона:", {
    reply_markup: Markup.inlineKeyboard([
      [Markup.button.callback("Отмена", "cancel_wizard")],
    ]),
  });
});

leadWizard.action("contact_email", async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;
  await ctx.answerCbQuery();
  setState(userId, { contact: "__EMAIL__" });
  await ctx.reply("Введите email:", {
    reply_markup: Markup.inlineKeyboard([
      [Markup.button.callback("Отмена", "cancel_wizard")],
    ]),
  });
});

leadWizard.action(/^use_tg_(.+)$/, async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;
  const username = (ctx.match as RegExpMatchArray)[1];
  const contact = `@${username}`;
  await ctx.answerCbQuery();
  setState(userId, { step: 1, contact });
  await sendServiceStep(ctx, userId);
});

// Услуга
async function sendServiceStep(ctx: Context, userId: number) {
  await ctx.reply("Что нужно?", {
    reply_markup: Markup.inlineKeyboard(
      SERVICE_OPTIONS.map((o) => [
        Markup.button.callback(o.label, `service_${o.value}`),
      ])
    ),
  });
}

// Обработка текстовых сообщений по шагам
leadWizard.on("text", async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;

  const text = (ctx.message as { text?: string }).text?.trim() ?? "";

  if (isFlooding(userId)) {
    recordMessage(userId);
    await ctx.reply(
      "⚠️ Слишком много сообщений. Подождите минуту и попробуйте снова."
    );
    return;
  }
  recordMessage(userId);

  const state = getState(userId);
  if (!state) return;

  if (state.step === 0) {
    // Имя
    if (text.length > 80) {
      await ctx.reply("Имя слишком длинное. До 80 символов.");
      return;
    }
    setState(userId, { step: 1, name: text || undefined });
    await sendContactStep(ctx, userId);
    resetMessageCount(userId);
    return;
  }

  if (state.contact === "__PHONE__" || state.contact === "__EMAIL__") {
    if (text.length < 3 || text.length > 120) {
      await ctx.reply("Контакт: от 3 до 120 символов.");
      return;
    }
    setState(userId, { contact: text });
    resetMessageCount(userId);
    await sendServiceStep(ctx, userId);
    return;
  }

  if (state.step === 3 && state.deadline && !state.message) {
    if (text.length > 2000) {
      await ctx.reply("Описание слишком длинное. До 2000 символов.");
      return;
    }
    if (text.length < 5) {
      await ctx.reply("Напишите чуть подробнее (минимум 5 символов).");
      return;
    }
    setState(userId, { step: 4, message: text });
    resetMessageCount(userId);
    await sendConfirmStep(ctx, getState(userId)!);
    return;
  }
});
