"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState("dark") // Added theme state

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    const savedTheme = localStorage.getItem("theme") || "dark"

    if (!token) {
      router.push("/login")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  if (!user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} border-r border-border/40 bg-card transition-all duration-300 flex flex-col fixed h-screen`}
      >
        <div className="p-4 border-b border-border/40">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              M
            </div>
            {sidebarOpen && <span className="font-bold text-lg text-foreground">MindWell</span>}
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { href: "/dashboard", label: "Dashboard", icon: "🏠" },
            { href: "/journal", label: "Journal", icon: "📔" },
            { href: "/mood", label: "Mood Tracker", icon: "😊" },
            { href: "/breathing", label: "Breathing", icon: "🧘" },
            { href: "/insights", label: "Insights", icon: "📊" },
            { href: "/profile", label: "Profile", icon: "👤" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className={`w-full justify-start ${sidebarOpen ? "" : "px-2"}`}>
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border/40 space-y-2">
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="w-full text-xs bg-transparent"
            title="Toggle dark/light mode"
          >
            {sidebarOpen ? (theme === "dark" ? "☀️ Light" : "🌙 Dark") : theme === "dark" ? "☀️" : "🌙"}
          </Button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full text-muted-foreground text-sm hover:text-foreground p-2 rounded"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
          <Button variant="outline" className="w-full text-xs bg-transparent" onClick={handleLogout}>
            {sidebarOpen ? "Log Out" : "↪"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? "ml-64" : "ml-20"} flex-1 flex flex-col transition-all duration-300`}>
        {/* Top Bar */}
        <div className="border-b border-border/40 bg-card p-4 flex justify-between items-center sticky top-0 z-40">
          <h2 className="text-foreground font-semibold">Welcome, {user.name}</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  )
}
