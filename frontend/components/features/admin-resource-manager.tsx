"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Search,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
} from "lucide-react"

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CATEGORIES = ["Article", "Book", "Video", "Exercise", "Psychology", "Other"]

const CATEGORY_COLORS: Record<string, string> = {
  Article:    "bg-blue-50 text-blue-600",
  Book:       "bg-amber-50 text-amber-600",
  Video:      "bg-red-50 text-red-600",
  Exercise:   "bg-emerald-50 text-emerald-600",
  Psychology: "bg-purple-50 text-purple-600",
  Other:      "bg-gray-100 text-gray-600",
}

const INPUT_CLASS =
  "w-full rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-sm text-[#152060] placeholder:text-[#152060]/30 transition-all focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"

const EMPTY_FORM = {
  title: "",
  description: "",
  url: "",
  category: "Article",
  type: "",
  is_active: true,
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function AdminResourceManager() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")

  // Form / panel state
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchResources = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resources/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (res.ok) {
        const data = await res.json()
        setResources(Array.isArray(data) ? data : [])
      }
    } catch {
      console.error("Failed to fetch resources")
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchResources() }, [fetchResources])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openCreate = () => {
    setForm({ ...EMPTY_FORM })
    setEditingId(null)
    setSavedOk(false)
    setPanelMode("create")
  }

  const openEdit = (resource: any) => {
    setForm({
      title:       resource.title       ?? "",
      description: resource.description ?? "",
      url:         resource.url         ?? "",
      category:    resource.category    ?? "Article",
      type:        resource.type        ?? "",
      is_active:   resource.is_active   ?? true,
    })
    setEditingId(resource.id)
    setSavedOk(false)
    setPanelMode("edit")
  }

  const closePanel = () => {
    setPanelMode(null)
    setEditingId(null)
    setSavedOk(false)
  }

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.url.trim() || !form.category) return
    setSaving(true)
    setSavedOk(false)
    try {
      const isEdit = panelMode === "edit" && editingId
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resources${isEdit ? `/${editingId}` : ""}`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title:       form.title.trim(),
            description: form.description.trim() || undefined,
            url:         form.url.trim(),
            category:    form.category,
            type:        form.type.trim() || undefined,
            is_active:   form.is_active,
          }),
        },
      )
      if (res.ok) {
        const saved = await res.json()
        setResources((prev) =>
          isEdit
            ? prev.map((r) => (r.id === saved.id ? saved : r))
            : [saved, ...prev],
        )
        setSavedOk(true)
        if (!isEdit) {
          setForm({ ...EMPTY_FORM })
          setTimeout(closePanel, 1200)
        } else {
          setTimeout(() => setSavedOk(false), 3000)
        }
      }
    } catch {
      console.error("Failed to save resource")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (resource: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resources/${resource.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_active: !resource.is_active }),
        },
      )
      if (res.ok) {
        const updated = await res.json()
        setResources((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      }
    } catch {
      console.error("Failed to toggle resource")
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resources/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      )
      if (res.ok) {
        setResources((prev) => prev.filter((r) => r.id !== id))
        if (editingId === id) closePanel()
      }
    } catch {
      console.error("Failed to delete resource")
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  // ── Filtered list ─────────────────────────────────────────────────────────

  const filtered = resources.filter((r) => {
    const term = search.toLowerCase()
    const matchSearch =
      !term ||
      (r.title ?? "").toLowerCase().includes(term) ||
      (r.description ?? "").toLowerCase().includes(term) ||
      (r.category ?? "").toLowerCase().includes(term)
    const matchCategory =
      filterCategory === "All" || r.category === filterCategory
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && r.is_active) ||
      (filterStatus === "inactive" && !r.is_active)
    return matchSearch && matchCategory && matchStatus
  })

  const activeCount   = resources.filter((r) => r.is_active).length
  const inactiveCount = resources.filter((r) => !r.is_active).length

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#152060]">
            Resource Management
          </h2>
          <p className="mt-0.5 text-sm text-[#152060]/50">
            Create, edit, and manage all mental health resources.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="shrink-0 border-0 bg-[#152060] font-semibold text-white hover:bg-[#1e3280]"
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add Resource
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",    value: resources.length, active: filterStatus === "all",      onClick: () => setFilterStatus("all") },
          { label: "Active",   value: activeCount,      active: filterStatus === "active",   onClick: () => setFilterStatus("active") },
          { label: "Inactive", value: inactiveCount,    active: filterStatus === "inactive", onClick: () => setFilterStatus("inactive") },
        ].map(({ label, value, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={[
              "rounded-2xl border p-4 text-left transition-all",
              active
                ? "border-[#152060]/30 bg-[#152060]/5"
                : "border-[#152060]/8 bg-white hover:border-[#152060]/20",
            ].join(" ")}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[#152060]/50">
              {label}
            </p>
            <p className="mt-0.5 text-3xl font-bold text-[#152060]">{value}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        {/* ── Resource list ─────────────────────────────────────────────── */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Search + category filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152060]/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description, or category…"
                className={`${INPUT_CLASS} pl-9`}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={[
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    filterCategory === cat
                      ? "bg-[#152060] text-white"
                      : "bg-white text-[#152060]/55 hover:bg-[#f7f9ff] hover:text-[#152060]",
                  ].join(" ")}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-[#152060]/40" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#152060]/15 bg-[#f7f9ff] py-16 text-center">
              <BookOpen className="mb-3 h-10 w-10 text-[#152060]/15" aria-hidden="true" />
              <p className="text-sm font-medium text-[#152060]/60">
                {resources.length === 0 ? "No resources yet" : "No resources match your filter"}
              </p>
              {resources.length === 0 && (
                <Button
                  onClick={openCreate}
                  className="mt-4 border-0 bg-[#152060] text-white hover:bg-[#1e3280]"
                  size="sm"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add your first resource
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((resource) => {
                const catColor = CATEGORY_COLORS[resource.category] ?? "bg-gray-100 text-gray-600"
                const isDeleting = deletingId === resource.id
                const isActive = panelMode === "edit" && editingId === resource.id

                return (
                  <div
                    key={resource.id}
                    className={[
                      "rounded-xl border bg-white px-4 py-3.5 transition-all",
                      isActive
                        ? "border-[#152060]/25 shadow-sm"
                        : "border-[#152060]/8 hover:border-[#152060]/20",
                      !resource.is_active ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${catColor}`}>
                            {resource.category}
                          </span>
                          {resource.type && (
                            <span className="rounded-full bg-[#f7f9ff] px-2.5 py-0.5 text-[10px] font-medium text-[#152060]/45">
                              {resource.type}
                            </span>
                          )}
                          <span
                            className={[
                              "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                              resource.is_active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-500",
                            ].join(" ")}
                          >
                            {resource.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="truncate font-semibold text-[#152060]">
                          {resource.title}
                        </p>
                        {resource.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-[#152060]/50">
                            {resource.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-1.5">
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#152060]/30 transition-colors hover:bg-[#f7f9ff] hover:text-[#152060]"
                            title="Open resource"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => handleToggleActive(resource)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#152060]/30 transition-colors hover:bg-[#f7f9ff] hover:text-[#152060]"
                          title={resource.is_active ? "Deactivate" : "Activate"}
                        >
                          {resource.is_active
                            ? <EyeOff className="h-3.5 w-3.5" />
                            : <Eye className="h-3.5 w-3.5" />
                          }
                        </button>

                        <button
                          onClick={() => openEdit(resource)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#152060]/30 transition-colors hover:bg-[#f7f9ff] hover:text-[#152060]"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {confirmDeleteId === resource.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(resource.id)}
                              disabled={isDeleting}
                              className="rounded-lg bg-red-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                            >
                              {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-lg px-2 py-1 text-[10px] font-semibold text-[#152060]/50 hover:bg-[#f7f9ff]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(resource.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#152060]/30 transition-colors hover:bg-red-50 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Create / Edit panel ───────────────────────────────────────── */}
        {panelMode && (
          <div className="w-full rounded-2xl border border-[#152060]/15 bg-white p-6 shadow-sm lg:w-80 lg:shrink-0">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-bold text-[#152060]">
                {panelMode === "create" ? "New Resource" : "Edit Resource"}
              </h3>
              <button
                onClick={closePanel}
                className="rounded-lg p-1.5 text-[#152060]/35 hover:bg-[#f7f9ff] hover:text-[#152060]"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-[#152060]/40">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleField}
                  placeholder="Resource title"
                  required
                  className={INPUT_CLASS}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-[#152060]/40">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleField}
                  placeholder="Brief description of the resource…"
                  rows={3}
                  className={`${INPUT_CLASS} resize-none`}
                />
              </div>

              {/* URL */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-[#152060]/40">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  name="url"
                  type="url"
                  value={form.url}
                  onChange={handleField}
                  placeholder="https://example.com/resource"
                  required
                  className={INPUT_CLASS}
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-[#152060]/40">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleField}
                  required
                  className={INPUT_CLASS}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-[#152060]/40">
                  Type <span className="text-[#152060]/30 normal-case font-normal">(optional sub-label)</span>
                </label>
                <input
                  name="type"
                  value={form.type}
                  onChange={handleField}
                  placeholder="e.g. PDF, Guide, Podcast"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between rounded-xl bg-[#f7f9ff] px-4 py-3">
                <span className="text-sm font-medium text-[#152060]">Visible to students</span>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
                  className={[
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                    form.is_active ? "bg-emerald-500" : "bg-[#152060]/20",
                  ].join(" ")}
                  aria-checked={form.is_active}
                  role="switch"
                >
                  <span
                    className={[
                      "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                      form.is_active ? "translate-x-6" : "translate-x-1",
                    ].join(" ")}
                  />
                </button>
              </div>

              {/* Success banner */}
              {savedOk && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {panelMode === "create" ? "Resource created!" : "Changes saved!"}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={saving || !form.title.trim() || !form.url.trim()}
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
                    {panelMode === "create" ? "Create Resource" : "Save Changes"}
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
