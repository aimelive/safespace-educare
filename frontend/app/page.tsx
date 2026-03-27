import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MessageCircle,
  BookOpen,
  TrendingUp,
  Shield,
  Heart,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Lock,
  Sparkles,
  ChevronRight,
} from "lucide-react"

// ─── SEO ─────────────────────────────────────────────────────────────────────

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://safespace-educare.com"

export const metadata: Metadata = {
  title: "SafeSpace Educare — Free Student Mental Health Support Platform",
  description:
    "Access free counseling sessions, anonymous chat support, mood tracking, and wellness resources. SafeSpace Educare empowers students to prioritize their mental health with confidence.",
  alternates: { canonical: APP_URL },
  openGraph: {
    title: "SafeSpace Educare — Free Student Mental Health Support",
    description:
      "Access free counseling sessions, anonymous chat support, mood tracking, and wellness resources designed for students.",
    url: APP_URL,
    type: "website",
  },
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SafeSpace Educare",
  url: APP_URL,
  logo: `${APP_URL}/icon.svg`,
  description:
    "SafeSpace Educare is a free, confidential mental health platform built for students.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "English",
  },
  sameAs: [],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SafeSpace Educare",
  url: APP_URL,
  description:
    "Free, confidential mental health support for students — counseling sessions, anonymous chat, mood tracking and wellness resources.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${APP_URL}/dashboard/resources?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "SafeSpace Educare — Student Mental Health Support",
  url: APP_URL,
  description:
    "Free, confidential mental health support for students — book counseling, track mood, access resources, and chat anonymously.",
  isPartOf: { "@type": "WebSite", url: APP_URL },
  about: {
    "@type": "Thing",
    name: "Student Mental Health",
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "SafeSpace Educare",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const MOTIVATIONAL_QUOTES = [
  "Your mental health is a priority, not a luxury.",
  "You are stronger than you think. Take care of yourself.",
  "It's okay to not be okay, and it's okay to ask for help.",
  "Small steps lead to big changes in mental wellness.",
  "Your feelings are valid. You deserve support.",
]

const FEATURES = [
  {
    icon: Calendar,
    title: "Book Counseling Sessions",
    body: "Connect with qualified counselors and schedule support exactly when you need it.",
    iconClass: "bg-blue-50 text-blue-600",
    borderHover: "hover:border-blue-200",
  },
  {
    icon: MessageCircle,
    title: "Anonymous Chat Support",
    body: "Share what you feel in a judgment-free space while staying completely private.",
    iconClass: "bg-purple-50 text-purple-600",
    borderHover: "hover:border-purple-200",
  },
  {
    icon: BookOpen,
    title: "Curated Wellness Resources",
    body: "Explore articles, videos, and tools to build healthy habits every day.",
    iconClass: "bg-emerald-50 text-emerald-600",
    borderHover: "hover:border-emerald-200",
  },
  {
    icon: TrendingUp,
    title: "Progress & Mood Tracking",
    body: "Track patterns, celebrate growth, and stay motivated on your wellness journey.",
    iconClass: "bg-amber-50 text-amber-600",
    borderHover: "hover:border-amber-200",
  },
]

const STEPS = [
  {
    step: "01",
    icon: Shield,
    title: "Create Your Safe Account",
    body: "Sign up in minutes and choose privacy settings that feel right for you.",
  },
  {
    step: "02",
    icon: Heart,
    title: "Choose Your Support Path",
    body: "Book counseling, start an anonymous chat, or explore practical resources.",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Build Healthy Momentum",
    body: "Track your wellbeing journey and keep progressing one step at a time.",
  },
]

const TRUST_PILLARS = [
  {
    icon: Lock,
    title: "Confidential by Design",
    body: "End-to-end privacy for every conversation. Anonymous options always available.",
  },
  {
    icon: Users,
    title: "Compassionate Professionals",
    body: "Trained counselors who listen, understand, and guide without judgment.",
  },
  {
    icon: Heart,
    title: "No-Judgment Culture",
    body: "A safe space to share openly and heal at your own pace.",
  },
]

const TESTIMONIALS = [
  {
    quote:
      "I finally found a place where I could ask for help without feeling judged. SafeSpace changed everything for me.",
    person: "Undergraduate Student",
    initials: "A.K.",
    stars: 5,
  },
  {
    quote:
      "Booking a session was so simple. The counselor support I received made a real, lasting difference in my life.",
    person: "Campus Community Member",
    initials: "M.T.",
    stars: 5,
  },
  {
    quote:
      "The daily mood check-ins and resources helped me stay consistent with my mental wellness goals each week.",
    person: "First-Year Student",
    initials: "S.R.",
    stars: 5,
  },
]

const FOOTER_COLS = [
  {
    heading: "Platform",
    links: ["Features", "How it works", "Student stories"],
  },
  {
    heading: "Support",
    links: ["Get help", "Contact us", "Accessibility"],
  },
  {
    heading: "Legal",
    links: ["Privacy policy", "Terms of use", "Cookie settings"],
  },
]

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {
  const randomQuote =
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]

  return (
    <div className="min-h-screen scroll-smooth bg-white text-[#152060]">
      {/* ── JSON-LD STRUCTURED DATA ──────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-[#152060] focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#152060]/8 bg-white/95 backdrop-blur-md">
        <nav
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
          aria-label="Primary navigation"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#152060]">
              <Heart className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              SafeSpace <span className="text-[#CC1A2E]">Educare</span>
            </span>
          </div>

          {/* Nav links (desktop) */}
          <div className="hidden items-center gap-8 md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "How it works", href: "#how-it-works" },
              { label: "Stories", href: "#testimonials" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#152060]/70 transition-colors hover:text-[#152060]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-[#152060]/80 hover:bg-[#152060]/5 hover:text-[#152060]"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-[#CC1A2E] text-white shadow-sm hover:bg-[#a8151f]">
                Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1a4f] via-[#152060] to-[#1e2d8a] px-5 pb-24 pt-16 text-white sm:px-8 md:pb-32 md:pt-24">
          {/* Decorative blobs */}
          <div
            className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#CC1A2E]/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-white/8 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-[#CC1A2E]/10 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-6xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-[#CC1A2E]" aria-hidden="true" />
              Confidential mental health support for students
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              {/* Copy */}
              <div className="space-y-6">
                <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
                  Feel supported,{" "}
                  <span className="text-[#CC1A2E]">understood</span>,{" "}
                  <br className="hidden sm:block" />
                  and never alone.
                </h1>

                <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                  SafeSpace Educare connects students with qualified counselors, trusted
                  resources, and a judgment-free space to care for their mental wellbeing —
                  whenever they need it most.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="w-full bg-[#CC1A2E] px-8 py-6 text-base font-semibold text-white shadow-lg shadow-red-900/30 hover:bg-[#a8151f] sm:w-auto"
                    >
                      Start Your Journey{" "}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-white/30 bg-transparent px-8 py-6 text-base text-white hover:bg-white/10 sm:w-auto"
                    >
                      I already have an account
                    </Button>
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center gap-5 pt-1 text-sm text-white/70">
                  {[
                    "Private by design",
                    "Real counselor access",
                    "Free for students",
                  ].map((label) => (
                    <span key={label} className="flex items-center gap-1.5">
                      <CheckCircle
                        className="h-4 w-4 text-emerald-400"
                        aria-hidden="true"
                      />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote card */}
              <aside aria-label="Daily encouragement">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/55">
                      Today&apos;s encouragement
                    </p>
                    <blockquote className="mb-5 border-l-2 border-[#CC1A2E] pl-4 text-base italic leading-relaxed text-white/90">
                      &ldquo;{randomQuote}&rdquo;
                    </blockquote>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/10 p-4 text-center">
                        <p className="text-2xl font-bold">24/7</p>
                        <p className="mt-0.5 text-xs text-white/60">Resource access</p>
                      </div>
                      <div className="rounded-xl bg-white/10 p-4 text-center">
                        <p className="text-2xl font-bold">100%</p>
                        <p className="mt-0.5 text-xs text-white/60">Confidential</p>
                      </div>
                    </div>
                  </div>

                  {/* Mini social proof */}
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                    <div className="flex -space-x-2" aria-hidden="true">
                      {["S", "A", "M"].map((initial) => (
                        <div
                          key={initial}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#152060] bg-[#1c2d83] text-xs font-bold text-white"
                        >
                          {initial}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-white/75">
                      Join students already finding support
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" aria-hidden="true">
            <svg
              viewBox="0 0 1440 40"
              className="w-full fill-white"
              preserveAspectRatio="none"
            >
              <path d="M0,16 C360,40 1080,0 1440,24 L1440,40 L0,40 Z" />
            </svg>
          </div>
        </section>

        {/* ── SOCIAL PROOF STRIP ──────────────────────────────────────────── */}
        <section
          className="border-b border-[#152060]/8 bg-[#f7f9ff] px-5 py-5 sm:px-8"
          aria-label="Platform highlights"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm font-medium text-[#152060]/65">
              Trusted by students seeking safe, confidential wellbeing support
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { emoji: "🔒", label: "Confidential care" },
                { emoji: "🤝", label: "Supportive community" },
                { emoji: "📈", label: "Guided progress" },
                { emoji: "💬", label: "Anonymous options" },
              ].map(({ emoji, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-[#152060]/10 bg-white px-3.5 py-1.5 text-xs font-medium text-[#152060]/75 shadow-sm"
                >
                  <span aria-hidden="true">{emoji}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────────── */}
        <section id="features" className="px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#CC1A2E]">
                Platform features
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need in one place
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#152060]/65">
                From immediate support to long-term growth, SafeSpace Educare helps you take
                care of your wellbeing with confidence.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <article
                  key={feature.title}
                  className={`group rounded-2xl border border-[#152060]/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${feature.borderHover}`}
                >
                  <div
                    className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconClass}`}
                  >
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold leading-snug">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#152060]/65">
                    {feature.body}
                  </p>
                  <div className="mt-5 flex items-center gap-1 text-xs font-medium text-[#152060]/35 transition-colors group-hover:text-[#152060]/65">
                    Learn more{" "}
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-[#f7f9ff] px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#CC1A2E]">
                Getting started
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your path to support in 3 steps
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#152060]/65">
                Designed to reduce friction so you can take the first step quickly and
                comfortably.
              </p>
            </div>

            <ol className="grid gap-6 md:grid-cols-3">
              {STEPS.map((item, index) => (
                <li key={item.step} className="relative">
                  {/* Connector line between steps on desktop */}
                  {index < STEPS.length - 1 && (
                    <div
                      className="absolute right-0 top-5 hidden h-px w-1/3 bg-gradient-to-r from-[#152060]/20 to-transparent md:block"
                      aria-hidden="true"
                    />
                  )}
                  <div className="h-full rounded-2xl border border-[#152060]/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#152060] text-white">
                        <item.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-bold tracking-widest text-[#CC1A2E]">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#152060]/65">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── PRIVACY & TRUST ─────────────────────────────────────────────── */}
        <section className="px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1a4f] via-[#152060] to-[#1a2870]">
              <div className="grid lg:grid-cols-[1fr_1.2fr]">
                {/* Copy */}
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    Privacy and trust come first
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-white/70">
                    We prioritize confidentiality, respectful care, and a supportive environment
                    where students can seek help without fear of judgment.
                  </p>
                  <div className="mt-8">
                    <Link href="/auth/register">
                      <Button className="bg-white font-semibold text-[#152060] hover:bg-white/90">
                        Start safely{" "}
                        <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Pillars */}
                <div className="flex flex-col justify-center gap-4 p-8 md:p-12 lg:border-l lg:border-white/10">
                  {TRUST_PILLARS.map((pillar) => (
                    <div
                      key={pillar.title}
                      className="flex gap-4 rounded-xl border border-white/10 bg-white/8 p-4"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                        <pillar.icon className="h-4 w-4 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{pillar.title}</p>
                        <p className="mt-1 text-sm text-white/65">{pillar.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
        <section
          id="testimonials"
          className="bg-[#f7f9ff] px-5 py-16 sm:px-8 md:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#CC1A2E]">
                Real stories
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Student voices
              </h2>
              <p className="mt-3 text-base text-[#152060]/65">
                Hear from students who found support through SafeSpace Educare.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <figure
                  key={item.person}
                  className="flex flex-col rounded-2xl border border-[#152060]/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Stars */}
                  <div className="mb-4 flex gap-0.5" aria-label={`${item.stars} out of 5 stars`}>
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  {/* Quote */}
                  <blockquote className="flex-1 text-sm leading-relaxed text-[#152060]/80">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  {/* Attribution */}
                  <figcaption className="mt-5 flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#152060] text-xs font-bold text-white"
                      aria-hidden="true"
                    >
                      {item.initials}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#152060]/50">
                      {item.person}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
        <section className="px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#152060] to-[#1e2d8a] p-10 text-center text-white shadow-2xl md:p-14">
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"
              aria-hidden="true"
            >
              <Heart className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to take your first step?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
              Join SafeSpace Educare today and access support designed to help you feel safer,
              stronger, and more in control of your wellbeing.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="w-full bg-[#CC1A2E] px-9 py-6 text-base font-semibold text-white shadow-lg hover:bg-[#a8151f] sm:w-auto"
                >
                  Get Started Free{" "}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/25 bg-transparent px-9 py-6 text-base text-white hover:bg-white/10 sm:w-auto"
                >
                  Sign in to account
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-sm text-white/45">
              Free for all students. Confidential and secure.
            </p>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0d1a4f] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Heart className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-base font-bold">SafeSpace Educare</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                Built with care for student wellbeing. A confidential platform connecting
                students with counselors and mental health resources.
              </p>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map(({ heading, links }) => (
              <div key={heading}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/35">
                  {heading}
                </p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/35 md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} SafeSpace Educare. All rights reserved.</p>
            <p>Made with ♥ for students everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
