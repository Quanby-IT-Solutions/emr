"use client"

import { Badge } from "@/components/ui/badge"
import { IconAlertTriangle } from "@tabler/icons-react"

interface Problem {
  id: string
  entry: string
  icd10Code: string
  status: string
}

interface Allergy {
  id: string
  substance: string
  reaction: string
  severity: string
  status: string
}

interface ProblemsAllergiesStripProps {
  problems: Problem[]
  allergies: Allergy[]
}

export function ProblemsAllergiesStrip({ problems, allergies }: ProblemsAllergiesStripProps) {
  const activeProblems = problems.filter((p) => p.status === "ACTIVE")
  const activeAllergies = allergies.filter((a) => a.status === "ACTIVE")
  const hasSevere = activeAllergies.some((a) => a.severity === "SEVERE")

  return (
    <div className="flex flex-col gap-0 rounded-lg border overflow-hidden">
      {/* Allergies row */}
      <div
        className={`flex items-center gap-3 px-4 py-2.5 ${
          hasSevere
            ? "bg-red-50 border-b border-red-200 dark:bg-red-950/30 dark:border-red-900"
            : activeAllergies.length > 0
              ? "bg-amber-50 border-b border-amber-200 dark:bg-amber-950/30 dark:border-amber-900"
              : "bg-muted/50 border-b"
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <IconAlertTriangle
            className={`h-4 w-4 ${hasSevere ? "text-red-600" : "text-amber-600"}`}
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Allergies
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {activeAllergies.length === 0 ? (
            <span className="text-xs text-muted-foreground">NKDA (No Known Drug Allergies)</span>
          ) : (
            activeAllergies.map((allergy) => (
              <Badge
                key={allergy.id}
                className={
                  allergy.severity === "SEVERE"
                    ? "bg-red-100 text-red-900 border-red-300 dark:bg-red-900/50 dark:text-red-200 dark:border-red-800"
                    : "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-800"
                }
              >
                {allergy.substance} — {allergy.reaction} — {allergy.severity}
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Problems row */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground shrink-0">
          Problems
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {activeProblems.length === 0 ? (
            <span className="text-xs text-muted-foreground">No active problems</span>
          ) : (
            activeProblems.map((problem) => (
              <Badge key={problem.id} variant="outline" className="text-xs">
                {problem.entry} ({problem.icd10Code})
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
