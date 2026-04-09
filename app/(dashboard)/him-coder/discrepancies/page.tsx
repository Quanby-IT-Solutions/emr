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
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { NewQueryDialog } from "./components/new-query-dialog"
import { QueryDetailSheet, type Discrepancy } from "./components/query-detail-sheet"

// --- Mock Data ---

const mockDiscrepancies: Discrepancy[] = [
  {
    id: "QRY-001",
    encounterId: "ENC-2026-0041",
    patient: "John Doe",
    mrn: "MRN-001",
    type: "Missing Signature",
    flaggedBy: "Alice Rivera",
    flaggedDate: "Apr 9, 2026 09:30",
    assignedTo: "Dr. Sarah Johnson",
    status: "Open",
    priority: "High",
    description: "Discharge Summary (note n3) is unsigned. The Discharge Summary requires attending physician signature before the chart can be coded and finalized.",
  },
  {
    id: "QRY-002",
    encounterId: "ENC-2026-0041",
    patient: "John Doe",
    mrn: "MRN-001",
    type: "Incomplete Note",
    flaggedBy: "Alice Rivera",
    flaggedDate: "Apr 9, 2026 09:35",
    assignedTo: "Dr. Sarah Johnson",
    status: "Open",
    priority: "Normal",
    description: "Discharge Instructions section in the Discharge Summary is incomplete. Missing specific wound care instructions and activity restriction details.",
  },
  {
    id: "QRY-003",
    encounterId: "ENC-2026-0038",
    patient: "Maria Garcia",
    mrn: "MRN-007",
    type: "Conflicting Diagnosis",
    flaggedBy: "Alice Rivera",
    flaggedDate: "Apr 8, 2026 15:00",
    assignedTo: "Dr. Michael Chen",
    status: "Pending Clinician",
    priority: "Urgent",
    description: "The H&P lists 'acute appendicitis' as the admitting diagnosis, but the Discharge Summary states 'acute gastroenteritis.' Please clarify the principal diagnosis for proper ICD-10 coding.",
  },
  {
    id: "QRY-004",
    encounterId: "ENC-2026-0036",
    patient: "Emily Davis",
    mrn: "MRN-011",
    type: "Missing Documentation",
    flaggedBy: "Brian Park",
    flaggedDate: "Apr 8, 2026 11:00",
    assignedTo: "Dr. Noah Bennett",
    status: "Pending Clinician",
    priority: "Normal",
    description: "Procedure note for bedside thoracentesis (documented in progress notes as performed on Apr 5) is missing from the chart. Please add the procedure note.",
  },
  {
    id: "QRY-005",
    encounterId: "ENC-2026-0033",
    patient: "Priya Patel",
    mrn: "MRN-009",
    type: "Missing Signature",
    flaggedBy: "Brian Park",
    flaggedDate: "Apr 7, 2026 16:45",
    assignedTo: "Dr. Michael Chen",
    status: "Resolved",
    priority: "Normal",
    description: "Consultation note from Neurology was unsigned. Required cosignature from attending.",
    resolution: "Note signed and cosigned on Apr 8, 2026 at 08:20 by Dr. Michael Chen.",
  },
  {
    id: "QRY-006",
    encounterId: "ENC-2026-0035",
    patient: "James Brown",
    mrn: "MRN-010",
    type: "Conflicting Diagnosis",
    flaggedBy: "Alice Rivera",
    flaggedDate: "Apr 7, 2026 14:00",
    assignedTo: "Dr. Sarah Johnson",
    status: "Resolved",
    priority: "High",
    description: "Progress notes suggest acute systolic heart failure but discharge summary lists diastolic heart failure. Clarification needed for accurate ICD-10 assignment.",
    resolution: "Dr. Johnson amended discharge summary to correctly state 'Chronic systolic (congestive) heart failure, acute exacerbation' on Apr 7, 2026.",
  },
  {
    id: "QRY-007",
    encounterId: "ENC-2026-0032",
    patient: "Ahmed Hassan",
    mrn: "MRN-018",
    type: "Other",
    flaggedBy: "Brian Park",
    flaggedDate: "Apr 6, 2026 10:00",
    assignedTo: "Dr. David Martinez",
    status: "Open",
    priority: "Normal",
    description: "Patient's allergy list was not verified/reconciled at discharge. Please confirm or update the allergy list.",
  },
]

const statusBadgeClass: Record<string, string> = {
  Open: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Pending Clinician": "bg-blue-100 text-blue-800 border-blue-300",
  Resolved: "bg-green-100 text-green-800 border-green-300",
}

const typeBadgeClass: Record<string, string> = {
  "Missing Signature": "bg-orange-100 text-orange-800 border-orange-300",
  "Conflicting Diagnosis": "bg-red-100 text-red-800 border-red-300",
  "Incomplete Note": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Missing Documentation": "bg-purple-100 text-purple-800 border-purple-300",
  Other: "bg-gray-100 text-gray-800 border-gray-300",
}

const priorityBadgeClass: Record<string, string> = {
  Normal: "bg-gray-100 text-gray-800 border-gray-300",
  High: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Urgent: "bg-red-100 text-red-800 border-red-300",
}

export default function DiscrepanciesPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState<Discrepancy | null>(null)

  const filtered = useMemo(() => {
    return mockDiscrepancies.filter((q) => {
      if (activeTab === "open" && q.status !== "Open") return false
      if (activeTab === "pending" && q.status !== "Pending Clinician") return false
      if (activeTab === "resolved" && q.status !== "Resolved") return false

      if (search) {
        const s = search.toLowerCase()
        return (
          q.patient.toLowerCase().includes(s) ||
          q.mrn.toLowerCase().includes(s) ||
          q.encounterId.toLowerCase().includes(s) ||
          q.id.toLowerCase().includes(s) ||
          q.assignedTo.toLowerCase().includes(s)
        )
      }

      return true
    })
  }, [activeTab, search])

  const openQuery = (q: Discrepancy) => {
    setSelectedQuery(q)
    setSheetOpen(true)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.HIM_CODER}>
      <DashboardLayout role={UserRole.HIM_CODER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Discrepancy Queries</h1>
              <p className="text-muted-foreground">
                Flag and track chart discrepancies requiring clinician clarification
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <IconPlus className="h-4 w-4 mr-2" />
              New Query
            </Button>
          </div>

          <div className="px-4 lg:px-6 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="pending">Pending Clinician</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient, MRN, encounter, or clinician..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {["all", "open", "pending", "resolved"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Encounter</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Flagged By</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                No discrepancy queries found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filtered.map((q) => (
                              <TableRow
                                key={q.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => openQuery(q)}
                              >
                                <TableCell className="font-medium">{q.id}</TableCell>
                                <TableCell>
                                  {q.patient}
                                  <span className="text-xs text-muted-foreground ml-1">({q.mrn})</span>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{q.encounterId}</TableCell>
                                <TableCell>
                                  <Badge className={typeBadgeClass[q.type]}>{q.type}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{q.flaggedBy}</TableCell>
                                <TableCell className="text-muted-foreground">{q.assignedTo}</TableCell>
                                <TableCell>
                                  <Badge className={priorityBadgeClass[q.priority]}>{q.priority}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={statusBadgeClass[q.status]}>{q.status}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{q.flaggedDate}</TableCell>
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

        <NewQueryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        <QueryDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} query={selectedQuery} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
