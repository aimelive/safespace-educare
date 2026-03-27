"use client"

import { useState, useEffect } from "react"
import {
  BarChart2,
  CalendarCheck,
  Users,
  UserCheck,
  MessageCircle,
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
  Loader2,
  RefreshCw,
} from "lucide-react"

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
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
      console.error("Failed to fetch analytics")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#CC1A2E]" aria-hidden="true" />
          <p className="text-sm text-[#152060]/55">Loading analytics…</p>
        </div>
      </div>
    )
  }

  const totalSessions = stats?.totalSessions ?? 0
  const completedSessions = stats?.completedSessions ?? 0
  const scheduledSessions = stats?.scheduledSessions ?? 0
  const cancelledSessions = stats?.cancelledSessions ?? 0
  const completionRate =
    totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

  const OVERVIEW = [
    {
      icon: Users,
      cls: "bg-blue-50 text-blue-600",
      label: "Total Students",
      value: stats?.totalStudents ?? 0,
    },
    {
      icon: UserCheck,
      cls: "bg-purple-50 text-purple-600",
      label: "Total Counselors",
      value: stats?.totalCounselors ?? 0,
    },
    {
      icon: CalendarCheck,
      cls: "bg-emerald-50 text-emerald-600",
      label: "Total Sessions",
      value: totalSessions,
    },
    {
      icon: MessageCircle,
      cls: "bg-amber-50 text-amber-600",
      label: "Open Chat Sessions",
      value: stats?.openChatSessions ?? 0,
    },
    {
      icon: BookOpen,
      cls: "bg-red-50 text-[#CC1A2E]",
      label: "Resources",
      value: stats?.totalResources ?? 0,
    },
    {
      icon: CheckCircle2,
      cls: "bg-teal-50 text-teal-600",
      label: "Completion Rate",
      value: `${completionRate}%`,
    },
  ]

  const SESSION_STATUSES = [
    { icon: Clock, label: "Scheduled", value: scheduledSessions, color: "bg-amber-500" },
    { icon: CheckCircle2, label: "Completed", value: completedSessions, color: "bg-emerald-500" },
    { icon: XCircle, label: "Cancelled", value: cancelledSessions, color: "bg-red-400" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#152060]">Analytics</h2>
          <p className="mt-0.5 text-sm text-[#152060]/50">
            Platform-wide usage and engagement overview.
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-[#152060]/12 bg-white px-3 py-2 text-xs font-medium text-[#152060]/60 transition-colors hover:bg-[#f7f9ff] hover:text-[#152060] disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Overview metrics ─────────────────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#152060]/40">
          Platform overview
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {OVERVIEW.map(({ icon: Icon, cls, label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#152060]/8 bg-white p-5 shadow-sm"
            >
              <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${cls}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#152060]/50">
                {label}
              </p>
              <p className="mt-1 text-3xl font-bold text-[#152060]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Session status breakdown ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
            <BarChart2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-[#152060]">Session Status Breakdown</h3>
        </div>

        {totalSessions === 0 ? (
          <p className="text-sm text-[#152060]/40">No sessions recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {/* Stacked bar */}
            <div className="flex h-4 w-full overflow-hidden rounded-full bg-[#152060]/8">
              {SESSION_STATUSES.map(({ label, value, color }) => {
                const pct = Math.round((value / totalSessions) * 100)
                return pct > 0 ? (
                  <div
                    key={label}
                    title={`${label}: ${pct}%`}
                    className={`h-full ${color} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                ) : null
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-3">
              {SESSION_STATUSES.map(({ icon: Icon, label, value, color }) => {
                const pct = totalSessions > 0
                  ? Math.round((value / totalSessions) * 100)
                  : 0
                return (
                  <div key={label} className="rounded-xl bg-[#f7f9ff] px-4 py-3 text-center">
                    <div className={`mx-auto mb-2 h-2.5 w-2.5 rounded-full ${color}`} />
                    <p className="text-xs font-medium text-[#152060]/60">{label}</p>
                    <p className="text-xl font-bold text-[#152060]">{value}</p>
                    <p className="text-[10px] text-[#152060]/40">{pct}%</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Common topics ────────────────────────────────────────────────── */}
      {stats?.commonTopics && stats.commonTopics.length > 0 && (
        <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-[#152060]">Common Session Topics</h3>
          <div className="space-y-3">
            {stats.commonTopics.map((topic: any, idx: number) => {
              const max = stats.commonTopics[0].count
              const pct = max > 0 ? Math.round((topic.count / max) * 100) : 0
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#152060]">{topic.topic}</p>
                    <span className="text-xs font-semibold text-[#152060]/50">
                      {topic.count} session{topic.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#152060]/8">
                    <div
                      className="h-2 rounded-full bg-[#152060] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Counselor activity ───────────────────────────────────────────── */}
      {stats?.counselorActivity && stats.counselorActivity.length > 0 && (
        <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-[#152060]">Counselor Activity</h3>
          <div className="space-y-2">
            {stats.counselorActivity.map((c: any, idx: number) => {
              const rate =
                c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-xl bg-[#f7f9ff] px-4 py-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#152060]/10 text-sm font-bold text-[#152060]">
                    {c.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#152060]">{c.name}</p>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#152060]/8">
                      <div
                        className="h-1.5 rounded-full bg-emerald-500"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold text-[#152060]">{c.total} sessions</p>
                    <p className="text-[10px] text-emerald-600">{rate}% completed</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state when no data at all */}
      {stats &&
        totalSessions === 0 &&
        (!stats.commonTopics || stats.commonTopics.length === 0) &&
        (!stats.counselorActivity || stats.counselorActivity.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#152060]/15 bg-[#f7f9ff] py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#152060]/8">
              <BarChart2 className="h-6 w-6 text-[#152060]/40" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-[#152060]/60">No activity data yet</p>
            <p className="mt-1 text-xs text-[#152060]/40">
              Analytics will appear once students start booking sessions.
            </p>
          </div>
        )}
    </div>
  )
}
