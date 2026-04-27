"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  IconBed,
  IconSearch,
  IconUserPlus,
  IconCheck,
  IconRefresh,
  IconAlertCircle,
  IconMapPin,
  IconFilter,
  IconLayoutGrid,
  IconList,
  IconStethoscope,
  IconUsers,
  IconActivity,
  IconClock,
  IconCalendar,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { bedsClient, type ApiBed } from "@/lib/api/beds-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// --- Types based on Prisma Schema ---

type LocationStatus = "AVAILABLE" | "OCCUPIED" | "CLEANING" | "OUT_OF_SERVICE"

interface Department {
  id: string
  name: string
  type: "CLINICAL" | "ADMINISTRATIVE"
}

interface Patient {
  id: string
  mrn: string
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
}

interface Encounter {
  id: string
  patient: Patient
  status: "ACTIVE" | "PLANNED" | "DISCHARGED" | "CANCELLED"
  startDateTime?: string // ISO String
  consultant?: string
}

interface Location {
  id: string
  departmentId: string | null
  department?: Department
  unit: string
  roomNumber: string | null
  bedNumber: string | null
  status: LocationStatus | null
  // Derived for UI:
  activeEncounter?: Encounter | null
}

function calculateLOS(startDate: string) {
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
  return diffDays
}

export default function BedsPage() {
  const queryClient = useQueryClient()

  const { data: beds = [], isLoading: bedsLoading } = useQuery({
    queryKey: ["beds"],
    queryFn: () => bedsClient.list(),
  })

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => bedsClient.listDepartments(),
  })

  const assignMutation = useMutation({
    mutationFn: (vars: { bedId: string; mrn: string; encounterId?: string; notes?: string }) =>
      bedsClient.assign(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beds"] })
      setIsAssignOpen(false)
      toast.success(`Patient assigned to ${selectedBed?.roomNumber}-${selectedBed?.bedNumber}`)
      setAssignForm({ mrn: "", encounterId: "", consultant: "", notes: "" })
    },
    onError: (err: Error) => toast.error(`Assignment failed: ${err.message}`),
  })

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Assignment Dialog State
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isDiscardOpen, setIsDiscardOpen] = useState(false)
  const [selectedBed, setSelectedBed] = useState<ApiBed | null>(null)
  const [assignForm, setAssignForm] = useState({
    mrn: "",
    encounterId: "",
    consultant: "",
    notes: "",
  })

  // Filter Logic
  const filteredBeds = useMemo(() => {
    return beds.filter((bed) => {
      // Department Filter
      if (selectedDepartment !== "all" && bed.departmentId !== selectedDepartment) {
        return false
      }
      // Status Filter
      if (statusFilter !== "all" && bed.status !== statusFilter) {
        return false
      }
      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const locationString = `${bed.unit} ${bed.roomNumber} ${bed.bedNumber}`.toLowerCase()
        const patientString = bed.activeEncounter
          ? `${bed.activeEncounter.patient.firstName} ${bed.activeEncounter.patient.lastName} ${bed.activeEncounter.patient.mrn}`.toLowerCase()
          : ""
        return locationString.includes(query) || patientString.includes(query)
      }
      return true
    })
  }, [beds, selectedDepartment, statusFilter, searchQuery])

  // Statistics
  const stats = useMemo(() => {
    return {
      total: filteredBeds.length,
      available: filteredBeds.filter((b) => b.status === "AVAILABLE").length,
      occupied: filteredBeds.filter((b) => b.status === "OCCUPIED").length,
      cleaning: filteredBeds.filter((b) => b.status === "CLEANING").length,
      outOfService: filteredBeds.filter((b) => b.status === "OUT_OF_SERVICE").length,
    }
  }, [filteredBeds])

  // Handlers
  const handleAssignClick = (bed: ApiBed) => {
    setSelectedBed(bed)
    setAssignForm({ mrn: "", encounterId: "", consultant: "", notes: "" })
    setIsAssignOpen(true)
  }

  const handleAssignCancel = () => {
    const hasChanges = 
      assignForm.mrn !== "" || 
      assignForm.encounterId !== "" || 
      assignForm.consultant !== "" || 
      assignForm.notes !== ""

    if (hasChanges) {
      setIsDiscardOpen(true)
    } else {
      setIsAssignOpen(false)
    }
  }

  const confirmDiscard = () => {
    setIsDiscardOpen(false)
    setIsAssignOpen(false)
    setAssignForm({ mrn: "", encounterId: "", consultant: "", notes: "" })
  }

  const handleAssignSubmit = () => {
    if (!assignForm.mrn || !selectedBed) {
      toast.error("Please enter a Patient MRN")
      return
    }
    assignMutation.mutate({
      bedId: selectedBed.id,
      mrn: assignForm.mrn,
      encounterId: assignForm.encounterId || undefined,
      notes: assignForm.notes || undefined,
    })
  }

  const getStatusStyles = (status: LocationStatus | null) => {
    switch (status) {
      case "AVAILABLE":
        return {
          // Brightest, pop out
          card: "bg-white dark:bg-zinc-950 border-border shadow-md ring-1 ring-foreground/5 scale-[1.01] transition-all duration-200",
          badge: "bg-foreground text-background hover:bg-foreground/90 border-transparent",
          icon: "text-foreground"
        }
      case "OCCUPIED":
        return {
          // Normal/Neutral
          card: "bg-muted/30 border-border shadow-sm",
          badge: "variant='outline' bg-transparent text-muted-foreground border-border", // Using string for simplicity in className
          icon: "text-muted-foreground"
        }
      case "CLEANING":
        return {
          // Faded
          card: "bg-muted/50 border-border/50 shadow-none opacity-90 hover:opacity-100",
          badge: "variant='secondary' bg-muted text-muted-foreground",
          icon: "text-muted-foreground/70"
        }
      case "OUT_OF_SERVICE":
        return {
          // Most Faded
          card: "bg-muted/80 border-border/30 shadow-inner opacity-60 grayscale hover:opacity-100 hover:grayscale-0",
          badge: "variant='secondary' bg-muted text-muted-foreground/50",
          icon: "text-muted-foreground/50"
        }
      default:
        return {
          card: "bg-card",
          badge: "bg-secondary text-secondary-foreground",
          icon: "text-primary"
        }
    }
  }

  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 max-w-[1600px] mx-auto w-full">
          {/* Header Section */}
          <div className="px-4 lg:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Bed Management</h1>
              <p className="text-muted-foreground">
                Monitor bed status and manage patient assignments across departments.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["beds"] })}>
                <IconRefresh className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <div className="bg-muted p-1 rounded-lg flex items-center">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setViewMode("grid")}
                >
                  <IconLayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setViewMode("list")}
                >
                  <IconList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="px-4 lg:px-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatsCard
              title="Total Beds"
              value={stats.total}
              icon={IconBed}
            />
            <StatsCard
              title="Available"
              value={stats.available}
              icon={IconCheck}
            />
            <StatsCard
              title="Occupied"
              value={stats.occupied}
              icon={IconUsers}
            />
            <StatsCard
              title="Cleaning"
              value={stats.cleaning}
              icon={IconActivity}
            />
            <StatsCard
              title="Out of Service"
              value={stats.outOfService}
              icon={IconAlertCircle}
            />
          </div>

          {/* Filters & Controls */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by room, unit, or patient name..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-[200px]">
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <IconMapPin className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Department" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full sm:w-[200px]">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <IconFilter className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="AVAILABLE">Available</SelectItem>
                          <SelectItem value="OCCUPIED">Occupied</SelectItem>
                          <SelectItem value="CLEANING">Cleaning</SelectItem>
                          <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="px-4 lg:px-6 flex-1">
            {bedsLoading ? (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Loading beds...
              </div>
            ) : filteredBeds.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center border rounded-lg bg-muted/20 border-dashed">
                <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                  <IconSearch className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No beds found</h3>
                <p className="text-muted-foreground max-w-sm mt-1">
                  We couldn&apos;t find any beds matching your current filters. Try adjusting your search criteria.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setSelectedDepartment("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredBeds.map((bed) => {
                      const los = bed.activeEncounter?.startDateTime 
                        ? calculateLOS(bed.activeEncounter.startDateTime) 
                        : 0
                      const isLongStay = los > 7
                      const styles = getStatusStyles(bed.status)

                      return (
                      <Card key={bed.id} className={cn("overflow-hidden transition-all flex flex-col h-full hover:shadow-xl hover:scale-[1.02] hover:ring-2 hover:ring-primary/20 group", styles.card)}>
                        <CardHeader className="pb-2 pt-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-bold flex items-center gap-2">
                                {bed.roomNumber}
                                <span className="text-muted-foreground font-normal text-sm group-hover:text-foreground transition-colors">- {bed.bedNumber}</span>
                              </CardTitle>
                              <CardDescription className="group-hover:text-foreground transition-colors">{bed.unit} • {bed.department?.name}</CardDescription>
                            </div>
                            <Badge variant="outline" className={cn("font-semibold border-0", styles.badge)}>
                              {bed.status?.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2 text-sm min-h-[80px] flex-1">
                          {bed.status === "OCCUPIED" && bed.activeEncounter ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md border border-border/50">
                                <div className="bg-background p-1.5 rounded-full shadow-sm">
                                  <IconUsers className="h-4 w-4 text-foreground" />
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">
                                    {bed.activeEncounter.patient.lastName}, {bed.activeEncounter.patient.firstName}
                                  </p>
                                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">MRN: {bed.activeEncounter.patient.mrn}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-1 mt-2 pl-1">
                                {bed.activeEncounter.consultant && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                                    <IconStethoscope className="h-3.5 w-3.5" />
                                    <span>{bed.activeEncounter.consultant}</span>
                                  </div>
                                )}
                                {bed.activeEncounter.startDateTime && (
                                  <div className={cn("flex items-center gap-2 text-xs", isLongStay ? "text-red-600 font-medium" : "text-muted-foreground group-hover:text-foreground transition-colors")}>
                                    <IconCalendar className="h-3.5 w-3.5" />
                                    <span>
                                      Day {los} 
                                      {isLongStay && " (Long Stay)"}
                                    </span>
                                  </div>
                                )}
                                {bed.activeEncounter.startDateTime && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                                    <IconClock className="h-3.5 w-3.5" />
                                    <span>
                                      Admitted: {new Date(bed.activeEncounter.startDateTime).toLocaleString(undefined, {
                                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : bed.status === "AVAILABLE" ? (
                            <div className="flex items-center gap-2 text-muted-foreground h-full py-2">
                              <IconCheck className={cn("h-4 w-4 text-foreground")} />
                              <span className="text-foreground font-medium">Ready for assignment</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-muted-foreground/70 h-full py-2 group-hover:text-foreground transition-colors">
                              <IconActivity className={cn("h-4 w-4")} />
                              <span>Currently unavailable</span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 bg-transparent">
                          {bed.status === "AVAILABLE" ? (
                            <Button className="w-full shadow-sm" size="sm" onClick={() => handleAssignClick(bed)}>
                              <IconUserPlus className="h-4 w-4 mr-2" />
                              Assign Patient
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full bg-white/50 hover:bg-white" size="sm" disabled>
                              View Details
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    )})}
                  </div>
                ) : (
                  <div className="border rounded-md bg-background">
                    {/* List View Implementation */}
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Location</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Department</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Patient Info</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Stay Info</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {filteredBeds.map((bed) => {
                            const los = bed.activeEncounter?.startDateTime 
                              ? calculateLOS(bed.activeEncounter.startDateTime) 
                              : 0
                            const isLongStay = los > 7
                            const styles = getStatusStyles(bed.status)

                            return (
                            <tr key={bed.id} className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle font-medium">
                                <div className="flex flex-col">
                                  <span className="text-base">{bed.roomNumber}-{bed.bedNumber}</span>
                                  <span className="text-xs text-muted-foreground">{bed.unit}</span>
                                </div>
                              </td>
                              <td className="p-4 align-middle">{bed.department?.name}</td>
                              <td className="p-4 align-middle">
                                <Badge variant="outline" className={cn("font-semibold border-0", styles.badge)}>
                                  {bed.status?.replace(/_/g, " ")}
                                </Badge>
                              </td>
                              <td className="p-4 align-middle">
                                {bed.status === "OCCUPIED" && bed.activeEncounter ? (
                                  <div className="flex flex-col gap-1">
                                    <div>
                                      <span className="font-medium block">
                                        {bed.activeEncounter.patient.lastName}, {bed.activeEncounter.patient.firstName}
                                      </span>
                                      <span className="text-xs text-muted-foreground block">MRN: {bed.activeEncounter.patient.mrn}</span>
                                    </div>
                                    {bed.activeEncounter.consultant && (
                                       <span className="text-xs text-muted-foreground flex items-center gap-1">
                                         <IconStethoscope className="h-3 w-3" /> {bed.activeEncounter.consultant}
                                       </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                              <td className="p-4 align-middle">
                                {bed.status === "OCCUPIED" && bed.activeEncounter && bed.activeEncounter.startDateTime ? (
                                  <div className="flex flex-col gap-1">
                                    <div className={cn("text-xs flex items-center gap-1", isLongStay ? "text-red-600 font-medium" : "text-muted-foreground")}>
                                      <IconCalendar className="h-3 w-3" />
                                      <span>
                                        Day {los} {isLongStay && "(Long Stay)"}
                                      </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                      <IconClock className="h-3 w-3" />
                                      <span>
                                        {new Date(bed.activeEncounter.startDateTime).toLocaleDateString(undefined, {
                                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                              <td className="p-4 align-middle text-right">
                                {bed.status === "AVAILABLE" && (
                                  <Button size="sm" variant="outline" onClick={() => handleAssignClick(bed)}>
                                    Assign
                                  </Button>
                                )}
                              </td>
                            </tr>
                          )})}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Assignment Dialog */}
          <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Assign Patient to Bed</DialogTitle>
                <DialogDescription>
                  {selectedBed ? (
                    <span>
                      Assigning to <strong>{selectedBed.roomNumber}-{selectedBed.bedNumber}</strong> in {selectedBed.unit}
                    </span>
                  ) : "Select a bed to assign"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {selectedBed && (
                  <div className="bg-muted/40 p-4 rounded-md text-sm grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="text-muted-foreground block text-xs">Department</span>
                      <span className="font-medium">{selectedBed.department?.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Location</span>
                      <span className="font-medium">{selectedBed.unit} / {selectedBed.roomNumber}-{selectedBed.bedNumber}</span>
                    </div>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="mrn">Patient MRN *</Label>
                  <div className="relative">
                    <IconStethoscope className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mrn"
                      placeholder="e.g. MRN-123456"
                      className="pl-9"
                      value={assignForm.mrn}
                      onChange={(e) => setAssignForm({...assignForm, mrn: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="consultant">Attending Provider / Consultant</Label>
                  <Input 
                    id="consultant" 
                    placeholder="e.g. Dr. Sarah Smith" 
                    value={assignForm.consultant}
                    onChange={(e) => setAssignForm({...assignForm, consultant: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="encounter">Encounter ID (Optional)</Label>
                  <Input 
                    id="encounter" 
                    placeholder="Auto-generated if left blank" 
                    value={assignForm.encounterId}
                    onChange={(e) => setAssignForm({...assignForm, encounterId: e.target.value})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Admission Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any special instructions or notes..."
                    value={assignForm.notes}
                    onChange={(e) => setAssignForm({...assignForm, notes: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleAssignCancel}>
                  Cancel
                </Button>
                <Button onClick={handleAssignSubmit} disabled={assignMutation.isPending}>
                  {assignMutation.isPending ? "Assigning..." : "Confirm Assignment"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Discard Changes Confirmation Modal */}
          <AlertDialog open={isDiscardOpen} onOpenChange={setIsDiscardOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved changes. Are you sure you want to discard them?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDiscardOpen(false)}>Keep Editing</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDiscard} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Discard Changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function StatsCard({ title, value, icon: Icon, className }: { title: string, value: number, icon: any, className?: string }) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-2 bg-muted rounded-full">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
