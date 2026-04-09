"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { dummyRegistrations, PatientRecord } from "./dummyregistration"
import { RegistrationForm } from "./registrationForm"
import { EditPatientModal } from "./editPatient"
import { ViewPatientModal } from "./viewPatient"
import {
  Search,
  Eye,
  Edit,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import { format } from "date-fns"

type SortOption = "name" | "id" | "date"

function getLocalStoragePatients(): PatientRecord[] {
  try {
    const raw = JSON.parse(localStorage.getItem("pgh-registered-patients") ?? "[]")
    return raw.map((p: any) => {
      // Calculate age from dateOfBirth or registeredAt
      let age = 0
      if (p.dateOfBirth) {
        const birthDate = new Date(p.dateOfBirth)
        const today = new Date()
        age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      }

      const statusMap: Record<string, "ACTIVE" | "PENDING" | "INACTIVE"> = {
        active: "ACTIVE",
        ACTIVE: "ACTIVE",
        pending: "PENDING",
        PENDING: "PENDING",
        inactive: "INACTIVE",
        INACTIVE: "INACTIVE",
      }

      return {
        id: p.hospitalNumber || p.id || "UNKNOWN",
        firstName: p.firstName || "",
        middleName: p.middleName || "",
        lastName: p.lastName || "",
        gender: (p.gender === "FEMALE" ? "FEMALE" : "MALE") as "MALE" | "FEMALE",
        age,
        contactNumber: p.mobileNumber || p.contactNumber || "",
        dateRegistered: p.registeredAt
          ? new Date(p.registeredAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: statusMap[p.status] || "ACTIVE",
      }
    })
  } catch {
    return []
  }
}

export default function PatientRegistrationPage() {
  const [patients, setPatients] = useState<PatientRecord[]>(dummyRegistrations)
  const [searchQuery, setSearchQuery] = useState("")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Load localStorage patients on mount and when form closes
  useEffect(() => {
    const stored = getLocalStoragePatients()
    setPatients([...stored, ...dummyRegistrations])
  }, [isRegistrationOpen])

  // Filter and sort patients
  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch =
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesGender = genderFilter === "all" || patient.gender === genderFilter
      const matchesStatus = statusFilter === "all" || patient.status === statusFilter

      return matchesSearch && matchesGender && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          const lastNameCompare = a.lastName.localeCompare(b.lastName)
          if (lastNameCompare !== 0) return lastNameCompare
          return a.firstName.localeCompare(b.firstName)

        case "id":
          return a.id.localeCompare(b.id)

        case "date":
          return new Date(b.dateRegistered).getTime() - new Date(a.dateRegistered).getTime()

        default:
          return 0
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPatients = filteredPatients.slice(startIndex, endIndex)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      ACTIVE: "default",
      PENDING: "secondary",
      INACTIVE: "destructive"
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const handleViewPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient)
    setIsViewModalOpen(true)
  }

  const handleEditPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient)
    setIsEditModalOpen(true)
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case "name":
        return "Alphabetical (A-Z)"
      case "id":
        return "Patient ID"
      case "date":
        return "Registration Date"
      default:
        return "Sort by"
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Patient Registration</h1>
            <p className="text-muted-foreground">
              Manage patient records and registrations
            </p>
          </div>

          {/* Toolbar */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  {/* Search and Filters Row */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 gap-2">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name or ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Select value={genderFilter} onValueChange={setGenderFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Genders</SelectItem>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Sort By */}
                      <div className="flex items-center gap-2 ml-2">
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Sort by:</span>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Alphabetical (A-Z)</SelectItem>
                            <SelectItem value="id">Patient ID</SelectItem>
                            <SelectItem value="date">Registration Date (Newest)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button onClick={() => setIsRegistrationOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      New Registration
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Patient Records</CardTitle>
                    <CardDescription>
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} patients • Sorted by {getSortLabel()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Contact Number</TableHead>
                        <TableHead>Date Registered</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPatients.length > 0 ? (
                        currentPatients.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell className="font-medium">{patient.id}</TableCell>
                            <TableCell>
                              {patient.lastName}, {patient.firstName} {patient.middleName}
                            </TableCell>
                            <TableCell>{patient.gender}</TableCell>
                            <TableCell>{patient.age}</TableCell>
                            <TableCell>{patient.contactNumber}</TableCell>
                            <TableCell>{format(new Date(patient.dateRegistered), "PP")}</TableCell>
                            <TableCell>{getStatusBadge(patient.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  title="View Details"
                                  onClick={() => handleViewPatient(patient)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  title="Edit Record"
                                  onClick={() => handleEditPatient(patient)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No patients found matching your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                {filteredPatients.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => {
                            return (
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - currentPage) <= 1
                            )
                          })
                          .map((page, index, array) => (
                            <div key={page} className="flex items-center">
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <Button
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="min-w-[40px]"
                              >
                                {page}
                              </Button>
                            </div>
                          ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <RegistrationForm 
          open={isRegistrationOpen}
          onOpenChange={setIsRegistrationOpen}
        />
        <ViewPatientModal 
          open={isViewModalOpen} 
          onOpenChange={setIsViewModalOpen}
          patient={selectedPatient}
        />
        <EditPatientModal 
          open={isEditModalOpen} 
          onOpenChange={setIsEditModalOpen}
          patient={selectedPatient}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}