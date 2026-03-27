"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Heart,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react"

const INPUT_CLASS =
  "w-full rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-[#152060] placeholder:text-[#152060]/30 transition-all focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/dashboard")
    } else {
      setChecking(false)
    }
  }, [router])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9ff]">
        <Loader2 className="h-6 w-6 animate-spin text-[#152060]/30" aria-label="Checking session" />
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("role", data.user.role)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9ff] flex items-center justify-center p-5 lg:p-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-[#152060]/8 shadow-2xl md:grid md:grid-cols-[0.85fr_1.15fr]">

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0d1a4f] via-[#152060] to-[#1e2d8a] p-10 text-white md:flex lg:p-12 min-h-[580px]">
          {/* Decorative blobs */}
          <div
            className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#CC1A2E]/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-white/8 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative space-y-10">
            {/* Back to home */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/55 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to home
            </Link>

            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Heart className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold">
                SafeSpace <span className="text-[#CC1A2E]">Educare</span>
              </span>
            </div>

            {/* Copy */}
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                Student wellbeing platform
              </div>
              <h1 className="text-3xl font-bold leading-tight lg:text-4xl">
                Welcome back to your safe space.
              </h1>
              <p className="text-sm leading-relaxed text-white/70">
                Continue your mental wellness journey with confidential sessions, supportive
                resources, and guided care.
              </p>
            </div>

            {/* Benefits list */}
            <ul className="space-y-3 text-sm text-white/80">
              {[
                "Confidential and secure sessions",
                "Anonymous support options",
                "Guided progress tracking",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle
                    className="h-4 w-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            {/* Quote card */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <blockquote className="text-sm italic leading-relaxed text-white/85">
                &ldquo;Your mental health is a priority, not a luxury.&rdquo;
              </blockquote>
              <p className="mt-2 text-xs text-white/40">— SafeSpace Educare</p>
            </div>
          </div>

          <p className="relative text-xs text-white/30 mt-5">
            © {new Date().getFullYear()} SafeSpace Educare
          </p>
        </aside>

        {/* ── FORM PANEL ───────────────────────────────────────────────────── */}
        <main className="flex items-center justify-center bg-white px-5 py-12 sm:px-10">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile header */}
            <div className="space-y-5 md:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#152060]/50 transition-colors hover:text-[#152060]"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back to home
              </Link>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#152060]">
                  <Heart className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-lg font-bold text-[#152060]">
                  SafeSpace <span className="text-[#CC1A2E]">Educare</span>
                </span>
              </div>
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-[#152060]/8 bg-[#f7f9ff] p-7 sm:p-9">
              <div className="mb-7 space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-[#152060]">
                  Sign in to your account
                </h2>
                <p className="text-sm text-[#152060]/55">
                  Access your dashboard and continue your wellness journey.
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#152060]"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152060]/30"
                      aria-hidden="true"
                    />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`${INPUT_CLASS} pl-10`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[#152060]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-medium text-[#CC1A2E] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152060]/30"
                      aria-hidden="true"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`${INPUT_CLASS} pl-10 pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#152060]/30 transition-colors hover:text-[#152060]/65"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full bg-[#CC1A2E] py-6 font-semibold text-white hover:bg-[#a8151f] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[#152060]/55">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-[#CC1A2E] hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
