import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// ─── FONTS ───────────────────────────────────────────────────────────────────

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// ─── SITE URL ────────────────────────────────────────────────────────────────

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://safespace-educare.com"

// ─── VIEWPORT ────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  themeColor: "#152060",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// ─── BASE METADATA ───────────────────────────────────────────────────────────

export const metadata: Metadata = {
  // Resolves all relative image/url values in metadata
  metadataBase: new URL(APP_URL),

  // Title template — child pages fill in the "%s" prefix
  title: {
    default: "SafeSpace Educare — Student Mental Health Support",
    template: "%s | SafeSpace Educare",
  },

  description:
    "SafeSpace Educare is a free, confidential mental health platform built for students. Book counseling sessions, track your mood, access wellness resources, and get anonymous support — anytime.",

  keywords: [
    "student mental health",
    "counseling platform",
    "mental wellness",
    "mood tracker",
    "anonymous chat support",
    "educational counseling",
    "student wellbeing",
    "mental health resources",
    "wellness exercises",
    "safe space students",
  ],

  authors: [{ name: "SafeSpace Educare", url: APP_URL }],
  creator: "SafeSpace Educare",
  publisher: "SafeSpace Educare",
  category: "health",

  // ── Robots ──────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // ── Open Graph ──────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "SafeSpace Educare",
    title: "SafeSpace Educare — Student Mental Health Support",
    description:
      "Free, confidential mental health support for students. Book counseling sessions, track your mood, and access wellness resources.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SafeSpace Educare — Student Mental Health Support Platform",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X Card ────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@SafeSpaceEducare",
    creator: "@SafeSpaceEducare",
    title: "SafeSpace Educare — Student Mental Health Support",
    description:
      "Free, confidential mental health support for students. Book counseling sessions, track your mood, and access wellness resources.",
    images: ["/opengraph-image"],
  },

  // ── Canonical ───────────────────────────────────────────────────────────
  alternates: {
    canonical: APP_URL,
  },

  // ── Icons ───────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png",  media: "(prefers-color-scheme: dark)"  },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple:    "/apple-icon.png",
    shortcut: "/icon.svg",
  },
}

// ─── ROOT LAYOUT ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
