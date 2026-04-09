"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  IconPercentage,
  IconClock,
  IconAlertTriangle,
  IconTargetArrow,
  IconDownload,
} from "@tabler/icons-react"
import { toast } from "sonner"

// --- Mock KPI Data ---

const kpiCards = [
  { label: "DNFC Rate", value: "8.2%", description: "Discharged Not Final Coded", target: "< 5%", icon: IconPercentage, trending: "up" as const },
  { label: "Chart Delinquency Rate", value: "3.1%", description: "Charts past deadline", target: "< 2%", icon: IconAlertTriangle, trending: "down" as const },
  { label: "Coding Accuracy", value: "96.4%", description: "Audit sample accuracy", target: "> 95%", icon: IconTargetArrow, trending: "stable" as const },
  { label: "Avg Coding TAT", value: "1.8 days", description: "Discharge to coded", target: "< 2 days", icon: IconClock, trending: "stable" as const },
]

// --- Mock Chart Data ---

const codingVolumeData = [
  { day: "Apr 3", coded: 10, finalized: 8 },
  { day: "Apr 4", coded: 14, finalized: 12 },
  { day: "Apr 5", coded: 8, finalized: 6 },
  { day: "Apr 6", coded: 11, finalized: 9 },
  { day: "Apr 7", coded: 15, finalized: 14 },
  { day: "Apr 8", coded: 13, finalized: 10 },
  { day: "Apr 9", coded: 12, finalized: 8 },
]

const chartConfig = {
  coded: {
    label: "Coded",
    color: "var(--chart-1)",
  },
  finalized: {
    label: "Finalized",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// --- Mock Delinquent Charts ---

const delinquentCharts = [
  { id: "ENC-2026-0041", patient: "John Doe", mrn: "MRN-001", dischargeDate: "Apr 9, 2026", deficiency: "Unsigned Discharge Summary", daysDelinquent: 0, assignedTo: "Dr. Sarah Johnson" },
  { id: "ENC-2026-0038", patient: "Maria Garcia", mrn: "MRN-007", dischargeDate: "Apr 8, 2026", deficiency: "Conflicting Diagnosis", daysDelinquent: 1, assignedTo: "Dr. Michael Chen" },
  { id: "ENC-2026-0032", patient: "Ahmed Hassan", mrn: "MRN-018", dischargeDate: "Apr 6, 2026", deficiency: "Allergy List Not Reconciled", daysDelinquent: 3, assignedTo: "Dr. David Martinez" },
  { id: "ENC-2026-0030", patient: "Michael Torres", mrn: "MRN-020", dischargeDate: "Apr 5, 2026", deficiency: "Unsigned Progress Note", daysDelinquent: 4, assignedTo: "Dr. Sarah Johnson" },
  { id: "ENC-2026-0027", patient: "Lisa Nguyen", mrn: "MRN-025", dischargeDate: "Apr 3, 2026", deficiency: "Missing Operative Note", daysDelinquent: 6, assignedTo: "Dr. Lisa Park" },
]

const trendingBadge: Record<string, string> = {
  up: "bg-red-100 text-red-800 border-red-300",
  down: "bg-green-100 text-green-800 border-green-300",
  stable: "bg-blue-100 text-blue-800 border-blue-300",
}

const trendingLabel: Record<string, string> = {
  up: "↑ Trending Up",
  down: "↓ Improving",
  stable: "→ Stable",
}

export default function HIMCoderReportsPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.HIM_CODER}>
      <DashboardLayout role={UserRole.HIM_CODER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">HIM Reports</h1>
              <p className="text-muted-foreground">
                Key performance indicators and coding analytics
              </p>
            </div>
            <Button variant="outline" onClick={() => toast.info("Exporting report data...")}>
              <IconDownload className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            {kpiCards.map((kpi) => (
              <Card key={kpi.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{kpi.description}</p>
                    <Badge className={trendingBadge[kpi.trending]}>
                      {trendingLabel[kpi.trending]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Target: {kpi.target}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coding Volume Chart */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Encounters Coded per Day</CardTitle>
                <CardDescription>Last 7 days — coded vs. finalized encounters</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
                  <BarChart data={codingVolumeData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="coded" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="finalized" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Delinquent Charts Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delinquent Charts</CardTitle>
                <CardDescription>Charts with unsigned notes or unresolved deficiencies past deadline</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Encounter</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Discharge Date</TableHead>
                      <TableHead>Deficiency</TableHead>
                      <TableHead>Days Delinquent</TableHead>
                      <TableHead>Assigned To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {delinquentCharts.map((chart) => (
                      <TableRow key={chart.id}>
                        <TableCell className="font-medium">{chart.id}</TableCell>
                        <TableCell>{chart.patient}</TableCell>
                        <TableCell className="text-muted-foreground">{chart.mrn}</TableCell>
                        <TableCell className="text-muted-foreground">{chart.dischargeDate}</TableCell>
                        <TableCell>{chart.deficiency}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              chart.daysDelinquent >= 5
                                ? "bg-red-100 text-red-800 border-red-300"
                                : chart.daysDelinquent >= 2
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : "bg-gray-100 text-gray-800 border-gray-300"
                            }
                          >
                            {chart.daysDelinquent} day{chart.daysDelinquent !== 1 ? "s" : ""}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{chart.assignedTo}</TableCell>
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
