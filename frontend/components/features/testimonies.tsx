"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus, X, Heart, Loader2, Shield } from "lucide-react"

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-full rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-[#152060] placeholder:text-[#152060]/30 transition-all focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function Testimonies() {
  const [posts, setPosts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_anonymous: false,
  })
  const [loading, setLoading] = useState(false)
  const [fetchingPosts, setFetchingPosts] = useState(true)
  const [liked, setLiked] = useState<number[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setFetchingPosts(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`)
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch {
      console.error("Failed to fetch posts")
    } finally {
      setFetchingPosts(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setFormData({ title: "", content: "", is_anonymous: false })
        setShowForm(false)
        fetchPosts()
      }
    } catch {
      console.error("Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: number) => {
    if (liked.includes(postId)) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.ok) setLiked((prev) => [...prev, postId])
    } catch {
      console.error("Failed to like post")
    }
  }

  return (
    <div className="space-y-7">

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#152060]">
            Testimonies &amp; Inspiration
          </h2>
          <p className="mt-0.5 text-sm text-[#152060]/50">
            Share your story and inspire others on their journey.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className={[
            "shrink-0 border-0 font-semibold",
            showForm
              ? "bg-[#152060]/10 text-[#152060] hover:bg-[#152060]/15"
              : "bg-[#CC1A2E] text-white hover:bg-[#a8151f]",
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
              Share Story
            </>
          )}
        </Button>
      </div>

      {/* ── SHARE FORM ────────────────────────────────────────────────── */}
      {showForm && (
        <div className="rounded-2xl border border-[#152060]/8 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#CC1A2E]" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-[#152060]">Your story matters</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="post-title" className="block text-sm font-semibold text-[#152060]">
                Title
              </label>
              <input
                id="post-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give your story a title…"
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label
                htmlFor="post-content"
                className="block text-sm font-semibold text-[#152060]"
              >
                Your story
              </label>
              <textarea
                id="post-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your experience and what helped you through it…"
                className={`${INPUT_CLASS} resize-none`}
                rows={5}
                required
              />
            </div>

            {/* Anonymous toggle */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#152060]/10 bg-[#f7f9ff] px-4 py-3 transition-colors hover:bg-white">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.is_anonymous}
                  onChange={(e) =>
                    setFormData({ ...formData, is_anonymous: e.target.checked })
                  }
                  className="sr-only"
                />
                <div
                  className={[
                    "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                    formData.is_anonymous
                      ? "border-[#152060] bg-[#152060]"
                      : "border-[#152060]/25 bg-white",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {formData.is_anonymous && (
                    <span className="text-[10px] font-bold text-white">✓</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-[#152060]/45" aria-hidden="true" />
                <span className="text-sm font-medium text-[#152060]/65">
                  Post anonymously
                </span>
              </div>
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full border-0 bg-[#CC1A2E] py-5 font-semibold text-white hover:bg-[#a8151f] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Publishing…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  Publish Testimony
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {/* ── FEED ──────────────────────────────────────────────────────── */}
      {fetchingPosts ? (
        <div className="flex items-center justify-center py-16">
          <Loader2
            className="h-6 w-6 animate-spin text-[#152060]/25"
            aria-label="Loading stories"
          />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#152060]/8 bg-[#f7f9ff] py-16 text-center">
          <Sparkles className="mb-3 h-10 w-10 text-[#152060]/15" aria-hidden="true" />
          <p className="text-sm font-medium text-[#152060]/50">No stories yet</p>
          <p className="mt-1 text-xs text-[#152060]/35">
            Be the first to share your experience and inspire others.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isLiked = liked.includes(post.id)
            return (
              <div
                key={post.id}
                className="rounded-2xl border border-[#152060]/8 bg-white p-6 transition-all hover:shadow-sm"
              >
                {/* Post header */}
                <div className="mb-4">
                  <h3 className="font-bold text-[#152060]">{post.title}</h3>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-[#152060]/40">
                    {post.is_anonymous ? (
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" aria-hidden="true" />
                        Anonymous
                      </span>
                    ) : (
                      <span>By {post.author_name}</span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>
                      {new Date(post.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#152060]/65">
                  {post.content}
                </p>

                {/* Footer */}
                <div className="mt-5 border-t border-[#152060]/6 pt-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={isLiked}
                    aria-label={isLiked ? "Liked" : "Like this story"}
                    className={[
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                      isLiked
                        ? "bg-red-50 text-red-500"
                        : "text-[#152060]/40 hover:bg-red-50 hover:text-red-500",
                    ].join(" ")}
                  >
                    <Heart
                      className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                      aria-hidden="true"
                    />
                    {isLiked ? "Liked" : "Like"}
                    {post.likes > 0 && (
                      <span className="ml-0.5">
                        {post.likes + (isLiked ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
