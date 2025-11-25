"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <span className="font-bold text-xl text-foreground">MindWell</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div
          className={`text-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Your Mental Wellness Journey Starts Here
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Track your mood, journal your thoughts, and practice calming breathing exercises in a beautifully designed
            space dedicated to your mental wellness.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="text-base">
                Start Free Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              Learn More
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="p-6 rounded-2xl bg-white dark:bg-card border border-border/40 backdrop-blur-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📔</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Daily Journaling</h3>
              <p className="text-sm text-muted-foreground">
                Guided prompts to help you express your thoughts and feelings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-card border border-border/40 backdrop-blur-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">😊</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Mood Tracking</h3>
              <p className="text-sm text-muted-foreground">Track your emotions and see patterns over time.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-card border border-border/40 backdrop-blur-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🧘</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Breathing Exercises</h3>
              <p className="text-sm text-muted-foreground">Calming exercises designed for relaxation and focus.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border/40 py-16 mt-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of users taking charge of their mental health.</p>
          <Link href="/signup">
            <Button size="lg" className="text-base">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 MindWell. Designed with care for your mental wellness.</p>
        </div>
      </footer>
    </div>
  )
}
