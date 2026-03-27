"use client"

import { useEffect, useState } from "react"
import StudentHome from "@/components/student-dashboard"
import CounselorDashboard from "@/components/counselor-dashboard"
import AdminDashboard from "@/components/admin-dashboard"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) setUser(JSON.parse(userData))
  }, [])

  if (!user) return null

  return (
    <>
      {user.role === "student" && <StudentHome user={user} />}
      {user.role === "counselor" && <CounselorDashboard user={user} />}
      {user.role === "admin" && <AdminDashboard user={user} />}
    </>
  )
}
