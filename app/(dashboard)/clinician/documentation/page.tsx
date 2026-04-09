"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { IconFilePlus } from "@tabler/icons-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRole } from "@/lib/auth/roles"
import { NewNoteDialog, type NoteTemplate } from "./components/new-note-dialog"
import { NoteDetailSheet, type ClinicalNote } from "./components/note-detail-sheet"

const mockNotes: ClinicalNote[] = [
  {
    id: "note-001",
    date: "Apr 9, 2026 08:15",
    patientId: "1",
    patientName: "John Doe",
    mrn: "MRN-001",
    noteType: "SOAP Progress Note",
    status: "Signed",
    author: "Dr. Sarah Johnson",
    isTrainee: false,
    signedBy: "Dr. Sarah Johnson",
    signedAt: "Apr 9, 2026 08:20",
    sections: [
      { title: "Subjective", content: "Patient reports improved shortness of breath overnight." },
      { title: "Objective", content: "Vitals stable. Lungs clear to auscultation bilaterally." },
      { title: "Assessment", content: "Improving diabetic control with stable respiratory status." },
      { title: "Plan", content: "Continue current regimen and reassess after afternoon labs." },
    ],
    addenda: [],
  },
  {
    id: "note-002",
    date: "Apr 9, 2026 07:10",
    patientId: "2",
    patientName: "Jane Smith",
    mrn: "MRN-002",
    noteType: "Telephone Encounter",
    status: "Draft",
    author: "Dr. David Martinez",
    isTrainee: false,
    sections: [
      { title: "Reason for Call", content: "Patient called regarding persistent cough and medication refill." },
      { title: "Discussion", content: "Reviewed inhaler technique and symptom escalation precautions." },
      { title: "Plan", content: "Refill albuterol and arrange follow-up if symptoms worsen." },
    ],
    addenda: [],
  },
  {
    id: "note-003",
    date: "Apr 8, 2026 18:40",
    patientId: "3",
    patientName: "Bob Wilson",
    mrn: "MRN-003",
    noteType: "Consultation",
    status: "Cosigned",
    author: "Dr. Emily Carter, PGY-2",
    isTrainee: true,
    signedBy: "Dr. Emily Carter, PGY-2",
    signedAt: "Apr 8, 2026 18:45",
    cosignedBy: "Dr. Lisa Park",
    cosignedAt: "Apr 8, 2026 19:05",
    sections: [
      { title: "Reason for Consultation", content: "Evaluate progressive renal dysfunction and electrolyte abnormalities." },
      { title: "HPI", content: "Three-day decline in urine output with rising creatinine." },
      { title: "Findings", content: "Volume overloaded, no emergent dialysis indication today." },
      { title: "Recommendations", content: "Strict I/O monitoring, nephrology follow-up, repeat BMP at 14:00." },
    ],
    addenda: [],
  },
  {
    id: "note-004",
    date: "Apr 8, 2026 16:20",
    patientId: "4",
    patientName: "Maria Garcia",
    mrn: "MRN-004",
    noteType: "H&P",
    status: "Signed",
    author: "Dr. Sarah Johnson",
    isTrainee: false,
    signedBy: "Dr. Sarah Johnson",
    signedAt: "Apr 8, 2026 16:30",
    sections: [
      { title: "Chief Complaint", content: "Severe epigastric pain and nausea." },
      { title: "HPI", content: "Pain began 12 hours prior to admission, radiating to the back." },
      { title: "Review of Systems", content: "Negative for chest pain, positive for vomiting." },
      { title: "Physical Exam", content: "Epigastric tenderness without rebound; mild tachycardia." },
      { title: "Assessment", content: "Likely acute pancreatitis with need for inpatient monitoring." },
      { title: "Plan", content: "Aggressive fluids, pain control, GI consult, serial labs." },
    ],
    addenda: [],
  },
  {
    id: "note-005",
    date: "Apr 8, 2026 14:10",
    patientId: "5",
    patientName: "Emily Davis",
    mrn: "MRN-011",
    noteType: "SOAP Progress Note",
    status: "Signed",
    author: "Dr. Noah Bennett, PGY-1",
    isTrainee: true,
    signedBy: "Dr. Noah Bennett, PGY-1",
    signedAt: "Apr 8, 2026 14:18",
    sections: [
      { title: "Subjective", content: "Breathing improved after nebulizer treatment." },
      { title: "Objective", content: "Wheezing decreased, sat 97% on room air." },
      { title: "Assessment", content: "Asthma exacerbation improving, still needs attending cosign." },
      { title: "Plan", content: "Continue bronchodilators, monitor peak flows, probable discharge tomorrow." },
    ],
    addenda: [],
  },
  {
    id: "note-006",
    date: "Apr 7, 2026 17:05",
    patientName: "James Brown",
    mrn: "MRN-010",
    noteType: "Discharge Summary",
    status: "Amended",
    author: "Dr. Sarah Johnson",
    isTrainee: false,
    signedBy: "Dr. Sarah Johnson",
    signedAt: "Apr 7, 2026 17:15",
    sections: [
      { title: "Admission Diagnosis", content: "Acute CHF exacerbation." },
      { title: "Hospital Course", content: "Responded well to IV diuresis and oxygen wean." },
      { title: "Discharge Diagnosis", content: "CHF exacerbation, improved." },
      { title: "Discharge Medications", content: "Furosemide, carvedilol, lisinopril." },
      { title: "Follow-Up", content: "Cardiology in 1 week, PCP in 3 days." },
      { title: "Discharge Instructions", content: "Daily weights, low-sodium diet, return for worsening dyspnea." },
    ],
    addenda: [
      {
        id: "add-001",
        author: "Dr. Sarah Johnson",
        createdAt: "Apr 7, 2026 19:30",
        content: "Added clarification regarding fluid restriction and home oxygen discontinuation.",
      },
    ],
  },
  {
    id: "note-007",
    date: "Apr 7, 2026 12:00",
    patientName: "Priya Patel",
    mrn: "MRN-009",
    noteType: "Consultation",
    status: "Signed",
    author: "Dr. Michael Chen",
    isTrainee: false,
    signedBy: "Dr. Michael Chen",
    signedAt: "Apr 7, 2026 12:12",
    sections: [
      { title: "Reason for Consultation", content: "New seizure activity requiring neurology input." },
      { title: "HPI", content: "Two witnessed generalized tonic-clonic episodes overnight." },
      { title: "Findings", content: "Neurologic exam otherwise non-focal between events." },
      { title: "Recommendations", content: "EEG, MRI brain, start levetiracetam." },
    ],
    addenda: [],
  },
  {
    id: "note-008",
    date: "Apr 6, 2026 09:25",
    patientName: "Robert Lee",
    mrn: "MRN-005",
    noteType: "Telephone Encounter",
    status: "Draft",
    author: "Dr. David Martinez",
    isTrainee: false,
    sections: [
      { title: "Reason for Call", content: "Post-operative pain medication questions." },
      { title: "Discussion", content: "Reviewed multimodal pain regimen and expected recovery timeline." },
      { title: "Plan", content: "Continue current plan; office follow-up in 48 hours if pain uncontrolled." },
    ],
    addenda: [],
  },
]

const noteTypeClass: Record<string, string> = {
  "H&P": "bg-sky-100 text-sky-800 border-sky-300",
  "SOAP Progress Note": "bg-blue-100 text-blue-800 border-blue-300",
  "Discharge Summary": "bg-green-100 text-green-800 border-green-300",
  Consultation: "bg-purple-100 text-purple-800 border-purple-300",
  "Telephone Encounter": "bg-orange-100 text-orange-800 border-orange-300",
  "Triage Note": "bg-amber-100 text-amber-800 border-amber-300",
}

const statusClass: Record<ClinicalNote["status"], string> = {
  Draft: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Signed: "bg-blue-100 text-blue-800 border-blue-300",
  Cosigned: "bg-green-100 text-green-800 border-green-300",
  Amended: "bg-purple-100 text-purple-800 border-purple-300",
}

export default function DocumentationPage() {
  const [notes, setNotes] = useState(mockNotes)
  const [activeTab, setActiveTab] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null)

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (activeTab === "unsigned" && note.status !== "Draft") {
        return false
      }
      if (activeTab === "cosign" && !(note.isTrainee && note.status !== "Cosigned")) {
        return false
      }
      if (activeTab === "addenda" && note.addenda.length === 0) {
        return false
      }
      return true
    })
  }, [activeTab, notes])

  const createTimestamp = () =>
    new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const handleCreateNote = (payload: {
    patientId: string
    patientName: string
    mrn: string
    template: NoteTemplate
    sections: Array<{ title: string; content: string }>
    status: "Draft" | "Signed"
  }) => {
    const timestamp = createTimestamp()
    const nextNote: ClinicalNote = {
      id: `note-${Date.now()}`,
      date: timestamp,
      patientId: payload.patientId,
      patientName: payload.patientName,
      mrn: payload.mrn,
      noteType: payload.template,
      status: payload.status,
      author: "Dr. Sarah Johnson",
      isTrainee: false,
      signedBy: payload.status === "Signed" ? "Dr. Sarah Johnson" : undefined,
      signedAt: payload.status === "Signed" ? timestamp : undefined,
      sections: payload.sections,
      addenda: [],
    }
    setNotes((current) => [nextNote, ...current])
  }

  const openNote = (note: ClinicalNote) => {
    setSelectedNote(note)
    setSheetOpen(true)
  }

  const handleCosign = (noteId: string) => {
    const timestamp = createTimestamp()
    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? {
              ...note,
              status: "Cosigned",
              cosignedBy: "Dr. Sarah Johnson",
              cosignedAt: timestamp,
            }
          : note
      )
    )
    setSelectedNote((current) =>
      current && current.id === noteId
        ? {
            ...current,
            status: "Cosigned",
            cosignedBy: "Dr. Sarah Johnson",
            cosignedAt: timestamp,
          }
        : current
    )
    toast.success("Note cosigned successfully")
  }

  const handleSaveAddendum = (noteId: string, content: string) => {
    const timestamp = createTimestamp()
    const nextAddendum = {
      id: `add-${Date.now()}`,
      author: "Dr. Sarah Johnson",
      createdAt: timestamp,
      content,
    }

    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? {
              ...note,
              status: "Amended",
              addenda: [...note.addenda, nextAddendum],
            }
          : note
      )
    )
    setSelectedNote((current) =>
      current && current.id === noteId
        ? {
            ...current,
            status: "Amended",
            addenda: [...current.addenda, nextAddendum],
          }
        : current
    )
  }

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-start justify-between gap-4 px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Clinical Documentation</h1>
              <p className="text-muted-foreground">
                Notes hub for drafting, signing, reviewing, cosigning, and amending documentation.
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <IconFilePlus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="gap-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle>Clinical Notes</CardTitle>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="h-auto flex-wrap justify-start">
                      <TabsTrigger value="all">All Notes</TabsTrigger>
                      <TabsTrigger value="unsigned">Unsigned / Draft</TabsTrigger>
                      <TabsTrigger value="cosign">Requires Cosignature</TabsTrigger>
                      <TabsTrigger value="addenda">Addenda</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Note Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotes.map((note) => (
                      <TableRow
                        key={note.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openNote(note)}
                      >
                        <TableCell>{note.date}</TableCell>
                        <TableCell className="font-medium">{note.patientName}</TableCell>
                        <TableCell>{note.mrn}</TableCell>
                        <TableCell>
                          <Badge className={noteTypeClass[note.noteType] ?? "bg-slate-100 text-slate-800 border-slate-300"}>
                            {note.noteType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusClass[note.status]}>{note.status}</Badge>
                        </TableCell>
                        <TableCell>{note.author}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(event) => {
                                event.stopPropagation()
                                openNote(note)
                              }}
                            >
                              View
                            </Button>
                            {note.isTrainee && note.status !== "Cosigned" && (
                              <Button
                                size="sm"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  openNote(note)
                                }}
                              >
                                Cosign
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <NewNoteDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreate={handleCreateNote} />
        <NoteDetailSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          note={selectedNote}
          onSaveAddendum={handleSaveAddendum}
          onCosign={handleCosign}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
