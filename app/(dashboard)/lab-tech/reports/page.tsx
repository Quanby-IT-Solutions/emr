"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  IconClockHour4,
  IconFlask,
  IconAlertTriangle,
  IconHourglass,
  IconCheck,
  IconX,
} from "@tabler/icons-react"

import {
  tatEntries,
  criticalValueLog,
  testVolumes,
} from "@/app/(dashboard)/dummy-data/dummy-lab-orders"

export default function LabTechReportsPage() {
  const [activeTab, setActiveTab] = useState("tat")

  // KPI calculations
  const avgTAT = Math.round(tatEntries.reduce((sum, e) => sum + e.tatMinutes, 0) / tatEntries.length)
  const testsThisWeek = testVolumes.reduce((sum, v) => sum + v.thisWeek, 0)
  const criticalThisWeek = criticalValueLog.length
  const overdueCount = tatEntries.filter(e => !e.withinTarget).length

  return (
    <ProtectedRoute requiredRole={UserRole.LAB_TECH}>
      <DashboardLayout role={UserRole.LAB_TECH}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">
              Laboratory performance metrics and analytics
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average TAT</CardTitle>
                <IconClockHour4 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgTAT} min</div>
                <p className="text-xs text-muted-foreground">Across all recent tests</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tests This Week</CardTitle>
                <IconFlask className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testsThisWeek}</div>
                <p className="text-xs text-muted-foreground">Total across all panels</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Values</CardTitle>
                <IconAlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalThisWeek}</div>
                <p className="text-xs text-muted-foreground">Recent critical results</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exceeded TAT Target</CardTitle>
                <IconHourglass className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{overdueCount}</div>
                <p className="text-xs text-muted-foreground">Tests beyond target TAT</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Reports */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="tat">Turnaround Time</TabsTrigger>
                    <TabsTrigger value="critical">Critical Value Log</TabsTrigger>
                    <TabsTrigger value="volume">Test Volume</TabsTrigger>
                  </TabsList>

                  {/* TAT Tab */}
                  <TabsContent value="tat" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Test Panel</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Ordered</TableHead>
                          <TableHead>Collected</TableHead>
                          <TableHead>Resulted</TableHead>
                          <TableHead>TAT</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tatEntries.map(entry => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.patient}</TableCell>
                            <TableCell>{entry.testPanel}</TableCell>
                            <TableCell>
                              <Badge variant={entry.priority === "STAT" ? "destructive" : entry.priority === "URGENT" ? "warning" : "secondary"}>
                                {entry.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{entry.orderedAt}</TableCell>
                            <TableCell className="text-sm">{entry.collectedAt}</TableCell>
                            <TableCell className="text-sm">{entry.resultedAt}</TableCell>
                            <TableCell className="font-medium">{entry.tatMinutes} min</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{entry.targetMinutes} min</TableCell>
                            <TableCell>
                              {entry.withinTarget ? (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                  <IconCheck className="h-3 w-3" />
                                  Within Target
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="gap-1 text-xs">
                                  <IconX className="h-3 w-3" />
                                  Exceeded
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* Critical Value Log Tab */}
                  <TabsContent value="critical" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>MRN</TableHead>
                          <TableHead>Test</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Flag</TableHead>
                          <TableHead>Notified Clinician</TableHead>
                          <TableHead>Acknowledged</TableHead>
                          <TableHead>Resulted At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {criticalValueLog.map(entry => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.patient}</TableCell>
                            <TableCell>{entry.mrn}</TableCell>
                            <TableCell>{entry.test}</TableCell>
                            <TableCell className="font-bold text-red-600 dark:text-red-400">{entry.value}</TableCell>
                            <TableCell>
                              <Badge variant="destructive" className="text-xs">{entry.flag}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{entry.notifiedClinician}</TableCell>
                            <TableCell>
                              {entry.acknowledged ? (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                  <IconCheck className="h-3 w-3" />
                                  Yes · {entry.acknowledgedAt}
                                </Badge>
                              ) : (
                                <Badge variant="warning" className="gap-1 text-xs">
                                  <IconX className="h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">{entry.resultedAt}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* Test Volume Tab */}
                  <TabsContent value="volume" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test Panel</TableHead>
                          <TableHead className="text-right">Today</TableHead>
                          <TableHead className="text-right">This Week</TableHead>
                          <TableHead className="text-right">This Month</TableHead>
                          <TableHead className="text-right">Critical Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testVolumes.map(entry => (
                          <TableRow key={entry.testPanel}>
                            <TableCell className="font-medium">{entry.testPanel}</TableCell>
                            <TableCell className="text-right">{entry.today}</TableCell>
                            <TableCell className="text-right">{entry.thisWeek}</TableCell>
                            <TableCell className="text-right">{entry.thisMonth}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={parseFloat(entry.criticalRate) > 2 ? "warning" : "secondary"} className="text-xs">
                                {entry.criticalRate}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* Totals Row */}
                        <TableRow className="border-t-2 font-bold">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">{testVolumes.reduce((s, v) => s + v.today, 0)}</TableCell>
                          <TableCell className="text-right">{testVolumes.reduce((s, v) => s + v.thisWeek, 0)}</TableCell>
                          <TableCell className="text-right">{testVolumes.reduce((s, v) => s + v.thisMonth, 0)}</TableCell>
                          <TableCell className="text-right">—</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
