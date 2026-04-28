"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth/context"
import { UserRole } from "@/lib/auth/roles"
import { cn } from "@/lib/utils"
import {
  IconActivityHeartbeat,
  IconShieldCheck,
  IconClock,
  IconLogin2,
  IconEye,
  IconEyeOff,
  IconUser,
  IconLock,
  IconAlertCircle,
  IconShieldLock,
  IconStethoscope,
  IconVaccine,
  IconClipboardList,
  IconPill,
  IconMicroscope,
  IconFileDescription,
  IconCreditCard,
  IconCalendarMonth,
  IconUserHeart,
  IconSearch,
  IconSparkles,
} from "@tabler/icons-react"

const roles = [
  { role: UserRole.SYSTEM_ADMIN, label: "System Admin", path: "/admin", username: "admin", icon: IconShieldLock, color: "text-rose-500", bg: "bg-rose-500/10" },
  { role: UserRole.CLINICIAN, label: "Clinician", path: "/clinician", username: "clinician", icon: IconStethoscope, color: "text-blue-500", bg: "bg-blue-500/10" },
  { role: UserRole.NURSE, label: "Nurse", path: "/nurse", username: "nurse", icon: IconVaccine, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { role: UserRole.REGISTRAR, label: "Registrar", path: "/registrar", username: "registrar", icon: IconClipboardList, color: "text-amber-500", bg: "bg-amber-500/10" },
  { role: UserRole.PHARMACIST, label: "Pharmacist", path: "/pharmacist", username: "pharmacist", icon: IconPill, color: "text-purple-500", bg: "bg-purple-500/10" },
  { role: UserRole.LAB_TECH, label: "Lab Tech", path: "/lab-tech", username: "labtech", icon: IconMicroscope, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { role: UserRole.HIM_CODER, label: "HIM Coder", path: "/him-coder", username: "himcoder", icon: IconFileDescription, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { role: UserRole.BILLER, label: "Biller", path: "/biller", username: "biller", icon: IconCreditCard, color: "text-teal-500", bg: "bg-teal-500/10" },
  { role: UserRole.SCHEDULER, label: "Scheduler", path: "/scheduler", username: "scheduler", icon: IconCalendarMonth, color: "text-orange-500", bg: "bg-orange-500/10" },
  { role: UserRole.PATIENT, label: "Patient", path: "/patient", username: "patient", icon: IconUserHeart, color: "text-pink-500", bg: "bg-pink-500/10" },
  { role: UserRole.AUDITOR, label: "Auditor", path: "/auditor", username: "auditor", icon: IconSearch, color: "text-slate-500", bg: "bg-slate-500/10" },
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
    icon: IconSparkles,
    title: "Modern Experience",
    description: "Intuitive, fast, and responsive interface",
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
        const lowerUser = username.trim().toLowerCase()
        const matched = roles.find((r) => r.username === lowerUser)
        router.push(matched?.path ?? '/')
        return
      }

      setError("Invalid credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAccess = async (quickUsername: string, path: string) => {
    setError("")
    setIsLoading(true)
    const success = await login(quickUsername, "demo123")
    if (success) {
      router.push(path)
    } else {
      setError("Failed to login with demo user.")
    }
    setIsLoading(false)
  }

  return (
    <div className="relative flex min-h-svh w-full bg-background selection:bg-primary/20">
      {/* Left Panel — Branding & Features (hidden on mobile) */}
      <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-zinc-50 lg:flex lg:w-1/2 xl:w-[55%] xl:p-16">
        {/* Background ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -right-[20%] bottom-[10%] h-[60%] w-[60%] rounded-full bg-emerald-600/20 blur-[120px]" />
          <div className="absolute left-[30%] top-[40%] h-[30%] w-[30%] rounded-full bg-teal-500/20 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-2xl flex-col justify-between">
          {/* Logo & Brand */}
          <div className="animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="flex items-center gap-3">
              <img src="/new-logo.png" alt="QHealth Logo" className="h-14 w-auto object-contain" />
              <div className="space-y-0.5">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-50">QHealth EMR</h1>
                <p className="text-sm font-medium text-zinc-400">Enterprise Medical Platform</p>
              </div>
            </div>

            {/* Hero Section */}
            <div className="mt-20">
              <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-zinc-300 backdrop-blur-md">
                <IconSparkles className="mr-2 h-4 w-4 text-primary" />
                Welcome to the future of healthcare
              </div>
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-zinc-50 xl:text-5xl">
                Healthcare management,{"\n"}
                <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  simplified.
                </span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
                A comprehensive, multi-role EMR platform designed for modern healthcare institutions. 
                From registration to discharge — every workflow, one unified system.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="mt-16 grid grid-cols-2 gap-4">
              {FEATURES.map((feature, i) => (
                <div 
                  key={feature.title} 
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-md transition-all hover:bg-white/10"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-auto flex items-center gap-8 pt-16 duration-700 animate-in fade-in slide-in-from-bottom-8 delay-300">
            <div>
              <p className="text-3xl font-bold text-zinc-50">11</p>
              <p className="mt-1 text-sm font-medium text-zinc-400">Specialized Roles</p>
            </div>
            <Separator orientation="vertical" className="h-10 bg-white/10" />
            <div>
              <p className="text-3xl font-bold text-zinc-50">100%</p>
              <p className="mt-1 text-sm font-medium text-zinc-400">Demo Ready</p>
            </div>
            <Separator orientation="vertical" className="h-10 bg-white/10" />
            <div>
              <p className="text-3xl font-bold text-zinc-50">24/7</p>
              <p className="mt-1 text-sm font-medium text-zinc-400">Availability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="relative flex w-full flex-col justify-center bg-background p-6 lg:w-1/2 xl:w-[45%]">
        {/* Subtle patterned background for right panel */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-30 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 mx-auto w-full max-w-[440px] duration-500 animate-in fade-in zoom-in-95">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src="/new-logo.png" alt="QHealth Logo" className="h-10 w-auto object-contain" />
            <div>
              <span className="text-xl font-bold tracking-tight">QHealth</span>
              <p className="text-xs font-medium text-muted-foreground">Enterprise Medical</p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="border-border/50 bg-card/60 shadow-2xl shadow-primary/5 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="mb-8 space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                <p className="text-sm font-medium text-muted-foreground">
                  Enter your credentials to access your workspace
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="group space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold transition-colors group-focus-within:text-primary">
                    Username
                  </Label>
                  <div className="relative">
                    <IconUser className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-12 border-border/50 bg-background/50 pl-10 transition-all duration-200 hover:border-border focus:bg-background"
                      required
                      disabled={isLoading}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="group space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold transition-colors group-focus-within:text-primary">
                      Password
                    </Label>
                    <a href="#" className="text-xs font-medium text-primary transition-colors hover:text-primary/80">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <IconLock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-border/50 bg-background/50 pl-10 pr-10 transition-all duration-200 hover:border-border focus:bg-background"
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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

                {error && (
                  <div className="flex items-center gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                    <IconAlertCircle className="h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-12 w-full bg-gradient-to-r from-primary to-emerald-600 text-base font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:from-primary/90 hover:to-emerald-600/90 active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Authenticating...
                    </div>
                  ) : (
                    <>
                      <IconLogin2 className="mr-2 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <div className="mt-10 w-full duration-700 animate-in fade-in slide-in-from-bottom-4 delay-200">
            <div className="mb-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold tracking-tight">Quick Access</h3>
                <p className="text-xs font-medium text-muted-foreground">
                  Select a persona to demo the platform
                </p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/20">
                Demo Mode
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {roles.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  className={cn(
                    "group relative flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-border/50 bg-card/40 p-3 text-center transition-all duration-300",
                    "hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] disabled:opacity-50",
                  )}
                  disabled={isLoading}
                  onClick={() => handleQuickAccess(item.username, item.path)}
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110", item.bg, item.color)}>
                    <item.icon className="h-5 w-5" stroke={2} />
                  </div>
                  <span className="w-full truncate text-[11px] font-bold text-muted-foreground transition-colors group-hover:text-foreground">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <p className="mt-8 text-center text-xs text-muted-foreground font-medium animate-in fade-in duration-700 delay-500">
            Protected by enterprise-grade security · All activity is logged
          </p>
        </div>
      </div>
    </div>
  )
}

