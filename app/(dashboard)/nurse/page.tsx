"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { dummyDischargeRecords, dummyIncidentReports } from "@/app/(dashboard)/dummy-data/dummy-nurse-ward"
import { IconHeartbeat, IconUsers, IconAlertCircle, IconArrowRight, IconAlertTriangle, IconBed, IconPill } from "@tabler/icons-react"
import Link from "next/link"
import { encountersClient, type ApiEncounterDetail } from "@/lib/api/encounters-client"

function encounterBadgeVariant(type: string): "default" | "secondary" | "destructive" | "outline" {
  if (type === "EMERGENCY") return "destructive"
  if (type === "INPATIENT") return "default"
  return "secondary"
}

function bedLabel(enc: ApiEncounterDetail) {
  const loc = enc.currentLocation
  if (!loc) return "—"
  return [loc.unit, loc.bedNumber].filter(Boolean).join(" / ")
}

export default function NurseDashboard() {
  const [encounters, setEncounters] = useState<ApiEncounterDetail[]>([])
  const pendingDischarges = dummyDischargeRecords.filter(d => !d.discharged)
  const openIncidents = dummyIncidentReports.filter(r => r.status !== "Closed")

  useEffect(() => {
    encountersClient.list("ACTIVE").then(setEncounters).catch(() => {})
  }, [])

  const inpatient = encounters.filter(e => e.type === "INPATIENT")
  const emergency = encounters.filter(e => e.type === "EMERGENCY")

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Nurse Dashboard</h1>
            <p className="text-muted-foreground">Active encounters — ward census</p>
          </div>

          {/* Top Stats */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Encounters</CardTitle>
                <IconUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{encounters.length}</div>
                <p className="text-xs text-muted-foreground">{inpatient.length} inpatient, {emergency.length} emergency</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Medications</CardTitle>
                <IconPill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">—</div>
                <p className="text-xs text-muted-foreground">See MAR for details</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vitals Due</CardTitle>
                <IconHeartbeat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{encounters.length}</div>
                <p className="text-xs text-muted-foreground">All active encounters</p>
              </CardContent>
            </Card>
            <Card className={openIncidents.length > 0 ? "border-yellow-300 dark:border-yellow-700" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <IconAlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openIncidents.length}</div>
                <p className="text-xs text-muted-foreground">{openIncidents.length} incident(s)</p>
              </CardContent>
            </Card>
          </div>

          {/* Incident alerts */}
          {openIncidents.length > 0 && (
            <div className="px-4 lg:px-6">
              <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                <CardHeader><CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400"><IconAlertTriangle className="h-5 w-5" />Active Incidents</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
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
                <CardTitle className="flex items-center gap-2"><IconBed className="h-5 w-5" />Active Encounter Census</CardTitle>
                <CardDescription>Current patients with active encounters</CardDescription>
              </CardHeader>
              <CardContent>
                {encounters.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">Loading encounters...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Location</TableHead><TableHead>Patient</TableHead><TableHead>MRN</TableHead><TableHead>Type</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {encounters.map(enc => (
                        <TableRow key={enc.id}>
                          <TableCell className="font-mono text-sm">{bedLabel(enc)}</TableCell>
                          <TableCell className="font-medium">{enc.patient.lastName}, {enc.patient.firstName}</TableCell>
                          <TableCell className="text-sm">{enc.patient.mrn}</TableCell>
                          <TableCell><Badge variant={encounterBadgeVariant(enc.type)}>{enc.type}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
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
                  <Button variant="outline" asChild><Link href="/nurse/triage">Triage Assessment</Link></Button>
                  <Button variant="outline" asChild><Link href="/nurse/admission">New Admission</Link></Button>
                </CardContent>
              </Card>

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
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
