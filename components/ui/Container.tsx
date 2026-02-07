import { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-[1280px] px-6 md:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
