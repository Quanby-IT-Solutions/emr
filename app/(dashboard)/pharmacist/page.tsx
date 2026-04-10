"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconPill,
  IconFileCheck,
  IconAlertCircle,
  IconClipboard,
  IconChevronRight,
  IconClock,
  IconPackage,
} from "@tabler/icons-react"

type QueueOrder = {
  id: string
  patient: string
  medication: string
  priority: "STAT" | "Urgent" | "Routine"
}

const verificationQueue: QueueOrder[] = [
  { id: "ORD-4421", patient: "Bob Wilson", medication: "Warfarin 5 mg", priority: "STAT" },
  { id: "ORD-4422", patient: "Diana Evans", medication: "Sumatriptan 50 mg", priority: "Urgent" },
  { id: "ORD-4423", patient: "Alice Brown", medication: "Insulin Glargine 30u", priority: "Routine" },
  { id: "ORD-4424", patient: "John Doe", medication: "Heparin 5000 units", priority: "STAT" },
  { id: "ORD-4425", patient: "Fiona Garcia", medication: "Enoxaparin 40 mg", priority: "Routine" },
]

const flaggedAlerts = [
  {
    id: "FLG-901",
    category: "Allergy Conflict",
    summary: "Amoxicillin ordered for severe penicillin allergy",
  },
  {
    id: "FLG-902",
    category: "Drug Interaction",
    summary: "Warfarin + Amiodarone requires dose adjustment",
  },
  {
    id: "FLG-903",
    category: "Renal Contraindication",
    summary: "Metformin with eGFR below 30 mL/min",
  },
]

const inventoryWatchlist = [
  { name: "Amoxicillin 500 mg", status: "Low Stock", quantity: 25 },
  { name: "Metformin 500 mg", status: "Out of Stock", quantity: 0 },
  { name: "Ibuprofen 400 mg", status: "Expired", quantity: 75 },
]

const recentApprovals = [
  { id: "APR-771", patient: "Alice Brown", medication: "Metformin 500 mg", by: "Pharm. Rodriguez" },
  { id: "APR-772", patient: "Edward Kim", medication: "Amlodipine 10 mg", by: "Pharm. Lee" },
  { id: "APR-773", patient: "Fiona Garcia", medication: "Enoxaparin 40 mg", by: "Pharm. Rodriguez" },
]

export default function PharmacistDashboard() {
  const router = useRouter()
  const pendingVerificationCount = verificationQueue.length
  const approvedTodayCount = recentApprovals.length
  const flaggedCount = flaggedAlerts.length
  const inventoryAlertCount = inventoryWatchlist.length

  const statCount = verificationQueue.filter((order) => order.priority === "STAT").length

  const priorityBadge = (priority: QueueOrder["priority"]) => {
    if (priority === "STAT") return <Badge variant="destructive">STAT</Badge>
    if (priority === "Urgent") return <Badge variant="warning">Urgent</Badge>
    return <Badge variant="outline">Routine</Badge>
  }

  const inventoryBadge = (status: string) => {
    if (status === "Out of Stock") return <Badge variant="destructive">Out of stock</Badge>
    if (status === "Low Stock") return <Badge variant="warning">Low stock</Badge>
    return <Badge variant="outline">Expired</Badge>
  }

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
                <div className="text-2xl font-bold">{pendingVerificationCount}</div>
                <p className="text-xs text-muted-foreground">Medication orders ({statCount} STAT)</p>
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
                <div className="text-2xl font-bold">{approvedTodayCount}</div>
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
                <div className="text-2xl font-bold">{flaggedCount}</div>
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
                <div className="text-2xl font-bold">{inventoryAlertCount}</div>
                <p className="text-xs text-muted-foreground">Low / out / expired items</p>
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

          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconClock className="h-4 w-4" /> Verification Queue Preview
                </CardTitle>
                <CardDescription>Highest-priority orders requiring pharmacist review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {verificationQueue.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{order.patient}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.medication} · {order.id}
                      </p>
                    </div>
                    {priorityBadge(order.priority)}
                  </div>
                ))}
                <Button className="w-full" onClick={() => router.push("/pharmacist/verification")}>Open Verification Queue</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconAlertCircle className="h-4 w-4" /> Safety Alerts
                </CardTitle>
                <CardDescription>Flagged orders that need intervention or escalation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {flaggedAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-md border p-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{alert.category}</p>
                      <Badge variant="destructive">Open</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{alert.summary}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => router.push("/pharmacist/flagged")}>Review Flagged Orders</Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconPackage className="h-4 w-4" /> Inventory Watchlist
                </CardTitle>
                <CardDescription>Items requiring stock action from pharmacy operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {inventoryWatchlist.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-md border p-2">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Quantity on hand: {item.quantity}</p>
                    </div>
                    {inventoryBadge(item.status)}
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => router.push("/pharmacist/inventory")}>Go To Inventory</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconFileCheck className="h-4 w-4" /> Recently Approved
                </CardTitle>
                <CardDescription>Most recent completed verifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between rounded-md border p-2">
                    <div>
                      <p className="text-sm font-medium">{approval.patient}</p>
                      <p className="text-xs text-muted-foreground">{approval.medication} · {approval.by}</p>
                    </div>
                    <Badge variant="secondary">Approved</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => router.push("/pharmacist/approved")}>View Approved Queue</Button>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6 text-xs text-muted-foreground">
            Demo data shown for queue preview and operations snapshot; replace with API-backed role-scoped data in production.
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
