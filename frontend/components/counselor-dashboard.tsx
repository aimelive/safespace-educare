"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  X,
  Save,
  Loader2,
  BookOpen,
  Heart,
} from "lucide-react"

// ─── DATA ────────────────────────────────────────────────────────────────────

const MOTIVATIONAL_QUOTES = [
  "Your compassion makes a real difference in students' lives.",
  "Every session is an opportunity to help someone heal.",
  "Thank you for being a beacon of hope and support.",
  "Your work builds a stronger, healthier community.",
]

const TIPS = [
  "Take detailed notes during sessions for better follow-up care.",
  "Flag high-risk cases immediately and inform administration.",
  "Review analytics regularly to identify common issues.",
  "Collaborate with other counselors and admin on student referrals.",
]

// ─── STYLES ──────────────────────────────────────────────────────────────────

const SELECT_CLASS =
  "w-full rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-[#152060] transition-all focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"

const TEXTAREA_CLASS =
  "w-full resize-none rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-[#152060] placeholder:text-[#152060]/30 transition-all focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function CounselorDashboard({ user }: { user: any }) {
  const [sessions, setSessions] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [sessionNotes, setSessionNotes] = useState("")
  const [savingNotes, setSavingNotes] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [sessionStatus, setSessionStatus] = useState("pending")

  useEffect(() => {
    fetchSessions()
    fetchAnalytics()
  }, [])

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sessions/counselor-sessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setSessions(Array.isArray(data) ? data : data.sessions || [])
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedSession) return
    setSavingNotes(true)
    setSavedSuccess(false)
    try {
      const token = localStorage.getItem("token")
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${selectedSession.id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes: sessionNotes, status: sessionStatus }),
        }
      )
      setSelectedSession({ ...selectedSession, notes: sessionNotes, status: sessionStatus })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to save notes:", error)
    } finally {
      setSavingNotes(false)
    }
  }

  const randomQuote =
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]

  const completed = sessions.filter((s) => s.status === "completed").length
  const pending = sessions.filter((s) => s.status === "pending").length

  const STATS = [
    {
      icon: CalendarCheck,
      iconClass: "bg-blue-50 text-blue-600",
      label: "Total Sessions",
      value: analytics?.totalSessions ?? sessions.length,
    },
    {
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600",
      label: "Completed",
      value: completed,
    },
    {
      icon: Clock,
      iconClass: "bg-amber-50 text-amber-600",
      label: "Pending",
      value: pending,
    },
    {
      icon: AlertTriangle,
      iconClass: "bg-red-50 text-[#CC1A2E]",
      label: "High Risk",
      value: analytics?.highRiskCount ?? 0,
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── HEADING ────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#CC1A2E]">
          Counselor dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#152060] sm:text-3xl">
          Welcome, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-[#152060]/55">
          You&apos;re making a real difference today.
        </p>
      </div>

      {/* ── QUOTE ──────────────────────────────────────────────────── */}
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

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#152060]/8 bg-white p-5 shadow-sm"
            >
              <div
                className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconClass}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#152060]/50">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-bold text-[#152060]">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* ── SESSIONS LIST ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#152060]">Your Sessions</h2>
          <p className="mt-0.5 text-sm text-[#152060]/50">
            Click any session to view details and add notes.
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#152060]/15 bg-[#f7f9ff] py-14 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#152060]/8">
              <CalendarCheck className="h-6 w-6 text-[#152060]/40" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-[#152060]/60">No sessions yet</p>
            <p className="mt-1 text-xs text-[#152060]/40">
              Students will book sessions soon!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setSelectedSession(session)
                  setSessionNotes(session.notes || "")
                  setSessionStatus(session.status || "pending")
                  setSavedSuccess(false)
                }}
                className="group flex w-full items-center justify-between rounded-xl border border-[#152060]/8 bg-[#f7f9ff] px-4 py-3.5 text-left transition-all duration-150 hover:border-[#152060]/20 hover:bg-white hover:shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#152060]">
                    {session.student_name || `Student ${session.student_id}`}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#152060]/50">
                    {new Date(session.scheduled_date).toLocaleDateString()} at{" "}
                    {session.scheduled_time}
                    {session.topic && ` · ${session.topic}`}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      session.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : session.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {session.status || "pending"}
                  </span>
                  <ChevronRight
                    className="h-4 w-4 text-[#152060]/30 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── SESSION DETAIL PANEL ───────────────────────────────────── */}
      {selectedSession && (
        <div className="rounded-2xl border border-[#152060]/15 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#152060]">Session Details</h3>
            <button
              onClick={() => setSelectedSession(null)}
              className="rounded-lg p-1.5 text-[#152060]/40 transition-colors hover:bg-[#f7f9ff] hover:text-[#152060]"
              aria-label="Close session details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Meta grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#152060]/50">
                  Student
                </p>
                <p className="mt-1 text-sm font-medium text-[#152060]">
                  {selectedSession.student_name ||
                    `Student ${selectedSession.student_id}`}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#152060]/50">
                  Scheduled date
                </p>
                <p className="mt-1 text-sm font-medium text-[#152060]">
                  {new Date(selectedSession.scheduled_date).toLocaleDateString()}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#152060]/50">
                  Topic
                </p>
                <p className="mt-1 text-sm font-medium text-[#152060]">
                  {selectedSession.topic || "Not specified"}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label
                htmlFor="session-status"
                className="block text-xs font-semibold uppercase tracking-wide text-[#152060]/50"
              >
                Session status
              </label>
              <select
                id="session-status"
                value={sessionStatus}
                onChange={(e) => setSessionStatus(e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label
                htmlFor="session-notes"
                className="block text-xs font-semibold uppercase tracking-wide text-[#152060]/50"
              >
                Session notes
              </label>
              <textarea
                id="session-notes"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Add detailed session notes, observations, and recommendations…"
                rows={5}
                className={TEXTAREA_CLASS}
              />
            </div>

            {/* Success banner */}
            {savedSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                Notes saved successfully!
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="flex-1 bg-[#152060] font-semibold text-white hover:bg-[#1e3280] disabled:opacity-60"
              >
                {savingNotes ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                    Save notes &amp; status
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedSession(null)}
                className="flex-1 border-[#152060]/15 text-[#152060] hover:bg-[#f7f9ff]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMMON TOPICS ──────────────────────────────────────────── */}
      {analytics?.commonIssues && analytics.commonIssues.length > 0 && (
        <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#152060]">
            Common Topics This Week
          </h2>
          <div className="space-y-2">
            {analytics.commonIssues.map((issue: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-[#f7f9ff] px-4 py-3"
              >
                <p className="text-sm font-medium text-[#152060]">{issue.topic}</p>
                <span className="rounded-full bg-[#152060] px-3 py-1 text-xs font-semibold text-white">
                  {issue.count} sessions
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TIPS ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
            <BookOpen className="h-4 w-4 text-amber-600" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-[#152060]">Tips for Success</h2>
        </div>
        <ul className="space-y-3">
          {TIPS.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CC1A2E] text-xs font-bold text-white">
                {idx + 1}
              </span>
              <span className="text-[#152060]/70">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
