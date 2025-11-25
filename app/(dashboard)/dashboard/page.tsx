"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function Dashboard() {
  const [entries, setEntries] = useState<number>(0)
  const [moodLogs, setMoodLogs] = useState<number>(0)
  const [userId, setUserId] = useState<string>("")

  const motivationalQuotes = [
    "Your mental health is a priority, not a luxury.",
    "Progress, not perfection.",
    "Every day is a new opportunity to care for yourself.",
    "You are stronger than you think.",
    "Taking time to reflect is taking time to grow.",
  ]

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserId(user.id)
      fetchCounts(user.id)
    }

    // Fall back to localStorage
    const savedEntries = localStorage.getItem("journalEntries")
    const savedMoods = localStorage.getItem("moodLogs")
    if (savedEntries) setEntries(JSON.parse(savedEntries).length)
    if (savedMoods) setMoodLogs(JSON.parse(savedMoods).length)
  }, [])

  const fetchCounts = async (uid: string) => {
    try {
      const [entriesRes, moodsRes] = await Promise.all([
        fetch(`/api/entries?userId=${uid}`),
        fetch(`/api/moods?userId=${uid}`),
      ])

      if (entriesRes.ok) {
        const data = await entriesRes.json()
        setEntries(data.length)
      }
      if (moodsRes.ok) {
        const data = await moodsRes.json()
        setMoodLogs(data.length)
      }
    } catch (error) {
      console.log("[v0] Error fetching counts:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 border border-border/40">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Your Wellness Space</h1>
        <p className="text-muted-foreground mb-4 text-lg italic">"{randomQuote}"</p>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/journal">
          <Card className="p-6 hover:shadow-lg cursor-pointer transition-all h-full bg-gradient-to-br from-primary/5 to-transparent border-border/40">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-semibold text-foreground mb-2">Start Journaling</h3>
            <p className="text-sm text-muted-foreground">Express your thoughts</p>
          </Card>
        </Link>

        <Link href="/mood">
          <Card className="p-6 hover:shadow-lg cursor-pointer transition-all h-full bg-gradient-to-br from-secondary/5 to-transparent border-border/40">
            <div className="text-4xl mb-3">😊</div>
            <h3 className="font-semibold text-foreground mb-2">Log Mood</h3>
            <p className="text-sm text-muted-foreground">Track your emotions</p>
          </Card>
        </Link>

        <Link href="/breathing">
          <Card className="p-6 hover:shadow-lg cursor-pointer transition-all h-full bg-gradient-to-br from-accent/5 to-transparent border-border/40">
            <div className="text-4xl mb-3">🧘</div>
            <h3 className="font-semibold text-foreground mb-2">Breathing Exercise</h3>
            <p className="text-sm text-muted-foreground">Relax and focus</p>
          </Card>
        </Link>

        <Link href="/insights">
          <Card className="p-6 hover:shadow-lg cursor-pointer transition-all h-full bg-gradient-to-br from-primary/10 to-secondary/10 border-border/40">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-foreground mb-2">View Insights</h3>
            <p className="text-sm text-muted-foreground">See your progress</p>
          </Card>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-border/40">
          <div className="text-3xl font-bold text-primary mb-2">{entries}</div>
          <p className="text-muted-foreground">Journal Entries</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/5 to-transparent border-border/40">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-secondary">7</div>
            <span className="text-2xl animate-pulse">🔥</span>
          </div>
          <p className="text-muted-foreground">Day Streak</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/5 to-transparent border-border/40">
          <div className="text-3xl font-bold text-accent mb-2">{moodLogs}</div>
          <p className="text-muted-foreground">Mood Check-ins</p>
        </Card>
      </div>

      {/* Recent Entries */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Quick Stats</h2>
        <div className="space-y-3">
          {[
            { label: "Journal Entries", value: entries, icon: "📝" },
            { label: "Mood Check-ins", value: moodLogs, icon: "😊" },
            { label: "Consistency", value: "7 days", icon: "🔥" },
          ].map((stat, i) => (
            <Card key={i} className="p-4 hover:shadow-md transition-all border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <p className="text-foreground font-medium">{stat.label}</p>
                </div>
                <p className="text-lg font-bold text-primary">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
