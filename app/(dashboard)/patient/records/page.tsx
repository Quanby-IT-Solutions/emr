"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconFileText, IconShieldLock, IconClockHour4 } from "@tabler/icons-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"

export default function RequestRecordsPage() {
  const requests = [
    {
      id: "RR-2026-0014",
      type: "Continuity of care summary",
      submittedAt: "2026-04-08",
      status: "Processing",
      eta: "1-2 business days",
    },
    {
      id: "RR-2026-0011",
      type: "Imaging reports (last 12 months)",
      submittedAt: "2026-03-27",
      status: "Completed",
      eta: "Delivered",
    },
  ]

  const statusBadge = (status: string) => {
    if (status === "Completed") return <Badge variant="secondary">Completed</Badge>
    if (status === "Processing") return <Badge variant="warning">Processing</Badge>
    return <Badge variant="outline">{status}</Badge>
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Request records</h1>
            <p className="max-w-3xl text-muted-foreground">
              Request a copy of released records for personal use or transfer. Requests are tracked
              here and processed by Health Information Management.
            </p>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Request history</CardTitle>
                <CardDescription>Recent and in-progress records requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {requests.map((request) => (
                  <div key={request.id} className="rounded-md border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium">{request.type}</p>
                        <p className="text-xs text-muted-foreground">{request.id} · Submitted {request.submittedAt}</p>
                      </div>
                      {statusBadge(request.status)}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">ETA: {request.eta}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Create request</CardTitle>
                <CardDescription>Preview-only controls in this demo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" disabled title="Demo only">
                  <IconFileText className="mr-2 h-4 w-4" /> New records request
                </Button>
                <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <IconShieldLock className="h-4 w-4" /> Privacy note
                  </p>
                  <p className="mt-1">Identity checks may be required before release.</p>
                </div>
                <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <IconClockHour4 className="h-4 w-4" /> Typical turnaround
                  </p>
                  <p className="mt-1">Most requests are fulfilled in 1-3 business days.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
