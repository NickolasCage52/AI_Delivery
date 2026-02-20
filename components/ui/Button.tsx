"use client";

import { motion } from "framer-motion";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Base = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "large";
  className?: string;
};

type AsButton = Base & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AsLink = Base & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: AsButton | AsLink) {
  const {
    children,
    variant = "primary",
    size = "default",
    className = "",
    ...rest
  } = props;

  const isLink = "href" in rest && rest.href;
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]";

  const variants = {
    primary:
      "bg-gradient-to-r from-[var(--accent)] to-[#7C3AED] text-[#09040F] shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_28px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 active:scale-[0.98]",
    secondary:
      "border border-[var(--accent)]/50 text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)] hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] hover:-translate-y-0.5 active:scale-[0.98]",
    ghost:
      "text-[var(--accent)] hover:bg-white/5",
  };

  const sizes = {
    default: "h-11 px-6 text-sm",
    large: "h-12 px-8 text-base",
  };

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  };

  if (isLink) {
    const {
      href,
      onAnimationStart,
      onAnimationEnd,
      onDragStart,
      onDrag,
      onDragEnd,
      ...aRest
    } = rest as AsLink;
    void onAnimationStart;
    void onAnimationEnd;
    void onDragStart;
    void onDrag;
    void onDragEnd;
    return (
      <motion.a
        href={href}
        className={cls}
        {...motionProps}
        {...aRest}
      >
        {children}
      </motion.a>
    );
  }

  const {
    onAnimationStart,
    onAnimationEnd,
    onDragStart,
    onDrag,
    onDragEnd,
    ...buttonRest
  } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  void onAnimationStart;
  void onAnimationEnd;
  void onDragStart;
  void onDrag;
  void onDragEnd;

  const { type = "button", ...restButton } = buttonRest;
  return (
    <motion.button type={type} className={cls} {...motionProps} {...restButton}>
      {children}
    </motion.button>
  );
}
