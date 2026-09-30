"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The home page is a single full-screen hero, so page chrome like the footer stays off it. */
export function HideOnHome({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? null : children;
}
