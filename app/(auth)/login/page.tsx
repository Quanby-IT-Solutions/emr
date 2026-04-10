"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DEMO_USERNAMES, useAuth } from "@/lib/auth/context"
import { UserRole } from "@/lib/auth/roles"
import {
  IconActivityHeartbeat,
  IconShieldCheck,
  IconClock,
  IconUsersGroup,
  IconChevronRight,
  IconLogin2,
  IconEye,
  IconEyeOff,
  IconUser,
  IconLock,
  IconAlertCircle,
} from "@tabler/icons-react"

const roles: { role: UserRole; label: string; path: string; username: string; icon: string }[] = [
  { role: UserRole.SYSTEM_ADMIN, label: "System Admin", path: "/admin", username: "admin", icon: "🛡️" },
  { role: UserRole.CLINICIAN, label: "Clinician", path: "/clinician", username: "clinician", icon: "🩺" },
  { role: UserRole.NURSE, label: "Nurse", path: "/nurse", username: "nurse", icon: "💉" },
  { role: UserRole.REGISTRAR, label: "Registrar", path: "/registrar", username: "registrar", icon: "📋" },
  { role: UserRole.PHARMACIST, label: "Pharmacist", path: "/pharmacist", username: "pharmacist", icon: "💊" },
  { role: UserRole.LAB_TECH, label: "Lab Tech", path: "/lab-tech", username: "labtech", icon: "🔬" },
  { role: UserRole.HIM_CODER, label: "HIM Coder", path: "/him-coder", username: "himcoder", icon: "📊" },
  { role: UserRole.BILLER, label: "Biller", path: "/biller", username: "biller", icon: "💳" },
  { role: UserRole.SCHEDULER, label: "Scheduler", path: "/scheduler", username: "scheduler", icon: "📅" },
  { role: UserRole.PATIENT, label: "Patient", path: "/patient", username: "patient", icon: "🧑" },
  { role: UserRole.AUDITOR, label: "Auditor", path: "/auditor", username: "auditor", icon: "🔍" },
]

const FEATURES = [
  {
    icon: IconActivityHeartbeat,
    title: "Clinical Excellence",
    description: "Streamlined workflows for every department",
  },
  {
    icon: IconShieldCheck,
    title: "Enterprise Security",
    description: "Role-based access with full audit trails",
  },
  {
    icon: IconClock,
    title: "Real-Time Data",
    description: "Live patient records, orders, and results",
  },
  {
    icon: IconUsersGroup,
    title: "Multi-Role Platform",
    description: "11 specialized roles, one unified system",
  },
]

export default function Page() {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

      setError(`Invalid username. Try: ${DEMO_USERNAMES.slice(0, 4).join(", ")}, …`)
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
    <div className="relative flex min-h-svh w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Left Panel — Branding & Features (hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%]">
        <div className="flex w-full flex-col justify-between p-12 xl:p-16">
          {/* Logo & Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                <IconActivityHeartbeat className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">QHealth EMR</h1>
                <p className="text-sm text-muted-foreground">Electronic Medical Records</p>
              </div>
            </div>

            {/* Hero Section */}
            <div className="mt-16 max-w-lg">
              <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Healthcare management,{" "}
                <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                  simplified.
                </span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                A comprehensive, multi-role EMR platform designed for modern healthcare institutions. 
                From registration to discharge — every workflow, one system.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              {FEATURES.map((feature) => (
                <Card key={feature.title} className="border bg-card/50 backdrop-blur-sm shadow-sm">
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold text-foreground">11</p>
              <p className="text-sm text-muted-foreground">Specialized Roles</p>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div>
              <p className="text-3xl font-bold text-foreground">100%</p>
              <p className="text-sm text-muted-foreground">Demo Ready</p>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div>
              <p className="text-3xl font-bold text-foreground">24/7</p>
              <p className="text-sm text-muted-foreground">Availability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="relative flex w-full flex-col justify-center p-6 lg:w-1/2 xl:w-[45%]">
        {/* Mobile Logo */}
        <div className="absolute left-6 top-6 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <IconActivityHeartbeat className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">QHealth EMR</span>
        </div>

        <div className="mx-auto w-full max-w-md">
          {/* Login Card */}
          <Card className="border shadow-xl">
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your credentials to access your workspace
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <IconUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-11 pl-10"
                      required
                      disabled={isLoading}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <IconLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pl-10 pr-10"
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <IconEyeOff className="h-4 w-4" />
                      ) : (
                        <IconEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                    <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="h-11 w-full text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Signing in…
                    </div>
                  ) : (
                    <>
                      <IconLogin2 className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Quick Access</h3>
                <p className="text-xs text-muted-foreground">
                  Select a role for instant demo access
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Demo Mode
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {roles.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  className="group flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-left text-sm font-medium shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  onClick={() => handleQuickAccess(item.username, item.path)}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1 truncate text-xs">{item.label}</span>
                  <IconChevronRight className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Protected by enterprise-grade security · All activity is logged
          </p>
        </div>
      </div>
    </div>
  )
}
