import { NextRequest, NextResponse } from "next/server";
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
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Слишком много запросов. Попробуйте позже." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Неверный JSON" },
      { status: 400 }
    );
  }

  const parseResult = LeadSchema.safeParse(body);
  if (!parseResult.success) {
    const msg = parseResult.error.issues
      .map((e) => e.message)
      .filter(Boolean)[0] || "Ошибка валидации";
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 400 }
    );
  }

  const payload = parseResult.data;

  // Honeypot
  if (payload.honeypot || payload._hp || payload.website || payload.company) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const normalized = normalizeLead(payload);
  const sent = await sendLeadToTelegram(normalized);
  if (!sent) {
    return NextResponse.json(
      { ok: false, error: "Ошибка отправки. Попробуйте позже." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
