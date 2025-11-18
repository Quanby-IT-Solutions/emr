"use client"
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FlowsheetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeEncounter: any
  staffId: string
  onSuccess: () => void
}

export function FlowsheetDialog({ 
  open, 
  onOpenChange, 
  activeEncounter, 
  staffId, 
  onSuccess 
}: FlowsheetDialogProps) {
  const [loading, setLoading] = useState(false)
  const [observation, setObservation] = useState({
    observationType: 'HEART_RATE',
    value: '',
    unit: 'BPM',
  })

  const unitMap: Record<string, string> = {
    'HEART_RATE': 'BPM',
    'SYSTOLIC_BP': 'MMHG',
    'DIASTOLIC_BP': 'MMHG',
    'TEMPERATURE': 'CELSIUS',
    'RESPIRATORY_RATE': 'BRPM',
    'SPO2': 'PERCENT',
    'PAIN_SCORE': 'POINTS',
    'WEIGHT': 'KG',
    'HEIGHT': 'CM',
  }

  const handleSubmit = async () => {
    if (!activeEncounter) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/flowsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encounterId: activeEncounter.id,
          recorderId: staffId,
          observationType: observation.observationType,
          value: observation.value,
          unit: observation.unit,
        }),
      })

      if (response.ok) {
        onOpenChange(false)
        setObservation({ observationType: 'HEART_RATE', value: '', unit: 'BPM' })
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to create observation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Flowsheet Observation</DialogTitle>
          <DialogDescription>Record vital signs or measurements</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Observation Type</Label>
            <Select
              value={observation.observationType}
              onValueChange={(value) => {
                setObservation({
                  ...observation,
                  observationType: value,
                  unit: unitMap[value] || 'NONE',
                })
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HEART_RATE">Heart Rate</SelectItem>
                <SelectItem value="SYSTOLIC_BP">Systolic BP</SelectItem>
                <SelectItem value="DIASTOLIC_BP">Diastolic BP</SelectItem>
                <SelectItem value="TEMPERATURE">Temperature</SelectItem>
                <SelectItem value="RESPIRATORY_RATE">Respiratory Rate</SelectItem>
                <SelectItem value="SPO2">SpO2</SelectItem>
                <SelectItem value="PAIN_SCORE">Pain Score</SelectItem>
                <SelectItem value="WEIGHT">Weight</SelectItem>
                <SelectItem value="HEIGHT">Height</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              placeholder="Enter measurement value"
              value={observation.value}
              onChange={(e) => setObservation({ ...observation, value: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Unit</Label>
            <Input value={observation.unit} disabled className="bg-muted" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Save Observation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}