"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { IconSearch, IconUser } from "@tabler/icons-react"

// --- Mock Data ---

interface Patient {
  id: string
  firstName: string
  lastName: string
  mrn: string
  dateOfBirth: string
  gender: string
  encounterType: "OUTPATIENT" | "EMERGENCY" | "INPATIENT"
  status: "Active" | "Discharged" | "Scheduled"
  attendingProvider: string
  location: string | null
  lastVisitDate: string
}

const mockPatients: Patient[] = [
  { id: "1", firstName: "John", lastName: "Doe", mrn: "MRN-001", dateOfBirth: "1985-03-15", gender: "Male", encounterType: "INPATIENT", status: "Active", attendingProvider: "Dr. Sarah Johnson", location: "Room 301-A", lastVisitDate: "2026-04-01" },
  { id: "2", firstName: "Jane", lastName: "Smith", mrn: "MRN-002", dateOfBirth: "1990-07-22", gender: "Female", encounterType: "OUTPATIENT", status: "Scheduled", attendingProvider: "Dr. Sarah Johnson", location: null, lastVisitDate: "2026-03-28" },
  { id: "3", firstName: "Robert", lastName: "Chen", mrn: "MRN-009", dateOfBirth: "1972-11-08", gender: "Male", encounterType: "INPATIENT", status: "Active", attendingProvider: "Dr. Sarah Johnson", location: "ICU Bed 4", lastVisitDate: "2026-03-28" },
  { id: "4", firstName: "Maria", lastName: "Garcia", mrn: "MRN-007", dateOfBirth: "1988-01-30", gender: "Female", encounterType: "EMERGENCY", status: "Active", attendingProvider: "Dr. Sarah Johnson", location: "ER Bay 3", lastVisitDate: "2026-04-09" },
  { id: "5", firstName: "James", lastName: "Lee", mrn: "MRN-012", dateOfBirth: "1965-05-14", gender: "Male", encounterType: "OUTPATIENT", status: "Active", attendingProvider: "Dr. Sarah Johnson", location: null, lastVisitDate: "2026-04-09" },
  { id: "6", firstName: "Linda", lastName: "Park", mrn: "MRN-011", dateOfBirth: "1958-09-03", gender: "Female", encounterType: "INPATIENT", status: "Active", attendingProvider: "Dr. Sarah Johnson", location: "Room 205-B", lastVisitDate: "2026-04-03" },
  { id: "7", firstName: "Sarah", lastName: "Kim", mrn: "MRN-015", dateOfBirth: "1995-12-20", gender: "Female", encounterType: "OUTPATIENT", status: "Scheduled", attendingProvider: "Dr. Sarah Johnson", location: null, lastVisitDate: "2026-03-15" },
  { id: "8", firstName: "Ahmed", lastName: "Hassan", mrn: "MRN-018", dateOfBirth: "1980-06-11", gender: "Male", encounterType: "OUTPATIENT", status: "Scheduled", attendingProvider: "Dr. Sarah Johnson", location: null, lastVisitDate: "2026-03-20" },
  { id: "9", firstName: "Emily", lastName: "Chen", mrn: "MRN-022", dateOfBirth: "1992-02-28", gender: "Female", encounterType: "EMERGENCY", status: "Discharged", attendingProvider: "Dr. Sarah Johnson", location: null, lastVisitDate: "2026-04-05" },
  { id: "10", firstName: "David", lastName: "Wilson", mrn: "MRN-003", dateOfBirth: "1975-08-19", gender: "Male", encounterType: "OUTPATIENT", status: "Discharged", attendingProvider: "Dr. Sarah Johnson", location: null, lastVisitDate: "2026-03-10" },
  { id: "11", firstName: "Patricia", lastName: "Martinez", mrn: "MRN-025", dateOfBirth: "1968-04-07", gender: "Female", encounterType: "INPATIENT", status: "Discharged", attendingProvider: "Dr. Sarah Johnson", location: null, lastVisitDate: "2026-04-06" },
  { id: "12", firstName: "Michael", lastName: "Brown", mrn: "MRN-030", dateOfBirth: "1953-10-25", gender: "Male", encounterType: "EMERGENCY", status: "Active", attendingProvider: "Dr. Sarah Johnson", location: "ER Bay 7", lastVisitDate: "2026-04-09" },
]

// --- Helpers ---

const encounterTypeBadge = (type: Patient["encounterType"]) => {
  const config: Record<string, { label: string; className: string }> = {
    OUTPATIENT: { label: "OPD", className: "bg-blue-100 text-blue-800 border-blue-200" },
    EMERGENCY: { label: "ER", className: "bg-orange-100 text-orange-800 border-orange-200" },
    INPATIENT: { label: "IPD", className: "bg-purple-100 text-purple-800 border-purple-200" },
  }
  const c = config[type]
  return <Badge className={c.className}>{c.label}</Badge>
}

const statusBadge = (status: Patient["status"]) => {
  const config: Record<string, string> = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    Discharged: "bg-gray-100 text-gray-800 border-gray-200",
  }
  return <Badge className={config[status]}>{status}</Badge>
}

// --- Page ---

export default function ClinicianPatientsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [encounterFilter, setEncounterFilter] = useState("all")

  const filteredPatients = useMemo(() => {
    return mockPatients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        fullName.includes(searchQuery.toLowerCase()) ||
        p.mrn.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter

      const matchesEncounter =
        encounterFilter === "all" || p.encounterType === encounterFilter

      return matchesSearch && matchesStatus && matchesEncounter
    })
  }, [searchQuery, statusFilter, encounterFilter])

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">My Patients</h1>
            <p className="text-muted-foreground">
              View and manage your patient panel
            </p>
          </div>

          <div className="px-4 lg:px-6 space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or MRN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Discharged">Discharged</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={encounterFilter} onValueChange={setEncounterFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Encounter Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="OUTPATIENT">OPD</SelectItem>
                      <SelectItem value="EMERGENCY">ER</SelectItem>
                      <SelectItem value="INPATIENT">IPD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Patient Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Patient List ({filteredPatients.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPatients.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <IconUser className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No patients found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient Name</TableHead>
                          <TableHead>MRN</TableHead>
                          <TableHead>DOB</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Encounter</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Attending</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Last Visit</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPatients.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell className="font-medium">
                              {patient.firstName} {patient.lastName}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {patient.mrn}
                            </TableCell>
                            <TableCell>{patient.dateOfBirth}</TableCell>
                            <TableCell>{patient.gender}</TableCell>
                            <TableCell>
                              {encounterTypeBadge(patient.encounterType)}
                            </TableCell>
                            <TableCell>
                              {statusBadge(patient.status)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {patient.attendingProvider}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {patient.location ?? "—"}
                            </TableCell>
                            <TableCell>{patient.lastVisitDate}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/clinician/chart?patientId=${patient.id}`
                                  )
                                }
                              >
                                View Chart
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}