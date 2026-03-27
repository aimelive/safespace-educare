"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CheckCircle2,
  Wind,
  MessageSquare,
  BookHeart,
  Dumbbell,
} from "lucide-react"

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Breathing:    Wind,
  Affirmations: MessageSquare,
  Journal:      BookHeart,
  Movement:     Dumbbell,
}

const CATEGORY_COLORS: Record<string, string> = {
  Breathing:    "bg-sky-50    text-sky-600    border-sky-200",
  Affirmations: "bg-purple-50 text-purple-600 border-purple-200",
  Journal:      "bg-amber-50  text-amber-600  border-amber-200",
  Movement:     "bg-emerald-50 text-emerald-600 border-emerald-200",
}

const EXERCISES = [
  {
    id: 1,
    title: "Box Breathing",
    category: "Breathing",
    description:
      "A simple 4-count breathing technique used by Navy SEALs to calm the nervous system and reduce anxiety fast.",
    duration: "5 min",
    steps: [
      "Find a comfortable position and gently close your eyes.",
      "Slowly exhale all the air from your lungs.",
      "Inhale slowly through your nose for 4 counts.",
      "Hold your breath for 4 counts.",
      "Exhale slowly through your mouth for 4 counts.",
      "Hold empty for 4 counts. Repeat 4–6 times.",
    ],
  },
  {
    id: 2,
    title: "Positive Affirmations",
    category: "Affirmations",
    description:
      "Repeat these powerful statements daily to rewire your mindset and build lasting self-confidence.",
    duration: "3 min",
    steps: [
      "Stand or sit in front of a mirror if possible.",
      "Take three deep breaths to center yourself.",
      "Say aloud: \"I am capable of handling anything.\"",
      "Say aloud: \"I am worthy of love and respect.\"",
      "Say aloud: \"I can handle challenges with grace.\"",
      "Say aloud: \"I am growing stronger every single day.\"",
    ],
  },
  {
    id: 3,
    title: "Gratitude Journal",
    category: "Journal",
    description:
      "Writing down what you're grateful for trains your brain to notice the positive — even on the hardest days.",
    duration: "5–10 min",
    steps: [
      "Find a quiet space free from distractions.",
      "Open a journal, notebook, or notes app.",
      "Write down 3 things you are genuinely grateful for.",
      "For each, write one sentence on why it matters to you.",
      "Read them aloud to yourself slowly.",
      "Close with one positive intention for the rest of the day.",
    ],
  },
  {
    id: 4,
    title: "Tension Release Stretch",
    category: "Movement",
    description:
      "A quick physical and mental reset sequence to release built-up tension in your body and mind.",
    duration: "7 min",
    steps: [
      "Stand up and shake out your hands and arms for 10 seconds.",
      "Roll your shoulders backward 5 times slowly.",
      "Tilt your head gently side to side — 3 times each way.",
      "Take 5 slow, deep breaths focusing only on the sensation of air.",
      "Tense every muscle in your body for 5 seconds, then fully release.",
      "Smile and say: \"I am releasing what I cannot control.\"",
    ],
  },
]

// ─── TYPES ────────────────────────────────────────────────────────────────────

import type React from "react"

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function ExercisesHub() {
  const [selectedExercise, setSelectedExercise] = useState<(typeof EXERCISES)[number] | null>(null)
  const [completed, setCompleted] = useState<number[]>([])
  const [activeStep, setActiveStep] = useState(0)

  const handleComplete = (id: number) => {
    if (!completed.includes(id)) setCompleted((prev) => [...prev, id])
  }

  // ── DETAIL VIEW ─────────────────────────────────────────────────────────────

  if (selectedExercise) {
    const CatIcon = CATEGORY_ICONS[selectedExercise.category] ?? BookHeart
    const catColor = CATEGORY_COLORS[selectedExercise.category] ?? ""
    const isCompleted = completed.includes(selectedExercise.id)
    const totalSteps = selectedExercise.steps.length

    return (
      <div className="space-y-6">
        {/* Back */}
        <button
          onClick={() => {
            setSelectedExercise(null)
            setActiveStep(0)
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#152060]/50 transition-colors hover:text-[#152060]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All exercises
        </button>

        {/* Detail card */}
        <div className="rounded-2xl border border-[#152060]/8 bg-white p-6">
          {/* Meta */}
          <div className="mb-6 flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${catColor}`}
            >
              <CatIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${catColor}`}
                >
                  {selectedExercise.category}
                </span>
                <span className="text-xs text-[#152060]/40">{selectedExercise.duration}</span>
              </div>
              <h3 className="text-lg font-bold text-[#152060]">{selectedExercise.title}</h3>
              <p className="mt-1 text-sm text-[#152060]/55">{selectedExercise.description}</p>
            </div>
          </div>

          {/* Progress bar */}
          {!isCompleted && (
            <div className="mb-5">
              <div className="mb-1.5 flex items-center justify-between text-xs text-[#152060]/45">
                <span>Progress</span>
                <span>{activeStep}/{totalSteps} steps</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#152060]/8">
                <div
                  className="h-1.5 rounded-full bg-[#152060]/50 transition-all duration-300"
                  style={{ width: `${(activeStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-2.5">
            {selectedExercise.steps.map((step, idx) => {
              const done = idx < activeStep || isCompleted
              const current = idx === activeStep && !isCompleted
              return (
                <div
                  key={idx}
                  className={[
                    "flex items-start gap-4 rounded-xl border p-4 transition-all",
                    done
                      ? "border-emerald-200 bg-emerald-50"
                      : current
                      ? "border-[#152060]/20 bg-[#f7f9ff] shadow-sm"
                      : "border-[#152060]/6 bg-white opacity-40",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      done
                        ? "bg-emerald-500 text-white"
                        : current
                        ? "bg-[#152060] text-white"
                        : "bg-[#152060]/10 text-[#152060]/35",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {done ? "✓" : idx + 1}
                  </div>
                  <p
                    className={[
                      "pt-0.5 text-sm",
                      done
                        ? "text-emerald-700"
                        : current
                        ? "font-medium text-[#152060]"
                        : "text-[#152060]/45",
                    ].join(" ")}
                  >
                    {step}
                  </p>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="mt-5">
            {isCompleted ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span className="text-sm font-semibold text-emerald-700">
                  Exercise completed! Great work.
                </span>
              </div>
            ) : (
              <Button
                onClick={() => {
                  if (activeStep < totalSteps - 1) {
                    setActiveStep((prev) => prev + 1)
                  } else {
                    handleComplete(selectedExercise.id)
                  }
                }}
                className="w-full border-0 bg-[#152060] py-5 font-semibold text-white hover:bg-[#1e3280]"
              >
                {activeStep < totalSteps - 1
                  ? `Next step (${activeStep + 2} / ${totalSteps})`
                  : "Complete exercise ✓"}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── GRID VIEW ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#152060]">
            Mental Health Exercises
          </h2>
          <p className="mt-0.5 text-sm text-[#152060]/50">
            Guided exercises to support your wellbeing.
          </p>
        </div>
        {completed.length > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            <span className="text-xs font-semibold text-emerald-700">
              {completed.length}/{EXERCISES.length} done
            </span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {EXERCISES.map((exercise) => {
          const CatIcon = CATEGORY_ICONS[exercise.category] ?? BookHeart
          const catColor = CATEGORY_COLORS[exercise.category] ?? ""
          const isDone = completed.includes(exercise.id)

          return (
            <div
              key={exercise.id}
              className={[
                "group rounded-2xl border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                isDone ? "border-emerald-200" : "border-[#152060]/8",
              ].join(" ")}
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${catColor}`}
                >
                  <CatIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                {isDone && (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span className="text-xs font-semibold">Done</span>
                  </div>
                )}
              </div>

              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${catColor}`}
                >
                  {exercise.category}
                </span>
                <span className="text-[10px] text-[#152060]/40">{exercise.duration}</span>
              </div>

              <h3 className="mt-1.5 font-semibold text-[#152060]">{exercise.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-[#152060]/55">
                {exercise.description}
              </p>

              <Button
                onClick={() => {
                  setSelectedExercise(exercise)
                  setActiveStep(0)
                }}
                size="sm"
                className={`mt-4 border-0 text-white ${
                  isDone
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-[#152060] hover:bg-[#1e3280]"
                }`}
              >
                {isDone ? "Redo exercise" : "Start exercise"}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
