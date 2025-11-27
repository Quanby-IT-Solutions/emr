import { Pill, Calendar, Clock, UserCheck, FileText, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CalendarAdministration } from "./med-record-calendar-view"

interface MedicationAdminCardProps {
  record: CalendarAdministration | null
}

export function MedicationAdminCard({ record }: MedicationAdminCardProps) {
  if (!record) return <div className="p-4 text-muted-foreground">Select a record to view details</div>

  const isTaken = record.status === "taken"

  const formatTime = (timeStr: string): string => {
    const match = timeStr.match(/(\d{1,2}):?(\d{2})/)
    if (match) {
      const hours = match[1].padStart(2, '0')
      const minutes = match[2]
      return `${hours}:${minutes}`
    }
    return timeStr
  }

  return (
    <div className="space-y-4 ml-2 mr-6">
      <Card className={`border-${isTaken ? 'green' : 'red'}-200 bg-${isTaken ? 'green' : 'red'}-50/30`}>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-4">
            {/* Status Banner */}
            <div className={`flex items-center gap-2 p-3 rounded-md ${isTaken ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isTaken ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <span className="font-semibold">{isTaken ? "Medication Administered" : "Medication Refused/Not Given"}</span>
            </div>

            {/* Medication Details */}
            <div>
                <Label className="text-xs text-muted-foreground">Medication</Label>
                <div className="flex items-start gap-2 mt-1">
                    <Pill className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                        <p className="font-medium text-sm leading-tight">{record.medicationName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{record.classification}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Dosage Given</Label>
                <p className="font-medium text-sm">{record.dosageAdministered}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Nurse</Label>
                <div className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="font-medium text-sm truncate">{record.administeringNurse}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Date</Label>
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="font-medium text-sm">{record.date}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Time</Label>
                <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="font-medium text-sm">{formatTime(record.time)}</p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Nurse Notes</Label>
              <div className="bg-white/50 border rounded-md p-3 text-sm italic text-muted-foreground flex gap-2">
                 <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                 {record.nurseNotes || "No notes recorded."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}