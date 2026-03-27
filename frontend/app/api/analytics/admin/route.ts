import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const adminData = {
      totalStudents: 245,
      totalSessions: 156,
      totalCounselors: 3,
      totalResources: 48,
      satisfactionRate: 92,
      weeklyTrends: {
        sessionsBooked: 24,
        resourcesAccessed: 87,
        checkinsCompleted: 156,
        newStudents: 12,
      },
      commonTopics: [
        { name: "Academic Pressure", count: 42 },
        { name: "Anxiety & Stress", count: 35 },
        { name: "Family Issues", count: 28 },
        { name: "Social Relationships", count: 18 },
        { name: "Self-Esteem", count: 15 },
      ],
    }

    return NextResponse.json(adminData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 })
  }
}
