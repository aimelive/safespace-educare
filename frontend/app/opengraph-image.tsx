import { ImageResponse } from "next/og"

/**
 * Dynamically-generated Open Graph image served at /opengraph-image
 * Used by both the root layout and any page that doesn't override it.
 *
 * Dimensions: 1200 × 630 px  (standard OG)
 * Runtime:    edge  (fastest cold-start, no Node.js APIs needed)
 */

export const runtime = "edge"
export const alt = "SafeSpace Educare — Student Mental Health Support Platform"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const NAVY  = "#152060"
const RED   = "#CC1A2E"
const LIGHT = "#f7f9ff"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: NAVY,
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* ── Decorative circle — top left ── */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 340,
            height: 340,
            borderRadius: "50%",
            backgroundColor: RED,
            opacity: 0.18,
          }}
        />

        {/* ── Decorative circle — bottom right ── */}
        <div
          style={{
            position: "absolute",
            bottom: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            opacity: 0.05,
          }}
        />

        {/* ── Decorative circle — centre accent ── */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 220,
            height: 220,
            borderRadius: "50%",
            backgroundColor: RED,
            opacity: 0.07,
          }}
        />

        {/* ── Main content ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 28,
            padding: "0 80px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo icon */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            }}
          >
            ❤️
          </div>

          {/* Brand name */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: "-2px",
              lineHeight: 1.05,
            }}
          >
            <span style={{ color: "#ffffff" }}>SafeSpace</span>
            <span style={{ color: RED }}>Educare</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "rgba(255,255,255,0.62)",
              lineHeight: 1.45,
              maxWidth: 680,
            }}
          >
            Free, confidential mental health support for students — always here when you need it.
          </div>

          {/* Feature pills */}
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 6,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              "Counseling Sessions",
              "Mood Tracking",
              "Anonymous Chat",
              "Wellness Resources",
            ].map((label) => (
              <div
                key={label}
                style={{
                  borderRadius: 100,
                  border: "1.5px solid rgba(255,255,255,0.18)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  padding: "9px 22px",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom URL strip ── */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 19,
            fontWeight: 400,
            color: "rgba(255,255,255,0.28)",
            letterSpacing: "0.5px",
          }}
        >
          safespace-educare.com
        </div>

        {/* ── Confidential badge — top right ── */}
        <div
          style={{
            position: "absolute",
            top: 32,
            right: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 100,
            border: "1px solid rgba(255,255,255,0.15)",
            backgroundColor: "rgba(255,255,255,0.08)",
            padding: "7px 16px",
            fontSize: 16,
            color: "rgba(255,255,255,0.6)",
            fontWeight: 500,
          }}
        >
          🔒 100% Confidential
        </div>
      </div>
    ),
    { ...size }
  )
}
