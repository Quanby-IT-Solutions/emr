"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  IconServer,
  IconUsers,
  IconTool,
  IconAlertTriangle,
  IconUserPlus,
  IconKey,
  IconShieldCheck,
  IconSettings,
  IconCalendar,
} from "@tabler/icons-react"
import Link from "next/link"

const systemAlerts = [
  { id: 1, type: "warning", message: "Disk usage at 82% on DB Server", time: "5 min ago" },
  { id: 2, type: "error", message: "3 failed login attempts from external IP 45.33.128.77", time: "32 min ago" },
  { id: 3, type: "info", message: "Scheduled maintenance window: April 12, 2:00-4:00 AM", time: "1 hr ago" },
]

const recentActivity = [
  { user: "Dr. Jose Rivera", role: "Clinician", action: "Login", time: "08:15 AM", ip: "192.168.1.45" },
  { user: "Ana Cruz", role: "Registrar", action: "Login", time: "08:12 AM", ip: "192.168.1.22" },
  { user: "Nurse Joy Reyes", role: "Nurse", action: "Update Vitals", time: "08:05 AM", ip: "192.168.1.67" },
  { user: "Admin User", role: "SysAdmin", action: "Deactivate Account", time: "07:58 AM", ip: "192.168.1.10" },
  { user: "RPh. Grace Tan", role: "Pharmacist", action: "Login", time: "07:45 AM", ip: "192.168.1.88" },
]

const announcements = [
  { id: 1, title: "System Update v3.2.1", message: "New PhilHealth module integration deployed successfully.", date: "Apr 9" },
  { id: 2, title: "Scheduled Downtime", message: "Database maintenance scheduled for April 12, 2:00-4:00 AM.", date: "Apr 8" },
  { id: 3, title: "New User Training", message: "HIS training for new residents on April 15, Conference Room A.", date: "Apr 7" },
]

const maintenanceSchedule = [
  { task: "Database Backup & Optimization", date: "Apr 12", time: "2:00-3:00 AM", status: "Scheduled" },
  { task: "Network Switch Firmware Update", date: "Apr 14", time: "12:00-1:00 AM", status: "Scheduled" },
  { task: "SSL Certificate Renewal", date: "Apr 20", time: "All Day", status: "Pending" },
]

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole={UserRole.SYSTEM_ADMIN}>
      <DashboardLayout role={UserRole.SYSTEM_ADMIN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">System Administration Dashboard</h1>
            <p className="text-muted-foreground">Real-time overview of system health, users, and IT requests.</p>
          </div>

          {/* System Health & Stats Cards */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Server Status</CardTitle>
                <IconServer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-2xl font-bold">Online</span>
                </div>
                <p className="text-xs text-muted-foreground">Uptime: 99.97% · 45 active sessions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <IconUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">328 total registered · 12 new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending IT Requests</CardTitle>
                <IconTool className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">3 in progress · 1 critical</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-muted-foreground">2 failed logins · 1 lockout in last 24h</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Panel */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button asChild><Link href="/admin/users"><IconUserPlus className="mr-2 h-4 w-4" />Add User</Link></Button>
                  <Button variant="outline" asChild><Link href="/admin/users"><IconKey className="mr-2 h-4 w-4" />Reset Password</Link></Button>
                  <Button variant="outline" asChild><Link href="/admin/audit-logs"><IconShieldCheck className="mr-2 h-4 w-4" />View Audit Log</Link></Button>
                  <Button variant="outline" asChild><Link href="/admin/system-config"><IconSettings className="mr-2 h-4 w-4" />System Config</Link></Button>
                  <Button variant="outline" asChild><Link href="/admin/it-requests"><IconTool className="mr-2 h-4 w-4" />IT Requests</Link></Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-2 lg:px-6">
            {/* System Alerts */}
            <Card>
              <CardHeader><CardTitle className="text-lg">System Alerts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {systemAlerts.map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <IconAlertTriangle className={`h-5 w-5 mt-0.5 ${alert.type === "error" ? "text-red-500" : alert.type === "warning" ? "text-yellow-500" : "text-blue-500"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Announcements */}
            <Card>
              <CardHeader><CardTitle className="text-lg">System Announcements</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{a.title}</p>
                      <Badge variant="secondary">{a.date}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{a.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* User Activity Log Snapshot */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">User Activity Log Snapshot</CardTitle>
                  <Button variant="ghost" size="sm" asChild><Link href="/admin/audit-logs">View All</Link></Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.map((a, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{a.user}</TableCell>
                        <TableCell><Badge variant="outline">{a.role}</Badge></TableCell>
                        <TableCell>{a.action}</TableCell>
                        <TableCell>{a.time}</TableCell>
                        <TableCell className="font-mono text-xs">{a.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Scheduled Maintenance Calendar */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><IconCalendar className="h-5 w-5" />Scheduled Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceSchedule.map((m, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{m.task}</TableCell>
                        <TableCell>{m.date}</TableCell>
                        <TableCell>{m.time}</TableCell>
                        <TableCell><Badge variant={m.status === "Scheduled" ? "default" : "secondary"}>{m.status}</Badge></TableCell>
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