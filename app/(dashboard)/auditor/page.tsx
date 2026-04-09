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
import { IconShieldCheck } from "@tabler/icons-react"

export default function AuditorDashboard() {
  return (
    <ProtectedRoute requiredRole={UserRole.AUDITOR}>
      <DashboardLayout role={UserRole.AUDITOR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Auditor / Privacy Officer</h1>
            <p className="text-muted-foreground max-w-3xl">
              TOR: read-all access and detailed audit logs of system activity.
              Chart-wide read views will align with other modules as they are built;
              this area starts with the audit trail.
            </p>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconShieldCheck className="h-5 w-5" />
                  Audit logs
                </CardTitle>
                <CardDescription>
                  Search and review CREATE / READ / UPDATE / DELETE / LOGIN /
                  BREAK_GLASS events with user, entity, IP, and structured details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/auditor/logs">Open audit logs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Other sidebar items</CardTitle>
                <CardDescription>
                  Reports and User Activity are not described in the current TOR for
                  this role; those pages are intentionally left minimal until scope is
                  defined.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auditor/reports">Reports (placeholder)</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auditor/activity">User activity (placeholder)</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
