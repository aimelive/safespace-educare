"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Users,
  CalendarCheck,
  UserCheck,
  BookOpen,
  MessageCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  ListChecks,
  Loader2,
  Heart,
  BarChart2,
} from "lucide-react"

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const MOTIVATIONAL_QUOTES = [
  "Your leadership drives meaningful change in mental health.",
  "Data-driven insights help us serve students better.",
  "Together, we're building a healthier school community.",
  "Every metric represents a student who got help.",
]

const ADMIN_TASKS = [
  {
    title: "Monitor student engagement",
    desc: "Check weekly trends to ensure students are actively using SafeSpace Educare.",
  },
  {
    title: "Review counselor workload",
    desc: "Ensure counselors are not overwhelmed and manage session distribution.",
  },
  {
    title: "Track common issues",
    desc: "Identify emerging mental health trends for targeted interventions.",
  },
  {
    title: "Maintain privacy",
    desc: "Regularly review data handling practices per local regulations.",
  },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function AdminDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/admin`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch {
        console.error("Failed to fetch admin stats")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const randomQuote =
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#CC1A2E]" aria-hidden="true" />
          <p className="text-sm text-[#152060]/55">Loading admin dashboard…</p>
        </div>
      </div>
    )
  }

  const KEY_METRICS = [
    {
      icon: Users,
      iconClass: "bg-blue-50 text-blue-600",
      label: "Students",
      value: stats?.totalStudents ?? 0,
    },
    {
      icon: UserCheck,
      iconClass: "bg-purple-50 text-purple-600",
      label: "Counselors",
      value: stats?.totalCounselors ?? 0,
    },
    {
      icon: CalendarCheck,
      iconClass: "bg-emerald-50 text-emerald-600",
      label: "Total Sessions",
      value: stats?.totalSessions ?? 0,
    },
    {
      icon: MessageCircle,
      iconClass: "bg-amber-50 text-amber-600",
      label: "Open Chats",
      value: stats?.openChatSessions ?? 0,
    },
    {
      icon: BookOpen,
      iconClass: "bg-red-50 text-[#CC1A2E]",
      label: "Resources",
      value: stats?.totalResources ?? 0,
    },
  ]

  const SESSION_BREAKDOWN = [
    {
      icon: Clock,
      label: "Scheduled",
      value: stats?.scheduledSessions ?? 0,
      cls: "bg-amber-50 text-amber-600",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: stats?.completedSessions ?? 0,
      cls: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: XCircle,
      label: "Cancelled",
      value: stats?.cancelledSessions ?? 0,
      cls: "bg-red-50 text-red-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── HEADING ────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#CC1A2E]">
          Admin portal
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#152060] sm:text-3xl">
          Welcome, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-[#152060]/55">
          School-wide overview of SafeSpace Educare usage and impact.
        </p>
      </div>

      {/* ── QUOTE ──────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1a4f] via-[#152060] to-[#1e2d8a] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Heart className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <blockquote className="text-sm italic leading-relaxed text-white/85">
            &ldquo;{randomQuote}&rdquo;
          </blockquote>
        </div>
      </div>

      {/* ── KEY METRICS ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {KEY_METRICS.map(({ icon: Icon, iconClass, label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#152060]/8 bg-white p-5 shadow-sm"
          >
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#152060]/50">
              {label}
            </p>
            <p className="mt-1 text-3xl font-bold text-[#152060]">{value}</p>
          </div>
        ))}
      </div>

      {/* ── SESSION BREAKDOWN + ANALYTICS LINK ─────────────────── */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <CalendarCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-[#152060]">Sessions Breakdown</h2>
          </div>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#CC1A2E] transition-colors hover:bg-red-50"
          >
            <BarChart2 className="h-3.5 w-3.5" aria-hidden="true" />
            Full analytics →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {SESSION_BREAKDOWN.map(({ icon: Icon, label, value, cls }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl bg-[#f7f9ff] px-4 py-4"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cls}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#152060]/50">
                  {label}
                </p>
                <p className="text-2xl font-bold text-[#152060]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── COMMON TOPICS ──────────────────────────────────────── */}
      {stats?.commonTopics && stats.commonTopics.length > 0 && (
        <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#152060]">
            Most Common Session Topics
          </h2>
          <div className="space-y-2">
            {stats.commonTopics.map((topic: any, idx: number) => {
              const max = stats.commonTopics[0].count
              const pct = Math.round((topic.count / max) * 100)
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#152060]">{topic.topic}</p>
                    <span className="text-xs font-semibold text-[#152060]/50">
                      {topic.count} session{topic.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#152060]/8">
                    <div
                      className="h-1.5 rounded-full bg-[#152060]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── COUNSELOR ACTIVITY ─────────────────────────────────── */}
      {stats?.counselorActivity && stats.counselorActivity.length > 0 && (
        <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#152060]">Counselor Activity</h2>
          <div className="space-y-2">
            {stats.counselorActivity.map((c: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-[#f7f9ff] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#152060]/10 text-xs font-bold text-[#152060]">
                    {c.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <p className="text-sm font-medium text-[#152060]">{c.name}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#152060]/60">
                  <span>{c.total} total</span>
                  <span className="font-semibold text-emerald-600">
                    {c.completed} completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SYSTEM STATUS ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
            <Activity className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-[#152060]">System Status</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
          <p className="text-sm font-medium text-[#152060]">All systems operational</p>
        </div>
        <p className="mt-1.5 text-xs text-[#152060]/40">
          Last checked: {new Date().toLocaleTimeString()} · Database: Connected · APIs: Responsive
        </p>
      </div>

      {/* ── ADMIN TASKS ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#152060]/8">
            <ListChecks className="h-4 w-4 text-[#152060]" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-[#152060]">Admin Responsibilities</h2>
        </div>
        <ul className="space-y-3">
          {ADMIN_TASKS.map((task, idx) => (
            <li key={idx} className="flex items-start gap-3.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#152060] text-xs font-bold text-white">
                {idx + 1}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-[#152060]">{task.title}: </span>
                <span className="text-[#152060]/60">{task.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
