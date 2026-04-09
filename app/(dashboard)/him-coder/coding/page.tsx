"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconUser, IconStethoscope, IconDeviceFloppy, IconSend } from "@tabler/icons-react"
import { toast } from "sonner"
import { ICDSearch, type ICD10Code } from "./components/icd-search"
import { AssignedCodes } from "./components/assigned-codes"

// --- Mock Encounter Context ---

const encounterInfo = {
  id: "ENC-2026-0039",
  patient: "Bob Wilson",
  mrn: "MRN-003",
  dob: "Mar 22, 1975",
  age: 51,
  sex: "Male",
  encounterType: "IPD" as const,
  admissionDate: "Apr 2, 2026",
  dischargeDate: "Apr 8, 2026",
  attendingProvider: "Dr. Lisa Park",
}

const problemList = [
  { problem: "Acute pancreatitis", status: "Active", onsetDate: "Apr 2, 2026" },
  { problem: "Type 2 diabetes mellitus", status: "Active", onsetDate: "2018" },
  { problem: "Essential hypertension", status: "Active", onsetDate: "2015" },
  { problem: "Chronic kidney disease, stage 3", status: "Active", onsetDate: "2022" },
  { problem: "Gastroesophageal reflux disease", status: "Resolved", onsetDate: "2020" },
]

const encounterTypeBadge: Record<string, string> = {
  OPD: "bg-blue-100 text-blue-800 border-blue-300",
  ER: "bg-orange-100 text-orange-800 border-orange-300",
  IPD: "bg-purple-100 text-purple-800 border-purple-300",
}

const problemStatusBadge: Record<string, string> = {
  Active: "bg-green-100 text-green-800 border-green-300",
  Resolved: "bg-gray-100 text-gray-800 border-gray-300",
}

export default function CodingPage() {
  const [principalDx, setPrincipalDx] = useState<ICD10Code | null>(null)
  const [secondaryDxList, setSecondaryDxList] = useState<ICD10Code[]>([])

  const allAssignedCodes = [
    ...(principalDx ? [principalDx.code] : []),
    ...secondaryDxList.map((c) => c.code),
  ]

  const handleSelectCode = (code: ICD10Code) => {
    if (allAssignedCodes.includes(code.code)) {
      toast.error(`Code ${code.code} is already assigned`)
      return
    }

    if (!principalDx) {
      setPrincipalDx(code)
      toast.success(`${code.code} set as Principal Diagnosis`)
    } else {
      setSecondaryDxList((prev) => [...prev, code])
      toast.success(`${code.code} added as Secondary Diagnosis`)
    }
  }

  const handleRemovePrincipal = () => {
    setPrincipalDx(null)
  }

  const handleRemoveSecondary = (codeStr: string) => {
    setSecondaryDxList((prev) => prev.filter((c) => c.code !== codeStr))
  }

  const handlePromoteToPrincipal = (codeStr: string) => {
    const code = secondaryDxList.find((c) => c.code === codeStr)
    if (!code) return

    if (principalDx) {
      setSecondaryDxList((prev) => [
        principalDx,
        ...prev.filter((c) => c.code !== codeStr),
      ])
    } else {
      setSecondaryDxList((prev) => prev.filter((c) => c.code !== codeStr))
    }
    setPrincipalDx(code)
    toast.success(`${code.code} promoted to Principal Diagnosis`)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.HIM_CODER}>
      <DashboardLayout role={UserRole.HIM_CODER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">ICD-10 Coding</h1>
            <p className="text-muted-foreground">
              Assign diagnosis codes to the encounter
            </p>
          </div>

          {/* Encounter Summary Bar */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <IconUser className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{encounterInfo.patient}</span>
                    <span className="text-muted-foreground">({encounterInfo.mrn})</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2">
                    <IconStethoscope className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{encounterInfo.id}</span>
                    <Badge className={encounterTypeBadge[encounterInfo.encounterType]}>
                      {encounterInfo.encounterType}
                    </Badge>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <span className="text-muted-foreground">
                    {encounterInfo.admissionDate} → {encounterInfo.dischargeDate}
                  </span>
                  <Separator orientation="vertical" className="h-5" />
                  <span className="text-muted-foreground">{encounterInfo.attendingProvider}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: ICD Search + Assigned Codes + Problem List */}
          <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
            {/* Left: Search + Assigned Codes — 2/3 */}
            <div className="lg:col-span-2 space-y-4">
              <ICDSearch onSelect={handleSelectCode} excludeCodes={allAssignedCodes} />

              <AssignedCodes
                principalDx={principalDx}
                secondaryDxList={secondaryDxList}
                onSetPrincipal={setPrincipalDx}
                onRemovePrincipal={handleRemovePrincipal}
                onRemoveSecondary={handleRemoveSecondary}
                onPromoteToPrincipal={handlePromoteToPrincipal}
              />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => toast.success("Codes saved as draft")}
                >
                  <IconDeviceFloppy className="h-4 w-4 mr-1" />
                  Save Codes
                </Button>
                <Button
                  disabled={!principalDx}
                  onClick={() => toast.success("Encounter submitted for finalization")}
                >
                  <IconSend className="h-4 w-4 mr-1" />
                  Submit for Finalization
                </Button>
              </div>
            </div>

            {/* Right: Problem List Reference — 1/3 */}
            <div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Patient Problem List</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Reference for code assignment
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {problemList.map((p, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                      <div>
                        <p className="font-medium">{p.problem}</p>
                        <p className="text-xs text-muted-foreground">Onset: {p.onsetDate}</p>
                      </div>
                      <Badge className={problemStatusBadge[p.status]}>{p.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
