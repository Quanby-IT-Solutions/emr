import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  IconCalendar,
  IconFlask,
  IconHeartbeat,
  IconCurrencyDollar,
} from "@tabler/icons-react"

export default function PatientDashboard() {
  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Patient portal</h1>
            <p className="max-w-3xl text-muted-foreground">
              Read-only access to released demographics, visits, results, medications, allergies,
              appointments, and billing (TOR — Patient Portal).
            </p>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming visits</CardTitle>
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Sample — next 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Results to review</CardTitle>
                <IconFlask className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Released lab rows (demo)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health record</CardTitle>
                <IconHeartbeat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Active medications (demo)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balance due</CardTitle>
                <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$350</div>
                <p className="text-xs text-muted-foreground">Sample open balance</p>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Go to</CardTitle>
                <CardDescription>TOR-aligned areas (in scope)</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                <Button asChild className="w-full">
                  <Link href="/patient/profile">My profile</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/patient/history">Health record</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/patient/appointments">Appointments</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/patient/results">Results</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/patient/billing">Billing</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
