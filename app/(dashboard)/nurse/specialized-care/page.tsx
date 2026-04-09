"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { dummyWardPatients } from "@/app/(dashboard)/dummy-data/dummy-nurse-ward"
import { toast } from "sonner"

// PACU-specific data
const aldreteCriteria = [
  { name: "Activity", scores: ["Unable to move (0)", "2 extremities (1)", "4 extremities (2)"] },
  { name: "Respiration", scores: ["Apneic (0)", "Dyspnea/shallow (1)", "Deep breath/cough (2)"] },
  { name: "Circulation", scores: ["BP ±50% of pre-op (0)", "BP ±20-49% (1)", "BP ±20% of pre-op (2)"] },
  { name: "Consciousness", scores: ["Unresponsive (0)", "Arousable on calling (1)", "Fully awake (2)"] },
  { name: "O2 Saturation", scores: ["SpO2 <90% (0)", "SpO2 90-92% needs O2 (1)", "SpO2 >92% on room air (2)"] },
]

const pacuPatient = dummyWardPatients.find(p => p.ward === "PACU")

// ICU monitoring data
const icuFlowsheet = [
  { time: "06:00", bp: "145/88", hr: 82, rr: 20, temp: 37.0, o2sat: 95, gcs: 12, ivFluids: "NSS @ 80mL/hr", urine: 50, intubated: false, vasopressors: "None" },
  { time: "08:00", bp: "150/90", hr: 80, rr: 18, temp: 37.1, o2sat: 96, gcs: 12, ivFluids: "NSS @ 80mL/hr", urine: 60, intubated: false, vasopressors: "None" },
  { time: "10:00", bp: "142/85", hr: 78, rr: 19, temp: 36.9, o2sat: 95, gcs: 12, ivFluids: "NSS @ 80mL/hr", urine: 55, intubated: false, vasopressors: "None" },
]

const cancerProtocols = [
  { name: "Vincristine / Daunorubicin / Prednisone (VDP)", patient: "Grace Tan", cycle: 3, day: 4, nextChemo: "2026-04-11", nadir: "Day 10-14", preChemoLab: "CBC pending" },
]

export default function SpecializedCarePage() {
  const [activeTab, setActiveTab] = useState("pacu")
  const [aldreteScores, setAldreteScores] = useState<number[]>([2, 2, 1, 1, 2])
  const totalAldrete = aldreteScores.reduce((a, b) => a + b, 0)

  const [chemoPrechecks, setChemoPrechecks] = useState<boolean[]>([false, false, false, false, false, false])
  const chemoChecklist = [
    "Verify patient identity (2-ID verification)",
    "Confirm chemotherapy order with physician",
    "Pre-medications administered (antiemetics, steroids)",
    "Baseline vital signs recorded",
    "IV access patent and verified",
    "Chemotherapy drugs double-checked with 2nd nurse",
  ]

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Specialized Care Units</h1>
            <p className="text-muted-foreground">PACU recovery monitoring, ICU flowsheet, and Oncology chemotherapy protocols.</p>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pacu">PACU</TabsTrigger>
                <TabsTrigger value="icu">ICU</TabsTrigger>
                <TabsTrigger value="oncology">Oncology / Cancer Care</TabsTrigger>
              </TabsList>

              {/* PACU Tab */}
              <TabsContent value="pacu" className="space-y-4">
                {pacuPatient && (
                  <Card>
                    <CardHeader>
                      <CardTitle>PACU Patient — {pacuPatient.patientName}</CardTitle>
                      <CardDescription>Bed {pacuPatient.bedNumber} | {pacuPatient.diagnosis} | Physician: {pacuPatient.admittingPhysician}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><Label className="text-muted-foreground">Diet Orders</Label><p>{pacuPatient.dietOrders}</p></div>
                        <div><Label className="text-muted-foreground">Medications</Label><p>{pacuPatient.currentMedications.join(", ")}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Aldrete Score */}
                <Card>
                  <CardHeader>
                    <CardTitle>Modified Aldrete Scoring System</CardTitle>
                    <CardDescription>Score ≥ 9 qualifies for discharge from PACU</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aldreteCriteria.map((criterion, idx) => (
                      <div key={criterion.name} className="space-y-2">
                        <Label className="font-medium">{criterion.name}</Label>
                        <div className="flex gap-2">
                          {criterion.scores.map((desc, score) => (
                            <Button
                              key={score}
                              size="sm"
                              variant={aldreteScores[idx] === score ? "default" : "outline"}
                              onClick={() => setAldreteScores(prev => prev.map((s, i) => i === idx ? score : s))}
                              className="text-xs"
                            >
                              {desc}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                      <span className="font-semibold">Total Aldrete Score:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{totalAldrete}/10</span>
                        <Badge variant={totalAldrete >= 9 ? "default" : "destructive"}>
                          {totalAldrete >= 9 ? "Ready for Transfer" : "Continue Monitoring"}
                        </Badge>
                      </div>
                    </div>
                    {totalAldrete >= 9 && (
                      <Button className="w-full" onClick={() => toast.success("Transfer order initiated. Notify receiving ward.")}>
                        Initiate Transfer to Ward
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ICU Tab */}
              <TabsContent value="icu" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ICU Flowsheet — Carlos Mendoza (CVA)</CardTitle>
                    <CardDescription>Bed 3B-08 | GCS Monitoring q2h | Neuro checks ordered</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>BP</TableHead>
                          <TableHead>HR</TableHead>
                          <TableHead>RR</TableHead>
                          <TableHead>Temp</TableHead>
                          <TableHead>SpO2</TableHead>
                          <TableHead>GCS</TableHead>
                          <TableHead>IV Fluids</TableHead>
                          <TableHead>Urine (mL)</TableHead>
                          <TableHead>Vasopressors</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {icuFlowsheet.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono text-sm">{row.time}</TableCell>
                            <TableCell className="font-mono">{row.bp}</TableCell>
                            <TableCell className="font-mono">{row.hr}</TableCell>
                            <TableCell className="font-mono">{row.rr}</TableCell>
                            <TableCell className="font-mono">{row.temp}°C</TableCell>
                            <TableCell className="font-mono">{row.o2sat}%</TableCell>
                            <TableCell className="font-mono font-medium">{row.gcs}</TableCell>
                            <TableCell className="text-sm">{row.ivFluids}</TableCell>
                            <TableCell className="font-mono">{row.urine}</TableCell>
                            <TableCell>{row.vasopressors}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-4">
                  <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Intake (24h)</p><p className="text-2xl font-bold font-mono">1920 mL</p></CardContent></Card>
                  <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Output (24h)</p><p className="text-2xl font-bold font-mono">1565 mL</p></CardContent></Card>
                  <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Fluid Balance</p><p className="text-2xl font-bold font-mono text-yellow-600">+355 mL</p></CardContent></Card>
                </div>
              </TabsContent>

              {/* Oncology Tab */}
              <TabsContent value="oncology" className="space-y-4">
                {cancerProtocols.map(proto => (
                  <Card key={proto.name}>
                    <CardHeader>
                      <CardTitle>{proto.patient} — {proto.name}</CardTitle>
                      <CardDescription>Cycle {proto.cycle}, Day {proto.day} | Next Chemo: {proto.nextChemo} | Nadir expected: {proto.nadir}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><Label className="text-muted-foreground">Pre-Chemo Lab</Label><p>{proto.preChemoLab}</p></div>
                        <div><Label className="text-muted-foreground">Isolation</Label><Badge variant="secondary">Neutropenic Precautions</Badge></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardHeader>
                    <CardTitle>Chemotherapy Administration Checklist</CardTitle>
                    <CardDescription>All items must be verified before initiating chemotherapy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {chemoChecklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Checkbox checked={chemoPrechecks[i]} onCheckedChange={v => setChemoPrechecks(prev => prev.map((c, idx) => idx === i ? !!v : c))} id={`chemo-${i}`} />
                        <label htmlFor={`chemo-${i}`} className="text-sm">{item}</label>
                      </div>
                    ))}
                    <Button className="w-full mt-4" disabled={!chemoPrechecks.every(Boolean)} onClick={() => toast.success("Chemotherapy administration verified and may proceed. Monitor patient closely.")}>
                      Verify & Proceed with Chemotherapy
                    </Button>
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
