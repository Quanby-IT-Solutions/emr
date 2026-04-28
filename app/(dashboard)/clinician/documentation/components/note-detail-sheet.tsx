"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export interface NoteSection {
  title: string
  content: string
}

export interface NoteAddendum {
  id: string
  author: string
  createdAt: string
  content: string
}

export interface ClinicalNote {
  id: string
  date: string
  patientId?: string
  patientName?: string
  mrn?: string
  noteType: string
  status: "Draft" | "Signed" | "Amended"
  author: string
  authorId?: string
  isTrainee: boolean
  signedBy?: string
  signedAt?: string
  cosignedBy?: string
  cosignedAt?: string
  sections: NoteSection[]
  addenda: NoteAddendum[]
}

interface NoteDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: ClinicalNote | null
  onSaveAddendum: (noteId: string, content: string) => void
  onCosign: (noteId: string) => void
}

const statusClass: Record<ClinicalNote["status"], string> = {
  Draft: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Signed: "bg-blue-100 text-blue-800 border-blue-300",
  Amended: "bg-purple-100 text-purple-800 border-purple-300",
}

export function NoteDetailSheet({
  open,
  onOpenChange,
  note,
  onSaveAddendum,
  onCosign,
}: NoteDetailSheetProps) {
  const [isAddingAddendum, setIsAddingAddendum] = useState(false)
  const [addendumText, setAddendumText] = useState("")

  if (!note) {
    return null
  }

  const canCosign = note.isTrainee && note.status !== "Signed"

  const handleSaveAddendum = () => {
    if (!addendumText.trim()) {
      toast.error("Addendum text is required")
      return
    }
    onSaveAddendum(note.id, addendumText.trim())
    toast.success("Addendum saved")
    setAddendumText("")
    setIsAddingAddendum(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIsAddingAddendum(false)
      setAddendumText("")
    }
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <SheetTitle>{note.noteType}</SheetTitle>
              <SheetDescription>
                {note.patientName ? `${note.patientName} | ` : ''}{note.mrn ? `${note.mrn} | ` : ''}{note.date}
              </SheetDescription>
            </div>
            <Badge className={statusClass[note.status]}>{note.status}</Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {canCosign && (
            <div className="rounded-lg border border-green-300 bg-green-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-green-900">Trainee note requires cosignature</p>
                  <p className="text-sm text-green-800">
                    Review the note content below and cosign if appropriate.
                  </p>
                </div>
                <Button onClick={() => onCosign(note.id)}>Cosign This Note</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {note.sections.map((section) => (
              <div key={section.title} className="rounded-lg border p-4">
                <p className="mb-2 font-medium">{section.title}</p>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="font-medium">Signature Block</p>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Author</p>
                <p>{note.author}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Signed</p>
                <p>{note.signedBy ? `${note.signedBy} on ${note.signedAt}` : "Not signed"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cosignature</p>
                <p>{note.cosignedBy ? `${note.cosignedBy} on ${note.cosignedAt}` : "Not cosigned"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Status</p>
                <p>{note.status}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">Addenda & Amendments</p>
              {!isAddingAddendum && (
                <Button variant="outline" onClick={() => setIsAddingAddendum(true)}>
                  Create Addendum
                </Button>
              )}
            </div>

            {isAddingAddendum && (
              <div className="space-y-3 rounded-lg border p-4">
                <Textarea
                  rows={4}
                  value={addendumText}
                  onChange={(event) => setAddendumText(event.target.value)}
                  placeholder="Enter addendum details..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveAddendum}>Save</Button>
                  <Button variant="outline" onClick={() => setIsAddingAddendum(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {note.addenda.length === 0 ? (
              <p className="text-sm text-muted-foreground">No addenda recorded.</p>
            ) : (
              <div className="space-y-3">
                {note.addenda.map((addendum) => (
                  <div key={addendum.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-medium">Amendment by {addendum.author}</p>
                      <p className="text-xs text-muted-foreground">{addendum.createdAt}</p>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {addendum.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
