import type { MetadataRoute } from "next"

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://safespace-educare.com"

/**
 * Generates /sitemap.xml
 *
 * Only public-facing pages are included.
 * Dashboard routes are intentionally excluded (private / auth-gated).
 * Auth pages are included at low priority so crawlers can discover them,
 * but they carry a noindex header set via app/auth/layout.tsx.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: APP_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${APP_URL}/auth/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${APP_URL}/auth/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]
}
