"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Combobox } from "@/components/ui/combo-box"
import {
  IconUser,
  IconPill,
  IconHistory,
  IconAlertTriangle,
  IconNotes,
  IconPlus,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { InterventionNoteDialog } from "./components/intervention-note-dialog"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActiveMedication {
  id: number
  medication: string
  dose: string
  route: string
  frequency: string
  prescriber: string
  startDate: string
  status: "Active" | "On Hold"
}

interface PastMedication {
  id: number
  medication: string
  dose: string
  route: string
  frequency: string
  startDate: string
  endDate: string
  reason: string
}

interface Allergy {
  substance: string
  reaction: string
  severity: "Mild" | "Moderate" | "Severe"
}

interface DrugInteraction {
  drug1: string
  drug2: string
  severity: "Minor" | "Moderate" | "Major"
  description: string
}

interface InterventionNote {
  id: number
  date: string
  type: string
  medication: string
  note: string
  severity: string
  pharmacist: string
}

interface PatientProfile {
  id: string
  name: string
  mrn: string
  dob: string
  age: number
  weight: number
  allergies: Allergy[]
  renalFunction: string
  eGFR: number
  activeMedications: ActiveMedication[]
  pastMedications: PastMedication[]
  drugInteractions: DrugInteraction[]
  interventionNotes: InterventionNote[]
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockPatients: PatientProfile[] = [
  {
    id: "p1",
    name: "Bob Wilson",
    mrn: "MRN-003456",
    dob: "1955-03-12",
    age: 71,
    weight: 82,
    allergies: [
      { substance: "Sulfa Drugs", reaction: "Rash, Hives", severity: "Moderate" },
      { substance: "Codeine", reaction: "Nausea", severity: "Mild" },
    ],
    renalFunction: "CKD Stage 3b",
    eGFR: 38,
    activeMedications: [
      {
        id: 1,
        medication: "Warfarin Sodium",
        dose: "5 mg",
        route: "PO",
        frequency: "Once daily",
        prescriber: "Dr. Davis",
        startDate: "2026-01-15",
        status: "Active",
      },
      {
        id: 2,
        medication: "Amiodarone",
        dose: "200 mg",
        route: "PO",
        frequency: "Once daily",
        prescriber: "Dr. Davis",
        startDate: "2025-11-20",
        status: "Active",
      },
      {
        id: 3,
        medication: "Furosemide",
        dose: "40 mg",
        route: "PO",
        frequency: "Once daily",
        prescriber: "Dr. Smith",
        startDate: "2025-12-01",
        status: "Active",
      },
      {
        id: 4,
        medication: "Potassium Chloride",
        dose: "20 mEq",
        route: "PO",
        frequency: "Once daily",
        prescriber: "Dr. Smith",
        startDate: "2025-12-01",
        status: "Active",
      },
      {
        id: 5,
        medication: "Digoxin",
        dose: "0.125 mg",
        route: "PO",
        frequency: "Once daily",
        prescriber: "Dr. Davis",
        startDate: "2026-02-10",
        status: "On Hold",
      },
    ],
    pastMedications: [
      {
        id: 101,
        medication: "Metoprolol Succinate",
        dose: "50 mg",
        route: "PO",
        frequency: "Once daily",
        startDate: "2025-06-01",
        endDate: "2025-11-15",
        reason: "Switched to Amiodarone for rate control",
      },
      {
        id: 102,
        medication: "Apixaban",
        dose: "5 mg",
        route: "PO",
        frequency: "Twice daily",
        startDate: "2025-03-01",
        endDate: "2026-01-14",
        reason: "Switched to Warfarin per cardiology",
      },
    ],
    drugInteractions: [
      {
        drug1: "Warfarin",
        drug2: "Amiodarone",
        severity: "Major",
        description:
          "Amiodarone significantly increases the anticoagulant effect of Warfarin. INR monitoring required; typical dose reduction 30–50%.",
      },
      {
        drug1: "Digoxin",
        drug2: "Amiodarone",
        severity: "Moderate",
        description:
          "Amiodarone increases Digoxin levels. Monitor Digoxin concentration and reduce dose if needed.",
      },
    ],
    interventionNotes: [
      {
        id: 1001,
        date: "2026-04-08",
        type: "Drug Interaction",
        medication: "Warfarin Sodium",
        note: "Notified Dr. Davis of elevated INR (3.8) likely due to Amiodarone interaction. Recommended reducing Warfarin to 3 mg daily and recheck INR in 3 days.",
        severity: "Critical",
        pharmacist: "Pharm. Rodriguez",
      },
      {
        id: 1002,
        date: "2026-04-05",
        type: "Renal Dosing",
        medication: "Digoxin",
        note: "eGFR declined to 38. Recommended holding Digoxin and checking trough level. Prescriber agreed — order placed to hold.",
        severity: "Significant",
        pharmacist: "Pharm. Lee",
      },
    ],
  },
  {
    id: "p2",
    name: "Alice Brown",
    mrn: "MRN-004567",
    dob: "1970-07-22",
    age: 56,
    weight: 91,
    allergies: [{ substance: "Latex", reaction: "Contact Dermatitis", severity: "Severe" }],
    renalFunction: "Normal",
    eGFR: 88,
    activeMedications: [
      {
        id: 11,
        medication: "Metformin",
        dose: "500 mg",
        route: "PO",
        frequency: "Twice daily",
        prescriber: "Dr. Davis",
        startDate: "2025-08-10",
        status: "Active",
      },
      {
        id: 12,
        medication: "Insulin Glargine",
        dose: "30 units",
        route: "SubQ",
        frequency: "Once daily at bedtime",
        prescriber: "Dr. Martinez",
        startDate: "2026-03-01",
        status: "Active",
      },
      {
        id: 13,
        medication: "Lisinopril",
        dose: "10 mg",
        route: "PO",
        frequency: "Once daily",
        prescriber: "Dr. Smith",
        startDate: "2025-10-15",
        status: "Active",
      },
      {
        id: 14,
        medication: "Atorvastatin",
        dose: "40 mg",
        route: "PO",
        frequency: "Once daily at bedtime",
        prescriber: "Dr. Johnson",
        startDate: "2025-09-01",
        status: "Active",
      },
    ],
    pastMedications: [
      {
        id: 201,
        medication: "Glipizide",
        dose: "5 mg",
        route: "PO",
        frequency: "Once daily",
        startDate: "2025-01-01",
        endDate: "2026-02-28",
        reason: "Inadequate control; switched to Insulin Glargine",
      },
    ],
    drugInteractions: [
      {
        drug1: "Metformin",
        drug2: "Insulin Glargine",
        severity: "Minor",
        description:
          "Beneficial combination in Type 2 Diabetes. Monitor for hypoglycemia.",
      },
    ],
    interventionNotes: [
      {
        id: 2001,
        date: "2026-04-07",
        type: "Dose Adjustment",
        medication: "Insulin Glargine",
        note: "Reviewed BG logs — fasting glucose consistently 180–220 mg/dL. Recommended increasing Insulin Glargine to 35 units. Prescriber concurred.",
        severity: "Significant",
        pharmacist: "Pharm. Rodriguez",
      },
    ],
  },
  {
    id: "p3",
    name: "Diana Evans",
    mrn: "MRN-006789",
    dob: "1997-11-05",
    age: 29,
    weight: 58,
    allergies: [{ substance: "Aspirin", reaction: "Bronchospasm", severity: "Moderate" }],
    renalFunction: "Normal",
    eGFR: 105,
    activeMedications: [
      {
        id: 21,
        medication: "Sertraline",
        dose: "100 mg",
        route: "PO",
        frequency: "Once daily",
        prescriber: "Dr. Thompson",
        startDate: "2025-06-15",
        status: "Active",
      },
      {
        id: 22,
        medication: "Sumatriptan",
        dose: "50 mg",
        route: "PO",
        frequency: "As needed (max 200 mg/day)",
        prescriber: "Dr. Thompson",
        startDate: "2026-04-09",
        status: "Active",
      },
      {
        id: 23,
        medication: "Lorazepam",
        dose: "0.5 mg",
        route: "PO",
        frequency: "As needed for anxiety",
        prescriber: "Dr. Thompson",
        startDate: "2026-01-10",
        status: "Active",
      },
    ],
    pastMedications: [
      {
        id: 301,
        medication: "Escitalopram",
        dose: "10 mg",
        route: "PO",
        frequency: "Once daily",
        startDate: "2024-06-01",
        endDate: "2025-06-10",
        reason: "Switched to Sertraline for better efficacy",
      },
      {
        id: 302,
        medication: "Ibuprofen",
        dose: "400 mg",
        route: "PO",
        frequency: "As needed",
        startDate: "2024-01-01",
        endDate: "2025-03-01",
        reason: "Aspirin allergy cross-reactivity concern — discontinued",
      },
    ],
    drugInteractions: [
      {
        drug1: "Sertraline",
        drug2: "Sumatriptan",
        severity: "Moderate",
        description:
          "Concurrent use may increase risk of serotonin syndrome. Monitor for symptoms: agitation, tremor, hyperthermia.",
      },
    ],
    interventionNotes: [
      {
        id: 3001,
        date: "2026-04-09",
        type: "Drug Interaction",
        medication: "Sumatriptan",
        note: "Counseled patient on serotonin syndrome risk with Sertraline + Sumatriptan. Advised to report any unusual symptoms immediately. Prescriber aware and accepts risk for PRN use.",
        severity: "Significant",
        pharmacist: "Pharm. Lee",
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function PharmacistPatientsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [activeTab, setActiveTab] = useState("active-meds")
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [interventionNotes, setInterventionNotes] = useState<
    Record<string, InterventionNote[]>
  >(
    Object.fromEntries(
      mockPatients.map((p) => [p.id, p.interventionNotes])
    )
  )

  const patient = useMemo(
    () => mockPatients.find((p) => p.id === selectedPatientId) ?? null,
    [selectedPatientId]
  )

  const patientOptions = mockPatients.map((p) => ({
    value: p.id,
    label: `${p.name} — ${p.mrn}`,
  }))

  const currentNotes = patient ? interventionNotes[patient.id] ?? [] : []

  function handleSaveNote(note: {
    type: string
    medication: string
    note: string
    severity: string
  }) {
    if (!patient) return
    const typeLabels: Record<string, string> = {
      "dose-adjustment": "Dose Adjustment",
      "drug-interaction": "Drug Interaction",
      "allergy-alert": "Allergy Alert",
      "formulary-substitution": "Formulary Substitution",
      "renal-dosing": "Renal Dosing",
      "therapeutic-duplication": "Therapeutic Duplication",
      other: "Other",
    }
    const newNote: InterventionNote = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: typeLabels[note.type] ?? note.type,
      medication: note.medication,
      note: note.note,
      severity: note.severity.charAt(0).toUpperCase() + note.severity.slice(1),
      pharmacist: "Current Pharmacist",
    }
    setInterventionNotes((prev) => ({
      ...prev,
      [patient.id]: [newNote, ...(prev[patient.id] ?? [])],
    }))
    toast.success("Intervention note saved")
  }

  const severityBadge = (severity: string) => {
    switch (severity) {
      case "Mild":
      case "Minor":
        return <Badge variant="outline">{severity}</Badge>
      case "Moderate":
      case "Significant":
        return <Badge variant="warning">{severity}</Badge>
      case "Severe":
      case "Major":
      case "Critical":
        return <Badge variant="destructive">{severity}</Badge>
      case "Informational":
        return <Badge variant="secondary">{severity}</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PHARMACIST}>
      <DashboardLayout role={UserRole.PHARMACIST}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Patient Medication Profile</h1>
            <p className="text-muted-foreground">
              View comprehensive medication profiles and document pharmacist interventions
            </p>
          </div>

          {/* Patient Search */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="max-w-sm">
                  <label className="text-sm font-medium mb-2 block">
                    Select Patient
                  </label>
                  <Combobox
                    options={patientOptions}
                    value={selectedPatientId}
                    onChange={setSelectedPatientId}
                    placeholder="Search by name or MRN..."
                    emptyMessage="No patients found"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Profile */}
          {patient && (
            <>
              {/* Patient Header Card */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <IconUser className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-semibold">{patient.name}</h2>
                          <Badge variant="outline">{patient.mrn}</Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-4">
                          <div>
                            <span className="text-muted-foreground">DOB:</span>{" "}
                            {patient.dob}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Age:</span>{" "}
                            {patient.age} yrs
                          </div>
                          <div>
                            <span className="text-muted-foreground">Weight:</span>{" "}
                            {patient.weight} kg
                          </div>
                          <div>
                            <span className="text-muted-foreground">eGFR:</span>{" "}
                            <span
                              className={
                                patient.eGFR < 60 ? "font-medium text-orange-600" : ""
                              }
                            >
                              {patient.eGFR} mL/min
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Renal:</span>{" "}
                          <span
                            className={
                              patient.eGFR < 60 ? "font-medium text-orange-600" : ""
                            }
                          >
                            {patient.renalFunction}
                          </span>
                        </div>

                        {/* Allergies */}
                        <Separator className="my-3" />
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">Allergies:</span>
                          {patient.allergies.length === 0 ? (
                            <Badge variant="outline">NKDA</Badge>
                          ) : (
                            patient.allergies.map((a, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <Badge variant="outline">{a.substance}</Badge>
                                {severityBadge(a.severity)}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabbed Content */}
              <div className="px-4 lg:px-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="active-meds" className="gap-1.5">
                      <IconPill className="h-3.5 w-3.5" />
                      Active Medications
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-1.5">
                      <IconHistory className="h-3.5 w-3.5" />
                      Medication History
                    </TabsTrigger>
                    <TabsTrigger value="allergies" className="gap-1.5">
                      <IconAlertTriangle className="h-3.5 w-3.5" />
                      Allergies & Interactions
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="gap-1.5">
                      <IconNotes className="h-3.5 w-3.5" />
                      Clinical Notes
                    </TabsTrigger>
                  </TabsList>

                  {/* Active Medications */}
                  <TabsContent value="active-meds" className="mt-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          Active Medications ({patient.activeMedications.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Dose</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Prescriber</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {patient.activeMedications.map((med) => (
                                <TableRow key={med.id}>
                                  <TableCell className="font-medium">
                                    {med.medication}
                                  </TableCell>
                                  <TableCell>{med.dose}</TableCell>
                                  <TableCell>{med.route}</TableCell>
                                  <TableCell>{med.frequency}</TableCell>
                                  <TableCell>{med.prescriber}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {med.startDate}
                                  </TableCell>
                                  <TableCell>
                                    {med.status === "Active" ? (
                                      <Badge variant="default">Active</Badge>
                                    ) : (
                                      <Badge variant="warning">On Hold</Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Medication History */}
                  <TabsContent value="history" className="mt-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          Discontinued / Past Medications ({patient.pastMedications.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Dose</TableHead>
                                <TableHead>Route / Freq</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead>End</TableHead>
                                <TableHead>Reason for Discontinuation</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {patient.pastMedications.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={6}
                                    className="text-center py-6 text-muted-foreground"
                                  >
                                    No past medications recorded
                                  </TableCell>
                                </TableRow>
                              ) : (
                                patient.pastMedications.map((med) => (
                                  <TableRow key={med.id}>
                                    <TableCell className="font-medium">
                                      {med.medication}
                                    </TableCell>
                                    <TableCell>{med.dose}</TableCell>
                                    <TableCell>
                                      {med.route} / {med.frequency}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {med.startDate}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {med.endDate}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {med.reason}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Allergies & Interactions */}
                  <TabsContent value="allergies" className="mt-4 space-y-4">
                    {/* Allergy List */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          Allergies & Adverse Reactions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {patient.allergies.length === 0 ? (
                          <div className="text-sm text-muted-foreground py-4 text-center">
                            No Known Drug Allergies (NKDA)
                          </div>
                        ) : (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Substance</TableHead>
                                  <TableHead>Reaction</TableHead>
                                  <TableHead>Severity</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {patient.allergies.map((a, i) => (
                                  <TableRow key={i}>
                                    <TableCell className="font-medium">
                                      {a.substance}
                                    </TableCell>
                                    <TableCell>{a.reaction}</TableCell>
                                    <TableCell>{severityBadge(a.severity)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Drug Interactions */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          Known Drug-Drug Interactions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {patient.drugInteractions.length === 0 ? (
                          <div className="text-sm text-muted-foreground py-4 text-center">
                            No known interactions among active medications
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {patient.drugInteractions.map((interaction, i) => (
                              <div
                                key={i}
                                className="rounded-lg border p-3 space-y-1"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">
                                    {interaction.drug1}
                                  </span>
                                  <span className="text-muted-foreground">↔</span>
                                  <span className="font-medium text-sm">
                                    {interaction.drug2}
                                  </span>
                                  {severityBadge(interaction.severity)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {interaction.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Clinical Notes */}
                  <TabsContent value="notes" className="mt-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-medium">
                          Pharmacist Intervention Notes ({currentNotes.length})
                        </CardTitle>
                        <Button
                          size="sm"
                          onClick={() => setNoteDialogOpen(true)}
                        >
                          <IconPlus className="h-4 w-4 mr-1" />
                          Add Note
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {currentNotes.length === 0 ? (
                          <div className="text-sm text-muted-foreground py-8 text-center">
                            No intervention notes recorded for this patient
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {currentNotes.map((note) => (
                              <div
                                key={note.id}
                                className="rounded-lg border p-4 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary">{note.type}</Badge>
                                    {severityBadge(note.severity)}
                                    {note.medication && (
                                      <Badge variant="outline">{note.medication}</Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {note.date}
                                  </span>
                                </div>
                                <p className="text-sm">{note.note}</p>
                                <p className="text-xs text-muted-foreground">
                                  — {note.pharmacist}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}

          {/* Empty state when no patient selected */}
          {!patient && (
            <div className="px-4 lg:px-6">
              <Card>
                <CardContent className="py-16 text-center">
                  <IconUser className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Select a patient above to view their medication profile
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Intervention Note Dialog */}
        {patient && (
          <InterventionNoteDialog
            open={noteDialogOpen}
            onOpenChange={setNoteDialogOpen}
            patientName={patient.name}
            activeMedications={patient.activeMedications.map((m) => m.medication)}
            onSave={handleSaveNote}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
