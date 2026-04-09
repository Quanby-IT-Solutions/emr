"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  IconFileText,
  IconFileCheck,
  IconAlertCircle,
  IconClock,
  IconClipboardList,
  IconCode,
  IconFlag,
  IconChartBar,
} from "@tabler/icons-react"

// --- Mock Data ---

const recentActivity = [
  { id: "ENC-2026-0041", patient: "John Doe", mrn: "MRN-001", action: "Coded", coder: "Alice Rivera", date: "Apr 9, 2026 09:15", status: "Coded" as const },
  { id: "ENC-2026-0038", patient: "Maria Garcia", mrn: "MRN-007", action: "Deficiency Flagged", coder: "Alice Rivera", date: "Apr 9, 2026 08:50", status: "Flagged" as const },
  { id: "ENC-2026-0035", patient: "Robert Chen", mrn: "MRN-009", action: "Finalized", coder: "Brian Park", date: "Apr 9, 2026 08:30", status: "Finalized" as const },
  { id: "ENC-2026-0033", patient: "Emily Davis", mrn: "MRN-011", action: "In Review", coder: "Alice Rivera", date: "Apr 9, 2026 08:10", status: "In Review" as const },
  { id: "ENC-2026-0030", patient: "James Brown", mrn: "MRN-010", action: "Coded", coder: "Brian Park", date: "Apr 8, 2026 17:45", status: "Coded" as const },
  { id: "ENC-2026-0028", patient: "Linda Park", mrn: "MRN-011", action: "Finalized", coder: "Alice Rivera", date: "Apr 8, 2026 16:20", status: "Finalized" as const },
]

const activityStatusClass: Record<string, string> = {
  "Coded": "bg-blue-100 text-blue-800 border-blue-300",
  "Flagged": "bg-red-100 text-red-800 border-red-300",
  "Finalized": "bg-green-100 text-green-800 border-green-300",
  "In Review": "bg-yellow-100 text-yellow-800 border-yellow-300",
}

const queueSummary = [
  { label: "Pending Review", count: 25, icon: IconFileText, href: "/him-coder/encounters" },
  { label: "In Coding", count: 8, icon: IconCode, href: "/him-coder/coding" },
  { label: "Deficiency Queries", count: 4, icon: IconAlertCircle, href: "/him-coder/discrepancies" },
  { label: "Ready to Finalize", count: 6, icon: IconFileCheck, href: "/him-coder/finalize" },
]

// --- Page ---

export default function HIMCoderDashboard() {
  const router = useRouter()

  return (
    <ProtectedRoute requiredRole={UserRole.HIM_CODER}>
      <DashboardLayout role={UserRole.HIM_CODER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">HIM Coding Dashboard</h1>
            <p className="text-muted-foreground">
              Medical coding, chart review, and deficiency management
            </p>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <IconFileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground">Discharged encounters</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Coding</CardTitle>
                <IconClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Currently processing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                <IconFileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Finalized encounters</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged Discrepancies</CardTitle>
                <IconAlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">4</div>
                <p className="text-xs text-muted-foreground">Awaiting clinician</p>
              </CardContent>
            </Card>
          </div>

          {/* Work Queue Summary */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Work Queue Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {queueSummary.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-2xl font-bold">{item.count}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Encounter</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Coder</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.map((item) => (
                      <TableRow key={item.id + item.date}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.patient}</TableCell>
                        <TableCell className="text-muted-foreground">{item.mrn}</TableCell>
                        <TableCell>{item.action}</TableCell>
                        <TableCell className="text-muted-foreground">{item.coder}</TableCell>
                        <TableCell>
                          <Badge className={activityStatusClass[item.status]}>{item.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common coding tasks</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button onClick={() => router.push("/him-coder/encounters")}>
                  <IconClipboardList className="h-4 w-4 mr-1" />
                  Review Encounters
                </Button>
                <Button variant="outline" onClick={() => router.push("/him-coder/coding")}>
                  <IconCode className="h-4 w-4 mr-1" />
                  Assign Codes
                </Button>
                <Button variant="outline" onClick={() => router.push("/him-coder/discrepancies")}>
                  <IconFlag className="h-4 w-4 mr-1" />
                  Flag Discrepancy
                </Button>
                <Button variant="outline" onClick={() => router.push("/him-coder/finalize")}>
                  <IconFileCheck className="h-4 w-4 mr-1" />
                  Finalize Encounters
                </Button>
                <Button variant="outline" onClick={() => router.push("/him-coder/reports")}>
                  <IconChartBar className="h-4 w-4 mr-1" />
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
