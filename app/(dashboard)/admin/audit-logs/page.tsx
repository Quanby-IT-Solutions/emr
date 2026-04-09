"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dummyAuditLogs, AuditModule, AuditActionType } from "@/app/(dashboard)/dummy-data/dummy-audit-logs"
import { IconSearch, IconDownload, IconAlertTriangle } from "@tabler/icons-react"
import { toast } from "sonner"
import { exportToCSV, exportToPrintableHTML } from "@/lib/export-utils"

const modules: AuditModule[] = ["Scheduling", "Registration", "Nursing", "Pharmacy", "Laboratory", "System", "User Management", "Billing"]
const actions: AuditActionType[] = ["CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "EXPORT", "PRINT"]

function getActionColor(action: AuditActionType) {
  switch (action) {
    case "CREATE": return "default"
    case "READ": return "secondary"
    case "UPDATE": return "outline"
    case "DELETE": return "destructive"
    case "LOGIN": case "LOGOUT": return "secondary"
    default: return "outline"
  }
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterModule, setFilterModule] = useState("all")
  const [filterAction, setFilterAction] = useState("all")

  const filteredLogs = useMemo(() => {
    return dummyAuditLogs.filter(log => {
      const matchSearch = log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchModule = filterModule === "all" || log.module === filterModule
      const matchAction = filterAction === "all" || log.action === filterAction
      return matchSearch && matchModule && matchAction
    })
  }, [searchQuery, filterModule, filterAction])

  const securityEvents = dummyAuditLogs.filter(l => l.isSecurityEvent)

  const moduleStats = useMemo(() => {
    const counts: Record<string, number> = {}
    dummyAuditLogs.forEach(l => { counts[l.module] = (counts[l.module] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [])

  const handleExport = (format: string) => {
    const cols = [
      { key: "timestamp" as const, header: "Timestamp" },
      { key: "userName" as const, header: "User" },
      { key: "userRole" as const, header: "Role" },
      { key: "action" as const, header: "Action" },
      { key: "module" as const, header: "Module" },
      { key: "description" as const, header: "Description" },
      { key: "ipAddress" as const, header: "IP Address" },
    ]
    const rows = filteredLogs.map(l => ({ ...l, timestamp: new Date(l.timestamp).toLocaleString() }))
    if (format === "Excel") {
      exportToCSV(rows, cols, `audit-logs-${new Date().toISOString().split("T")[0]}`)
      toast.success("Audit log exported as CSV")
    } else {
      exportToPrintableHTML(rows, cols, "Audit Log Report", `Filtered: ${filteredLogs.length} records`)
      toast.success("Audit report opened for printing")
    }
  }

  return (
    <ProtectedRoute requiredRole={UserRole.SYSTEM_ADMIN}>
      <DashboardLayout role={UserRole.SYSTEM_ADMIN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Audit Log & System Reports</h1>
              <p className="text-muted-foreground">Full traceability of all system actions for compliance and accountability.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}><IconDownload className="mr-2 h-4 w-4" />Export PDF</Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("Excel")}><IconDownload className="mr-2 h-4 w-4" />Export Excel</Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="all-logs">
              <TabsList>
                <TabsTrigger value="all-logs">All Logs</TabsTrigger>
                <TabsTrigger value="security">Security Events ({securityEvents.length})</TabsTrigger>
                <TabsTrigger value="module-report">Module Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="all-logs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Action Log</CardTitle>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
                      <div className="relative flex-1">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by user or description..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                      </div>
                      <Select value={filterModule} onValueChange={setFilterModule}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Module" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Modules</SelectItem>
                          {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={filterAction} onValueChange={setFilterAction}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Action" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Actions</SelectItem>
                          {actions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Module</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>IP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.map(log => (
                          <TableRow key={log.id} className={log.isSecurityEvent ? "bg-red-50 dark:bg-red-950/20" : ""}>
                            <TableCell className="text-xs font-mono whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                            <TableCell className="font-medium">{log.userName}</TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">{log.userRole}</Badge></TableCell>
                            <TableCell><Badge variant={getActionColor(log.action)}>{log.action}</Badge></TableCell>
                            <TableCell className="text-sm">{log.module}</TableCell>
                            <TableCell className="max-w-[300px] truncate text-sm">{log.description}</TableCell>
                            <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><IconAlertTriangle className="h-5 w-5 text-red-500" />Security Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>IP Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {securityEvents.map(log => (
                          <TableRow key={log.id} className="bg-red-50 dark:bg-red-950/20">
                            <TableCell className="text-xs font-mono whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                            <TableCell className="font-medium">{log.userName}</TableCell>
                            <TableCell><Badge variant="destructive">{log.action}</Badge></TableCell>
                            <TableCell className="max-w-[400px] text-sm">{log.description}</TableCell>
                            <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="module-report" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>Module Activity Summary</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {moduleStats.map(([mod, count]) => (
                        <Card key={mod}>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{count}</div>
                            <p className="text-sm text-muted-foreground">{mod}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
