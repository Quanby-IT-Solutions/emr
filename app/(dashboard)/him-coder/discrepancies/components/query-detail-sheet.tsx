"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "sonner"

export interface Discrepancy {
  id: string
  encounterId: string
  patient: string
  mrn: string
  type: "Missing Signature" | "Conflicting Diagnosis" | "Incomplete Note" | "Missing Documentation" | "Other"
  flaggedBy: string
  flaggedDate: string
  assignedTo: string
  status: "Open" | "Pending Clinician" | "Resolved"
  priority: "Normal" | "High" | "Urgent"
  description: string
  resolution?: string
}

interface QueryDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  query: Discrepancy | null
}

const statusBadge: Record<string, string> = {
  Open: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Pending Clinician": "bg-blue-100 text-blue-800 border-blue-300",
  Resolved: "bg-green-100 text-green-800 border-green-300",
}

const priorityBadge: Record<string, string> = {
  Normal: "bg-gray-100 text-gray-800 border-gray-300",
  High: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Urgent: "bg-red-100 text-red-800 border-red-300",
}

const typeBadge: Record<string, string> = {
  "Missing Signature": "bg-orange-100 text-orange-800 border-orange-300",
  "Conflicting Diagnosis": "bg-red-100 text-red-800 border-red-300",
  "Incomplete Note": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Missing Documentation": "bg-purple-100 text-purple-800 border-purple-300",
  Other: "bg-gray-100 text-gray-800 border-gray-300",
}

export function QueryDetailSheet({ open, onOpenChange, query }: QueryDetailSheetProps) {
  if (!query) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Discrepancy Query — {query.id}</SheetTitle>
          <SheetDescription>
            Encounter {query.encounterId} — {query.patient} ({query.mrn})
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={typeBadge[query.type]}>{query.type}</Badge>
            <Badge className={statusBadge[query.status]}>{query.status}</Badge>
            <Badge className={priorityBadge[query.priority]}>{query.priority}</Badge>
          </div>

          <Separator />

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Flagged By</p>
              <p>{query.flaggedBy}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Flagged Date</p>
              <p>{query.flaggedDate}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assigned To</p>
              <p>{query.assignedTo}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm">{query.description}</p>
          </div>

          {query.resolution && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Resolution</p>
                <p className="text-sm">{query.resolution}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex flex-wrap gap-2">
            {query.status !== "Resolved" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info("Reminder sent to " + query.assignedTo)}
                >
                  Send Reminder
                </Button>
                <Button
                  size="sm"
                  onClick={() => toast.success("Query marked as resolved")}
                >
                  Mark Resolved
                </Button>
              </>
            )}
            {query.status === "Resolved" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.info("Query reopened")}
              >
                Reopen
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
