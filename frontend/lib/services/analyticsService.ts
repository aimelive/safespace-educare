import { apiCall, getToken } from "@/lib/api"

export async function getDashboardAnalytics() {
  const token = getToken()
  return apiCall("/api/analytics/dashboard", "GET", undefined, token)
}
