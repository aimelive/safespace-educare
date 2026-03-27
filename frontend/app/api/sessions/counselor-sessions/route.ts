import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const userStr = Buffer.from(token, "base64").toString()
    const user = JSON.parse(userStr)

    const bookApiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/sessions/book`

    // Mock sessions for this counselor - in real app, query database
    const mockSessions = [
      {
        id: "session1",
        student_id: "student-001",
        student_name: "Student A",
        counselor_id: user.id,
        scheduled_date: "2025-11-28",
        scheduled_time: "10:00",
        topic: "Anxiety Management",
        status: "completed",
        notes: "Student showed improvement in breathing techniques",
        created_at: "2025-11-20T10:00:00Z",
      },
      {
        id: "session2",
        student_id: "student-002",
        student_name: "Student B",
        counselor_id: user.id,
        scheduled_date: "2025-11-29",
        scheduled_time: "14:00",
        topic: "Family Conflict",
        status: "pending",
        notes: "",
        created_at: "2025-11-21T14:00:00Z",
      },
      {
        id: "session3",
        student_id: "student-003",
        student_name: "Student C",
        counselor_id: user.id,
        scheduled_date: "2025-11-30",
        scheduled_time: "15:30",
        topic: "Academic Pressure",
        status: "pending",
        notes: "",
        created_at: "2025-11-22T15:30:00Z",
      },
    ]

    return NextResponse.json(mockSessions)
  } catch (error) {
    console.error("Error fetching counselor sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 400 })
  }
}
