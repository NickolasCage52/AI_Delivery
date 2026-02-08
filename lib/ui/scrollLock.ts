let lockCount = 0;
let prevOverflow = "";
let prevPaddingRight = "";

export function lockBodyScroll() {
  if (typeof document === "undefined") return;
  const body = document.body;
  if (lockCount === 0) {
    prevOverflow = body.style.overflow;
    prevPaddingRight = body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    body.style.paddingRight = scrollBarWidth > 0 ? `${scrollBarWidth}px` : "";
    body.classList.add("scroll-locked");
  }
  lockCount += 1;
}

export function unlockBodyScroll() {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const body = document.body;
    body.style.overflow = prevOverflow;
    body.style.paddingRight = prevPaddingRight;
    body.classList.remove("scroll-locked");
  }
}
