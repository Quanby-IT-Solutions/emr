"use client"
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconX } from '@tabler/icons-react'

interface RejectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedNote: any
  staffId: string
  onSuccess: () => void
}

export function RejectionDialog({ 
  open, 
  onOpenChange, 
  selectedNote, 
  staffId, 
  onSuccess 
}: RejectionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [rejectionComment, setRejectionComment] = useState('')

  const handleReject = async () => {
    if (!selectedNote || !rejectionComment.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/clinical-notes/${selectedNote.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: rejectionComment }),
      })

      if (response.ok) {
        onOpenChange(false)
        setRejectionComment('')
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to reject note:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Correction</DialogTitle>
          <DialogDescription>
            Provide specific feedback for the nurse to correct this note
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-slate-100 rounded">
            <p className="text-sm font-semibold mb-1">{selectedNote?.title}</p>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">{selectedNote?.content}</p>
          </div>
          <div className="space-y-2">
            <Label>Correction Required <span className="text-red-500">*</span></Label>
            <Textarea
              placeholder="Explain what needs to be corrected (required)..."
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              rows={5}
              className="border-red-300 focus:border-red-500"
            />
            <p className="text-xs text-muted-foreground">
              Be specific about what needs to be corrected so the nurse can fix it accurately.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false)
            setRejectionComment('')
          }}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={loading || !rejectionComment.trim()}
          >
            <IconX className="h-4 w-4 mr-1" />
            Request Correction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}