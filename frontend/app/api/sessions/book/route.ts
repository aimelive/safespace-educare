import { type NextRequest, NextResponse } from "next/server"

// Shared sessions storage (in production, use a database)
const bookingSessions: any[] = [
  {
    id: "session-demo-1",
    student_id: "demo-student",
    counselor_id: "counselor1",
    counselor_name: "Dr. Sarah Johnson",
    student_name: "Anonymous Student",
    scheduled_date: "2025-11-28",
    scheduled_time: "10:00",
    topic: "Anxiety Management",
    status: "completed",
    notes: "Student showed improvement in breathing techniques",
    created_at: "2025-11-20T10:00:00Z",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const userStr = Buffer.from(token, "base64").toString()
    const user = JSON.parse(userStr)

    const { counselor_id, date, time, topic } = body

    // Find counselor name
    const counselors = [
      { id: "counselor1", name: "Dr. Sarah Johnson" },
      { id: "counselor2", name: "Mr. Michael Chen" },
      { id: "counselor3", name: "Ms. Emma Davis" },
    ]
    const counselor = counselors.find((c) => c.id === counselor_id)

    const newSession = {
      id: `session-${Date.now()}`,
      student_id: user.id,
      counselor_id,
      counselor_name: counselor?.name || "Counselor",
      student_name: user.name,
      scheduled_date: date,
      scheduled_time: time,
      topic,
      status: "pending",
      notes: "",
      created_at: new Date().toISOString(),
    }

    bookingSessions.push(newSession)

    return NextResponse.json(
      {
        session: newSession,
        message: "Session booked successfully! Your counselor will see this booking.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Failed to book session" }, { status: 400 })
  }
}

export function getBookedSessions() {
  return bookingSessions
}

export function updateSession(sessionId: string, updates: any) {
  const session = bookingSessions.find((s) => s.id === sessionId)
  if (session) {
    Object.assign(session, updates)
  }
  return session
}
