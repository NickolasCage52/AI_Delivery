 "use client";

import { useEffect, useMemo, useState } from "react";
import { setFxDebugStatus } from "@/lib/perf/fxDebug";

type FxLifecycleOptions = {
  enabled?: boolean;
  isInViewport?: boolean;
  debugKey?: "heroFx" | "graph" | "cursor";
};

export function useFxLifecycle({ enabled = true, isInViewport = true, debugKey }: FxLifecycleOptions) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVisibility = () => setIsHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const isActive = useMemo(() => enabled && isInViewport && !isHidden, [enabled, isInViewport, isHidden]);

  useEffect(() => {
    if (!debugKey) return;
    setFxDebugStatus(debugKey, isActive ? "running" : "paused");
  }, [debugKey, isActive]);

  return { isActive, isHidden, isInViewport };
}
