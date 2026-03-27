"use client"

import { useState, useCallback } from "react"
import { apiCall, getToken } from "@/lib/api"

export function useApi<T>(endpoint: string, method = "GET", body?: any) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getToken()
      const result = await apiCall(endpoint, method, body, token)
      setData(result)
      return result
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [endpoint, method, body])

  return { data, loading, error, execute }
}
