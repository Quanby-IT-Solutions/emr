"use client"
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ClinicalNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeEncounter: any
  staffId: string
  onSuccess: () => void
}

export function ClinicalNoteDialog({ 
  open, 
  onOpenChange, 
  activeEncounter, 
  staffId, 
  onSuccess 
}: ClinicalNoteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState({
    title: '',
    content: '',
    noteType: 'NURSING_NOTE',
    cosignerId: '',
  })

  const handleCreate = async (submitForCosign: boolean) => {
    if (!activeEncounter) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/clinical-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encounterId: activeEncounter.id,
          authorId: staffId,
          cosignerId: submitForCosign ? note.cosignerId : null,
          noteType: note.noteType,
          title: note.title,
          content: note.content,
          submitForCosign,
        }),
      })

      if (response.ok) {
        onOpenChange(false)
        setNote({ title: '', content: '', noteType: 'NURSING_NOTE', cosignerId: '' })
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to create note:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Clinical Note</DialogTitle>
          <DialogDescription>Document patient care and submit for co-signature</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Note Type</Label>
            <Select
              value={note.noteType}
              onValueChange={(value) => setNote({ ...note, noteType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NURSING_NOTE">Nursing Note</SelectItem>
                <SelectItem value="TRIAGE_NOTE">Triage Note</SelectItem>
                <SelectItem value="PROGRESS_NOTE">Progress Note</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="e.g., Verbal Order - Pain Medication"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              placeholder="Document patient care details..."
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <Label>Co-Signer (Doctor/Clinician ID)</Label>
            <Input
              placeholder="Enter staff ID of doctor for co-signature"
              value={note.cosignerId}
              onChange={(e) => setNote({ ...note, cosignerId: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Required if submitting for co-signature
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleCreate(false)} disabled={loading}>
            Save as Draft
          </Button>
          <Button onClick={() => handleCreate(true)} disabled={loading || !note.cosignerId}>
            Submit for Co-Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}