import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconReport, IconShieldCheck } from "@tabler/icons-react"

export default function AuditorDashboard() {
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
