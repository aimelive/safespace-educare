import { type NextRequest, NextResponse } from "next/server"

// Mock sessions storage (shared with book endpoint)
const mockSessions = [
  {
    id: "session1",
    student_id: "student1",
    counselor_id: "counselor1",
    counselor_name: "Dr. Sarah Johnson",
    scheduled_date: "2025-11-28",
    scheduled_time: "10:00",
    topic: "School Stress",
    status: "completed",
    notes: "Discussed coping strategies",
  },
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const userStr = Buffer.from(token, "base64").toString()
    const user = JSON.parse(userStr)

    // Return sessions for this student
    const userSessions = mockSessions.filter((s) => s.student_id === user.id)

    return NextResponse.json(userSessions || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 400 })
  }
}
