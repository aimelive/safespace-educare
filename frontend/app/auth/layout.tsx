import type { Metadata } from "next"
import type React from "react"

/**
 * Auth layout — shared by /auth/login and /auth/register.
 *
 * Marks both pages as noindex so search engines do not crawl or index
 * the login / registration forms.  The pages are "use client" components
 * and therefore cannot export metadata themselves; this server layout
 * handles it for them.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
