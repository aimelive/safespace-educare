import { apiCall, getToken } from "@/lib/api"

export async function getCounselors() {
  return apiCall("/api/sessions/counselors")
}

export async function bookSession(counselor_id: number, date: string, time: string, topic?: string) {
  const token = getToken()
  return apiCall("/api/sessions/book", "POST", { counselor_id, date, time, topic }, token)
}

export async function getStudentSessions() {
  const token = getToken()
  return apiCall("/api/sessions/my-sessions", "GET", undefined, token)
}

export async function getCounselorSessions() {
  const token = getToken()
  return apiCall("/api/sessions/counselor-sessions", "GET", undefined, token)
}

export async function updateSessionStatus(sessionId: number, status: string, notes?: string) {
  const token = getToken()
  return apiCall(`/api/sessions/${sessionId}`, "PATCH", { status, notes }, token)
}
