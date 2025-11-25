import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 })
    }

    const moods = await db.collection("moods").find({ userId }).sort({ date: -1 }).toArray()
    return NextResponse.json(moods)
  } catch (error) {
    console.log("[v0] Error fetching moods:", error)
    return NextResponse.json({ error: "Failed to fetch moods" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const { userId, mood, label, date, notes } = await request.json()

    if (!userId || !mood) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const moodEntry = {
      userId,
      mood,
      label,
      date: date || new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      notes: notes || "",
      createdAt: new Date(),
    }

    const result = await db.collection("moods").insertOne(moodEntry)
    return NextResponse.json({ ...moodEntry, _id: result.insertedId })
  } catch (error) {
    console.log("[v0] Error creating mood:", error)
    return NextResponse.json({ error: "Failed to create mood" }, { status: 500 })
  }
}
