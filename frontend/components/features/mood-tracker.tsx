"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Flame, SmilePlus, Loader2, CheckCircle2 } from "lucide-react"

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const MOODS = [
  { label: "Happy",   emoji: "😊", active: "bg-emerald-500 border-emerald-500 text-white", idle: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { label: "Sad",     emoji: "😢", active: "bg-blue-500   border-blue-500   text-white", idle: "bg-blue-50   border-blue-200   text-blue-700"   },
  { label: "Anxious", emoji: "😰", active: "bg-orange-500 border-orange-500 text-white", idle: "bg-orange-50 border-orange-200 text-orange-700" },
  { label: "Calm",    emoji: "😌", active: "bg-teal-500   border-teal-500   text-white", idle: "bg-teal-50   border-teal-200   text-teal-700"   },
  { label: "Stressed",emoji: "😤", active: "bg-red-500    border-red-500    text-white", idle: "bg-red-50    border-red-200    text-red-700"    },
  { label: "Excited", emoji: "🤩", active: "bg-purple-500 border-purple-500 text-white", idle: "bg-purple-50 border-purple-200 text-purple-700" },
  { label: "Tired",   emoji: "😴", active: "bg-slate-500  border-slate-500  text-white", idle: "bg-slate-50  border-slate-200  text-slate-700"  },
  { label: "Neutral", emoji: "😐", active: "bg-gray-500   border-gray-500   text-white", idle: "bg-gray-50   border-gray-200   text-gray-700"   },
]

const INTENSITY_LABELS: Record<number, string> = {
  1: "Very low", 2: "Low", 3: "Slightly low", 4: "Below average",
  5: "Average", 6: "Above average", 7: "Fairly high", 8: "High",
  9: "Very high", 10: "Extreme",
}

const INPUT_CLASS =
  "w-full rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-[#152060] placeholder:text-[#152060]/30 transition-all focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState("")
  const [history, setHistory] = useState<any[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchMoodHistory()
  }, [])

  const fetchMoodHistory = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/moods/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setHistory(data.moods || [])
      setStreak(data.streak || 0)
    } catch {
      console.error("Failed to fetch mood history")
    }
  }

  const handleSubmit = async () => {
    if (!selectedMood) return
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/moods/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mood: selectedMood, intensity, notes }),
      })
      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setSelectedMood(null)
          setIntensity(5)
          setNotes("")
          fetchMoodHistory()
        }, 1800)
      }
    } catch {
      console.error("Failed to submit mood")
    } finally {
      setLoading(false)
    }
  }

  const moodData = MOODS.find((m) => m.label === selectedMood)

  return (
    <div className="space-y-7">

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#152060]">Mood Check-in</h2>
          <p className="mt-0.5 text-sm text-[#152060]/50">How are you feeling right now?</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5">
          <Flame className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
          <span className="text-sm font-bold text-orange-600">{streak}</span>
          <span className="text-xs text-orange-500">day streak</span>
        </div>
      </div>

      {/* ── MOOD SELECTOR ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-6">
        <p className="mb-4 text-sm font-semibold text-[#152060]">Select your mood</p>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {MOODS.map((mood) => {
            const active = selectedMood === mood.label
            return (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                aria-pressed={active}
                className={[
                  "flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3.5 transition-all duration-150",
                  active
                    ? mood.active + " scale-[1.03] shadow-sm"
                    : mood.idle + " hover:scale-[1.02]",
                ].join(" ")}
              >
                <span className="text-2xl leading-none" aria-hidden="true">{mood.emoji}</span>
                <span className="text-xs font-semibold">{mood.label}</span>
              </button>
            )
          })}
        </div>

        {/* Intensity + notes */}
        {selectedMood && (
          <div className="mt-6 space-y-5 border-t border-[#152060]/8 pt-5">
            {/* Intensity slider */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-[#152060]">Intensity</label>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-[#152060]">{intensity}</span>
                  <span className="text-xs text-[#152060]/45">/10 — {INTENSITY_LABELS[intensity]}</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number.parseInt(e.target.value))}
                className="w-full accent-[#152060]"
                aria-label="Mood intensity"
              />
              <div className="mt-1 flex justify-between text-[10px] text-[#152060]/30">
                <span>Minimal</span>
                <span>Moderate</span>
                <span>Intense</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#152060]">
                Notes{" "}
                <span className="font-normal text-[#152060]/40">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind? Add any context about your mood…"
                className={`${INPUT_CLASS} resize-none`}
                rows={3}
              />
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={loading || submitted}
              className={[
                "w-full border-0 py-5 font-semibold text-white transition-all",
                submitted
                  ? "bg-emerald-500 hover:bg-emerald-500"
                  : "bg-[#CC1A2E] hover:bg-[#a8151f]",
              ].join(" ")}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Check-in saved!
                </>
              ) : loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                `Save — Feeling ${selectedMood} ${moodData?.emoji}`
              )}
            </Button>
          </div>
        )}
      </div>

      {/* ── HISTORY ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#152060]">Recent check-ins</h3>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <SmilePlus className="mb-2 h-8 w-8 text-[#152060]/15" aria-hidden="true" />
            <p className="text-sm text-[#152060]/45">
              No check-ins yet. Select a mood above to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 7).map((item, idx) => {
              const info = MOODS.find(
                (m) => m.label.toLowerCase() === item.mood?.toLowerCase()
              )
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl bg-[#f7f9ff] px-4 py-3"
                >
                  <span className="text-xl" aria-hidden="true">{info?.emoji ?? "😐"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold capitalize text-[#152060]">{item.mood}</p>
                    <p className="text-xs text-[#152060]/40">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-[#152060]/10">
                      <div
                        className="h-1.5 rounded-full bg-[#152060]/40 transition-all"
                        style={{ width: `${(item.intensity / 10) * 100}%` }}
                        aria-label={`Intensity ${item.intensity}/10`}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-medium text-[#152060]/50">
                      {item.intensity}/10
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
