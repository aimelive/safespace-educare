"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  CalendarPlus,
  Calendar,
  Clock,
  Lightbulb,
  User,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react"

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-full rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-[#152060] placeholder:text-[#152060]/30 transition-all focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-100   text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100    text-blue-700",
  cancelled: "bg-red-100     text-red-700",
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function SessionBooking() {
  const [counselors, setCounselors] = useState<any[]>([])
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [topic, setTopic] = useState("")
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingCounselors, setFetchingCounselors] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchCounselors()
    fetchSessions()
  }, [])

  const fetchCounselors = async () => {
    try {
      setFetchingCounselors(true)
      setError("")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/counselors`)
      const data = await res.json()
      const list = Array.isArray(data) ? data : data.counselors || data.data || []
      setCounselors(list)
    } catch {
      setError("Unable to load counselors. Please try again.")
      setCounselors([])
    } finally {
      setFetchingCounselors(false)
    }
  }

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/my-sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSessions(Array.isArray(data) ? data : data.sessions || data.data || [])
    } catch {
      console.error("Failed to fetch sessions")
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCounselor || !date || !time) return
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          counselor_id: selectedCounselor,
          date,
          time,
          topic,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setSelectedCounselor(null)
        setDate("")
        setTime("")
        setTopic("")
        fetchSessions()
        setTimeout(() => setSuccess(false), 4000)
      } else {
        setError("Failed to book session. Please try again.")
      }
    } catch {
      setError("An error occurred while booking your session.")
    } finally {
      setLoading(false)
    }
  }

  const activeSessions = sessions.filter((s) => s.status !== "cancelled")

  return (
    <div className="space-y-7">

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#152060]">Book a Session</h2>
        <p className="mt-0.5 text-sm text-[#152060]/50">
          Connect with a counselor at a time that works for you.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      {/* Success banner */}
      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Session booked successfully! Your counselor will confirm shortly.
        </div>
      )}

      {/* ── BOOKING FORM ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-6">
        <h3 className="mb-5 text-sm font-semibold text-[#152060]">New booking</h3>

        <form onSubmit={handleBooking} className="space-y-5">
          {/* Counselor cards */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#152060]">Select a counselor</p>

            {fetchingCounselors ? (
              <div className="flex items-center gap-2 py-4 text-sm text-[#152060]/45">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading counselors…
              </div>
            ) : counselors.length === 0 ? (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                No counselors available right now. Please check back later.
              </div>
            ) : (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {counselors.map((c) => {
                  const active = selectedCounselor === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCounselor(c.id)}
                      aria-pressed={active}
                      className={[
                        "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-150",
                        active
                          ? "border-[#152060] bg-[#152060]/5"
                          : "border-[#152060]/10 bg-[#f7f9ff] hover:border-[#152060]/25 hover:bg-white",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
                          active
                            ? "bg-[#152060] text-white"
                            : "bg-[#152060]/10 text-[#152060]/50",
                        ].join(" ")}
                      >
                        <User className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-semibold ${
                            active ? "text-[#152060]" : "text-[#152060]/70"
                          }`}
                        >
                          {c.name}
                        </p>
                        <p className="truncate text-xs text-[#152060]/40">
                          {c.specialization || "General Counselor"}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Date + Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="sess-date" className="block text-sm font-semibold text-[#152060]">
                Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152060]/30"
                  aria-hidden="true"
                />
                <input
                  id="sess-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className={`${INPUT_CLASS} pl-10`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sess-time" className="block text-sm font-semibold text-[#152060]">
                Time
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152060]/30"
                  aria-hidden="true"
                />
                <input
                  id="sess-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className={`${INPUT_CLASS} pl-10`}
                />
              </div>
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <label htmlFor="sess-topic" className="block text-sm font-semibold text-[#152060]">
              What&apos;s on your mind?{" "}
              <span className="font-normal text-[#152060]/40">(optional)</span>
            </label>
            <div className="relative">
              <Lightbulb
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152060]/30"
                aria-hidden="true"
              />
              <input
                id="sess-topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. stress, school pressure, relationships…"
                className={`${INPUT_CLASS} pl-10`}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !selectedCounselor || !date || !time}
            className="w-full border-0 bg-[#CC1A2E] py-5 font-semibold text-white hover:bg-[#a8151f] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Booking…
              </>
            ) : (
              <>
                <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                Confirm Booking
              </>
            )}
          </Button>
        </form>
      </div>

      {/* ── SESSIONS LIST ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#152060]">Your sessions</h3>

        {activeSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="mb-2 h-8 w-8 text-[#152060]/15" aria-hidden="true" />
            <p className="text-sm text-[#152060]/45">
              No sessions yet. Book your first one above!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-[#152060]/8 bg-[#f7f9ff] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#152060]/10">
                    <User className="h-4 w-4 text-[#152060]/50" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#152060]">{session.counselor_name}</p>
                    <p className="mt-0.5 text-xs text-[#152060]/50">
                      {new Date(session.scheduled_date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at {session.scheduled_time}
                    </p>
                    {session.topic && (
                      <p className="mt-1 text-xs text-[#152060]/45">{session.topic}</p>
                    )}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    STATUS_STYLES[session.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
