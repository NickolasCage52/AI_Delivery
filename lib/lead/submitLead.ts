"use client";

import type { LeadErrorCode } from "./errors";
import { getUserMessage } from "./errors";

export type LeadPayload = {
  name?: string;
  contact: string;
  task?: string;
  need?: string;
  message?: string;
  sphere?: string;
  niche?: string;
  timeline?: string;
  deadline?: string;
  improve?: string;
  chaos?: string;
  sourcePage?: string;
  formId?: string;
  utm?: Record<string, string>;
  honeypot?: string;
  _hp?: string;
  company?: string;
};

export type SubmitLeadResult =
  | { ok: true; leadId?: string }
  | { ok: false; code: LeadErrorCode; message: string; leadId?: string };

const FETCH_TIMEOUT_MS = 15000;
const RETRY_STATUSES = [502, 503, 504];

function isRetryable(status: number): boolean {
  return RETRY_STATUSES.includes(status) || status === 0;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number }
): Promise<Response> {
  const { timeout = FETCH_TIMEOUT_MS, ...fetchOpts } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      ...fetchOpts,
      signal: controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

export async function submitLead(
  payload: LeadPayload
): Promise<SubmitLeadResult> {
  const body = {
    ...payload,
    sourcePage: payload.sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "/"),
  };

  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_LEAD_DEBUG === "1") {
    console.debug("[lead] submit payload:", {
      formId: body.formId,
      sourcePage: body.sourcePage,
      contact: body.contact ? `${body.contact.slice(0, 3)}***` : "",
    });
  }

  const doFetch = async (): Promise<Response> => {
    return fetchWithTimeout("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      timeout: FETCH_TIMEOUT_MS,
    });
  };

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      const res = await doFetch();
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        error?: string;
        leadId?: string;
      };

      if (res.ok) {
        return { ok: true, leadId: data.leadId };
      }

      const code = (data.code as LeadErrorCode) ?? inferCodeFromStatus(res.status);
      const message = data.message ?? data.error ?? getUserMessage(code);
      const leadId = data.leadId;

      if (isRetryable(res.status) && attempts < maxAttempts - 1) {
        attempts++;
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }

      return { ok: false, code, message, leadId };
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.name === "AbortError") {
          return {
            ok: false,
            code: "TIMEOUT",
            message: getUserMessage("TIMEOUT"),
          };
        }
        const isNetwork =
          e.message?.includes("fetch") ||
          e.message?.includes("Failed to fetch") ||
          e.message?.includes("NetworkError");
        if (isNetwork && attempts < maxAttempts - 1) {
          attempts++;
          await new Promise((r) => setTimeout(r, 800));
          continue;
        }
        return {
          ok: false,
          code: isNetwork ? "NETWORK_ERROR" : "UNKNOWN",
          message: getUserMessage(isNetwork ? "NETWORK_ERROR" : "UNKNOWN"),
        };
      }
      return {
        ok: false,
        code: "UNKNOWN",
        message: getUserMessage("UNKNOWN"),
      };
    }
  }

  return {
    ok: false,
    code: "UNKNOWN",
    message: getUserMessage("UNKNOWN"),
  };
}

function inferCodeFromStatus(status: number): LeadErrorCode {
  if (status === 400) return "VALIDATION_ERROR";
  if (status === 429) return "RATE_LIMIT";
  if (status >= 500) return "TELEGRAM_FAILED";
  return "UNKNOWN";
}

export function collectUtm(): Record<string, string> {
  if (typeof window === "undefined" || !window.location?.search) return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const [k, v] of params) {
    if (k.startsWith("utm_") && v) utm[k] = v;
  }
  return utm;
}
