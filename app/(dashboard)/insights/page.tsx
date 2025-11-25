"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function InsightsPage() {
  const [moodLogs, setMoodLogs] = useState<any[]>([])
  const [entries, setEntries] = useState<any[]>([])
  const [moodChartData, setMoodChartData] = useState<any[]>([])
  const [moodTrendData, setMoodTrendData] = useState<any[]>([])
  const [userId, setUserId] = useState<string>("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserId(user.id)
      fetchMoods(user.id)
      fetchEntries(user.id)
    }

    // Fall back to localStorage
    const savedMoods = localStorage.getItem("moodLogs")
    const savedEntries = localStorage.getItem("journalEntries")
    if (savedMoods) setMoodLogs(JSON.parse(savedMoods))
    if (savedEntries) setEntries(JSON.parse(savedEntries))
  }, [])

  const fetchMoods = async (uid: string) => {
    try {
      const response = await fetch(`/api/moods?userId=${uid}`)
      if (response.ok) {
        const data = await response.json()
        setMoodLogs(data)
        processChartData(data)
      }
    } catch (error) {
      console.log("[v0] Error fetching moods:", error)
    }
  }

  const fetchEntries = async (uid: string) => {
    try {
      const response = await fetch(`/api/entries?userId=${uid}`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (error) {
      console.log("[v0] Error fetching entries:", error)
    }
  }

  const processChartData = (logs: any[]) => {
    const moodCounts: Record<string, number> = {}
    const moodLabels: Record<string, string> = {
      "😊": "Happy",
      "😐": "Neutral",
      "😢": "Sad",
      "😰": "Anxious",
      "😴": "Tired",
    }

    logs.forEach((log: any) => {
      const label = log.label || moodLabels[log.mood]
      moodCounts[label] = (moodCounts[label] || 0) + 1
    })

    const chartData = Object.entries(moodCounts).map(([label, count]) => ({
      name: label,
      count: count as number,
    }))

    setMoodChartData(chartData)

    const last7Days: Record<string, Record<string, number>> = {}
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString()
      last7Days[dateStr] = {}
    }

    logs.forEach((log: any) => {
      if (last7Days[log.date]) {
        const label = log.label || moodLabels[log.mood]
        last7Days[log.date][label] = (last7Days[log.date][label] || 0) + 1
      }
    })

    const trendData = Object.entries(last7Days).map(([date, moods]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      happy: moods["Happy"] || 0,
      neutral: moods["Neutral"] || 0,
      sad: moods["Sad"] || 0,
      anxious: moods["Anxious"] || 0,
      tired: moods["Tired"] || 0,
    }))

    setMoodTrendData(trendData)
  }

  const totalMoods = moodLogs.length
  const mostCommonMood =
    moodChartData.length > 0 ? moodChartData.reduce((max, curr) => (curr.count > max.count ? curr : max)).name : "N/A"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Insights</h1>
        <p className="text-muted-foreground">Understand your wellness patterns</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center border-border/40 bg-gradient-to-br from-primary/5 to-transparent">
          <p className="text-3xl mb-2">📝</p>
          <p className="text-2xl font-bold text-foreground">{entries.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Entries</p>
        </Card>

        <Card className="p-4 text-center border-border/40 bg-gradient-to-br from-primary/5 to-transparent">
          <p className="text-3xl mb-2">🔥</p>
          <p className="text-2xl font-bold text-foreground">7</p>
          <p className="text-sm text-muted-foreground mt-1">Day Streak</p>
        </Card>

        <Card className="p-4 text-center border-border/40 bg-gradient-to-br from-primary/5 to-transparent">
          <p className="text-3xl mb-2">😊</p>
          <p className="text-2xl font-bold text-foreground">{mostCommonMood}</p>
          <p className="text-sm text-muted-foreground mt-1">Most Common Mood</p>
        </Card>

        <Card className="p-4 text-center border-border/40 bg-gradient-to-br from-primary/5 to-transparent">
          <p className="text-3xl mb-2">😔</p>
          <p className="text-2xl font-bold text-foreground">{totalMoods}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Check-ins</p>
        </Card>
      </div>

      {moodChartData.length > 0 && (
        <Card className="p-6 border-border/40">
          <h3 className="font-semibold text-foreground mb-4">📊 Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moodChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-foreground)",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[8, 8, 0, 0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {moodTrendData.length > 0 && (
        <Card className="p-6 border-border/40">
          <h3 className="font-semibold text-foreground mb-4">📈 Mood Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-foreground)",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="happy" stroke="#22c55e" name="Happy" strokeWidth={2} />
              <Line type="monotone" dataKey="neutral" stroke="#3b82f6" name="Neutral" strokeWidth={2} />
              <Line type="monotone" dataKey="sad" stroke="#a855f7" name="Sad" strokeWidth={2} />
              <Line type="monotone" dataKey="anxious" stroke="#f97316" name="Anxious" strokeWidth={2} />
              <Line type="monotone" dataKey="tired" stroke="#64748b" name="Tired" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Insights */}
      <div className="space-y-4">
        <Card className="p-6 border-border/40">
          <h3 className="font-semibold text-foreground mb-3">📊 Mood Trends</h3>
          <p className="text-muted-foreground text-sm">
            {moodLogs.length > 0
              ? `You've logged ${totalMoods} mood check-ins. Your most common mood is ${mostCommonMood}. Keep tracking to see patterns emerge!`
              : "Start logging your moods to see trends appear here."}
          </p>
        </Card>

        <Card className="p-6 border-border/40">
          <h3 className="font-semibold text-foreground mb-3">✍️ Journaling Activity</h3>
          <p className="text-muted-foreground text-sm">
            {entries.length > 0
              ? `Great work! You've written ${entries.length} journal entries. Keep expressing yourself!`
              : "Start journaling to build a consistent practice."}
          </p>
        </Card>

        <Card className="p-6 border-border/40">
          <h3 className="font-semibold text-foreground mb-3">💡 Breathing Insights</h3>
          <p className="text-muted-foreground text-sm">
            You've completed breathing exercises. Keep building this healthy habit for better emotional regulation.
          </p>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-border/40">
        <h3 className="font-semibold text-foreground mb-3">💡 Personalized Recommendations</h3>
        <ul className="space-y-2 text-muted-foreground text-sm">
          <li>• Try journaling consistently to track patterns</li>
          <li>• Log moods regularly to understand your emotional patterns</li>
          <li>• Consider a breathing exercise when you feel anxious</li>
        </ul>
      </Card>
    </div>
  )
}
