/**
 * In-memory store для состояния wizard по userId.
 * TTL: 30 минут без активности → сброс.
 */

const TTL_MS = 30 * 60 * 1000; // 30 минут

export type LeadWizardState = {
  step: number;
  name?: string;
  contact?: string;
  goal?: string;
  service?: string;
  deadline?: string;
  message?: string;
  lastActivity: number;
};

const store = new Map<number, LeadWizardState>();

function prune(userId: number): void {
  const s = store.get(userId);
  if (s && Date.now() - s.lastActivity > TTL_MS) {
    store.delete(userId);
  }
}

export function getState(userId: number): LeadWizardState | null {
  prune(userId);
  return store.get(userId) ?? null;
}

export function setState(userId: number, state: Partial<LeadWizardState>): void {
  const existing = store.get(userId) ?? { step: 0, lastActivity: Date.now() };
  const next: LeadWizardState = {
    ...existing,
    ...state,
    lastActivity: Date.now(),
  };
  store.set(userId, next);
}

export function clearState(userId: number): void {
  store.delete(userId);
}
