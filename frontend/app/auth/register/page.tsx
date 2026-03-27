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
  User,
  GraduationCap,
  Stethoscope,
  ShieldCheck,
  AlertCircle,
  School,
} from "lucide-react"

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-full rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-[#152060] placeholder:text-[#152060]/30 transition-all focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"

const ROLES = [
  {
    value: "student",
    label: "Student",
    description: "Counseling & resources",
    icon: GraduationCap,
  },
  {
    value: "counselor",
    label: "Counselor",
    description: "Support students",
    icon: Stethoscope,
  },
  {
    value: "admin",
    label: "Admin",
    description: "School oversight",
    icon: ShieldCheck,
  },
]

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    school: "",
    role: "student",
  })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
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
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0d1a4f] via-[#152060] to-[#1e2d8a] p-10 text-white md:flex lg:p-12">
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
                Safe and student-first care
              </div>
              <h1 className="text-3xl font-bold leading-tight lg:text-4xl">
                Start your mental wellness journey.
              </h1>
              <p className="text-sm leading-relaxed text-white/70">
                Join SafeSpace Educare to access counseling, anonymous support, and practical
                resources for better mental wellbeing.
              </p>
            </div>

            {/* Benefits list */}
            <ul className="space-y-3 text-sm text-white/80">
              {[
                "Free for all students",
                "Anonymous options always available",
                "Privacy-focused experience",
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

            {/* Mini how-it-works */}
            <div className="space-y-3">
              {[
                { n: "01", label: "Create your safe account" },
                { n: "02", label: "Choose your support path" },
                { n: "03", label: "Build healthy momentum" },
              ].map(({ n, label }) => (
                <div key={n} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-[#CC1A2E]">
                    {n}
                  </span>
                  <span className="text-sm text-white/65">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-white/30">
            © {new Date().getFullYear()} SafeSpace Educare
          </p>
        </aside>

        {/* ── FORM PANEL ───────────────────────────────────────────────────── */}
        <main className="flex items-center justify-center bg-white px-5 py-12 sm:px-10">
          <div className="w-full max-w-lg space-y-8">
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
                  Create your account
                </h2>
                <p className="text-sm text-[#152060]/55">
                  Set up your profile and access support tailored to your role.
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
                {/* Role selector — visual cards */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#152060]">I am a…</p>
                  <div className="grid grid-cols-3 gap-3" role="group" aria-label="Account type">
                    {ROLES.map(({ value, label, description, icon: Icon }) => {
                      const selected = formData.role === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: value })}
                          aria-pressed={selected}
                          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3.5 text-center transition-all duration-150 ${
                            selected
                              ? "border-[#152060] bg-[#152060]/5"
                              : "border-[#152060]/10 bg-[#f7f9ff] hover:border-[#152060]/25 hover:bg-white"
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                              selected
                                ? "bg-[#152060] text-white"
                                : "bg-white text-[#152060]/45"
                            }`}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div>
                            <p
                              className={`text-xs font-semibold ${
                                selected ? "text-[#152060]" : "text-[#152060]/65"
                              }`}
                            >
                              {label}
                            </p>
                            <p className="mt-0.5 hidden text-[10px] leading-tight text-[#152060]/40 sm:block">
                              {description}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Full name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#152060]"
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152060]/30"
                      aria-hidden="true"
                    />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`${INPUT_CLASS} pl-10`}
                    />
                  </div>
                </div>

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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#152060]"
                  >
                    Password
                  </label>
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

                {/* Age — required for all roles */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-[#152060]"
                  >
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min={1}
                    className={INPUT_CLASS}
                  />
                </div>

                {/* Conditional: Student school field */}
                {formData.role === "student" && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="school"
                      className="block text-sm font-medium text-[#152060]"
                    >
                      School{" "}
                      <span className="font-normal text-[#152060]/40">(optional)</span>
                    </label>
                    <div className="relative">
                      <School
                        className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152060]/30"
                        aria-hidden="true"
                      />
                      <input
                        id="school"
                        type="text"
                        name="school"
                        placeholder="Your school"
                        value={formData.school}
                        onChange={handleChange}
                        className={`${INPUT_CLASS} pl-10`}
                      />
                    </div>
                  </div>
                )}

                {/* Conditional: Counselor school field */}
                {formData.role === "counselor" && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="school-counselor"
                      className="block text-sm font-medium text-[#152060]"
                    >
                      School name
                    </label>
                    <div className="relative">
                      <School
                        className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152060]/30"
                        aria-hidden="true"
                      />
                      <input
                        id="school-counselor"
                        type="text"
                        name="school"
                        placeholder="Your school"
                        value={formData.school}
                        onChange={handleChange}
                        className={`${INPUT_CLASS} pl-10`}
                      />
                    </div>
                  </div>
                )}

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
                      Creating account…
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[#152060]/55">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-[#CC1A2E] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
