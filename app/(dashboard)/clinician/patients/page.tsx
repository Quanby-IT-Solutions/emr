"use client"

import { useMemo, useState, useEffect } from "react"
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

interface Patient {
  id: string
  firstName: string
  lastName: string
  mrn: string
  dateOfBirth: string
  gender: string | null
}

const statusBadge = (status: string) => {
  const config: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    PLANNED: "bg-blue-100 text-blue-800 border-blue-200",
    DISCHARGED: "bg-gray-100 text-gray-800 border-gray-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  }
  return <Badge className={config[status] ?? "bg-slate-100 text-slate-800"}>{status}</Badge>
}

const encounterTypeBadge = (type: string) => {
  const config: Record<string, { label: string; className: string }> = {
    OUTPATIENT: { label: "OPD", className: "bg-blue-100 text-blue-800 border-blue-200" },
    EMERGENCY: { label: "ER", className: "bg-orange-100 text-orange-800 border-orange-200" },
    INPATIENT: { label: "IPD", className: "bg-purple-100 text-purple-800 border-purple-200" },
  }
  const c = config[type]
  if (!c) return <Badge>{type}</Badge>
  return <Badge className={c.className}>{c.label}</Badge>
}

export default function ClinicianPatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [encounterFilter, setEncounterFilter] = useState("all")

  useEffect(() => {
    fetch('/api/patients?withEncounters=true')
      .then((r) => r.json())
      .then((json) => {
        if (Array.isArray(json?.data)) setPatients(json.data)
        else if (Array.isArray(json)) setPatients(json)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        fullName.includes(searchQuery.toLowerCase()) ||
        p.mrn.toLowerCase().includes(searchQuery.toLowerCase())

      const activeEncounter = (p.encounters ?? [])[0]
      const encounterStatus = activeEncounter?.status ?? ''
      const encounterType = activeEncounter?.type ?? ''

      const matchesStatus = statusFilter === "all" || encounterStatus === statusFilter
      const matchesEncounter = encounterFilter === "all" || encounterType === encounterFilter

      return matchesSearch && matchesStatus && matchesEncounter
    })
  }, [searchQuery, statusFilter, encounterFilter, patients])

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
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PLANNED">Scheduled</SelectItem>
                      <SelectItem value="DISCHARGED">Discharged</SelectItem>
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

            <Card>
              <CardHeader>
                <CardTitle>
                  Patient List ({loading ? '...' : filteredPatients.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Loading patients...</p>
                  </div>
                ) : filteredPatients.length === 0 ? (
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
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPatients.map((patient) => {
                          const enc = (patient.encounters ?? [])[0]
                          return (
                            <TableRow key={patient.id}>
                              <TableCell className="font-medium">
                                {patient.firstName} {patient.lastName}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {patient.mrn}
                              </TableCell>
                              <TableCell>
                                {new Date(patient.dateOfBirth).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{patient.gender ?? '—'}</TableCell>
                              <TableCell>
                                {enc ? encounterTypeBadge(enc.type) : '—'}
                              </TableCell>
                              <TableCell>
                                {enc ? statusBadge(enc.status) : '—'}
                              </TableCell>
                              <TableCell className="text-sm">
                                {enc?.attendingProvider
                                  ? `${enc.attendingProvider.firstName} ${enc.attendingProvider.lastName}`
                                  : '—'}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {enc?.currentLocation
                                  ? `${enc.currentLocation.unit} ${enc.currentLocation.roomNumber ?? ''}`
                                  : '—'}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/clinician/chart?patientId=${patient.id}`)
                                  }
                                >
                                  View Chart
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
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
