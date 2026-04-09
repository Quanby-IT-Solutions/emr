"use client"

import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { IconCircleCheck, IconCircleDashed, IconSend, IconClipboard, IconX } from "@tabler/icons-react"

export interface ReferralTimelineEntry {
  label: string
  date: string | null
  status: "done" | "current" | "pending" | "declined"
}

export interface ReferralDetail {
  id: string
  patient: string
  mrn: string
  referredTo: string
  specialty: string
  reason: string
  priority: "Routine" | "Urgent"
  status: "Pending" | "Accepted" | "Completed" | "Declined"
  dateCreated: string
  referringProvider: string
  attachedNotes: string[]
  timeline: ReferralTimelineEntry[]
}

interface ReferralDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  referral: ReferralDetail | null
}

const statusBadgeClass: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Accepted: "bg-blue-100 text-blue-800 border-blue-300",
  Completed: "bg-green-100 text-green-800 border-green-300",
  Declined: "bg-red-100 text-red-800 border-red-300",
}

const priorityBadgeClass: Record<string, string> = {
  Routine: "bg-gray-100 text-gray-800 border-gray-300",
  Urgent: "bg-yellow-100 text-yellow-800 border-yellow-300",
}

function TimelineIcon({ s }: { s: ReferralTimelineEntry["status"] }) {
  switch (s) {
    case "done":
      return <IconCircleCheck className="h-5 w-5 text-green-600" />
    case "current":
      return <IconCircleDashed className="h-5 w-5 text-blue-600 animate-pulse" />
    case "declined":
      return <IconX className="h-5 w-5 text-red-600" />
    default:
      return <IconCircleDashed className="h-5 w-5 text-muted-foreground" />
  }
}

export function ReferralDetailSheet({ open, onOpenChange, referral }: ReferralDetailSheetProps) {
  if (!referral) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Referral {referral.id}</SheetTitle>
          <SheetDescription>
            {referral.patient} — {referral.specialty}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status & Priority */}
          <div className="flex items-center gap-2">
            <Badge className={statusBadgeClass[referral.status]}>{referral.status}</Badge>
            <Badge className={priorityBadgeClass[referral.priority]}>{referral.priority}</Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Patient</p>
              <p className="font-medium">{referral.patient}</p>
            </div>
            <div>
              <p className="text-muted-foreground">MRN</p>
              <p className="font-medium">{referral.mrn}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Referred To</p>
              <p className="font-medium">{referral.referredTo}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Specialty</p>
              <p className="font-medium">{referral.specialty}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Referring Provider</p>
              <p className="font-medium">{referral.referringProvider}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Date Created</p>
              <p className="font-medium">{referral.dateCreated}</p>
            </div>
          </div>

          <Separator />

          {/* Reason */}
          <div>
            <p className="text-sm font-semibold mb-1">Reason for Referral</p>
            <p className="text-sm text-muted-foreground">{referral.reason}</p>
          </div>

          {/* Linked Notes */}
          {referral.attachedNotes.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-semibold mb-2">Linked Notes</p>
                <ul className="space-y-1.5">
                  {referral.attachedNotes.map((note, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <IconClipboard className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Separator />

          {/* Status Timeline */}
          <div>
            <p className="text-sm font-semibold mb-3">Status Timeline</p>
            <div className="relative pl-6 space-y-4">
              {referral.timeline.map((entry, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  {/* Vertical line connector */}
                  {idx < referral.timeline.length - 1 && (
                    <div className="absolute left-[-14px] top-6 w-px h-[calc(100%+4px)] bg-border" />
                  )}
                  <div className="absolute left-[-18px] top-0.5">
                    <TimelineIcon s={entry.status} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{entry.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.date ?? "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
