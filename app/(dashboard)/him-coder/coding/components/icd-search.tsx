"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconSearch, IconPlus } from "@tabler/icons-react"

export interface ICD10Code {
  code: string
  description: string
  category: string
}

interface ICDSearchProps {
  onSelect: (code: ICD10Code) => void
  excludeCodes?: string[]
}

const icdDatabase: ICD10Code[] = [
  { code: "E11.9", description: "Type 2 diabetes mellitus without complications", category: "Endocrine" },
  { code: "E11.65", description: "Type 2 diabetes mellitus with hyperglycemia", category: "Endocrine" },
  { code: "E11.22", description: "Type 2 diabetes mellitus with diabetic chronic kidney disease", category: "Endocrine" },
  { code: "E11.40", description: "Type 2 diabetes mellitus with diabetic neuropathy, unspecified", category: "Endocrine" },
  { code: "I50.9", description: "Heart failure, unspecified", category: "Circulatory" },
  { code: "I50.22", description: "Chronic systolic (congestive) heart failure", category: "Circulatory" },
  { code: "I50.32", description: "Chronic diastolic (congestive) heart failure", category: "Circulatory" },
  { code: "I10", description: "Essential (primary) hypertension", category: "Circulatory" },
  { code: "I25.10", description: "Atherosclerotic heart disease of native coronary artery", category: "Circulatory" },
  { code: "J18.9", description: "Pneumonia, unspecified organism", category: "Respiratory" },
  { code: "J44.1", description: "Chronic obstructive pulmonary disease with acute exacerbation", category: "Respiratory" },
  { code: "J96.00", description: "Acute respiratory failure, unspecified", category: "Respiratory" },
  { code: "N18.3", description: "Chronic kidney disease, stage 3 (moderate)", category: "Genitourinary" },
  { code: "N18.4", description: "Chronic kidney disease, stage 4 (severe)", category: "Genitourinary" },
  { code: "N17.9", description: "Acute kidney failure, unspecified", category: "Genitourinary" },
  { code: "K85.9", description: "Acute pancreatitis, unspecified", category: "Digestive" },
  { code: "K21.0", description: "Gastro-esophageal reflux disease with esophagitis", category: "Digestive" },
  { code: "G40.909", description: "Epilepsy, unspecified, not intractable", category: "Nervous" },
  { code: "A41.9", description: "Sepsis, unspecified organism", category: "Infectious" },
  { code: "D64.9", description: "Anemia, unspecified", category: "Blood" },
  { code: "R65.20", description: "Severe sepsis without septic shock", category: "Symptoms" },
  { code: "Z87.39", description: "Personal history of other diseases of the musculoskeletal system", category: "Factors" },
]

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

export function ICDSearch({ onSelect, excludeCodes = [] }: ICDSearchProps) {
  const [search, setSearch] = useState("")

  const results = useMemo(() => {
    if (!search || search.length < 2) return []
    const q = search.toLowerCase()
    return icdDatabase
      .filter(
        (code) =>
          !excludeCodes.includes(code.code) &&
          (code.code.toLowerCase().includes(q) ||
            code.description.toLowerCase().includes(q) ||
            code.category.toLowerCase().includes(q))
      )
      .slice(0, 8)
  }, [search, excludeCodes])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">ICD-10 Code Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ICD-10 code, description, or category..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {results.length > 0 && (
          <div className="space-y-1 max-h-72 overflow-y-auto border rounded-md">
            {results.map((code) => (
              <div
                key={code.code}
                className="flex items-center justify-between p-2.5 text-sm hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                onClick={() => {
                  onSelect(code)
                  setSearch("")
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-semibold text-primary">{code.code}</span>
                  <span>{code.description}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={categoryBadge[code.category] ?? "bg-gray-100 text-gray-800 border-gray-300"}>
                    {code.category}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <IconPlus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {search.length >= 2 && results.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No matching ICD-10 codes found for &quot;{search}&quot;
          </p>
        )}

        {search.length > 0 && search.length < 2 && (
          <p className="text-xs text-muted-foreground">Type at least 2 characters to search...</p>
        )}
      </CardContent>
    </Card>
  )
}
