"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconTrash, IconStar, IconGripVertical } from "@tabler/icons-react"
import type { ICD10Code } from "./icd-search"

interface AssignedCodesProps {
  principalDx: ICD10Code | null
  secondaryDxList: ICD10Code[]
  onSetPrincipal: (code: ICD10Code) => void
  onRemovePrincipal: () => void
  onRemoveSecondary: (code: string) => void
  onPromoteToPrincipal: (code: string) => void
}

const categoryBadge: Record<string, string> = {
  Endocrine: "bg-amber-100 text-amber-800 border-amber-300",
  Circulatory: "bg-red-100 text-red-800 border-red-300",
  Respiratory: "bg-sky-100 text-sky-800 border-sky-300",
  Genitourinary: "bg-indigo-100 text-indigo-800 border-indigo-300",
  Digestive: "bg-orange-100 text-orange-800 border-orange-300",
  Nervous: "bg-purple-100 text-purple-800 border-purple-300",
  Infectious: "bg-rose-100 text-rose-800 border-rose-300",
  Blood: "bg-pink-100 text-pink-800 border-pink-300",
  Symptoms: "bg-gray-100 text-gray-800 border-gray-300",
  Factors: "bg-teal-100 text-teal-800 border-teal-300",
}

function CodeRow({
  code,
  isPrincipal,
  onRemove,
  onPromote,
}: {
  code: ICD10Code
  isPrincipal?: boolean
  onRemove: () => void
  onPromote?: () => void
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border p-2.5 text-sm">
      <IconGripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-primary">{code.code}</span>
          {isPrincipal && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <IconStar className="h-3 w-3 mr-0.5" />
              Principal
            </Badge>
          )}
          <Badge className={categoryBadge[code.category] ?? "bg-gray-100 text-gray-800 border-gray-300"}>
            {code.category}
          </Badge>
        </div>
        <p className="text-muted-foreground truncate mt-0.5">{code.description}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!isPrincipal && onPromote && (
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onPromote}>
            <IconStar className="h-3 w-3 mr-0.5" />
            Principal
          </Button>
        )}
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700" onClick={onRemove}>
          <IconTrash className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

export function AssignedCodes({
  principalDx,
  secondaryDxList,
  onRemovePrincipal,
  onRemoveSecondary,
  onPromoteToPrincipal,
}: AssignedCodesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Assigned Diagnosis Codes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Principal Diagnosis */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Principal Diagnosis
          </p>
          {principalDx ? (
            <CodeRow code={principalDx} isPrincipal onRemove={onRemovePrincipal} />
          ) : (
            <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              No principal diagnosis assigned. Search and select a code above.
            </div>
          )}
        </div>

        <Separator />

        {/* Secondary Diagnoses */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Secondary Diagnoses
            </p>
            <Badge variant="outline">{secondaryDxList.length} codes</Badge>
          </div>
          {secondaryDxList.length > 0 ? (
            <div className="space-y-2">
              {secondaryDxList.map((code) => (
                <CodeRow
                  key={code.code}
                  code={code}
                  onRemove={() => onRemoveSecondary(code.code)}
                  onPromote={() => onPromoteToPrincipal(code.code)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              No secondary diagnoses assigned yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
