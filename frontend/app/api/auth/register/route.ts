import { type NextRequest, NextResponse } from "next/server"

// Mock database of users
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role, age, school } = body

    // Simulate user creation
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      age: role === "student" ? age : undefined,
      school: school || "Default School",
      created_at: new Date().toISOString(),
    }

    users.push({ ...newUser, password })

    // Create mock token
    const token = Buffer.from(JSON.stringify(newUser)).toString("base64")

    return NextResponse.json(
      {
        token,
        user: newUser,
        message: "User registered successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 })
  }
}
