import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users: Record<string, any> = {}

export async function POST(request: NextRequest) {
  const { action, email, password, name } = await request.json()

  if (action === "signup") {
    if (users[email]) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    users[email] = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password, // In production, hash this with bcrypt
      createdAt: new Date(),
      isPremium: false,
      settings: { theme: "light", notifications: true },
    }

    return NextResponse.json({
      user: { id: users[email].id, name, email },
      token: "mock-jwt-token-" + users[email].id,
    })
  }

  if (action === "login") {
    const user = users[email]
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
      token: "mock-jwt-token-" + user.id,
    })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
