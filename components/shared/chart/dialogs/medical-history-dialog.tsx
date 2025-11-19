"use client"
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MedicalHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staffId: string
  patientId: string
}

export function MedicalHistoryDialog({ 
  open, 
  onOpenChange, 
  staffId, 
  patientId 
}: MedicalHistoryDialogProps) {
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState({
    type: 'MEDICAL_HISTORY',
    entry: '',
    icd10Code: '',
  })

  const handleAdd = async () => {
    setLoading(true)
    try {
      // Mock implementation - replace with actual API call
      const response = await fetch('/api/medical-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          type: history.type,
          entry: history.entry,
          icd10Code: history.icd10Code,
          addedBy: staffId,
        }),
      })

      if (response.ok) {
        alert('Medical history added successfully!')
        onOpenChange(false)
        setHistory({ type: 'MEDICAL_HISTORY', entry: '', icd10Code: '' })
      }
    } catch (error) {
      console.error('Failed to add history:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Medical History</DialogTitle>
          <DialogDescription>Record patient medical history</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>History Type</Label>
            <Select
              value={history.type}
              onValueChange={(value) => setHistory({ ...history, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEDICAL_HISTORY">Medical History</SelectItem>
                <SelectItem value="SURGICAL_HISTORY">Surgical History</SelectItem>
                <SelectItem value="FAMILY_HISTORY">Family History</SelectItem>
                <SelectItem value="SOCIAL_HISTORY">Social History</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the medical history..."
              value={history.entry}
              onChange={(e) => setHistory({ ...history, entry: e.target.value })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>ICD-10 Code (Optional)</Label>
            <Input
              placeholder="e.g., E11.9"
              value={history.icd10Code}
              onChange={(e) => setHistory({ ...history, icd10Code: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            Add History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}