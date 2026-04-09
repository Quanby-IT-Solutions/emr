"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  IconFlask,
  IconFileCheck,
  IconClock,
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowRight,
} from "@tabler/icons-react"

import { labOrders, criticalValueLog } from "@/app/(dashboard)/dummy-data/dummy-lab-orders"

export default function LabTechDashboard() {
  // Compute stats from dummy data
  const pendingCount = labOrders.filter(o => o.status === "PLACED" || o.status === "COLLECTED").length
  const inProgressCount = labOrders.filter(o => o.status === "IN_PROGRESS").length
  const completedCount = labOrders.filter(o => o.status === "COMPLETED" || o.status === "CORRECTED").length
  const statCount = labOrders.filter(o => o.priority === "STAT" && o.status !== "COMPLETED" && o.status !== "CORRECTED" && o.status !== "CANCELLED").length

  // Recent activity: last 6 orders that are in-progress or completed
  const recentActivity = labOrders
    .filter(o => ["IN_PROGRESS", "COMPLETED", "CORRECTED", "COLLECTED"].includes(o.status))
    .slice(0, 6)

  // Unacknowledged critical values
  const unacknowledgedCritical = criticalValueLog.filter(c => !c.acknowledged)

  return (
    <ProtectedRoute requiredRole={UserRole.LAB_TECH}>
      <DashboardLayout role={UserRole.LAB_TECH}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Laboratory Dashboard</h1>
            <p className="text-muted-foreground">
              Test processing and results management
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <IconFlask className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Awaiting collection/processing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <IconClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressCount}</div>
                <p className="text-xs text-muted-foreground">Currently testing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <IconFileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCount}</div>
                <p className="text-xs text-muted-foreground">Results submitted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">STAT Orders</CardTitle>
                <IconAlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{statCount}</div>
                <p className="text-xs text-muted-foreground">Urgent priority</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common laboratory tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-3">
                <Button className="w-full" asChild>
                  <Link href="/lab-tech/queue">View Order Queue</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/lab-tech/processing">Process Tests</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/lab-tech/completed">View Completed</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          {unacknowledgedCritical.length > 0 && (
            <div className="px-4 lg:px-6">
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <IconAlertTriangle className="h-5 w-5" />
                      Critical Alerts — Unacknowledged
                    </CardTitle>
                    <Badge variant="destructive">{unacknowledgedCritical.length}</Badge>
                  </div>
                  <CardDescription>
                    Critical values requiring clinician acknowledgment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>Test</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Notified Clinician</TableHead>
                        <TableHead>Resulted At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unacknowledgedCritical.map(entry => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.patient}</TableCell>
                          <TableCell>{entry.mrn}</TableCell>
                          <TableCell>{entry.test}</TableCell>
                          <TableCell className="font-bold text-red-600 dark:text-red-400">{entry.value}</TableCell>
                          <TableCell className="text-sm">{entry.notifiedClinician}</TableCell>
                          <TableCell className="text-sm">{entry.resultedAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Activity */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest lab orders and results</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/lab-tech/queue" className="gap-1">
                      View All <IconArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test Panel</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.patient.name}</TableCell>
                        <TableCell>{order.testPanel}</TableCell>
                        <TableCell>
                          <Badge variant={order.priority === "STAT" ? "destructive" : order.priority === "URGENT" ? "warning" : "secondary"}>
                            {order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === "COMPLETED" || order.status === "CORRECTED" ? "default"
                              : order.status === "IN_PROGRESS" ? "warning"
                                : "outline"
                          }>
                            {order.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{order.completedAt ?? order.collectedAt ?? order.orderedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
