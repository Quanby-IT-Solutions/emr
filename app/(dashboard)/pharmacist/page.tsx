"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconPill, IconFileCheck, IconAlertCircle, IconClipboard } from "@tabler/icons-react"

export default function PharmacistDashboard() {
  const router = useRouter()

  return (
    <ProtectedRoute requiredRole={UserRole.PHARMACIST}>
      <DashboardLayout role={UserRole.PHARMACIST}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Pharmacist Dashboard</h1>
            <p className="text-muted-foreground">
              Medication verification and inventory management
            </p>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card
              className="cursor-pointer transition hover:border-primary/50 hover:bg-muted/30"
              onClick={() => router.push("/pharmacist/verification")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                <IconPill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14</div>
                <p className="text-xs text-muted-foreground">Medication orders</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition hover:border-primary/50 hover:bg-muted/30"
              onClick={() => router.push("/pharmacist/approved")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Orders</CardTitle>
                <IconFileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition hover:border-primary/50 hover:bg-muted/30"
              onClick={() => router.push("/pharmacist/flagged")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged Orders</CardTitle>
                <IconAlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Require review</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition hover:border-primary/50 hover:bg-muted/30"
              onClick={() => router.push("/pharmacist/inventory")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
                <IconClipboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Low stock items</p>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common pharmacy tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
                <Button className="w-full" variant="outline" onClick={() => router.push("/pharmacist/orders")}>Medication Orders</Button>
                <Button className="w-full" onClick={() => router.push("/pharmacist/verification")}>Verify Orders</Button>
                <Button className="w-full" variant="outline" onClick={() => router.push("/pharmacist/approved")}>Approved Queue</Button>
                <Button className="w-full" variant="outline" onClick={() => router.push("/pharmacist/inventory")}>Check Inventory</Button>
                <Button className="w-full" variant="outline" onClick={() => router.push("/pharmacist/flagged")}>View Flagged</Button>
                <Button className="w-full" variant="outline" onClick={() => router.push("/pharmacist/patients")}>Patient Profiles</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
