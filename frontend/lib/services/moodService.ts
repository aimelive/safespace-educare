import { apiCall, getToken } from "@/lib/api"

export async function recordMoodCheckin(mood: string, intensity: number, notes?: string) {
  const token = getToken()
  return apiCall("/api/moods/checkin", "POST", { mood, intensity, notes }, token)
}

export async function getMoodHistory(days = 30) {
  const token = getToken()
  return apiCall(`/api/moods/history?days=${days}`, "GET", undefined, token)
}
