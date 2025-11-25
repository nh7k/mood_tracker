"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const exercises = [
  {
    name: "4-7-8 Breathing",
    cycles: { inhale: 4, hold: 7, exhale: 8 },
    duration: 240,
    description: "Relaxation technique",
  },
  { name: "Box Breathing", cycles: { inhale: 4, hold: 4, exhale: 4 }, duration: 180, description: "Focus and clarity" },
  { name: "Deep Breathing", cycles: { inhale: 5, hold: 5, exhale: 5 }, duration: 150, description: "Stress relief" },
]

export default function BreathingPage() {
  const [activeExercise, setActiveExercise] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [phaseTime, setPhaseTime] = useState(0)
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    if (!isRunning || !activeExercise) return

    const interval = setInterval(() => {
      setPhaseTime((prev) => {
        const next = prev + 1
        const cycles = activeExercise.cycles

        if (phase === "inhale" && next >= cycles.inhale) {
          setPhase("hold")
          return 0
        }
        if (phase === "hold" && next >= cycles.hold) {
          setPhase("exhale")
          return 0
        }
        if (phase === "exhale" && next >= cycles.exhale) {
          setPhase("inhale")
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsRunning(false)
              setSessions([...sessions, { exercise: activeExercise.name, date: new Date().toLocaleTimeString() }])
              return 0
            }
            return prev - 1
          })
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, phase, activeExercise, sessions])

  const startExercise = (exercise: any) => {
    setActiveExercise(exercise)
    setTimeLeft(exercise.duration)
    setIsRunning(true)
    setPhase("inhale")
    setPhaseTime(0)
  }

  const getPhaseText = () => {
    const texts = {
      inhale: "Breathe In...",
      hold: "Hold...",
      exhale: "Breathe Out...",
    }
    return texts[phase]
  }

  const getPhaseProgress = () => {
    const cycles = activeExercise?.cycles
    if (!cycles) return 0
    const total = cycles[phase]
    return (phaseTime / total) * 100
  }

  if (activeExercise && isRunning) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="mb-8">
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-8 border-primary/20"></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-primary transition-all duration-300"
                style={{
                  borderTopColor: "var(--color-primary)",
                  borderRightColor: "var(--color-primary)",
                  borderBottomColor: "transparent",
                  borderLeftColor: "transparent",
                  transform: `rotate(${getPhaseProgress() * 3.6}deg)`,
                }}
              ></div>
              <div className={`absolute inset-8 rounded-full animate-breathing`}></div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-foreground mb-4">{getPhaseText()}</h2>
          <p className="text-lg text-muted-foreground mb-8">{activeExercise.name}</p>
          <p className="text-3xl font-bold text-primary mb-8">{timeLeft}s</p>

          <Button
            onClick={() => {
              setIsRunning(false)
              setActiveExercise(null)
            }}
            variant="outline"
            size="lg"
          >
            Stop Exercise
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Breathing Exercises</h1>
        <p className="text-muted-foreground">Calm your mind with guided breathing techniques</p>
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <Card
            key={exercise.name}
            className="p-6 hover:shadow-lg transition-all border-border/40 cursor-pointer"
            onClick={() => startExercise(exercise)}
          >
            <p className="text-4xl mb-3">🧘</p>
            <h3 className="text-lg font-semibold text-foreground mb-2">{exercise.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{exercise.description}</p>
            <p className="text-xs text-muted-foreground mb-4">Duration: {exercise.duration}s</p>
            <Button className="w-full" size="sm">
              Start
            </Button>
          </Card>
        ))}
      </div>

      {/* Sessions */}
      {sessions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Today's Sessions</h2>
          <div className="space-y-2">
            {sessions.map((session, i) => (
              <Card key={i} className="p-4 border-border/40">
                <div className="flex items-center justify-between">
                  <p className="text-foreground">{session.exercise}</p>
                  <p className="text-sm text-muted-foreground">{session.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
