"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconSearch, IconCheck, IconArrowBack, IconDownload } from "@tabler/icons-react"
import { toast } from "sonner"
import { FinalizeDialog } from "./components/finalize-dialog"

// --- Types ---

type ReviewStatus = "Ready" | "Pending Review" | "Finalized" | "Returned"

interface CodedEncounter {
  id: string
  patient: string
  mrn: string
  principalDx: string
  secondaryDxCount: number
  coder: string
  reviewStatus: ReviewStatus
  codingDate: string
}

// --- Mock Data ---

const mockCoded: CodedEncounter[] = [
  { id: "ENC-2026-0037", patient: "Robert Chen", mrn: "MRN-009", principalDx: "E11.9 — Type 2 DM", secondaryDxCount: 3, coder: "Alice Rivera", reviewStatus: "Ready", codingDate: "Apr 9, 2026" },
  { id: "ENC-2026-0034", patient: "Linda Park", mrn: "MRN-011", principalDx: "J18.9 — Pneumonia", secondaryDxCount: 2, coder: "Brian Park", reviewStatus: "Ready", codingDate: "Apr 8, 2026" },
  { id: "ENC-2026-0031", patient: "Sarah Kim", mrn: "MRN-015", principalDx: "N18.3 — CKD Stage 3", secondaryDxCount: 4, coder: "Alice Rivera", reviewStatus: "Pending Review", codingDate: "Apr 8, 2026" },
  { id: "ENC-2026-0035", patient: "James Brown", mrn: "MRN-010", principalDx: "I50.22 — Chronic systolic CHF", secondaryDxCount: 3, coder: "Alice Rivera", reviewStatus: "Finalized", codingDate: "Apr 7, 2026" },
  { id: "ENC-2026-0033", patient: "Priya Patel", mrn: "MRN-009", principalDx: "G40.909 — Epilepsy", secondaryDxCount: 1, coder: "Brian Park", reviewStatus: "Finalized", codingDate: "Apr 7, 2026" },
  { id: "ENC-2026-0028", patient: "Linda Park", mrn: "MRN-011", principalDx: "K85.9 — Acute pancreatitis", secondaryDxCount: 2, coder: "Alice Rivera", reviewStatus: "Finalized", codingDate: "Apr 6, 2026" },
  { id: "ENC-2026-0025", patient: "Michael Torres", mrn: "MRN-020", principalDx: "A41.9 — Sepsis", secondaryDxCount: 5, coder: "Brian Park", reviewStatus: "Returned", codingDate: "Apr 6, 2026" },
  { id: "ENC-2026-0022", patient: "Emily Chen", mrn: "MRN-022", principalDx: "I10 — Hypertension", secondaryDxCount: 1, coder: "Alice Rivera", reviewStatus: "Ready", codingDate: "Apr 5, 2026" },
]

const reviewStatusBadge: Record<ReviewStatus, string> = {
  Ready: "bg-green-100 text-green-800 border-green-300",
  "Pending Review": "bg-yellow-100 text-yellow-800 border-yellow-300",
  Finalized: "bg-blue-100 text-blue-800 border-blue-300",
  Returned: "bg-red-100 text-red-800 border-red-300",
}

export default function FinalizePage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEnc, setSelectedEnc] = useState<CodedEncounter | null>(null)

  const filtered = useMemo(() => {
    return mockCoded.filter((enc) => {
      if (activeTab === "ready" && enc.reviewStatus !== "Ready") return false
      if (activeTab === "pending" && enc.reviewStatus !== "Pending Review") return false
      if (activeTab === "finalized" && enc.reviewStatus !== "Finalized") return false
      if (activeTab === "returned" && enc.reviewStatus !== "Returned") return false

      if (search) {
        const s = search.toLowerCase()
        return (
          enc.patient.toLowerCase().includes(s) ||
          enc.mrn.toLowerCase().includes(s) ||
          enc.id.toLowerCase().includes(s) ||
          enc.principalDx.toLowerCase().includes(s) ||
          enc.coder.toLowerCase().includes(s)
        )
      }

      return true
    })
  }, [activeTab, search])

  const openFinalizeDialog = (enc: CodedEncounter) => {
    setSelectedEnc(enc)
    setDialogOpen(true)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.HIM_CODER}>
      <DashboardLayout role={UserRole.HIM_CODER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Finalize Encounters</h1>
              <p className="text-muted-foreground">
                Review and finalize coded encounters to complete the HIM workflow
              </p>
            </div>
            <Button variant="outline" onClick={() => toast.info("Export started — generating coding file")}>
              <IconDownload className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="px-4 lg:px-6 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="ready">Ready</TabsTrigger>
                <TabsTrigger value="pending">Pending Review</TabsTrigger>
                <TabsTrigger value="finalized">Finalized</TabsTrigger>
                <TabsTrigger value="returned">Returned</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient, MRN, encounter, diagnosis, or coder..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {["all", "ready", "pending", "finalized", "returned"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Encounter ID</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>MRN</TableHead>
                            <TableHead>Principal Dx</TableHead>
                            <TableHead># Secondary Dx</TableHead>
                            <TableHead>Coder</TableHead>
                            <TableHead>Review Status</TableHead>
                            <TableHead>Coding Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                No encounters found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filtered.map((enc) => (
                              <TableRow key={enc.id}>
                                <TableCell className="font-medium">{enc.id}</TableCell>
                                <TableCell>{enc.patient}</TableCell>
                                <TableCell className="text-muted-foreground">{enc.mrn}</TableCell>
                                <TableCell>
                                  <span className="font-mono text-xs">{enc.principalDx}</span>
                                </TableCell>
                                <TableCell className="text-center">{enc.secondaryDxCount}</TableCell>
                                <TableCell className="text-muted-foreground">{enc.coder}</TableCell>
                                <TableCell>
                                  <Badge className={reviewStatusBadge[enc.reviewStatus]}>{enc.reviewStatus}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{enc.codingDate}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    {enc.reviewStatus === "Ready" && (
                                      <Button
                                        size="sm"
                                        onClick={() => openFinalizeDialog(enc)}
                                      >
                                        <IconCheck className="h-3.5 w-3.5 mr-1" />
                                        Finalize
                                      </Button>
                                    )}
                                    {(enc.reviewStatus === "Ready" || enc.reviewStatus === "Pending Review") && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => toast.info(`${enc.id} returned to coding`)}
                                      >
                                        <IconArrowBack className="h-3.5 w-3.5 mr-1" />
                                        Return
                                      </Button>
                                    )}
                                    {enc.reviewStatus === "Finalized" && (
                                      <Button size="sm" variant="ghost" disabled>
                                        Completed
                                      </Button>
                                    )}
                                    {enc.reviewStatus === "Returned" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => toast.info(`${enc.id} reopened for re-coding`)}
                                      >
                                        Re-code
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {selectedEnc && (
          <FinalizeDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            encounterId={selectedEnc.id}
            patient={selectedEnc.patient}
            principalDx={selectedEnc.principalDx}
            onConfirm={() => {
              toast.success(`${selectedEnc.id} finalized successfully`)
              setDialogOpen(false)
            }}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
