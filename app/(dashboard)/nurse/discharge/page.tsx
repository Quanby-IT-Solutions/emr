"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { DischargeRecord, DischargeStep } from "@/app/(dashboard)/dummy-data/dummy-nurse-ward"
import { toast } from "sonner"
import { IconChecklist, IconClipboardCheck } from "@tabler/icons-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { encountersClient, type ApiEncounterDetail } from "@/lib/api/encounters-client"
import { DISCHARGE_STEPS } from "@/lib/services/encounters"

const CHECKLIST_STEPS = DISCHARGE_STEPS as readonly DischargeStep[]

function buildChecklist(stored: Record<string, boolean> | null): Record<DischargeStep, boolean> {
  const defaults = Object.fromEntries(CHECKLIST_STEPS.map((s) => [s, false])) as Record<DischargeStep, boolean>
  if (!stored) return defaults
  return { ...defaults, ...stored } as Record<DischargeStep, boolean>
}

function encounterToRecord(enc: ApiEncounterDetail): DischargeRecord {
  return {
    id: enc.id,
    patientId: enc.patient.id,
    patientName: `${enc.patient.firstName} ${enc.patient.lastName}`,
    hospitalNumber: enc.patient.mrn,
    ward: enc.currentLocation?.unit ?? "-",
    bedNumber: enc.currentLocation?.bedNumber ?? "-",
    admissionDate: enc.startDateTime?.split("T")[0] ?? "-",
    dischargeOrderDate: enc.startDateTime?.split("T")[0] ?? "-",
    dischargeOrderBy: enc.attendingProvider
      ? `${enc.attendingProvider.firstName} ${enc.attendingProvider.lastName}`
      : "-",
    checklist: buildChecklist(enc.dischargeChecklist),
    homeInstructions: "-",
    followUpDate: null,
    followUpClinic: null,
    dischargeVitals: null,
    discharged: enc.status === "DISCHARGED",
    dischargeDate: enc.endDateTime?.split("T")[0] ?? null,
  }
}

export default function DischargeManagementPage() {
  const queryClient = useQueryClient()
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(null)
  const [vitalsOpen, setVitalsOpen] = useState(false)
  const [vitalsData, setVitalsData] = useState({ bp: "", hr: "", rr: "", temp: "", o2sat: "" })

  const { data: encounters = [], isLoading } = useQuery({
    queryKey: ["encounters", "ACTIVE"],
    queryFn: () => encountersClient.list("ACTIVE"),
  })

  const records = encounters.map(encounterToRecord)
  const selectedRecord = records.find((r) => r.id === selectedEncounterId) ?? null

  const checklistMutation = useMutation({
    mutationFn: ({ encounterId, patch }: { encounterId: string; patch: Record<string, boolean> }) =>
      encountersClient.updateDischargeChecklist(encounterId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encounters", "ACTIVE"] })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to update checklist")
    },
  })

  const vitalsMutation = useMutation({
    mutationFn: ({
      encounterId,
      vitals,
    }: {
      encounterId: string
      vitals: { observationType: string; value: string; unit?: string }[]
    }) =>
      Promise.all(
        vitals.map((v) => encountersClient.recordObservation(encounterId, v))
      ),
    onSuccess: (_, { encounterId }) => {
      checklistMutation.mutate({
        encounterId,
        patch: { "Final Vitals": true },
      })
      toast.success("Discharge vitals recorded")
      setVitalsOpen(false)
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to record vitals")
    },
  })

  const dischargeMutation = useMutation({
    mutationFn: (encounterId: string) => encountersClient.discharge(encounterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encounters", "ACTIVE"] })
      setDetailOpen(false)
      toast.success("Patient discharged successfully")
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Discharge failed — check checklist is complete")
    },
  })

  const handleToggleStep = (encounterId: string, step: DischargeStep, current: boolean) => {
    checklistMutation.mutate({ encounterId, patch: { [step]: !current } })
  }

  const handleRecordVitals = () => {
    if (!selectedEncounterId || !vitalsData.bp || !vitalsData.hr) {
      toast.error("Please fill in vitals")
      return
    }
    const [systolic, diastolic] = vitalsData.bp.split("/")
    const vitals = [
      systolic && { observationType: "SYSTOLIC_BP", value: systolic.trim(), unit: "MMHG" },
      diastolic && { observationType: "DIASTOLIC_BP", value: diastolic.trim(), unit: "MMHG" },
      vitalsData.hr && { observationType: "HEART_RATE", value: vitalsData.hr, unit: "BPM" },
      vitalsData.rr && { observationType: "RESPIRATORY_RATE", value: vitalsData.rr, unit: "BRPM" },
      vitalsData.temp && { observationType: "TEMPERATURE", value: vitalsData.temp, unit: "CELSIUS" },
      vitalsData.o2sat && { observationType: "SPO2", value: vitalsData.o2sat, unit: "PERCENT" },
    ].filter(Boolean) as { observationType: string; value: string; unit: string }[]

    vitalsMutation.mutate({ encounterId: selectedEncounterId, vitals })
  }

  const handleCompleteDischarge = (encounterId: string) => {
    const record = records.find((r) => r.id === encounterId)
    if (!record) return
    const allComplete = Object.values(record.checklist).every(Boolean)
    if (!allComplete) {
      toast.error("Please complete all checklist items before discharge")
      return
    }
    dischargeMutation.mutate(encounterId)
  }

  const activeRecords = records.filter((r) => !r.discharged)
  const completedRecords = records.filter((r) => r.discharged)

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <IconChecklist className="h-6 w-6" />
              Discharge Management
            </h1>
            <p className="text-muted-foreground">
              Manage discharge checklists, final vitals, home instructions, and clearances.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Active Patients</p>
                <p className="text-3xl font-bold">{records.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{activeRecords.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Discharged</p>
                <p className="text-3xl font-bold text-green-600">{completedRecords.length}</p>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Discharge Checklists</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center text-muted-foreground py-8">Loading patients...</p>
                ) : activeRecords.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No active patients.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {activeRecords.map((r) => {
                      const completed = Object.values(r.checklist).filter(Boolean).length
                      const total = Object.keys(r.checklist).length
                      const percentage = Math.round((completed / total) * 100)
                      return (
                        <Card key={r.id} className="border">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="font-medium text-lg">{r.patientName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {r.hospitalNumber} — Bed {r.bedNumber} — {r.dischargeOrderBy}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant={percentage === 100 ? "default" : "secondary"}>
                                  {completed}/{total} ({percentage}%)
                                </Badge>
                                <Button
                                  size="sm"
                                  className="ml-2"
                                  onClick={() => {
                                    setSelectedEncounterId(r.id)
                                    setDetailOpen(true)
                                  }}
                                >
                                  <IconClipboardCheck className="h-4 w-4 mr-1" />
                                  Manage
                                </Button>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="grid grid-cols-4 gap-2 mt-3">
                              {CHECKLIST_STEPS.map((step) => (
                                <div key={step} className="flex items-center gap-1">
                                  <Checkbox
                                    checked={r.checklist[step]}
                                    onCheckedChange={() =>
                                      handleToggleStep(r.id, step, r.checklist[step])
                                    }
                                    id={`${r.id}-${step}`}
                                  />
                                  <label
                                    htmlFor={`${r.id}-${step}`}
                                    className={`text-xs ${r.checklist[step] ? "line-through text-muted-foreground" : ""}`}
                                  >
                                    {step}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {completedRecords.length > 0 && (
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Discharges</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Hospital #</TableHead>
                        <TableHead>Ward/Bed</TableHead>
                        <TableHead>Discharge Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedRecords.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.patientName}</TableCell>
                          <TableCell className="font-mono text-sm">{r.hospitalNumber}</TableCell>
                          <TableCell>
                            {r.ward} — {r.bedNumber}
                          </TableCell>
                          <TableCell>{r.dischargeDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Discharge Checklist — {selectedRecord?.patientName}</DialogTitle>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Hospital #</Label>
                    <p className="font-mono">{selectedRecord.hospitalNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ward / Bed</Label>
                    <p>
                      {selectedRecord.ward} — {selectedRecord.bedNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Attending Provider</Label>
                    <p>{selectedRecord.dischargeOrderBy}</p>
                  </div>
                </div>

                <hr />
                <div>
                  <h3 className="font-semibold mb-2">Checklist Steps</h3>
                  <div className="space-y-2">
                    {CHECKLIST_STEPS.map((step) => (
                      <div key={step} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedRecord.checklist[step]}
                            onCheckedChange={() =>
                              handleToggleStep(
                                selectedRecord.id,
                                step,
                                selectedRecord.checklist[step]
                              )
                            }
                            disabled={checklistMutation.isPending}
                          />
                          <span
                            className={`text-sm ${selectedRecord.checklist[step] ? "line-through text-muted-foreground" : ""}`}
                          >
                            {step}
                          </span>
                        </div>
                        {step === "Final Vitals" && !selectedRecord.checklist["Final Vitals"] && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setVitalsOpen(true)
                              setVitalsData({ bp: "", hr: "", rr: "", temp: "", o2sat: "" })
                            }}
                          >
                            Record
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailOpen(false)}>
                Close
              </Button>
              {selectedRecord && !selectedRecord.discharged && (
                <Button
                  onClick={() => handleCompleteDischarge(selectedRecord.id)}
                  disabled={
                    !Object.values(selectedRecord.checklist).every(Boolean) ||
                    dischargeMutation.isPending
                  }
                >
                  {dischargeMutation.isPending ? "Processing..." : "Complete Discharge"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={vitalsOpen} onOpenChange={setVitalsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Discharge Vitals</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>BP</Label>
                <Input
                  value={vitalsData.bp}
                  onChange={(e) => setVitalsData((p) => ({ ...p, bp: e.target.value }))}
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-2">
                <Label>HR</Label>
                <Input
                  type="number"
                  value={vitalsData.hr}
                  onChange={(e) => setVitalsData((p) => ({ ...p, hr: e.target.value }))}
                  placeholder="bpm"
                />
              </div>
              <div className="space-y-2">
                <Label>RR</Label>
                <Input
                  type="number"
                  value={vitalsData.rr}
                  onChange={(e) => setVitalsData((p) => ({ ...p, rr: e.target.value }))}
                  placeholder="/min"
                />
              </div>
              <div className="space-y-2">
                <Label>Temp (°C)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={vitalsData.temp}
                  onChange={(e) => setVitalsData((p) => ({ ...p, temp: e.target.value }))}
                  placeholder="36.5"
                />
              </div>
              <div className="space-y-2">
                <Label>SpO2 (%)</Label>
                <Input
                  type="number"
                  value={vitalsData.o2sat}
                  onChange={(e) => setVitalsData((p) => ({ ...p, o2sat: e.target.value }))}
                  placeholder="98"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setVitalsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRecordVitals} disabled={vitalsMutation.isPending}>
                {vitalsMutation.isPending ? "Saving..." : "Save Vitals"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
