/**
 * Single shared requestAnimationFrame loop.
 * Register callbacks to run once per frame; avoids multiple RAFs (scroll velocity + blur + etc).
 */

type Callback = (time: number) => void;
const callbacks = new Set<Callback>();
let rafId: number | null = null;

function tick(time: number) {
  rafId = null;
  callbacks.forEach((cb) => {
    try {
      cb(time);
    } catch (e) {
      console.warn("[rafLoop] callback error", e);
    }
  });
  if (callbacks.size > 0) rafId = requestAnimationFrame(tick);
}

/**
 * Add a callback to run every frame. Returns unsubscribe.
 */
export function rafLoopSubscribe(cb: Callback): () => void {
  callbacks.add(cb);
  if (rafId === null) rafId = requestAnimationFrame(tick);
  return () => {
    callbacks.delete(cb);
    if (callbacks.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
