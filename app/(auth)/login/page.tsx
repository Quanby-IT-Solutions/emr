"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRole } from "@/lib/auth/roles"

const roles = [
  { role: UserRole.SYSTEM_ADMIN, label: "System Admin", path: "/admin" },
  { role: UserRole.SCHEDULER, label: "Scheduler", path: "/scheduler" },
  { role: UserRole.REGISTRAR, label: "Registrar", path: "/registrar" },
  { role: UserRole.NURSE, label: "Nurse", path: "/nurse" },
  { role: UserRole.CLINICIAN, label: "Clinician", path: "/clinician" },
  { role: UserRole.PHARMACIST, label: "Pharmacist", path: "/pharmacist" },
  { role: UserRole.LAB_TECH, label: "Lab Tech", path: "/lab-tech" },
  { role: UserRole.HIM_CODER, label: "HIM Coder", path: "/him-coder" },
  { role: UserRole.BILLER, label: "Biller", path: "/biller" },
  { role: UserRole.PATIENT, label: "Patient", path: "/patient" },
  { role: UserRole.AUDITOR, label: "Auditor", path: "/auditor" },
]

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your login logic here
    console.log("Login with:", email, password)
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                />
              </div>
              <Button type="submit" className="w-full">
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
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-auto py-3 text-xs"
                >
                  <Link href={item.path}>
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
