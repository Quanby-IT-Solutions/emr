"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconSearch, IconEye } from "@tabler/icons-react"
import { toast } from "sonner"

// --- Types ---

type EncounterType = "OPD" | "ER" | "IPD"
type CodingStatus = "Pending" | "In Review" | "Coded" | "Finalized"
type Priority = "Normal" | "High" | "Urgent"

interface DischargedEncounter {
  id: string
  patient: string
  mrn: string
  encounterType: EncounterType
  dischargeDate: string
  attendingProvider: string
  codingStatus: CodingStatus
  priority: Priority
  principalDx: string | null
}

// --- Mock Data ---

const mockEncounters: DischargedEncounter[] = [
  { id: "ENC-2026-0041", patient: "John Doe", mrn: "MRN-001", encounterType: "IPD", dischargeDate: "Apr 9, 2026", attendingProvider: "Dr. Sarah Johnson", codingStatus: "Pending", priority: "Normal", principalDx: null },
  { id: "ENC-2026-0040", patient: "Jane Smith", mrn: "MRN-002", encounterType: "ER", dischargeDate: "Apr 9, 2026", attendingProvider: "Dr. David Martinez", codingStatus: "Pending", priority: "High", principalDx: null },
  { id: "ENC-2026-0039", patient: "Bob Wilson", mrn: "MRN-003", encounterType: "IPD", dischargeDate: "Apr 8, 2026", attendingProvider: "Dr. Lisa Park", codingStatus: "In Review", priority: "Normal", principalDx: null },
  { id: "ENC-2026-0038", patient: "Maria Garcia", mrn: "MRN-007", encounterType: "ER", dischargeDate: "Apr 8, 2026", attendingProvider: "Dr. Michael Chen", codingStatus: "Pending", priority: "Urgent", principalDx: null },
  { id: "ENC-2026-0037", patient: "Robert Chen", mrn: "MRN-009", encounterType: "IPD", dischargeDate: "Apr 8, 2026", attendingProvider: "Dr. Sarah Johnson", codingStatus: "Coded", priority: "Normal", principalDx: "E11.9 — Type 2 DM" },
  { id: "ENC-2026-0036", patient: "Emily Davis", mrn: "MRN-011", encounterType: "OPD", dischargeDate: "Apr 7, 2026", attendingProvider: "Dr. Noah Bennett", codingStatus: "In Review", priority: "Normal", principalDx: null },
  { id: "ENC-2026-0035", patient: "James Brown", mrn: "MRN-010", encounterType: "IPD", dischargeDate: "Apr 7, 2026", attendingProvider: "Dr. Sarah Johnson", codingStatus: "Finalized", priority: "Normal", principalDx: "I50.9 — Heart failure" },
  { id: "ENC-2026-0034", patient: "Linda Park", mrn: "MRN-011", encounterType: "IPD", dischargeDate: "Apr 7, 2026", attendingProvider: "Dr. Lisa Park", codingStatus: "Coded", priority: "High", principalDx: "J18.9 — Pneumonia" },
  { id: "ENC-2026-0033", patient: "Priya Patel", mrn: "MRN-009", encounterType: "ER", dischargeDate: "Apr 6, 2026", attendingProvider: "Dr. Michael Chen", codingStatus: "Finalized", priority: "Normal", principalDx: "G40.909 — Epilepsy" },
  { id: "ENC-2026-0032", patient: "Ahmed Hassan", mrn: "MRN-018", encounterType: "OPD", dischargeDate: "Apr 6, 2026", attendingProvider: "Dr. David Martinez", codingStatus: "Pending", priority: "Normal", principalDx: null },
  { id: "ENC-2026-0031", patient: "Sarah Kim", mrn: "MRN-015", encounterType: "IPD", dischargeDate: "Apr 5, 2026", attendingProvider: "Dr. Noah Bennett", codingStatus: "Coded", priority: "Normal", principalDx: "N18.3 — CKD Stage 3" },
  { id: "ENC-2026-0030", patient: "Michael Torres", mrn: "MRN-020", encounterType: "ER", dischargeDate: "Apr 5, 2026", attendingProvider: "Dr. Sarah Johnson", codingStatus: "Pending", priority: "High", principalDx: null },
]

const encounterTypeBadge: Record<EncounterType, string> = {
  OPD: "bg-blue-100 text-blue-800 border-blue-300",
  ER: "bg-orange-100 text-orange-800 border-orange-300",
  IPD: "bg-purple-100 text-purple-800 border-purple-300",
}

const codingStatusBadge: Record<CodingStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "In Review": "bg-blue-100 text-blue-800 border-blue-300",
  Coded: "bg-green-100 text-green-800 border-green-300",
  Finalized: "bg-gray-100 text-gray-800 border-gray-300",
}

const priorityBadge: Record<Priority, string> = {
  Normal: "bg-gray-100 text-gray-800 border-gray-300",
  High: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Urgent: "bg-red-100 text-red-800 border-red-300",
}

export default function EncountersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredEncounters = useMemo(() => {
    return mockEncounters.filter((enc) => {
      if (activeTab === "pending" && enc.codingStatus !== "Pending") return false
      if (activeTab === "in-review" && enc.codingStatus !== "In Review") return false
      if (activeTab === "coded" && enc.codingStatus !== "Coded") return false

      if (statusFilter !== "all" && enc.codingStatus !== statusFilter) return false

      if (search) {
        const q = search.toLowerCase()
        return (
          enc.patient.toLowerCase().includes(q) ||
          enc.mrn.toLowerCase().includes(q) ||
          enc.id.toLowerCase().includes(q) ||
          enc.attendingProvider.toLowerCase().includes(q)
        )
      }

      return true
    })
  }, [activeTab, statusFilter, search])

  return (
    <ProtectedRoute requiredRole={UserRole.HIM_CODER}>
      <DashboardLayout role={UserRole.HIM_CODER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Discharged Encounters</h1>
            <p className="text-muted-foreground">
              Work queue of discharged patient encounters awaiting chart review and coding
            </p>
          </div>

          <div className="px-4 lg:px-6 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-review">In Review</TabsTrigger>
                <TabsTrigger value="coded">Coded</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient, MRN, encounter, or provider..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Coded">Coded</SelectItem>
                    <SelectItem value="Finalized">Finalized</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {["all", "pending", "in-review", "coded"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Encounter ID</TableHead>
                            <TableHead>Patient Name</TableHead>
                            <TableHead>MRN</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Discharge Date</TableHead>
                            <TableHead>Attending</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Coding Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEncounters.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                No encounters found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredEncounters.map((enc) => (
                              <TableRow key={enc.id}>
                                <TableCell className="font-medium">{enc.id}</TableCell>
                                <TableCell>{enc.patient}</TableCell>
                                <TableCell className="text-muted-foreground">{enc.mrn}</TableCell>
                                <TableCell>
                                  <Badge className={encounterTypeBadge[enc.encounterType]}>{enc.encounterType}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{enc.dischargeDate}</TableCell>
                                <TableCell className="text-muted-foreground">{enc.attendingProvider}</TableCell>
                                <TableCell>
                                  <Badge className={priorityBadge[enc.priority]}>{enc.priority}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={codingStatusBadge[enc.codingStatus]}>{enc.codingStatus}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant={enc.codingStatus === "Pending" ? "default" : "outline"}
                                    onClick={() => toast.info(`Opening chart review for ${enc.patient} (${enc.id})`)}
                                  >
                                    <IconEye className="h-3.5 w-3.5 mr-1" />
                                    {enc.codingStatus === "Pending" ? "Start Review" : "View"}
                                  </Button>
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
      </DashboardLayout>
    </ProtectedRoute>
  )
}
