"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconAlertTriangle, IconCheck, IconFlag } from "@tabler/icons-react"
import { toast } from "sonner"

export interface DeficiencyItem {
  id: string
  label: string
  required: boolean
  status: "Complete" | "Missing" | "Incomplete"
}

interface DeficiencyChecklistProps {
  items: DeficiencyItem[]
  onMarkComplete: () => void
  onFlagDeficiency: () => void
  onSendToCoding: () => void
}

const statusIcon = (status: DeficiencyItem["status"]) => {
  switch (status) {
    case "Complete":
      return <IconCheck className="h-4 w-4 text-green-600" />
    case "Missing":
      return <IconAlertTriangle className="h-4 w-4 text-red-500" />
    case "Incomplete":
      return <IconFlag className="h-4 w-4 text-yellow-500" />
  }
}

const statusBadgeClass: Record<string, string> = {
  Complete: "bg-green-100 text-green-800 border-green-300",
  Missing: "bg-red-100 text-red-800 border-red-300",
  Incomplete: "bg-yellow-100 text-yellow-800 border-yellow-300",
}

export function DeficiencyChecklist({
  items,
  onMarkComplete,
  onFlagDeficiency,
  onSendToCoding,
}: DeficiencyChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    return new Set(items.filter((i) => i.status === "Complete").map((i) => i.id))
  })

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const totalComplete = checkedItems.size
  const totalRequired = items.filter((i) => i.required).length
  const requiredComplete = items.filter((i) => i.required && checkedItems.has(i.id)).length
  const allRequiredMet = requiredComplete === totalRequired

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Chart Deficiency Checklist</CardTitle>
          <Badge variant="outline">
            {totalComplete}/{items.length} checked
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {allRequiredMet
            ? "All required items are met — ready for coding"
            : `${totalRequired - requiredComplete} required item(s) still missing`}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-md border p-2.5 text-sm"
          >
            <Checkbox
              checked={checkedItems.has(item.id)}
              onCheckedChange={() => toggleItem(item.id)}
            />
            <div className="flex-1 flex items-center gap-2">
              {statusIcon(item.status)}
              <span className={checkedItems.has(item.id) ? "line-through text-muted-foreground" : ""}>
                {item.label}
              </span>
              {item.required && (
                <span className="text-xs text-red-500 font-medium">Required</span>
              )}
            </div>
            <Badge className={statusBadgeClass[item.status]}>{item.status}</Badge>
          </div>
        ))}

        <Separator className="my-3" />

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onMarkComplete()
              toast.success("Chart marked as review complete")
            }}
          >
            <IconCheck className="h-3.5 w-3.5 mr-1" />
            Mark Complete
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => {
              onFlagDeficiency()
              toast.info("Deficiency flagged — query sent to clinician")
            }}
          >
            <IconFlag className="h-3.5 w-3.5 mr-1" />
            Flag Deficiency
          </Button>
          <Button
            size="sm"
            disabled={!allRequiredMet}
            onClick={() => {
              onSendToCoding()
              toast.success("Chart sent to coding queue")
            }}
          >
            Send to Coding
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
