"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Heart,
  LogOut,
  Loader2,
  Home,
  SmilePlus,
  CalendarPlus,
  MessageCircle,
  Dumbbell,
  BookOpen,
  Trophy,
  Sparkles,
  ChevronRight,
  X,
  Menu,
  LayoutDashboard,
  BarChart2,
  CalendarCheck,
} from "lucide-react"

// ─── NAV CONFIG ──────────────────────────────────────────────────────────────

const STUDENT_NAV = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Home", icon: Home }],
  },
  {
    label: "Support",
    items: [
      { href: "/dashboard/book-session", label: "Book Session", icon: CalendarPlus },
      { href: "/dashboard/chat", label: "Anonymous Chat", icon: MessageCircle },
    ],
  },
  {
    label: "Wellness",
    items: [
      { href: "/dashboard/mood", label: "Mood Check-in", icon: SmilePlus },
      { href: "/dashboard/exercises", label: "Exercises", icon: Dumbbell },
      { href: "/dashboard/resources", label: "Resources", icon: BookOpen },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/dashboard/victories", label: "Victories", icon: Trophy },
      { href: "/dashboard/testimonies", label: "Testimonies", icon: Sparkles },
    ],
  },
]

const COUNSELOR_NAV = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Work",
    items: [
      { href: "/dashboard/sessions", label: "Sessions", icon: CalendarCheck },
      { href: "/dashboard/chat", label: "Student Chats", icon: MessageCircle },
    ],
  },
]

const ADMIN_NAV = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Management",
    items: [
      { href: "/dashboard/chat", label: "Student Chats", icon: MessageCircle },
      { href: "/dashboard/resources", label: "Resources", icon: BookOpen },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
    ],
  },
]

function getNavSections(role: string) {
  if (role === "counselor") return COUNSELOR_NAV
  if (role === "admin") return ADMIN_NAV
  return STUDENT_NAV
}

function getSidebarFooter(role: string) {
  if (role === "counselor") {
    return {
      icon: CalendarCheck,
      title: "Your sessions",
      body: "View and manage all booked sessions.",
      linkHref: "/dashboard/sessions",
      linkLabel: "View sessions →",
    }
  }
  if (role === "admin") {
    return {
      icon: BarChart2,
      title: "Analytics",
      body: "Monitor platform health and usage.",
      linkHref: "/dashboard/analytics",
      linkLabel: "View analytics →",
    }
  }
  return {
    icon: MessageCircle,
    title: "Need support now?",
    body: "Anonymous chat is always available.",
    linkHref: "/dashboard/chat",
    linkLabel: "Start a chat →",
  }
}

// ─── LAYOUT ──────────────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const role = localStorage.getItem("role")
    if (!userData || !role) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9ff]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#152060]">
            <Heart className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader2
              className="h-6 w-6 animate-spin text-[#CC1A2E]"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-[#152060]/70">
              Loading your dashboard…
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const roleLabel =
    user.role.charAt(0).toUpperCase() + user.role.slice(1)
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U"

  const navSections = getNavSections(user.role)
  const allItems = navSections.flatMap((s) => s.items)
  const footer = getSidebarFooter(user.role)
  const FooterIcon = footer.icon

  const currentItem = allItems.find((item) =>
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === item.href,
  )
  const currentSection = navSections.find((s) =>
    s.items.some((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === item.href,
    ),
  )

  return (
    <div className="min-h-screen bg-[#f7f9ff]">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-[#152060]/8 bg-white/95 backdrop-blur-md">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
          aria-label="Dashboard navigation"
        >
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#152060]/10 bg-white text-[#152060]/60 shadow-sm hover:text-[#152060] md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#152060]">
                <Heart className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="hidden text-base font-bold text-[#152060] sm:block">
                SafeSpace <span className="text-[#CC1A2E]">Educare</span>
              </span>
            </Link>

            <div className="h-6 w-px bg-[#152060]/10" aria-hidden="true" />

            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#152060] text-xs font-bold text-white"
                aria-hidden="true"
              >
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-none text-[#152060]">
                  {user.name}
                </p>
                <p className="mt-0.5 text-xs text-[#152060]/50">{roleLabel}</p>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="gap-2 text-[#152060]/70 hover:bg-[#152060]/5 hover:text-[#152060]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </nav>
      </header>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8 md:py-8">
        <div className="flex gap-6">
          {/* Mobile backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* ── SIDEBAR ────────────────────────────────────────────────────── */}
          <aside
            className={[
              "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-[#152060]/8 bg-white shadow-2xl transition-transform duration-300",
              "md:sticky md:top-24 md:z-auto md:h-[calc(100vh-6.5rem)] md:w-56 md:shrink-0 md:translate-x-0 md:rounded-2xl md:border md:shadow-sm",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
            aria-label="Dashboard navigation"
          >
            {/* Mobile top bar */}
            <div className="flex items-center justify-between border-b border-[#152060]/8 px-4 py-3.5 md:hidden">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#CC1A2E]" aria-hidden="true" />
                <span className="text-sm font-bold text-[#152060]">Menu</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1.5 text-[#152060]/40 hover:bg-[#f7f9ff] hover:text-[#152060]"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Desktop brand strip */}
            <div className="hidden items-center gap-2 border-b border-[#152060]/8 px-4 py-3.5 md:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#152060]">
                <Heart className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-[#152060]">
                {roleLabel} Dashboard
              </span>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto space-y-4 p-3">
              {navSections.map((section) => (
                <div key={section.label}>
                  <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-[#152060]/30">
                    {section.label}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map(({ href, label, icon: Icon }) => {
                      const active =
                        href === "/dashboard"
                          ? pathname === "/dashboard"
                          : pathname === href
                      return (
                        <Link
                          key={href}
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={[
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                            active
                              ? "bg-[#152060] text-white shadow-sm"
                              : "text-[#152060]/55 hover:bg-[#f7f9ff] hover:text-[#152060]",
                          ].join(" ")}
                        >
                          <Icon
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="truncate">{label}</span>
                          {active && (
                            <ChevronRight
                              className="ml-auto h-3.5 w-3.5 shrink-0 opacity-60"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Sidebar footer CTA */}
            <div className="border-t border-[#152060]/8 p-3">
              <div className="rounded-xl bg-gradient-to-br from-[#f7f9ff] to-[#eef1fa] p-3.5">
                <div className="mb-1 flex items-center gap-2">
                  <FooterIcon
                    className="h-3.5 w-3.5 text-[#CC1A2E]"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-semibold text-[#152060]">
                    {footer.title}
                  </p>
                </div>
                <p className="text-[11px] leading-relaxed text-[#152060]/50">
                  {footer.body}
                </p>
                <Link
                  href={footer.linkHref}
                  className="mt-2 block text-[11px] font-semibold text-[#CC1A2E] hover:underline"
                >
                  {footer.linkLabel}
                </Link>
              </div>
            </div>
          </aside>

          {/* ── PAGE CONTENT ───────────────────────────────────────────────── */}
          <div className="min-w-0 flex-1 space-y-5">
            {/* Mobile breadcrumb */}
            <div className="hidden items-center gap-3 max-md:flex">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#152060]/40">
                  {currentSection?.label}
                </p>
                <p className="text-sm font-semibold text-[#152060]">
                  {currentItem?.label}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
