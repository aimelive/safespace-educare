"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  X,
  Save,
  Loader2,
  Search,
} from "lucide-react"

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Status = "all" | "scheduled" | "completed" | "cancelled"

const STATUS_FILTERS: { value: Status; label: string }[] = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  scheduled: Clock,
  completed: CheckCircle2,
  cancelled: XCircle,
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [filter, setFilter] = useState<Status>("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<any>(null)
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("scheduled")
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setFetching(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sessions/counselor-sessions`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const data = await res.json()
      setSessions(Array.isArray(data) ? data : data.sessions ?? [])
    } catch {
      console.error("Failed to fetch sessions")
    } finally {
      setFetching(false)
    }
  }

  const openSession = (session: any) => {
    setSelected(session)
    setNotes(session.notes ?? "")
    setStatus(session.status ?? "scheduled")
    setSavedOk(false)
  }

  const saveSession = async () => {
    if (!selected) return
    setSaving(true)
    setSavedOk(false)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${selected.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, notes }),
        },
      )
      if (res.ok) {
        const updated = await res.json()
        setSessions((prev) =>
          prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
        )
        setSelected((prev: any) => ({ ...prev, status, notes }))
        setSavedOk(true)
        setTimeout(() => setSavedOk(false), 3000)
      }
    } catch {
      console.error("Failed to save session")
    } finally {
      setSaving(false)
    }
  }

  const filtered = sessions.filter((s) => {
    const matchesFilter = filter === "all" || s.status === filter
    const term = search.toLowerCase()
    const matchesSearch =
      !term ||
      (s.student_name ?? "").toLowerCase().includes(term) ||
      (s.topic ?? "").toLowerCase().includes(term)
    return matchesFilter && matchesSearch
  })

  const counts = {
    all: sessions.length,
    scheduled: sessions.filter((s) => s.status === "scheduled").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#152060]">Sessions</h2>
        <p className="mt-0.5 text-sm text-[#152060]/50">
          All counseling sessions booked with you.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            { key: "all", label: "Total", icon: CalendarCheck, color: "bg-blue-50 text-blue-600" },
            { key: "scheduled", label: "Scheduled", icon: Clock, color: "bg-amber-50 text-amber-600" },
            { key: "completed", label: "Completed", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
            { key: "cancelled", label: "Cancelled", icon: XCircle, color: "bg-red-50 text-red-500" },
          ] as const
        ).map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={[
              "rounded-2xl border p-4 text-left transition-all",
              filter === key
                ? "border-[#152060]/30 bg-[#152060]/5 shadow-sm"
                : "border-[#152060]/8 bg-white hover:border-[#152060]/20",
            ].join(" ")}
          >
            <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#152060]/50">
              {label}
            </p>
            <p className="mt-0.5 text-2xl font-bold text-[#152060]">{counts[key]}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        {/* ── Sessions list ─────────────────────────────────────────────────── */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Search + filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152060]/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student or topic…"
                className="w-full rounded-xl border border-[#152060]/12 bg-[#f7f9ff] py-2.5 pl-9 pr-4 text-sm text-[#152060] placeholder:text-[#152060]/30 focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"
              />
            </div>
            <div className="flex gap-1.5">
              {STATUS_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={[
                    "rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                    filter === value
                      ? "bg-[#152060] text-white"
                      : "bg-white text-[#152060]/55 hover:bg-[#f7f9ff] hover:text-[#152060]",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-[#152060]/40" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#152060]/15 bg-[#f7f9ff] py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#152060]/8">
                <CalendarCheck className="h-6 w-6 text-[#152060]/40" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-[#152060]/60">
                {sessions.length === 0 ? "No sessions yet" : "No sessions match your filter"}
              </p>
              <p className="mt-1 text-xs text-[#152060]/40">
                {sessions.length === 0
                  ? "Students will book sessions with you soon."
                  : "Try adjusting the search or status filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((session) => {
                const StatusIcon = STATUS_ICONS[session.status] ?? Clock
                const isActive = selected?.id === session.id
                return (
                  <button
                    key={session.id}
                    onClick={() => openSession(session)}
                    className={[
                      "group flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-150",
                      isActive
                        ? "border-[#152060]/25 bg-[#152060]/5 shadow-sm"
                        : "border-[#152060]/8 bg-white hover:border-[#152060]/20 hover:shadow-sm",
                    ].join(" ")}
                  >
                    {/* Date block */}
                    <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-[#152060]/5 py-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#152060]/50">
                        {new Date(session.scheduled_date).toLocaleDateString("en", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold leading-none text-[#152060]">
                        {new Date(session.scheduled_date).getDate()}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#152060]">
                        {session.student_name ?? `Student ${session.student_id?.slice(0, 8)}`}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#152060]/50">
                        {session.scheduled_time}
                        {session.topic ? ` · ${session.topic}` : ""}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={[
                          "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                          STATUS_STYLES[session.status] ?? "bg-[#152060]/8 text-[#152060]/50",
                        ].join(" ")}
                      >
                        <StatusIcon className="h-3 w-3" aria-hidden="true" />
                        {session.status ?? "scheduled"}
                      </span>
                      <ChevronRight
                        className="h-4 w-4 text-[#152060]/25 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Detail panel ──────────────────────────────────────────────────── */}
        {selected && (
          <div className="w-full rounded-2xl border border-[#152060]/15 bg-white p-6 shadow-sm lg:w-80 lg:shrink-0">
            <div className="mb-5 flex items-start justify-between gap-3">
              <h3 className="font-bold text-[#152060]">Session details</h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-[#152060]/35 hover:bg-[#f7f9ff] hover:text-[#152060]"
                aria-label="Close detail panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Student", value: selected.student_name ?? "—" },
                  {
                    label: "Date",
                    value: new Date(selected.scheduled_date).toLocaleDateString(),
                  },
                  { label: "Time", value: selected.scheduled_time ?? "—" },
                  { label: "Topic", value: selected.topic ?? "Not specified" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#152060]/40">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-[#152060]">{value}</p>
                  </div>
                ))}
              </div>

              <hr className="border-[#152060]/8" />

              {/* Status */}
              <div className="space-y-1.5">
                <label
                  htmlFor="detail-status"
                  className="block text-[10px] font-bold uppercase tracking-wide text-[#152060]/40"
                >
                  Status
                </label>
                <select
                  id="detail-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-sm text-[#152060] focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label
                  htmlFor="detail-notes"
                  className="block text-[10px] font-bold uppercase tracking-wide text-[#152060]/40"
                >
                  Session notes
                </label>
                <textarea
                  id="detail-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add observations, recommendations…"
                  rows={5}
                  className="w-full resize-none rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-sm text-[#152060] placeholder:text-[#152060]/30 focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"
                />
              </div>

              {/* Success banner */}
              {savedOk && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Saved successfully
                </div>
              )}

              {/* Actions */}
              <Button
                onClick={saveSession}
                disabled={saving}
                className="w-full bg-[#152060] font-semibold text-white hover:bg-[#1e3280] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                    Save notes &amp; status
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
