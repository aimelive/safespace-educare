import { apiCall, getToken } from "@/lib/api"

export async function getResources(category?: string) {
  const url = category ? `/api/resources?category=${category}` : "/api/resources"
  return apiCall(url)
}

export async function saveResource(resource_id: number) {
  const token = getToken()
  return apiCall("/api/resources/save", "POST", { resource_id }, token)
}

export async function getSavedResources() {
  const token = getToken()
  return apiCall("/api/resources/saved", "GET", undefined, token)
}
