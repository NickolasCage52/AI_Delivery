"use client";

import { createContext, useContext, type RefObject } from "react";

export type LenisLike = {
  scrollTo: (target: number | string | HTMLElement, options?: { immediate?: boolean }) => void;
  destroy: () => void;
  raf: (t: number) => void;
};

const LenisRefContext = createContext<RefObject<LenisLike | null> | null>(null);

export function useLenisRef(): RefObject<LenisLike | null> | null {
  return useContext(LenisRefContext);
}

export { LenisRefContext };
