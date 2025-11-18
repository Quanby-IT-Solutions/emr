"use client"
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IconCheck, IconAlertCircle } from '@tabler/icons-react'

interface CorrectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedNote: any
  staffId: string
  onSuccess: () => void
}

export function CorrectionDialog({ 
  open, 
  onOpenChange, 
  selectedNote, 
  staffId, 
  onSuccess 
}: CorrectionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [correctedContent, setCorrectedContent] = useState('')

  useEffect(() => {
    if (selectedNote) {
      setCorrectedContent(selectedNote.content || '')
    }
  }, [selectedNote])

  const handleResubmit = async () => {
    if (!selectedNote || !correctedContent.trim()) {
      alert('Please provide corrected content')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/clinical-notes/${selectedNote.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resubmit',
          staffId,
          content: correctedContent,
        }),
      })

      if (response.ok) {
        onOpenChange(false)
        setCorrectedContent('')
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to resubmit note:', error)
    } finally {
      setLoading(false)
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Correct & Resubmit Note</DialogTitle>
          <DialogDescription>
            Review the feedback and make necessary corrections
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Show Rejection Comments */}
          {selectedNote?.comments && selectedNote.comments.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="font-semibold text-sm mb-2 flex items-center gap-2 text-red-900">
                <IconAlertCircle className="h-4 w-4" />
                Doctor&apos;s Feedback:
              </p>
              {selectedNote.comments.map((comment: any) => (
                <div key={comment.id} className="mb-2 last:mb-0">
                  <p className="text-sm text-red-900">{comment.comment}</p>
                  <p className="text-xs text-red-700 mt-1">
                    By: Dr. {comment.createdByStaff.firstName} {comment.createdByStaff.lastName} - {formatDate(comment.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Original Content */}
          <div className="space-y-2">
            <Label>Original Note Title</Label>
            <Input value={selectedNote?.title || ''} disabled className="bg-muted" />
          </div>

          {/* Editable Content */}
          <div className="space-y-2">
            <Label>Corrected Content <span className="text-red-500">*</span></Label>
            <Textarea
              placeholder="Update the note content based on doctor's feedback..."
              value={correctedContent}
              onChange={(e) => setCorrectedContent(e.target.value)}
              rows={10}
              className="border-blue-300 focus:border-blue-500"
            />
            <p className="text-xs text-muted-foreground">
              Make the necessary corrections and resubmit for co-signature.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false)
            setCorrectedContent('')
          }}>
            Cancel
          </Button>
          <Button
            onClick={handleResubmit}
            disabled={loading || !correctedContent.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <IconCheck className="h-4 w-4 mr-1" />
            Resubmit for Co-Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}