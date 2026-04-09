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
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dummyWardPatients } from "@/app/(dashboard)/dummy-data/dummy-nurse-ward"
import { toast } from "sonner"
import { IconPlus, IconEye } from "@tabler/icons-react"

type NoteType = "Progress Note" | "Nurse Assessment" | "Intake/Output" | "Incident Report" | "Procedure Note" | "Endorsement Note"

interface ClinicalNote {
  id: string
  patientId: string
  patientName: string
  bedNumber: string
  noteType: NoteType
  content: string
  vitalsSummary: string | null
  createdBy: string
  createdAt: string
  signedOff: boolean
}

const dummyNotes: ClinicalNote[] = [
  { id: "CN-001", patientId: "WP-001", patientName: "Juan Dela Cruz", bedNumber: "3B-01", noteType: "Progress Note", content: "Patient alert and oriented. Afebrile. Cough productive of yellowish sputum. Tolerating oral diet. IV antibiotics continued. Plan: Repeat CBC and CXR tomorrow.", vitalsSummary: "BP 130/80 HR 78 RR 18 T 36.8 SpO2 96%", createdBy: "Nurse Joy Reyes", createdAt: "2026-04-09 08:30", signedOff: true },
  { id: "CN-002", patientId: "WP-003", patientName: "Pedro Reyes", bedNumber: "3B-03", noteType: "Nurse Assessment", content: "Post-MI Day 6. No chest pain. Hemodynamically stable. Ambulating with assistance. Cardiac enzymes trending down. Echo scheduled for tomorrow.", vitalsSummary: "BP 118/72 HR 68 RR 16 T 36.5 SpO2 98%", createdBy: "Nurse Joy Reyes", createdAt: "2026-04-09 09:00", signedOff: true },
  { id: "CN-003", patientId: "WP-007", patientName: "Carlos Mendoza", bedNumber: "3B-08", noteType: "Nurse Assessment", content: "CVA patient. GCS 12 (E4V3M5). Right-sided weakness persists. Able to follow simple commands. NGT feeding tolerated. Neuro checks being done q2h.", vitalsSummary: "BP 150/90 HR 82 RR 20 T 37.0 SpO2 95%", createdBy: "Nurse Joy Reyes", createdAt: "2026-04-09 10:00", signedOff: false },
  { id: "CN-004", patientId: "WP-002", patientName: "Rosa Santos", bedNumber: "3B-02", noteType: "Intake/Output", content: "Shift I&O (07:00-15:00):\nIntake: IV 500mL + Oral 800mL = 1300mL\nOutput: Urine 1100mL + Insensible 400mL = 1500mL\nBalance: -200mL\nCBG Log: 0600: 168, 1200: 145", vitalsSummary: "BP 130/85 HR 74 RR 16 T 36.6 SpO2 97%", createdBy: "Nurse Joy Reyes", createdAt: "2026-04-09 14:30", signedOff: false },
]

const noteTypes: NoteType[] = ["Progress Note", "Nurse Assessment", "Intake/Output", "Incident Report", "Procedure Note", "Endorsement Note"]

export default function ClinicalDocumentationPage() {
  const [notes, setNotes] = useState(dummyNotes)
  const [newOpen, setNewOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [filterPatient, setFilterPatient] = useState("all")

  const [formData, setFormData] = useState({
    patientId: "", noteType: "" as NoteType | "", content: "", vitalsSummary: "",
  })

  const filtered = notes.filter(n => {
    const matchType = filterType === "all" || n.noteType === filterType
    const matchPatient = filterPatient === "all" || n.patientId === filterPatient
    return matchType && matchPatient
  })

  const handleNewNote = () => {
    if (!formData.patientId || !formData.noteType || !formData.content) {
      toast.error("Please fill in all required fields")
      return
    }
    const patient = dummyWardPatients.find(p => p.id === formData.patientId)
    const newNote: ClinicalNote = {
      id: `CN-${Date.now()}`,
      patientId: formData.patientId,
      patientName: patient?.patientName ?? "Unknown",
      bedNumber: patient?.bedNumber ?? "",
      noteType: formData.noteType as NoteType,
      content: formData.content,
      vitalsSummary: formData.vitalsSummary || null,
      createdBy: "Nurse Joy Reyes",
      createdAt: new Date().toLocaleString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
      signedOff: false,
    }
    setNotes(prev => [newNote, ...prev])
    setNewOpen(false)
    setFormData({ patientId: "", noteType: "", content: "", vitalsSummary: "" })
    toast.success("Clinical note created")
  }

  const handleSignOff = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, signedOff: true } : n))
    toast.success("Note signed off")
    setDetailOpen(false)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Clinical Documentation</h1>
              <p className="text-muted-foreground">Progress notes, assessments, I&O, and incident reports.</p>
            </div>
            <Button onClick={() => setNewOpen(true)}><IconPlus className="h-4 w-4 mr-2" />New Note</Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 px-4 lg:px-6">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Note Types</SelectItem>
                {noteTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterPatient} onValueChange={setFilterPatient}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                {dummyWardPatients.map(p => <SelectItem key={p.id} value={p.id}>{p.patientName} ({p.bedNumber})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Notes Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader><CardTitle>Clinical Notes ({filtered.length})</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Bed</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(n => (
                      <TableRow key={n.id}>
                        <TableCell className="text-sm">{n.createdAt}</TableCell>
                        <TableCell className="font-medium">{n.patientName}</TableCell>
                        <TableCell className="font-mono text-sm">{n.bedNumber}</TableCell>
                        <TableCell><Badge variant="outline">{n.noteType}</Badge></TableCell>
                        <TableCell className="text-sm max-w-64 truncate">{n.content.substring(0, 80)}...</TableCell>
                        <TableCell className="text-sm">{n.createdBy}</TableCell>
                        <TableCell>{n.signedOff ? <Badge variant="default">Signed</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell>
                        <TableCell><Button size="sm" variant="ghost" onClick={() => { setSelectedNote(n); setDetailOpen(true) }}><IconEye className="h-4 w-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* New Note Dialog */}
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New Clinical Note</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Patient *</Label>
                  <Select value={formData.patientId} onValueChange={v => setFormData(p => ({ ...p, patientId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>{dummyWardPatients.map(p => <SelectItem key={p.id} value={p.id}>{p.patientName} — {p.bedNumber}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Note Type *</Label>
                  <Select value={formData.noteType} onValueChange={v => setFormData(p => ({ ...p, noteType: v as NoteType }))}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{noteTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Vitals Summary</Label><Input value={formData.vitalsSummary} onChange={e => setFormData(p => ({ ...p, vitalsSummary: e.target.value }))} placeholder="BP HR RR T SpO2" /></div>
              <div className="space-y-2"><Label>Note Content *</Label><Textarea value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} rows={8} placeholder="Enter clinical documentation..." /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button><Button onClick={handleNewNote}>Save Note</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{selectedNote?.noteType} — {selectedNote?.patientName}</DialogTitle></DialogHeader>
            {selectedNote && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><Label className="text-muted-foreground">Bed</Label><p className="font-mono">{selectedNote.bedNumber}</p></div>
                  <div><Label className="text-muted-foreground">Date/Time</Label><p>{selectedNote.createdAt}</p></div>
                  <div><Label className="text-muted-foreground">Author</Label><p>{selectedNote.createdBy}</p></div>
                  <div><Label className="text-muted-foreground">Status</Label>{selectedNote.signedOff ? <Badge variant="default">Signed Off</Badge> : <Badge variant="secondary">Draft</Badge>}</div>
                </div>
                {selectedNote.vitalsSummary && (
                  <div className="rounded-lg bg-muted p-3">
                    <Label className="text-muted-foreground text-xs">Vitals</Label>
                    <p className="font-mono text-sm">{selectedNote.vitalsSummary}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Note</Label>
                  <div className="mt-1 whitespace-pre-wrap rounded-lg border p-3 text-sm">{selectedNote.content}</div>
                </div>
              </div>
            )}
            <DialogFooter>
              {selectedNote && !selectedNote.signedOff && <Button onClick={() => handleSignOff(selectedNote.id)}>Sign Off Note</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
