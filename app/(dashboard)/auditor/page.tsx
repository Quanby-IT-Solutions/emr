import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  IconActivity,
  IconAlertTriangle,
  IconEye,
  IconReport,
  IconShieldCheck,
} from "@tabler/icons-react"
import {
  breakGlassEvents,
  loginEvents,
  patientChartReads,
  privilegedOrSecurityEvents,
} from "@/lib/auditor/audit-report-metrics"
import { sampleAuditLogs } from "@/lib/auditor/sample-audit-logs"

export default function AuditorDashboard() {
  const totalEvents = sampleAuditLogs.length
  const breakGlass = breakGlassEvents()
  const chartReads = patientChartReads()
  const logins = loginEvents()
  const security = privilegedOrSecurityEvents()

  const priorityQueue = [...security]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return (
    <ProtectedRoute requiredRole={UserRole.AUDITOR}>
      <DashboardLayout role={UserRole.AUDITOR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Auditor / Privacy Officer</h1>
            <p className="text-muted-foreground max-w-3xl">
              Organization-wide read access and a detailed audit trail of system activity.
              Additional read-only chart views can be layered in as other modules go live;
              this area begins with audit logs.
            </p>
          </div>

          <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalEvents}</p>
                <p className="text-xs text-muted-foreground">Demo immutable audit entries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Break-glass</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-destructive">{breakGlass.length}</p>
                <p className="text-xs text-muted-foreground">Emergency access rows</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Patient chart reads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{chartReads.length}</p>
                <p className="text-xs text-muted-foreground">READ + PATIENT_CHART</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Authentication events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{logins.length}</p>
                <p className="text-xs text-muted-foreground">LOGIN actions in sample</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconShieldCheck className="h-5 w-5" />
                  Audit logs
                </CardTitle>
                <CardDescription>
                  Line-level trail: CREATE / READ / UPDATE / DELETE / LOGIN / BREAK_GLASS with
                  user, entity, IP, and structured details (TOR audit trail).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/auditor/logs">Open audit logs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconReport className="h-5 w-5" />
                  Reports
                </CardTitle>
                <CardDescription>
                  Aggregated privacy &amp; compliance views, break-glass summary, and CSV export
                  from the same demo data — not the interactive log grid.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/auditor/reports">Open reports</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">User activity</CardTitle>
                <CardDescription>
                  Broader activity summaries when requirements are finalized. Use Audit logs for
                  each event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auditor/activity">User activity</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconAlertTriangle className="h-4 w-4" /> Priority review queue
                </CardTitle>
                <CardDescription>
                  Latest security-related events for privacy officer review.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {priorityQueue.map((event) => (
                  <div key={event.id} className="rounded-md border p-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-mono">{event.actionType}</p>
                      <Badge variant={event.actionType === "BREAK_GLASS" ? "destructive" : "outline"}>
                        {event.entityType ?? "N/A"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {event.user?.displayName ?? event.user?.username ?? "Unknown user"} · {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
                <Button size="sm" variant="outline" asChild>
                  <Link href="/auditor/logs">Open full audit logs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconActivity className="h-4 w-4" /> Auditor workflow shortcuts
                </CardTitle>
                <CardDescription>Common privacy and compliance review actions.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
                <Button className="justify-start" asChild>
                  <Link href="/auditor/logs">
                    <IconEye className="mr-2 h-4 w-4" /> Inspect event trail
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/auditor/reports">
                    <IconReport className="mr-2 h-4 w-4" /> Open compliance reports
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/auditor/activity">
                    <IconActivity className="mr-2 h-4 w-4" /> User activity analytics
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/auditor/reports">
                    <IconShieldCheck className="mr-2 h-4 w-4" /> Break-glass summary
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
