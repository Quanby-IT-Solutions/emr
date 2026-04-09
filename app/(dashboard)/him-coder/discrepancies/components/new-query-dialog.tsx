"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface NewQueryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewQueryDialog({ open, onOpenChange }: NewQueryDialogProps) {
  const [encounterID, setEncounterID] = useState("")
  const [type, setType] = useState("")
  const [priority, setPriority] = useState("")
  const [assignee, setAssignee] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (!encounterID || !type || !priority || !description) {
      toast.error("Please fill in all required fields")
      return
    }
    toast.success(`Query created for ${encounterID}`)
    setEncounterID("")
    setType("")
    setPriority("")
    setAssignee("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Discrepancy Query</DialogTitle>
          <DialogDescription>
            Flag a chart discrepancy and route a query to the responsible clinician.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="encounter-id">Encounter ID *</Label>
            <Input
              id="encounter-id"
              placeholder="e.g. ENC-2026-0041"
              value={encounterID}
              onChange={(e) => setEncounterID(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Discrepancy Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Missing Signature">Missing Signature</SelectItem>
                  <SelectItem value="Conflicting Diagnosis">Conflicting Diagnosis</SelectItem>
                  <SelectItem value="Incomplete Note">Incomplete Note</SelectItem>
                  <SelectItem value="Missing Documentation">Missing Documentation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Priority *</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Assign To (Clinician)</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Select clinician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                <SelectItem value="Dr. David Martinez">Dr. David Martinez</SelectItem>
                <SelectItem value="Dr. Lisa Park">Dr. Lisa Park</SelectItem>
                <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                <SelectItem value="Dr. Noah Bennett">Dr. Noah Bennett</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the discrepancy and what correction or clarification is needed..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Query</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
