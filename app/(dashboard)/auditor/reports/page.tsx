"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import {
  actionSummaryCsv,
  breakGlassEvents,
  countByActionType,
  loginEvents,
  patientChartReads,
  privilegedOrSecurityEvents,
} from "@/lib/auditor/audit-report-metrics"
import { sampleAuditLogs } from "@/lib/auditor/sample-audit-logs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { IconDownload, IconFileAnalytics } from "@tabler/icons-react"

export default function AuditorReportsPage() {
  const byAction = countByActionType()
  const bg = breakGlassEvents()
  const chartReads = patientChartReads()
  const logins = loginEvents()
  const security = privilegedOrSecurityEvents()

  const downloadSummary = () => {
    const blob = new Blob([actionSummaryCsv()], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "audit-action-summary-demo.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.AUDITOR}>
      <DashboardLayout role={UserRole.AUDITOR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Privacy &amp; compliance reports</h1>
            <p className="text-muted-foreground max-w-3xl">
              <Link
                href="/auditor/logs"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Audit logs
              </Link>{" "}
              to inspect every event (search, filters, row detail).
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Figures below are computed from the same demo audit fixtures as Audit logs — not live
              data.
            </p>
          </div>

          <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Events in sample set</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{sampleAuditLogs.length}</p>
                <p className="text-xs text-muted-foreground">Immutable audit entries (demo)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Break-glass</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{bg.length}</p>
                <p className="text-xs text-muted-foreground">
                  TOR: emergency access with justified reason &amp; special audit
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Chart reads (PHI)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{chartReads.length}</p>
                <p className="text-xs text-muted-foreground">READ · PATIENT_CHART in demo set</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{logins.length}</p>
                <p className="text-xs text-muted-foreground">LOGIN events in demo set</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconFileAnalytics className="h-5 w-5" />
                    Activity by action type
                  </CardTitle>
                  <CardDescription>
                    Roll-up for governance review (demo counts from sample logs).
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={downloadSummary}>
                  <IconDownload className="mr-1 size-4" />
                  Export CSV (demo)
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {byAction.map(([action, n]) => (
                      <TableRow key={action}>
                        <TableCell className="font-mono text-xs">{action}</TableCell>
                        <TableCell className="text-right font-medium">{n}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Break-glass detail</CardTitle>
                <CardDescription>
                  TOR glossary — <strong>Break-glass</strong>: emergency override with extra
                  auditing. Justification is required in production.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bg.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No break-glass rows in demo set.</p>
                ) : (
                  <ul className="space-y-3 text-sm">
                    {bg.map((r) => (
                      <li
                        key={r.id}
                        className="rounded-lg border bg-muted/30 p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="destructive">BREAK_GLASS</Badge>
                          <span className="text-muted-foreground text-xs">
                            {new Date(r.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 font-medium">
                          {r.user?.displayName ?? r.user?.username ?? "Unknown user"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Entity: {r.entityType} {r.entityId ? `· ${r.entityId}` : ""}
                        </p>
                        {r.reasonForAccess ? (
                          <p className="mt-2 text-xs leading-relaxed">
                            <span className="font-medium text-foreground">Reason: </span>
                            {r.reasonForAccess}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Security &amp; oversight-related events</CardTitle>
                <CardDescription>
                  Subset of demo logs: role changes, audit-log queries, and break-glass — typical
                  privacy officer review queue.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {security.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="whitespace-nowrap text-xs">
                          {new Date(r.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate text-xs">
                          {r.user?.displayName ?? r.user?.username ?? "—"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{r.actionType}</TableCell>
                        <TableCell className="text-xs">
                          {r.entityType ?? "—"}
                          {r.entityId ? ` · ${r.entityId}` : ""}
                        </TableCell>
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
