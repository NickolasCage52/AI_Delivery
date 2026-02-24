import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { LeadSchema } from "@/lib/lead/schema";
import { normalizeLead } from "@/lib/lead/normalize";
import { sendLeadToTelegram } from "@/lib/lead/sendToTelegram";

// Rate limit: 5 запросов / 10 минут на IP
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

export async function POST(req: NextRequest) {
  const leadId = randomUUID();
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        code: "RATE_LIMIT",
        message: "Слишком много попыток. Подождите 10 минут или напишите в Telegram.",
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Неверный формат данных.",
        leadId,
      },
      { status: 400 }
    );
  }

  const parseResult = LeadSchema.safeParse(body);
  if (!parseResult.success) {
    const msg =
      parseResult.error.issues
        .map((e) => e.message)
        .filter(Boolean)[0] || "Ошибка валидации";
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: msg,
        leadId,
      },
      { status: 400 }
    );
  }

  const payload = parseResult.data;

  // Honeypot: тихо принять (не слать в Telegram)
  if (payload.honeypot || payload._hp || payload.website || payload.company) {
    return NextResponse.json({ ok: true, leadId }, { status: 200 });
  }

  const normalized = normalizeLead(payload);

  if (process.env.LEAD_DEBUG === "1") {
    console.debug("[lead]", {
      leadId,
      formId: payload.formId,
      sourcePage: payload.sourcePage,
      timestamp: new Date().toISOString(),
    });
  }

  const result = await sendLeadToTelegram(normalized);

  if (!result.ok) {
    console.error("[lead] Telegram failed", {
      leadId,
      formId: payload.formId,
      sourcePage: payload.sourcePage,
      status: result.status,
      errorCode: result.errorCode,
      description: result.description,
    });
    return NextResponse.json(
      {
        ok: false,
        code: "TELEGRAM_FAILED",
        message: "Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.",
        leadId,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, leadId }, { status: 200 });
}
