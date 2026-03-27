"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trophy, Plus, X, Loader2 } from "lucide-react"

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-full rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-[#152060] placeholder:text-[#152060]/30 transition-all focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"

const CATEGORIES = ["Academic", "Social", "Health", "Personal", "Family", "Other"]

const CATEGORY_STYLES: Record<string, string> = {
  academic: "bg-blue-50    text-blue-600    border-blue-200",
  social:   "bg-purple-50  text-purple-600  border-purple-200",
  health:   "bg-emerald-50 text-emerald-600 border-emerald-200",
  personal: "bg-amber-50   text-amber-600   border-amber-200",
  family:   "bg-pink-50    text-pink-600    border-pink-200",
  other:    "bg-gray-50    text-gray-600    border-gray-200",
  general:  "bg-slate-50   text-slate-600   border-slate-200",
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function VictoryTracker() {
  const [victories, setVictories] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
  })
  const [loading, setLoading] = useState(false)
  const [fetchingVictories, setFetchingVictories] = useState(true)

  useEffect(() => {
    fetchVictories()
  }, [])

  const fetchVictories = async () => {
    setFetchingVictories(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/victories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setVictories(Array.isArray(data) ? data : [])
    } catch {
      console.error("Failed to fetch victories")
    } finally {
      setFetchingVictories(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/victories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setFormData({ title: "", description: "", category: "general" })
        setShowForm(false)
        fetchVictories()
      }
    } catch {
      console.error("Failed to create victory")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-7">

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#152060]">Victory Tracker</h2>
          <p className="mt-0.5 text-sm text-[#152060]/50">
            Celebrate your achievements and personal wins, big or small.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className={[
            "shrink-0 border-0 font-semibold",
            showForm
              ? "bg-[#152060]/10 text-[#152060] hover:bg-[#152060]/15"
              : "bg-[#152060] text-white hover:bg-[#1e3280]",
          ].join(" ")}
        >
          {showForm ? (
            <>
              <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
              New Victory
            </>
          )}
        </Button>
      </div>

      {/* ── FORM ──────────────────────────────────────────────────────── */}
      {showForm && (
        <div className="rounded-2xl border border-[#152060]/8 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-[#152060]">Record a new victory</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category pills */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#152060]">Category</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Victory category">
                {CATEGORIES.map((cat) => {
                  const val = cat.toLowerCase()
                  const selected = formData.category === val
                  const style = CATEGORY_STYLES[val] ?? CATEGORY_STYLES.general
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: val })}
                      aria-pressed={selected}
                      className={[
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                        selected
                          ? style + " scale-105 shadow-sm"
                          : "border-[#152060]/10 bg-[#f7f9ff] text-[#152060]/50 hover:border-[#152060]/20 hover:text-[#152060]/70",
                      ].join(" ")}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="v-title" className="block text-sm font-semibold text-[#152060]">
                What did you accomplish?
              </label>
              <input
                id="v-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Finished my assignment, opened up to a friend…"
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="v-desc" className="block text-sm font-semibold text-[#152060]">
                Tell us more{" "}
                <span className="font-normal text-[#152060]/40">(optional)</span>
              </label>
              <textarea
                id="v-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="How did this victory make you feel? What made it meaningful?"
                className={`${INPUT_CLASS} resize-none`}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full border-0 bg-[#CC1A2E] py-5 font-semibold text-white hover:bg-[#a8151f] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Recording…
                </>
              ) : (
                <>
                  <Trophy className="mr-2 h-4 w-4" aria-hidden="true" />
                  Record Victory 🎉
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {/* ── VICTORIES GRID ────────────────────────────────────────────── */}
      {fetchingVictories ? (
        <div className="flex items-center justify-center py-16">
          <Loader2
            className="h-6 w-6 animate-spin text-[#152060]/25"
            aria-label="Loading victories"
          />
        </div>
      ) : victories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#152060]/8 bg-[#f7f9ff] py-16 text-center">
          <Trophy className="mb-3 h-10 w-10 text-[#152060]/15" aria-hidden="true" />
          <p className="text-sm font-medium text-[#152060]/50">No victories yet</p>
          <p className="mt-1 text-xs text-[#152060]/35">
            Every small step counts. Record your first win!
          </p>
          <Button
            onClick={() => setShowForm(true)}
            size="sm"
            className="mt-4 border-0 bg-[#152060] text-white hover:bg-[#1e3280]"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Record your first victory
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {victories.map((victory) => {
            const catStyle =
              CATEGORY_STYLES[victory.category?.toLowerCase()] ??
              CATEGORY_STYLES.general

            return (
              <div
                key={victory.id}
                className="rounded-2xl border border-[#152060]/8 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${catStyle}`}
                  >
                    {victory.category || "General"}
                  </span>
                  <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
                </div>

                <h3 className="font-semibold text-[#152060]">{victory.title}</h3>

                {victory.description && (
                  <p className="mt-1.5 line-clamp-3 text-sm text-[#152060]/55">
                    {victory.description}
                  </p>
                )}

                <p className="mt-3 text-xs text-[#152060]/35">
                  {new Date(victory.created_at).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
