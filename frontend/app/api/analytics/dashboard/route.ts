import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const analyticsData = {
      totalSessions: 24,
      completedSessions: 18,
      highRiskCount: 2,
      commonIssues: [
        { topic: "Academic Pressure", count: 8 },
        { topic: "Anxiety", count: 6 },
        { topic: "Family Issues", count: 4 },
        { topic: "Social Relationships", count: 3 },
      ],
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
