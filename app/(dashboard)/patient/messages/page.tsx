"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconMessageCircle, IconSend, IconStethoscope } from "@tabler/icons-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"

export default function MessagesPage() {
  const threads = [
    {
      id: "MSG-1021",
      subject: "Lab follow-up instructions",
      sender: "Dr. Maria Santos",
      role: "Endocrinology",
      updatedAt: "2026-04-09 10:20",
      unread: true,
      preview: "Your latest glucose is slightly elevated. Please continue your current regimen and repeat fasting labs in 3 months.",
    },
    {
      id: "MSG-1019",
      subject: "Appointment reminder",
      sender: "Clinic Scheduling",
      role: "Operations",
      updatedAt: "2026-04-08 16:05",
      unread: false,
      preview: "This is a reminder for your follow-up on May 12 at 9:00 AM. Reply if you need to reschedule.",
    },
  ]

  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="max-w-3xl text-muted-foreground">
              Secure, read-only message preview for communication with care teams.
            </p>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Inbox</CardTitle>
                <CardDescription>Recent conversations with clinical and scheduling teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {threads.map((thread) => (
                  <div key={thread.id} className="rounded-md border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{thread.subject}</p>
                        {thread.unread && <Badge>Unread</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{thread.updatedAt}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {thread.sender} · {thread.role}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{thread.preview}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compose</CardTitle>
                <CardDescription>Messaging actions are disabled in this preview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" disabled title="Demo only">
                  <IconSend className="mr-2 h-4 w-4" /> New message
                </Button>
                <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <IconStethoscope className="h-4 w-4" /> Clinical questions
                  </p>
                  <p className="mt-1">For urgent symptoms, call emergency services instead of portal messaging.</p>
                </div>
                <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <IconMessageCircle className="h-4 w-4" /> Expected response
                  </p>
                  <p className="mt-1">Most portal messages are reviewed within 1-2 business days.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
