"use client"
import { useState, useEffect } from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconCheck, IconX, IconClock, IconAlertCircle } from '@tabler/icons-react'
import { UserRole } from "@/lib/auth/roles"
import { ClinicalNoteDialog } from "../dialogs/clinical-note-dialog"
import { RejectionDialog } from "../dialogs/rejection-dialog"
import { CorrectionDialog } from "../dialogs/correction-dialog"

interface ClinicalNotesTabProps {
  patientData: any
  role: UserRole
  staffId: string
}

export function ClinicalNotesTab({ patientData, role, staffId }: ClinicalNotesTabProps) {
  const [clinicalNotes, setClinicalNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false)
  const [correctionDialogOpen, setCorrectionDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<any>(null)

  const activeEncounter = patientData.patient.encounters.find(
    (e: any) => e.status === 'ACTIVE'
  )

  const fetchClinicalNotes = async () => {
    if (!activeEncounter) return
    
    try {
      const response = await fetch(`/api/clinical-notes?encounterId=${activeEncounter.id}`)
      const data = await response.json()
      setClinicalNotes(data.notes || [])
    } catch (error) {
      console.error('Failed to fetch clinical notes:', error)
    }
  }

  useEffect(() => {
    fetchClinicalNotes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEncounter])

  const handleSignNote = async (noteId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/clinical-notes/${noteId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sign',
          staffId,
        }),
      })

      if (response.ok) {
        fetchClinicalNotes()
      }
    } catch (error) {
      console.error('Failed to sign note:', error)
    } finally {
      setLoading(false)
    }
  }

  const openRejectionDialog = (note: any) => {
    setSelectedNote(note)
    setRejectionDialogOpen(true)
  }

  const openCorrectionDialog = (note: any) => {
    setSelectedNote(note)
    setCorrectionDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="secondary">Draft</Badge>
      case 'PENDING_COSIGN':
        return <Badge className="bg-yellow-500">Pending Co-Sign</Badge>
      case 'NEEDS_CORRECTION':
        return <Badge variant="destructive">Needs Correction</Badge>
      case 'SIGNED':
        return <Badge className="bg-green-500">Signed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <TabsContent value="clinical-notes">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Clinical Notes</CardTitle>
              <CardDescription>Documentation requiring co-signature</CardDescription>
            </div>
            {role === UserRole.NURSE && activeEncounter && (
              <Button onClick={() => setNoteDialogOpen(true)}>
                <IconPlus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!activeEncounter ? (
            <p className="text-center text-muted-foreground py-8">No active encounter</p>
          ) : clinicalNotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No clinical notes</p>
          ) : (
            <div className="space-y-4">
              {clinicalNotes.map((note: any) => (
                <Card key={note.id} className={note.status === 'NEEDS_CORRECTION' ? 'border-red-500' : ''}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{note.noteType.replace(/_/g, ' ')}</Badge>
                            {getStatusBadge(note.status)}
                          </div>
                          <p className="font-semibold text-lg">{note.title}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 bg-slate-50 rounded">
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      </div>

                      {/* Metadata */}
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Author: {note.author.firstName} {note.author.lastName} ({note.author.jobTitle})</p>
                        {note.cosigner && (
                          <p>Co-Signer: Dr. {note.cosigner.firstName} {note.cosigner.lastName}</p>
                        )}
                        {note.signedAt && (
                          <p>Signed: {formatDate(note.signedAt)}</p>
                        )}
                      </div>

                      {/* Comments (Rejection Reasons) */}
                      {note.comments && note.comments.length > 0 && (
                        <div className="border-t pt-3">
                          <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <IconAlertCircle className="h-4 w-4 text-red-500" />
                            Correction Requested:
                          </p>
                          {note.comments.map((comment: any) => (
                            <div key={comment.id} className="p-2 bg-red-50 border border-red-200 rounded mb-2">
                              <p className="text-sm text-red-900">{comment.comment}</p>
                              <p className="text-xs text-red-700 mt-1">
                                By: Dr. {comment.createdByStaff.firstName} {comment.createdByStaff.lastName} - {formatDate(comment.createdAt)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {/* Doctor Actions */}
                        {role === UserRole.CLINICIAN && note.status === 'PENDING_COSIGN' && note.cosignerId === staffId && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSignNote(note.id)}
                              disabled={loading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <IconCheck className="h-4 w-4 mr-1" />
                              Sign Note
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectionDialog(note)}
                              disabled={loading}
                            >
                              <IconX className="h-4 w-4 mr-1" />
                              Request Correction
                            </Button>
                          </>
                        )}

                        {/* Nurse Actions */}
                        {role === UserRole.NURSE && note.status === 'NEEDS_CORRECTION' && note.authorId === staffId && (
                          <Button
                            size="sm"
                            onClick={() => openCorrectionDialog(note)}
                            disabled={loading}
                          >
                            <IconClock className="h-4 w-4 mr-1" />
                            Correct & Resubmit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ClinicalNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        activeEncounter={activeEncounter}
        staffId={staffId}
        onSuccess={fetchClinicalNotes}
      />

      <RejectionDialog
        open={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        selectedNote={selectedNote}
        staffId={staffId}
        onSuccess={fetchClinicalNotes}
      />

      <CorrectionDialog
        open={correctionDialogOpen}
        onOpenChange={setCorrectionDialogOpen}
        selectedNote={selectedNote}
        staffId={staffId}
        onSuccess={fetchClinicalNotes}
      />
    </TabsContent>
  )
}