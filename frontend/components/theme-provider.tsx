"use client"

import * as React from "react"

/**
 * Lightweight theme provider — no external dependency.
 * Dark-mode variants are handled entirely via Tailwind CSS
 * (`@custom-variant dark` in globals.css). This wrapper simply
 * passes children through, preserving any future drop-in upgrade path.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
