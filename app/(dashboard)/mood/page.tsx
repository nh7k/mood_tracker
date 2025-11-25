"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const moods = [
  { emoji: "😊", label: "Happy", color: "from-green-400" },
  { emoji: "😐", label: "Neutral", color: "from-blue-400" },
  { emoji: "😢", label: "Sad", color: "from-purple-400" },
  { emoji: "😰", label: "Anxious", color: "from-orange-400" },
  { emoji: "😴", label: "Tired", color: "from-gray-400" },
]

export default function MoodPage() {
  const [moodLogs, setMoodLogs] = useState<any[]>([])
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string>("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserId(user.id)
      fetchMoods(user.id)
    }

    // Fall back to localStorage
    const savedMoods = localStorage.getItem("moodLogs")
    if (savedMoods) {
      setMoodLogs(JSON.parse(savedMoods))
    }
  }, [])

  const fetchMoods = async (uid: string) => {
    try {
      const response = await fetch(`/api/moods?userId=${uid}`)
      if (response.ok) {
        const data = await response.json()
        setMoodLogs(data)
      }
    } catch (error) {
      console.log("[v0] Error fetching moods:", error)
    }
  }

  const handleLogMood = async (mood: any) => {
    if (!userId) return

    setLoading(true)
    try {
      const response = await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          mood: mood.emoji,
          label: mood.label,
          notes: note,
          date: new Date().toLocaleDateString(),
        }),
      })

      if (response.ok) {
        const savedMood = await response.json()
        const updatedLogs = [savedMood, ...moodLogs]
        setMoodLogs(updatedLogs)
        // Also save to localStorage for offline support
        localStorage.setItem("moodLogs", JSON.stringify(updatedLogs))
        setSelectedMood(null)
        setNote("")
      }
    } catch (error) {
      console.log("[v0] Error logging mood:", error)
    } finally {
      setLoading(false)
    }
  }

  const todayMoods = moodLogs.filter((log) => log.date === new Date().toLocaleDateString())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Mood Tracker</h1>
        <p className="text-muted-foreground">Check in with your emotions throughout the day</p>
      </div>

      {/* Quick Mood Selection */}
      <Card className="p-8 text-center bg-gradient-to-b from-primary/10 to-secondary/10 border-border/40">
        <p className="text-foreground font-semibold mb-6">How are you feeling right now?</p>
        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          {moods.map((mood) => (
            <button
              key={mood.emoji}
              onClick={() => setSelectedMood(mood)}
              className={`text-5xl p-4 rounded-2xl transition-all hover:scale-110 ${selectedMood?.emoji === mood.emoji ? "bg-primary/30 scale-125" : "hover:bg-muted/50"}`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="space-y-4 max-w-md mx-auto">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="w-full p-3 rounded-lg bg-background border border-border/40 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <div className="flex gap-3">
              <Button onClick={() => handleLogMood(selectedMood)} className="flex-1" disabled={loading}>
                {loading ? "Logging..." : "Log Mood"}
              </Button>
              <Button onClick={() => setSelectedMood(null)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Mood History */}
      {todayMoods.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Today's Mood Log ({todayMoods.length})</h2>
          <div className="space-y-3">
            {todayMoods.map((log) => (
              <Card
                key={log._id || log.id}
                className="p-4 flex items-center justify-between border-border/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{log.mood}</span>
                  <div>
                    <p className="font-semibold text-foreground">{log.label}</p>
                    {log.notes && <p className="text-sm text-muted-foreground">{log.notes}</p>}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{log.time || log.timestamp}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {moodLogs.length === 0 && (
        <Card className="p-12 text-center border-border/40">
          <p className="text-2xl mb-2">😊</p>
          <p className="text-muted-foreground">Start logging your moods to see a record here.</p>
        </Card>
      )}
    </div>
  )
}
