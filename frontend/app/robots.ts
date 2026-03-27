import type { MetadataRoute } from "next"

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://safespace-educare.com"

/**
 * Generates /robots.txt
 *
 * Rules:
 *  - Public marketing pages and auth pages are crawlable
 *  - All /dashboard/* routes are blocked (private, authenticated content)
 *  - All /api/* routes are blocked (not meant for crawlers)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/auth/login", "/auth/register"],
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  }
}
