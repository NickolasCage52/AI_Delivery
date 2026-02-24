"use client";

import { useEffect } from "react";

/**
 * Prevents "Error: [object Event]" in dev overlay when a promise is rejected
 * with a DOM Event instead of an Error (e.g. from libraries or browser internals).
 * Converts Event rejections to proper Errors and logs them.
 */
export function UnhandledRejectionHandler() {
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (reason && typeof reason === "object" && "preventDefault" in reason && typeof (reason as Event).preventDefault === "function") {
        event.preventDefault();
        const err = new Error("Unhandled promise rejection (Event object)");
        console.error("[unhandledrejection] Caught rejection with Event object. This often happens when an event handler passes the event to async code that rejects. Original event type:", (reason as Event).type, err);
      }
    };
    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);
  return null;
}
