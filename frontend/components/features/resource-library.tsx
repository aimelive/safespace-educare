"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, ExternalLink, Bookmark, BookmarkCheck, Loader2 } from "lucide-react"

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Psychology", "Exercise", "Book", "Article", "Video"]

const CATEGORY_COLORS: Record<string, string> = {
  Psychology: "bg-purple-50 text-purple-600",
  Exercise:   "bg-emerald-50 text-emerald-600",
  Book:       "bg-amber-50   text-amber-600",
  Article:    "bg-blue-50    text-blue-600",
  Video:      "bg-red-50     text-red-600",
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function ResourceLibrary() {
  const [resources, setResources] = useState<any[]>([])
  const [savedResources, setSavedResources] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)

  useEffect(() => {
    fetchResources()
    fetchSavedResources()
  }, [selectedCategory])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const url =
        selectedCategory && selectedCategory !== "All"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/resources?category=${selectedCategory}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/resources`
      const res = await fetch(url)
      const data = await res.json()
      setResources(Array.isArray(data) ? data : [])
    } catch {
      console.error("Failed to fetch resources")
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedResources = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSavedResources(Array.isArray(data) ? data.map((r: any) => r.id) : [])
    } catch {
      console.error("Failed to fetch saved resources")
    }
  }

  const handleSaveResource = async (resourceId: number) => {
    if (savedResources.includes(resourceId)) return
    setSavingId(resourceId)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resource_id: resourceId }),
      })
      if (res.ok) setSavedResources((prev) => [...prev, resourceId])
    } catch {
      console.error("Failed to save resource")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-7">

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#152060]">Resource Library</h2>
        <p className="mt-0.5 text-sm text-[#152060]/50">
          Curated articles, books, and exercises for your wellbeing.
        </p>
      </div>

      {/* ── CATEGORY FILTER ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active =
            (cat === "All" && !selectedCategory) || selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === "All" ? "" : cat)}
              className={[
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150",
                active
                  ? "border-[#152060] bg-[#152060] text-white"
                  : "border-[#152060]/10 bg-white text-[#152060]/55 hover:border-[#152060]/25 hover:text-[#152060]",
              ].join(" ")}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* ── RESOURCES GRID ────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2
            className="h-6 w-6 animate-spin text-[#152060]/25"
            aria-label="Loading resources"
          />
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#152060]/8 bg-[#f7f9ff] py-16 text-center">
          <BookOpen className="mb-3 h-10 w-10 text-[#152060]/15" aria-hidden="true" />
          <p className="text-sm font-medium text-[#152060]/50">No resources found</p>
          <p className="mt-1 text-xs text-[#152060]/35">
            Try a different category or check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {resources.map((resource) => {
            const saved = savedResources.includes(resource.id)
            const catColor =
              CATEGORY_COLORS[resource.category] ?? "bg-gray-50 text-gray-500"

            return (
              <div
                key={resource.id}
                className="flex flex-col rounded-2xl border border-[#152060]/8 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Badges */}
                <div className="mb-3 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${catColor}`}>
                    {resource.category}
                  </span>
                  {resource.type && (
                    <span className="rounded-full bg-[#f7f9ff] px-2.5 py-0.5 text-xs font-medium text-[#152060]/45">
                      {resource.type}
                    </span>
                  )}
                </div>

                <h3 className="mb-2 line-clamp-2 font-semibold text-[#152060]">
                  {resource.title}
                </h3>
                <p className="mb-4 flex-1 line-clamp-3 text-sm text-[#152060]/55">
                  {resource.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full border-0 bg-[#152060] text-white hover:bg-[#1e3280]"
                    >
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      View
                    </Button>
                  </a>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveResource(resource.id)}
                    disabled={savingId === resource.id}
                    aria-label={saved ? "Already saved" : "Save resource"}
                    className={
                      saved
                        ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                        : "border-[#152060]/15 text-[#152060]/55 hover:text-[#152060]"
                    }
                  >
                    {savingId === resource.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    ) : saved ? (
                      <BookmarkCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
