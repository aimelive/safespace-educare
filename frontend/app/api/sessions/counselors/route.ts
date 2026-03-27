import { type NextRequest, NextResponse } from "next/server"

// Mock counselors data
const mockCounselors = [
  {
    id: "counselor1",
    name: "Dr. Sarah Johnson",
    specialization: "Anxiety & Stress",
    available: true,
    availability: ["09:00", "10:00", "14:00", "15:00"],
  },
  {
    id: "counselor2",
    name: "Mr. Michael Chen",
    specialization: "Academic Pressure",
    available: true,
    availability: ["10:00", "11:00", "13:00", "16:00"],
  },
  {
    id: "counselor3",
    name: "Ms. Emma Davis",
    specialization: "Family Issues",
    available: true,
    availability: ["09:30", "11:30", "14:30", "15:30"],
  },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(mockCounselors)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch counselors" }, { status: 500 })
  }
}
