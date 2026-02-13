type Cleanup = () => void;

function isEnabled() {
  return typeof window !== "undefined" && process.env.NEXT_PUBLIC_SCROLL_DEBUG === "1";
}

function safeStack() {
  try {
    return new Error().stack;
  } catch {
    return undefined;
  }
}

export function installScrollDebug(): Cleanup {
  if (!isEnabled()) return () => {};

  const label = "[scroll-debug]";
  console.log(`${label} enabled`);

  // window.scrollTo
  const originalScrollTo = window.scrollTo.bind(window);
  window.scrollTo = ((...args: Parameters<typeof window.scrollTo>) => {
    console.log(`${label} window.scrollTo`, ...args, safeStack());
    return originalScrollTo(...args);
  }) as typeof window.scrollTo;

  // Element.scrollIntoView
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (...args: Parameters<Element["scrollIntoView"]>) {
    const id = (this as HTMLElement)?.id ? `#${(this as HTMLElement).id}` : (this as HTMLElement)?.tagName;
    console.log(`${label} scrollIntoView`, id, ...args, safeStack());
    return originalScrollIntoView.apply(this, args);
  };

  // history push/replace + hash change
  const onHashChange = () => {
    console.log(`${label} hashchange`, window.location.hash, safeStack());
  };
  window.addEventListener("hashchange", onHashChange);

  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);
  history.pushState = ((...args: Parameters<typeof history.pushState>) => {
    const url = args[2] as unknown;
    if (typeof url === "string" && url.includes("#")) {
      console.log(`${label} history.pushState`, url, safeStack());
    }
    return originalPushState(...args);
  }) as typeof history.pushState;
  history.replaceState = ((...args: Parameters<typeof history.replaceState>) => {
    const url = args[2] as unknown;
    if (typeof url === "string" && url.includes("#")) {
      console.log(`${label} history.replaceState`, url, safeStack());
    }
    return originalReplaceState(...args);
  }) as typeof history.replaceState;

  return () => {
    window.removeEventListener("hashchange", onHashChange);
    window.scrollTo = originalScrollTo;
    Element.prototype.scrollIntoView = originalScrollIntoView;
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
    console.log(`${label} disabled`);
  };
}

export function wrapLenisScrollTo<TTarget extends string | number | HTMLElement, TOptions>(
  lenis: { scrollTo?: (target: TTarget, options?: TOptions) => unknown }
) {
  if (!isEnabled() || !lenis || typeof lenis.scrollTo !== "function") return;
  const label = "[scroll-debug]";
  const original = lenis.scrollTo.bind(lenis) as (target: TTarget, options?: TOptions) => unknown;
  lenis.scrollTo = ((target: TTarget, options?: TOptions) => {
    console.log(`${label} lenis.scrollTo`, target, options, safeStack());
    return original(target, options);
  }) as typeof lenis.scrollTo;
}

