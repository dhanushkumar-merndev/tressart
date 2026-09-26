"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
};

/** Subtle 3D tilt that follows the pointer. Off for touch and reduced-motion users. */
export function Tilt({ children, className = "", max = 7 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const enabled = () =>
    window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !enabled()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) scale3d(1.015, 1.015, 1)`;
    el.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
    el.style.setProperty("--glare-o", "1");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--glare-o", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt relative transition-transform duration-500 ease-[var(--ease-silk)] will-change-transform [transform-style:preserve-3d] ${className}`}
    >
      {children}
      <span aria-hidden="true" className="tilt-glare pointer-events-none absolute inset-0 rounded-[inherit]" />
    </div>
  );
}
