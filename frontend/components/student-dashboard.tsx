"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Home,
  SmilePlus,
  CalendarPlus,
  MessageCircle,
  BookOpen,
  Trophy,
  Sparkles,
  Calendar,
  Heart,
  Lightbulb,
  ArrowRight,
  Flame,
  TrendingUp,
  Loader2,
} from "lucide-react"

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function calculateStreak(moods: any[]): number {
  if (!moods.length) return 0
  const dates = [
    ...new Set(
      moods.map((m) => new Date(m.created_at || m.date).toDateString())
    ),
  ]
  let streak = 0
  const check = new Date()
  while (dates.includes(check.toDateString())) {
    streak++
    check.setDate(check.getDate() - 1)
  }
  return streak
}

const MOOD_EMOJI: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  anxious: "😰",
  calm: "😌",
  stressed: "😤",
  excited: "🤩",
  tired: "😴",
  neutral: "😐",
}

// ─── STUDENT HOME (overview) ──────────────────────────────────────────────────

export default function StudentHome({ user }: { user: any }) {
  const router = useRouter()
  const firstName = user?.name?.split(" ")[0] || "there"

  const [loadingStats, setLoadingStats] = useState(true)
  const [stats, setStats] = useState({
    moodStreak: 0,
    sessionsBooked: 0,
    resourcesSaved: 0,
    victories: 0,
  })
  const [recentMoods, setRecentMoods] = useState<any[]>([])
  const [upcomingSession, setUpcomingSession] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const headers = { Authorization: `Bearer ${token}` }

    Promise.allSettled([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/moods/history`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/my-sessions`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/saved`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/victories`, { headers }),
    ]).then(async ([moodsRes, sessionsRes, savedRes, victoriesRes]) => {
      let moodStreak = 0
      if (moodsRes.status === "fulfilled" && moodsRes.value.ok) {
        const d = await moodsRes.value.json()
        const moodsData: any[] = Array.isArray(d) ? d : d.moods || []
        moodStreak = calculateStreak(moodsData)
        setRecentMoods(moodsData.slice(0, 5))
      }

      let sessionsCount = 0
      if (sessionsRes.status === "fulfilled" && sessionsRes.value.ok) {
        const d = await sessionsRes.value.json()
        const sessions = Array.isArray(d) ? d : d.sessions || []
        sessionsCount = sessions.length
        const next = sessions.find(
          (s: any) => s.status === "pending" || s.status === "confirmed"
        )
        setUpcomingSession(next || null)
      }

      let savedCount = 0
      if (savedRes.status === "fulfilled" && savedRes.value.ok) {
        const d = await savedRes.value.json()
        savedCount = Array.isArray(d) ? d.length : d.saved?.length ?? 0
      }

      let victoriesCount = 0
      if (victoriesRes.status === "fulfilled" && victoriesRes.value.ok) {
        const d = await victoriesRes.value.json()
        victoriesCount = Array.isArray(d) ? d.length : d.victories?.length ?? 0
      }

      setStats({
        moodStreak,
        sessionsBooked: sessionsCount,
        resourcesSaved: savedCount,
        victories: victoriesCount,
      })
      setLoadingStats(false)
    })
  }, [])

  const STAT_CARDS = [
    {
      icon: Flame,
      iconClass: "bg-orange-50 text-orange-500",
      label: "Mood Streak",
      value: `${stats.moodStreak}`,
      unit: "days",
      href: "/dashboard/mood",
    },
    {
      icon: Calendar,
      iconClass: "bg-blue-50 text-blue-600",
      label: "Sessions Booked",
      value: `${stats.sessionsBooked}`,
      unit: "total",
      href: "/dashboard/book-session",
    },
    {
      icon: BookOpen,
      iconClass: "bg-emerald-50 text-emerald-600",
      label: "Resources Saved",
      value: `${stats.resourcesSaved}`,
      unit: "saved",
      href: "/dashboard/resources",
    },
    {
      icon: Trophy,
      iconClass: "bg-amber-50 text-amber-600",
      label: "Victories",
      value: `${stats.victories}`,
      unit: "recorded",
      href: "/dashboard/victories",
    },
  ]

  const QUICK_ACTIONS = [
    {
      href: "/dashboard/book-session",
      icon: Calendar,
      iconClass: "bg-blue-50 text-blue-600",
      title: "Book a Session",
      body: "Connect with a qualified counselor at a time that works for you.",
      cta: "Book now",
      ctaClass: "bg-[#152060] hover:bg-[#1e3280]",
    },
    {
      href: "/dashboard/mood",
      icon: SmilePlus,
      iconClass: "bg-amber-50 text-amber-600",
      title: "How are you feeling?",
      body: "Track your mood and emotional wellbeing — just takes a minute.",
      cta: "Check in",
      ctaClass: "bg-[#152060] hover:bg-[#1e3280]",
    },
    {
      href: "/dashboard/chat",
      icon: MessageCircle,
      iconClass: "bg-purple-50 text-purple-600",
      title: "Need to talk?",
      body: "Start an anonymous, judgment-free chat with a counselor now.",
      cta: "Start chat",
      ctaClass: "bg-[#CC1A2E] hover:bg-[#a8151f]",
    },
    {
      href: "/dashboard/resources",
      icon: BookOpen,
      iconClass: "bg-emerald-50 text-emerald-600",
      title: "Explore Resources",
      body: "Browse curated articles, videos, and wellness tools at your pace.",
      cta: "Explore",
      ctaClass: "bg-[#152060] hover:bg-[#1e3280]",
    },
  ]

  return (
    <div className="space-y-8">
      {/* ── GREETING ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#152060]">
            <Heart className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#152060]">
              Good to see you, {firstName} 👋
            </h2>
            <p className="mt-0.5 text-sm text-[#152060]/50">
              Your safe space for mental health support and personal growth.
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:flex">
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-emerald-700">
            Support available
          </span>
        </div>
      </div>

      {/* ── STATS ROW ─────────────────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#152060]/40" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-widest text-[#152060]/40">
            Your progress
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <button
                key={card.label}
                onClick={() => router.push(card.href)}
                className="group rounded-2xl border border-[#152060]/8 bg-[#f7f9ff] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#152060]/20 hover:bg-white hover:shadow-md"
              >
                <div
                  className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.iconClass}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="flex items-baseline gap-1">
                  {loadingStats ? (
                    <Loader2
                      className="h-5 w-5 animate-spin text-[#152060]/25"
                      aria-label="Loading"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-[#152060]">
                      {card.value}
                    </span>
                  )}
                  {!loadingStats && (
                    <span className="text-xs text-[#152060]/45">{card.unit}</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs font-medium text-[#152060]/55">
                  {card.label}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── QUICK ACTIONS ─────────────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#152060]/40" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-widest text-[#152060]/40">
            Quick actions
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <div
                key={action.href}
                className="group rounded-2xl border border-[#152060]/8 bg-[#f7f9ff] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${action.iconClass}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-[#152060]">{action.title}</h3>
                <p className="mt-1 text-sm text-[#152060]/55">{action.body}</p>
                <Button
                  size="sm"
                  onClick={() => router.push(action.href)}
                  className={`mt-4 border-0 text-white ${action.ctaClass}`}
                >
                  {action.cta}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── DATA PANELS ───────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Recent moods */}
        <div className="rounded-2xl border border-[#152060]/8 bg-[#f7f9ff] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SmilePlus className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-[#152060]">
                Recent Moods
              </h3>
            </div>
            <button
              onClick={() => router.push("/dashboard/mood")}
              className="text-xs font-medium text-[#CC1A2E] hover:underline"
            >
              Check in →
            </button>
          </div>

          {loadingStats ? (
            <div className="flex items-center justify-center py-6">
              <Loader2
                className="h-5 w-5 animate-spin text-[#152060]/25"
                aria-label="Loading"
              />
            </div>
          ) : recentMoods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <SmilePlus
                className="mb-2 h-8 w-8 text-[#152060]/15"
                aria-hidden="true"
              />
              <p className="text-sm text-[#152060]/45">No mood entries yet.</p>
              <button
                onClick={() => router.push("/dashboard/mood")}
                className="mt-1.5 text-xs font-semibold text-[#CC1A2E] hover:underline"
              >
                Start tracking today
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentMoods.map((mood, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5"
                >
                  <span className="text-lg" aria-hidden="true">
                    {MOOD_EMOJI[mood.mood?.toLowerCase()] ?? "😐"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium capitalize text-[#152060]">
                      {mood.mood}
                    </p>
                    <div className="mt-1 h-1 w-full rounded-full bg-[#152060]/8">
                      <div
                        className="h-1 rounded-full bg-[#152060]/40 transition-all"
                        style={{
                          width: `${((mood.intensity ?? 5) / 10) * 100}%`,
                        }}
                        aria-label={`Intensity ${mood.intensity}/10`}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-[#152060]/40">
                    {mood.intensity ?? "–"}/10
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming session */}
        <div className="rounded-2xl border border-[#152060]/8 bg-[#f7f9ff] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarPlus
                className="h-4 w-4 text-blue-600"
                aria-hidden="true"
              />
              <h3 className="text-sm font-semibold text-[#152060]">
                Next Session
              </h3>
            </div>
            <button
              onClick={() => router.push("/dashboard/book-session")}
              className="text-xs font-medium text-[#CC1A2E] hover:underline"
            >
              Book one →
            </button>
          </div>

          {loadingStats ? (
            <div className="flex items-center justify-center py-6">
              <Loader2
                className="h-5 w-5 animate-spin text-[#152060]/25"
                aria-label="Loading"
              />
            </div>
          ) : !upcomingSession ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Calendar
                className="mb-2 h-8 w-8 text-[#152060]/15"
                aria-hidden="true"
              />
              <p className="text-sm text-[#152060]/45">No upcoming sessions.</p>
              <button
                onClick={() => router.push("/dashboard/book-session")}
                className="mt-1.5 text-xs font-semibold text-[#CC1A2E] hover:underline"
              >
                Book your first session
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-[#152060]/8 bg-white p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="font-semibold text-[#152060]">
                  {upcomingSession.counselor_name || "Counselor"}
                </p>
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  {upcomingSession.status}
                </span>
              </div>
              <div className="space-y-1 text-xs text-[#152060]/55">
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {new Date(
                    upcomingSession.scheduled_date
                  ).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at {upcomingSession.scheduled_time}
                </p>
                {upcomingSession.topic && (
                  <p className="flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                    {upcomingSession.topic}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── TIP CARD ──────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 rounded-2xl border border-[#152060]/10 bg-gradient-to-br from-[#f7f9ff] to-[#eef1fa] p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#152060]/10">
          <Lightbulb className="h-4 w-4 text-[#152060]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#152060]">Did you know?</p>
          <p className="mt-1 text-sm leading-relaxed text-[#152060]/60">
            Regular mood tracking helps identify patterns and improve emotional
            awareness. Even a 2-minute daily check-in can make a real difference
            over time. Try building a streak starting today!
          </p>
        </div>
      </div>
    </div>
  )
}
