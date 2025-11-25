import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 })
    }

    const entries = await db.collection("entries").find({ userId }).sort({ date: -1 }).toArray()
    return NextResponse.json(entries)
  } catch (error) {
    console.log("[v0] Error fetching entries:", error)
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const { userId, title, content, mood, date } = await request.json()

    if (!userId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const entry = {
      userId,
      title,
      content,
      mood,
      date: date || new Date().toLocaleDateString(),
      createdAt: new Date(),
    }

    const result = await db.collection("entries").insertOne(entry)
    return NextResponse.json({ ...entry, _id: result.insertedId })
  } catch (error) {
    console.log("[v0] Error creating entry:", error)
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
  }
}
