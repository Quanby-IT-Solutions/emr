"use client"

import { useMemo, useState, useEffect, useCallback } from "react"
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
import { useAuth } from "@/lib/auth/context"
import { NewNoteDialog, type NoteTemplate } from "./components/new-note-dialog"
import { NoteDetailSheet, type ClinicalNote } from "./components/note-detail-sheet"

const noteTypeClass: Record<string, string> = {
  H_AND_P: "bg-sky-100 text-sky-800 border-sky-300",
  PROGRESS_NOTE: "bg-blue-100 text-blue-800 border-blue-300",
  DISCHARGE_SUMMARY: "bg-green-100 text-green-800 border-green-300",
  CONSULT_NOTE: "bg-purple-100 text-purple-800 border-purple-300",
  TRIAGE_NOTE: "bg-amber-100 text-amber-800 border-amber-300",
  NURSING_NOTE: "bg-teal-100 text-teal-800 border-teal-300",
  ADDENDUM: "bg-orange-100 text-orange-800 border-orange-300",
}

type NoteStatus = ClinicalNote["status"]

const statusClass: Record<NoteStatus, string> = {
  Draft: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Signed: "bg-blue-100 text-blue-800 border-blue-300",
  Amended: "bg-purple-100 text-purple-800 border-purple-300",
}

function apiNoteToUi(n: any): ClinicalNote {
  const statusMap: Record<string, NoteStatus> = {
    DRAFT: "Draft",
    SIGNED: "Signed",
    AMENDED: "Amended",
  }
  let sections: Array<{ title: string; content: string }> = []
  try {
    const parsed = JSON.parse(n.content ?? '{}')
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      sections = Object.entries(parsed).map(([title, content]) => ({
        title,
        content: String(content),
      }))
    }
  } catch {
    sections = [{ title: "Content", content: n.content ?? '' }]
  }

  const addenda = (n.addenda ?? []).map((a: any) => ({
    id: a.id,
    author: `${a.author?.firstName ?? ''} ${a.author?.lastName ?? ''}`.trim(),
    createdAt: a.signedAt ? new Date(a.signedAt).toLocaleString() : '',
    content: a.content ?? '',
  }))

  return {
    id: n.id,
    date: n.signedAt
      ? new Date(n.signedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'Draft',
    noteType: n.noteType,
    status: statusMap[n.status] ?? 'Draft',
    author: n.author ? `${n.author.firstName} ${n.author.lastName}` : 'Unknown',
    authorId: n.author?.id,
    isTrainee: false,
    signedBy: n.signedAt ? (n.author ? `${n.author.firstName} ${n.author.lastName}` : undefined) : undefined,
    signedAt: n.signedAt ? new Date(n.signedAt).toLocaleString() : undefined,
    cosignedBy: n.cosigner ? `${n.cosigner.firstName} ${n.cosigner.lastName}` : undefined,
    sections,
    addenda,
  }
}

export default function DocumentationPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<ClinicalNote[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null)

  const fetchNotes = useCallback(() => {
    if (!user?.staffId) return
    setLoading(true)
    fetch(`/api/clinical-notes?authorId=${user.staffId}`)
      .then((r) => r.json())
      .then((json) => {
        const raw = Array.isArray(json?.data) ? json.data : []
        setNotes(raw.map(apiNoteToUi))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.staffId])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (activeTab === "unsigned" && note.status !== "Draft") return false
      if (activeTab === "addenda" && note.addenda.length === 0) return false
      return true
    })
  }, [activeTab, notes])

  const openNote = (note: ClinicalNote) => {
    setSelectedNote(note)
    setSheetOpen(true)
  }

  const handleCreateNote = async (payload: {
    patientId: string
    patientName: string
    mrn: string
    template: NoteTemplate
    sections: Array<{ title: string; content: string }>
    status: "Draft" | "Signed"
    encounterId?: string
  }) => {
    if (!payload.encounterId) {
      toast.error("No encounter ID provided")
      return
    }
    const content = JSON.stringify(
      Object.fromEntries(payload.sections.map((s) => [s.title, s.content]))
    )
    const res = await fetch(`/api/encounters/${payload.encounterId}/clinical-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noteType: payload.template,
        title: payload.template.replace(/_/g, ' '),
        content,
      }),
    })
    if (res.ok) {
      fetchNotes()
      toast.success("Note created")
    } else {
      toast.error("Failed to create note")
    }
  }

  const handleCosign = async (noteId: string) => {
    const res = await fetch(`/api/clinical-notes/${noteId}/cosign`, { method: 'POST' })
    if (res.ok) {
      fetchNotes()
      toast.success("Note cosigned successfully")
    } else {
      toast.error("Failed to cosign note")
    }
  }

  const handleSign = async (noteId: string) => {
    const res = await fetch(`/api/clinical-notes/${noteId}/sign`, { method: 'POST' })
    if (res.ok) {
      fetchNotes()
      toast.success("Note signed")
    } else {
      toast.error("Failed to sign note")
    }
  }

  const handleSaveAddendum = async (noteId: string, content: string) => {
    const res = await fetch(`/api/clinical-notes/${noteId}/addendum`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    if (res.ok) {
      fetchNotes()
      toast.success("Addendum added")
    } else {
      toast.error("Failed to add addendum")
    }
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
                      <TabsTrigger value="addenda">Addenda</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">Loading notes...</p>
                ) : filteredNotes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No notes found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
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
                          <TableCell>
                            <Badge className={noteTypeClass[note.noteType] ?? "bg-slate-100 text-slate-800 border-slate-300"}>
                              {note.noteType.replace(/_/g, ' ')}
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
                                onClick={(e) => { e.stopPropagation(); openNote(note) }}
                              >
                                View
                              </Button>
                              {note.status === "Draft" && (
                                <Button
                                  size="sm"
                                  onClick={(e) => { e.stopPropagation(); handleSign(note.id) }}
                                >
                                  Sign
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
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
