"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { dummyWardPatients, dummyDischargeRecords, dummyIncidentReports } from "@/app/(dashboard)/dummy-data/dummy-nurse-ward"
import { IconPill, IconHeartbeat, IconUsers, IconAlertCircle, IconArrowRight, IconAlertTriangle, IconBed } from "@tabler/icons-react"
import Link from "next/link"

export default function NurseDashboard() {
  const assignedPatients = dummyWardPatients.filter(p => p.ward.includes("Ward 3B"))
  const criticalPatients = dummyWardPatients.filter(p => p.status === "Critical")
  const forDischarge = dummyWardPatients.filter(p => p.status === "For Discharge")
  const isolationPatients = dummyWardPatients.filter(p => p.isolationPrecautions !== null)
  const pendingDischarges = dummyDischargeRecords.filter(d => !d.discharged)
  const openIncidents = dummyIncidentReports.filter(r => r.status !== "Closed")

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Nurse Dashboard — Ward 3B</h1>
            <p className="text-muted-foreground">Shift: AM (7:00–15:00) | Nurse Joy Reyes | April 9, 2026</p>
          </div>

          {/* Top Stats */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assigned Patients</CardTitle>
                <IconUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignedPatients.length}</div>
                <p className="text-xs text-muted-foreground">{criticalPatients.length} critical, {forDischarge.length} for discharge</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Medications</CardTitle>
                <IconPill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Next due: 10:00 AM (3 meds)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vitals Due</CardTitle>
                <IconHeartbeat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">2 overdue (highlighted below)</p>
              </CardContent>
            </Card>
            <Card className={openIncidents.length > 0 ? "border-yellow-300 dark:border-yellow-700" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <IconAlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openIncidents.length + isolationPatients.length}</div>
                <p className="text-xs text-muted-foreground">{openIncidents.length} incident(s), {isolationPatients.length} isolation</p>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          {(criticalPatients.length > 0 || openIncidents.length > 0) && (
            <div className="px-4 lg:px-6">
              <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                <CardHeader><CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400"><IconAlertTriangle className="h-5 w-5" />Critical Alerts</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {criticalPatients.map(p => (
                      <div key={p.id} className="flex items-center justify-between rounded-lg border border-red-200 dark:border-red-800 p-3">
                        <div>
                          <p className="font-medium">{p.patientName} — Bed {p.bedNumber}</p>
                          <p className="text-sm text-muted-foreground">{p.diagnosis}</p>
                        </div>
                        <Badge variant="destructive">{p.status}</Badge>
                      </div>
                    ))}
                    {openIncidents.map(ir => (
                      <div key={ir.id} className="flex items-center justify-between rounded-lg border border-yellow-200 dark:border-yellow-800 p-3">
                        <div>
                          <p className="font-medium">{ir.incidentType} — {ir.patientName ?? "No patient"}</p>
                          <p className="text-sm text-muted-foreground">{ir.incidentDate} {ir.incidentTime}</p>
                        </div>
                        <Badge variant="secondary">{ir.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            {/* Ward Census */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><IconBed className="h-5 w-5" />Ward Census</CardTitle>
                <CardDescription>Current patient assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Bed</TableHead><TableHead>Patient</TableHead><TableHead>Diagnosis</TableHead><TableHead>Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedPatients.map(p => (
                      <TableRow key={p.id} className={p.status === "Critical" ? "bg-red-50 dark:bg-red-950/20" : ""}>
                        <TableCell className="font-mono text-sm">{p.bedNumber}</TableCell>
                        <TableCell className="font-medium">{p.patientName}{p.isolationPrecautions && <Badge variant="outline" className="ml-2 text-xs">⚠ {p.isolationPrecautions}</Badge>}</TableCell>
                        <TableCell className="text-sm">{p.diagnosis}</TableCell>
                        <TableCell><Badge variant={p.status === "Critical" ? "destructive" : p.status === "For Discharge" ? "default" : p.status === "For Observation" ? "secondary" : "outline"}>{p.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Quick Actions + Pending Discharges */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                <CardContent className="grid gap-2 grid-cols-2">
                  <Button asChild><Link href="/nurse/vitals">Record Vital Signs</Link></Button>
                  <Button variant="outline" asChild><Link href="/nurse/medications">Administer Medication</Link></Button>
                  <Button variant="outline" asChild><Link href="/nurse/clinical-docs">New Clinical Note</Link></Button>
                  <Button variant="outline" asChild><Link href="/nurse/discharge">Discharge Checklist</Link></Button>
                  <Button variant="outline" asChild><Link href="/nurse/reports">Shift Endorsement</Link></Button>
                  <Button variant="outline" asChild><Link href="/nurse/admission">New Admission</Link></Button>
                </CardContent>
              </Card>

              {/* Pending Discharges */}
              {pendingDischarges.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Pending Discharges</CardTitle></CardHeader>
                  <CardContent>
                    {pendingDischarges.map(d => {
                      const completed = Object.values(d.checklist).filter(Boolean).length
                      const total = Object.keys(d.checklist).length
                      return (
                        <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{d.patientName} — Bed {d.bedNumber}</p>
                            <p className="text-sm text-muted-foreground">Checklist: {completed}/{total} completed</p>
                          </div>
                          <Button size="sm" variant="outline" asChild><Link href="/nurse/discharge"><IconArrowRight className="h-4 w-4" /></Link></Button>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Isolation Patients */}
              {isolationPatients.length > 0 && (
                <Card className="border-yellow-200 dark:border-yellow-800">
                  <CardHeader><CardTitle className="text-yellow-700 dark:text-yellow-400">Isolation Precautions</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {isolationPatients.map(p => (
                        <div key={p.id} className="flex items-center justify-between text-sm">
                          <span>{p.patientName} — {p.bedNumber}</span>
                          <Badge variant="outline">{p.isolationPrecautions}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
