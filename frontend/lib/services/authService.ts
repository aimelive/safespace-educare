import { apiCall } from "@/lib/api"

export async function register(name: string, email: string, password: string, age?: number, school?: string) {
  return apiCall("/api/auth/register", "POST", {
    name,
    email,
    password,
    age,
    school,
    role: "student",
  })
}

export async function login(email: string, password: string) {
  return apiCall("/api/auth/login", "POST", { email, password })
}

export async function getCurrentUser(token: string) {
  return apiCall("/api/auth/me", "GET", undefined, token)
}

export function setAuth(token: string, user: any) {
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}
