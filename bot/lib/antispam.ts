/**
 * Антиспам для бота: rate limit и флуд-защита.
 */

const LEAD_RATE_WINDOW_MS = 30 * 60 * 1000; // 30 минут
const LEAD_RATE_MAX = 3; // макс. 3 заявки за 30 мин

const MSG_BURST_WINDOW_MS = 60 * 1000; // 1 минута
const MSG_BURST_MAX = 10; // макс. 10 сообщений подряд без шага

const leadTimestamps = new Map<number, number[]>();
const msgTimestamps = new Map<number, number[]>();

export function isLeadRateLimited(userId: number): boolean {
  const now = Date.now();
  const timestamps = leadTimestamps.get(userId) ?? [];
  const recent = timestamps.filter((t) => now - t < LEAD_RATE_WINDOW_MS);
  return recent.length >= LEAD_RATE_MAX;
}

export function recordLead(userId: number): void {
  const now = Date.now();
  const timestamps = leadTimestamps.get(userId) ?? [];
  const recent = timestamps.filter((t) => now - t < LEAD_RATE_WINDOW_MS);
  recent.push(now);
  leadTimestamps.set(userId, recent);
}

export function isFlooding(userId: number): boolean {
  const now = Date.now();
  const timestamps = msgTimestamps.get(userId) ?? [];
  const recent = timestamps.filter((t) => now - t < MSG_BURST_WINDOW_MS);
  return recent.length >= MSG_BURST_MAX;
}

export function recordMessage(userId: number): void {
  const now = Date.now();
  const timestamps = msgTimestamps.get(userId) ?? [];
  const recent = timestamps.filter((t) => now - t < MSG_BURST_WINDOW_MS);
  recent.push(now);
  msgTimestamps.set(userId, recent);
}

export function resetMessageCount(userId: number): void {
  msgTimestamps.delete(userId);
}
