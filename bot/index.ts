/**
 * Telegram bot для сбора заявок.
 * Запуск: npm run bot:dev (dev) / npm run bot:start (prod)
 */

import "dotenv/config";
import { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { leadWizard, startLeadFlow } from "./flows/leadWizard";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("[bot] TELEGRAM_BOT_TOKEN is required");
  process.exit(1);
}

const bot = new Telegraf(token);

bot.use(leadWizard);

bot.start(async (ctx) => {
  const payload = (ctx as { startPayload?: string }).startPayload ?? "";

  if (payload === "lead") {
    return startLeadFlow(ctx);
  }

  await ctx.reply(
    "👋 Привет! Я помогаю оставить заявку в AI Delivery.\n\nНажмите кнопку или отправьте /lead",
    Markup.inlineKeyboard([
      [Markup.button.url("Оставить заявку", "https://t.me/AIDeliveryLeads_bot?start=lead")],
    ])
  );
});

void bot.launch().then(() => {
  console.log("[bot] AIDeliveryLeads_bot running");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
