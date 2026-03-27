import { type NextRequest, NextResponse } from "next/server"

// Mock database (in real app, query actual DB)
const mockUsers = [
  {
    id: "counselor1",
    name: "Dr. Sarah Johnson",
    email: "sarah@safespace-educare.com",
    password: "password123",
    role: "counselor",
    school: "Central High School",
  },
  {
    id: "admin1",
    name: "Mr. James Wilson",
    email: "james@safespace-educare.com",
    password: "password123",
    role: "admin",
    school: "Central High School",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = Buffer.from(JSON.stringify(user)).toString("base64")
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      token,
      user: userWithoutPassword,
      message: "Login successful",
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 400 })
  }
}
