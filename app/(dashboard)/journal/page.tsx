"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const prompts = [
  "What are 3 things you're grateful for today?",
  "What challenge did you overcome this week?",
  "Describe a moment that made you smile today.",
  "What would make tomorrow better than today?",
  "What emotions are you feeling right now and why?",
]

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [newEntry, setNewEntry] = useState({ title: "", content: "", mood: "😊", tags: [] })
  const [showForm, setShowForm] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string>("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserId(user.id)
      fetchEntries(user.id)
    }

    // Fall back to localStorage for backward compatibility
    const savedEntries = localStorage.getItem("journalEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

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

  const handleCreateEntry = async () => {
    if (newEntry.content.trim() && userId) {
      setLoading(true)
      try {
        const response = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            title: newEntry.title,
            content: newEntry.content,
            mood: newEntry.mood,
            date: new Date().toLocaleDateString(),
          }),
        })

        if (response.ok) {
          const entry = await response.json()
          setEntries([entry, ...entries])
          // Also save to localStorage for offline support
          const allEntries = [entry, ...entries]
          localStorage.setItem("journalEntries", JSON.stringify(allEntries))
          setNewEntry({ title: "", content: "", mood: "😊", tags: [] })
          setShowForm(false)
        }
      } catch (error) {
        console.log("[v0] Error saving entry:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Daily Journal</h1>
        <p className="text-muted-foreground">Express your thoughts and feelings in a safe space</p>
      </div>

      {/* Prompt Card */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-border/40">
        <p className="text-lg text-foreground font-semibold mb-4">Today's Prompt</p>
        <p className="text-foreground text-lg italic mb-4">"{currentPrompt}"</p>
        <Button
          onClick={() => setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)])}
          variant="outline"
          size="sm"
        >
          Get Another Prompt
        </Button>
      </Card>

      {/* New Entry Form */}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full" size="lg">
          Start New Entry
        </Button>
      ) : (
        <Card className="p-6 border-border/40">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mood</label>
              <div className="flex gap-3">
                {["😊", "😐", "😢", "😰", "😴"].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setNewEntry({ ...newEntry, mood })}
                    className={`text-2xl p-2 rounded-lg transition-all ${newEntry.mood === mood ? "bg-primary/20 scale-110" : "hover:bg-muted"}`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title (Optional)</label>
              <Input
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                placeholder="Give your entry a title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Your Thoughts</label>
              <textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                placeholder="Write freely here... This is your personal space."
                className="w-full min-h-48 p-4 rounded-lg bg-background border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">{newEntry.content.length} characters</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCreateEntry} className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Save Entry"}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Entries List */}
      {entries.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Your Entries ({entries.length})</h2>
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card
                key={entry._id || entry.id}
                className="p-6 hover:shadow-lg transition-all border-border/40 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                    {entry.title && <h3 className="text-lg font-semibold text-foreground mt-1">{entry.title}</h3>}
                  </div>
                  <span className="text-2xl">{entry.mood}</span>
                </div>
                <p className="text-foreground line-clamp-3">{entry.content}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <Card className="p-12 text-center border-border/40">
          <p className="text-2xl mb-2">📝</p>
          <p className="text-muted-foreground">No entries yet. Start writing to see them appear here.</p>
        </Card>
      )}
    </div>
  )
}
