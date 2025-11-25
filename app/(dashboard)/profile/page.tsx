"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [theme, setTheme] = useState("light")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      setFormData({ name: parsed.name, email: parsed.email })
    }
  }, [])

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/")
    }
  }

  const handleSaveProfile = () => {
    const updated = { ...user, ...formData }
    localStorage.setItem("user", JSON.stringify(updated))
    setUser(updated)
    setIsEditing(false)
  }

  if (!user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="p-6 border-border/40">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl">
              {user.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        {isEditing && (
          <div className="space-y-4 border-t border-border/40 pt-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <Button onClick={handleSaveProfile} className="w-full">
              Save Changes
            </Button>
          </div>
        )}
      </Card>

      {/* Preferences */}
      <Card className="p-6 border-border/40">
        <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between">
              <span className="text-foreground">Dark Mode</span>
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                className="w-4 h-4 rounded"
              />
            </label>
          </div>
          <div>
            <label className="flex items-center justify-between">
              <span className="text-foreground">Email Notifications</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            </label>
          </div>
        </div>
      </Card>

      {/* Data & Security */}
      <Card className="p-6 border-border/40">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data & Security</h3>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span>✓</span> Your data is encrypted with AES-256 encryption
          </p>
          <Button variant="outline" className="w-full text-left justify-start bg-transparent">
            📥 Export My Data
          </Button>
          <Button variant="outline" className="w-full text-left justify-start bg-transparent">
            🔐 Change Password
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-border/40 border-destructive/30 bg-destructive/5">
        <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button
          variant="outline"
          onClick={handleDeleteAccount}
          className="text-destructive hover:bg-destructive/10 w-full bg-transparent"
        >
          Delete Account
        </Button>
      </Card>
    </div>
  )
}
