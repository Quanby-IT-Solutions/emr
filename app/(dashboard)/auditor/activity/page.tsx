"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { sampleAuditLogs } from "@/lib/auditor/sample-audit-logs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconSearch } from "@tabler/icons-react"

export default function ActivityPage() {
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  const users = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>()
    for (const row of sampleAuditLogs) {
      const key = row.user?.username ?? "unknown"
      const name = row.user?.displayName ?? row.user?.username ?? "Unknown user"
      const current = map.get(key)
      map.set(key, { name, count: (current?.count ?? 0) + 1 })
    }
    return [...map.entries()]
      .map(([id, value]) => ({ id, ...value }))
      .sort((a, b) => b.count - a.count)
  }, [])

  const entities = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of sampleAuditLogs) {
      const entity = row.entityType ?? "UNSPECIFIED"
      map.set(entity, (map.get(entity) ?? 0) + 1)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [])

  const filteredEvents = useMemo(() => {
    return sampleAuditLogs
      .filter((row) => {
        const matchesAction = actionFilter === "all" || row.actionType === actionFilter
        const query = search.trim().toLowerCase()
        const matchesSearch =
          !query ||
          (row.user?.displayName ?? "").toLowerCase().includes(query) ||
          (row.user?.username ?? "").toLowerCase().includes(query) ||
          (row.entityType ?? "").toLowerCase().includes(query) ||
          (row.entityId ?? "").toLowerCase().includes(query) ||
          (row.actionType ?? "").toLowerCase().includes(query)
        return matchesAction && matchesSearch
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
  }, [search, actionFilter])

  const breakGlassCount = sampleAuditLogs.filter((row) => row.actionType === "BREAK_GLASS").length

  const actionBadge = (action: string) => {
    if (action === "BREAK_GLASS") return <Badge variant="destructive">BREAK_GLASS</Badge>
    if (action === "DELETE" || action === "UPDATE") return <Badge variant="warning">{action}</Badge>
    if (action === "READ") return <Badge variant="secondary">READ</Badge>
    return <Badge variant="outline">{action}</Badge>
  }

  return (
    <ProtectedRoute requiredRole={UserRole.AUDITOR}>
      <DashboardLayout role={UserRole.AUDITOR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">User activity</h1>
            <p className="text-muted-foreground max-w-3xl">
              Aggregated activity trends from the demo audit set. For full event-level inspection,
              use{" "}
              <Link
                href="/auditor/logs"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Audit logs
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{sampleAuditLogs.length}</p>
                <p className="text-xs text-muted-foreground">Rows in current demo set</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Unique users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">Actors observed in logs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Entities touched</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{entities.length}</p>
                <p className="text-xs text-muted-foreground">Distinct entity types</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Break-glass events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-destructive">{breakGlassCount}</p>
                <p className="text-xs text-muted-foreground">Emergency-access events</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top active users</CardTitle>
                <CardDescription>Most frequent actors in the demo period.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {users.slice(0, 6).map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    <Badge variant="outline">{user.count} events</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Most accessed entities</CardTitle>
                <CardDescription>Entity types most touched across system activity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {entities.slice(0, 6).map(([entity, count]) => (
                  <div key={entity} className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm font-medium">{entity}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent filtered activity</CardTitle>
                <CardDescription>Quickly isolate actions before opening the full logs grid.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
                  <div className="relative">
                    <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="pl-9"
                      placeholder="Search user, action, entity, or id..."
                    />
                  </div>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All actions</SelectItem>
                      <SelectItem value="CREATE">CREATE</SelectItem>
                      <SelectItem value="READ">READ</SelectItem>
                      <SelectItem value="UPDATE">UPDATE</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="LOGIN">LOGIN</SelectItem>
                      <SelectItem value="BREAK_GLASS">BREAK_GLASS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No events match the filter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="text-xs whitespace-nowrap">
                            {new Date(row.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-xs max-w-[220px] truncate">
                            {row.user?.displayName ?? row.user?.username ?? "Unknown user"}
                          </TableCell>
                          <TableCell>{actionBadge(row.actionType)}</TableCell>
                          <TableCell className="text-xs">
                            {row.entityType ?? "—"}
                            {row.entityId ? ` · ${row.entityId}` : ""}
                          </TableCell>
                          <TableCell className="text-xs font-mono">{row.ipAddress ?? "—"}</TableCell>
                        </TableRow>
                      ))
                    )}
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
