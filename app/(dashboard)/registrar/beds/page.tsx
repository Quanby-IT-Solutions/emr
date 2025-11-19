"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { IconBed, IconSearch, IconUserPlus, IconCheck, IconRefresh, IconAlertCircle, IconMapPin } from "@tabler/icons-react"

interface Bed {
  id: string
  roomNumber: string
  bedNumber: string
  floor: string
  bedType: string
  status: string
  notes: string | null
  department: {
    id: string
    name: string
    code: string
  }
  currentPatient: {
    id: string
    firstName: string
    lastName: string
    mrn: string
  } | null
}

interface Department {
  id: string
  name: string
  code: string
  type: string
  availableBeds: number
}

export default function BedsPage() {
  const [beds, setBeds] = useState<Bed[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null)
  const [patientMRN, setPatientMRN] = useState("")
  const [encounterID, setEncounterID] = useState("")
  const [assignmentNotes, setAssignmentNotes] = useState("")
  const [assigning, setAssigning] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  useEffect(() => {
    fetchDepartments()
    fetchBeds()
  }, [])

  useEffect(() => {
    fetchBeds()
  }, [selectedDepartment, searchQuery])

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments/inpatient')
      const data = await res.json()
      if (data.success) {
        setDepartments(data.data)
      } else {
        setError('Failed to load departments')
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      setError('Failed to load departments')
    }
  }

  const fetchBeds = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (selectedDepartment !== 'all') params.append('departmentId', selectedDepartment)
      if (searchQuery) params.append('search', searchQuery)

      const res = await fetch(`/api/beds/available?${params.toString()}`)
      const data = await res.json()
      
      if (data.success) {
        setBeds(data.data)
      } else {
        setError('Failed to load beds')
      }
    } catch (error) {
      console.error('Error fetching beds:', error)
      setError('Failed to load beds')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignBed = async () => {
    if (!selectedBed || !patientMRN || !encounterID) {
      setError('Please fill in all required fields')
      return
    }

    setAssigning(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/beds/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bedId: selectedBed.id,
          patientId: patientMRN,
          encounterId: encounterID,
          assignedBy: 'current-registrar-id', // Get from auth context in production
          notes: assignmentNotes
        })
      })

      const data = await res.json()

      if (data.success) {
        setSuccess('Patient successfully assigned to bed')
        setAssignDialogOpen(false)
        setPatientMRN("")
        setEncounterID("")
        setAssignmentNotes("")
        setSelectedBed(null)
        fetchBeds() // Refresh bed list
        fetchDepartments() // Refresh department counts
      } else {
        setError(data.error || 'Failed to assign bed')
      }
    } catch (error) {
      console.error('Error assigning bed:', error)
      setError('Failed to assign bed')
    } finally {
      setAssigning(false)
    }
  }

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'default'
      case 'OCCUPIED': return 'destructive'
      case 'CLEANING': return 'secondary'
      case 'OUT_OF_SERVICE': return 'outline'
      default: return 'default'
    }
  }

  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Bed Management</h1>
            <p className="text-muted-foreground">
              Search and assign available beds to patients
            </p>
          </div>

          <div className="px-4 lg:px-6 space-y-6">
            {/* Success/Error Messages */}
            {error && (
              <Card className="border-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <IconAlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-500">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {success && (
              <Card className="border-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <IconCheck className="h-5 w-5 text-green-500" />
                    <p className="text-green-500">{success}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Department Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.slice(0, 4).map((dept) => (
                <Card 
                  key={dept.id} 
                  className="cursor-pointer hover:bg-slate-50 transition-colors" 
                  onClick={() => setSelectedDepartment(dept.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{dept.name}</p>
                        <p className="text-2xl font-bold">{dept.availableBeds}</p>
                        <p className="text-xs text-muted-foreground">Available Beds</p>
                      </div>
                      <IconBed className="h-8 w-8 text-primary opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Search Available Beds</CardTitle>
                <CardDescription>
                  Filter by department and search to find available beds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Department/Unit</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} ({dept.availableBeds} available)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Search</Label>
                    <div className="relative">
                      <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Room, bed number, or unit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {beds.length} available bed(s) found
                  </p>
                  <Button variant="outline" onClick={fetchBeds} disabled={loading}>
                    <IconRefresh className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Beds Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconMapPin className="h-5 w-5" />
                  Available Beds
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading beds...
                  </div>
                ) : beds.length === 0 ? (
                  <div className="text-center py-8">
                    <IconAlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No available beds found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your filters or search criteria
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Bed</TableHead>
                        <TableHead>Unit/Floor</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {beds.map((bed) => (
                        <TableRow key={bed.id} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <IconBed className="h-4 w-4" />
                              <span className="font-mono text-sm">
                                {bed.roomNumber}-{bed.bedNumber}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{bed.roomNumber}</TableCell>
                          <TableCell>{bed.bedNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{bed.floor}</Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{bed.department.name}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getBadgeColor(bed.status) as any}>
                              {bed.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedBed(bed)
                                setAssignDialogOpen(true)
                              }}
                            >
                              <IconUserPlus className="h-4 w-4 mr-1" />
                              Assign Patient
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bed Assignment Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Patient to Bed</DialogTitle>
              <DialogDescription>
                Assign a patient to {selectedBed?.roomNumber} - {selectedBed?.bedNumber}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Bed Details Card */}
              {selectedBed && (
                <Card className="bg-slate-50">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-semibold">
                          Room {selectedBed.roomNumber}, Bed {selectedBed.bedNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Unit</p>
                        <p className="font-semibold">{selectedBed.floor}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Department</p>
                        <p className="font-semibold">{selectedBed.department.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge variant={getBadgeColor(selectedBed.status) as any}>
                          {selectedBed.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Patient Information */}
              <div>
                <Label htmlFor="mrn">Patient MRN *</Label>
                <Input
                  id="mrn"
                  placeholder="Enter patient MRN"
                  value={patientMRN}
                  onChange={(e) => setPatientMRN(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the Medical Record Number of the patient
                </p>
              </div>

              <div>
                <Label htmlFor="encounter">Encounter ID *</Label>
                <Input
                  id="encounter"
                  placeholder="Enter encounter ID"
                  value={encounterID}
                  onChange={(e) => setEncounterID(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the active encounter ID for this admission
                </p>
              </div>

              <div>
                <Label htmlFor="notes">Assignment Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special notes or instructions..."
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Warning Box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex gap-2">
                <IconAlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900">
                  <p className="font-semibold">Important:</p>
                  <p>Make sure the patient information is correct before assigning. This action will mark the bed as occupied and create a transfer record.</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignBed} disabled={assigning}>
                {assigning ? (
                  "Assigning..."
                ) : (
                  <>
                    <IconCheck className="h-4 w-4 mr-1" />
                    Assign Bed
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}