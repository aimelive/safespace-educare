import { apiCall, getToken } from "@/lib/api"

export async function createVictory(title: string, description?: string, category?: string) {
  const token = getToken()
  return apiCall("/api/victories", "POST", { title, description, category }, token)
}

export async function getUserVictories() {
  const token = getToken()
  return apiCall("/api/victories", "GET", undefined, token)
}
