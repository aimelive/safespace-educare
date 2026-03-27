"use client"

import { useEffect, useState } from "react"
import ResourceLibrary from "@/components/features/resource-library"
import AdminResourceManager from "@/components/features/admin-resource-manager"

export default function ResourcesPage() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null")
      setRole(user?.role ?? "student")
    } catch {
      setRole("student")
    }
  }, [])

  if (role === null) return null
  if (role === "admin") return <AdminResourceManager />
  return <ResourceLibrary />
}
