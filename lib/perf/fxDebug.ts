"use client";

import { useSyncExternalStore } from "react";

type FxStatus = "running" | "paused" | "off";
type FxDebugKey = "heroFx" | "graph" | "cursor";

const FX_DEBUG_ENABLED =
  process.env.NODE_ENV === "development" &&
  (process.env.NEXT_PUBLIC_FX_DEBUG === "1" ||
    process.env.NEXT_PUBLIC_FX_DEBUG === "true" ||
    process.env.NEXT_PUBLIC_FX_DEBUG === "on");

const listeners = new Set<() => void>();
let state: Record<FxDebugKey, FxStatus> = {
  heroFx: "paused",
  graph: "paused",
  cursor: "off",
};

function emit() {
  listeners.forEach((cb) => cb());
}

export function setFxDebugStatus(key: FxDebugKey, status: FxStatus) {
  if (!FX_DEBUG_ENABLED) return;
  if (state[key] === status) return;
  state = { ...state, [key]: status };
  emit();
}

export function useFxDebugState() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state
  );
}
