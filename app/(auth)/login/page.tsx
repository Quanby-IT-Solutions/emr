"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEMO_USERNAMES, useAuth } from "@/lib/auth/context"
import { UserRole } from "@/lib/auth/roles"

const roles: { role: UserRole; label: string; path: string; username: string }[] = [
  { role: UserRole.SYSTEM_ADMIN, label: "System Admin", path: "/admin", username: "admin" },
  { role: UserRole.SCHEDULER, label: "Scheduler", path: "/scheduler", username: "scheduler" },
  { role: UserRole.REGISTRAR, label: "Registrar", path: "/registrar", username: "registrar" },
  { role: UserRole.NURSE, label: "Nurse", path: "/nurse", username: "nurse" },
  { role: UserRole.CLINICIAN, label: "Clinician", path: "/clinician", username: "clinician" },
  { role: UserRole.PHARMACIST, label: "Pharmacist", path: "/pharmacist", username: "pharmacist" },
  { role: UserRole.LAB_TECH, label: "Lab Tech", path: "/lab-tech", username: "labtech" },
  { role: UserRole.HIM_CODER, label: "HIM Coder", path: "/him-coder", username: "himcoder" },
  { role: UserRole.BILLER, label: "Biller", path: "/biller", username: "biller" },
  { role: UserRole.PATIENT, label: "Patient", path: "/patient", username: "patient" },
  { role: UserRole.AUDITOR, label: "Auditor / Privacy Officer", path: "/auditor", username: "auditor" },
]

export default function Page() {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(username, password)

      if (success) {
        router.push("/dashboard")
        return
      }

      setError(`Invalid username. Valid usernames: ${DEMO_USERNAMES.join(", ")}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAccess = async (quickUsername: string, path: string) => {
    setError("")
    setIsLoading(true)
    const success = await login(quickUsername, "")
    if (success) {
      router.push(path)
    } else {
      setError("Failed to login with demo user.")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted/40">
      <div className="w-full max-w-md space-y-6">
        {/* Main Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to EMR System</CardTitle>
            <CardDescription>
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="e.g. admin, nurse, clinician"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : null}
              <Button type="submit" className="w-full" disabled={isLoading}>
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Access Role Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Access (Testing)</CardTitle>
            <CardDescription className="text-xs">
              Click a role to access dashboard directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((item) => (
                <Button
                  key={item.role}
                  variant="outline"
                  size="sm"
                  className="h-auto py-3 text-xs"
                  disabled={isLoading}
                  onClick={() => handleQuickAccess(item.username, item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
