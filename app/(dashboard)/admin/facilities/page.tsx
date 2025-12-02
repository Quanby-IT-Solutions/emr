"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Pencil, Trash2, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

type Facility = {
  id: number
  name: string
  type: string
  location: string
  beds: number
  status: string
}

const mockFacilities: Facility[] = [
  { id: 1, name: "Main Hospital", type: "Hospital", location: "Downtown", beds: 250, status: "active" },
  { id: 2, name: "North Clinic", type: "Clinic", location: "North District", beds: 20, status: "active" },
  { id: 3, name: "East Medical Center", type: "Medical Center", location: "East Side", beds: 150, status: "active" },
]

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>(mockFacilities)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDiscardOpen, setIsDiscardOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    beds: "",
    status: "active"
  })

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      location: "",
      beds: "",
      status: "active"
    })
    setSelectedFacility(null)
  }

  const handleAdd = () => {
    if (!formData.name || !formData.type || !formData.location || !formData.beds) {
      toast.error("Please fill in all required fields")
      return
    }

    const newFacility: Facility = {
      id: facilities.length > 0 ? Math.max(...facilities.map(f => f.id)) + 1 : 1,
      name: formData.name,
      type: formData.type,
      location: formData.location,
      beds: parseInt(formData.beds) || 0,
      status: formData.status
    }
    setFacilities([...facilities, newFacility])
    setIsAddOpen(false)
    resetForm()
    toast.success("Facility added successfully")
  }

  const handleAddCancel = () => {
    // Check if changes were made in the add form
    const hasChanges = 
      formData.name !== "" ||
      formData.type !== "" ||
      formData.location !== "" ||
      formData.beds !== "" ||
      formData.status !== "active"

    if (hasChanges) {
      setIsDiscardOpen(true)
    } else {
      setIsAddOpen(false)
      resetForm()
    }
  }

  const handleEdit = () => {
    if (!selectedFacility) return

    if (!formData.name || !formData.type || !formData.location || !formData.beds) {
      toast.error("Please fill in all required fields")
      return
    }
    
    const updatedFacilities = facilities.map(f => 
      f.id === selectedFacility.id 
        ? { 
            ...f, 
            name: formData.name, 
            type: formData.type, 
            location: formData.location, 
            beds: parseInt(formData.beds) || 0, 
            status: formData.status 
          } 
        : f
    )
    setFacilities(updatedFacilities)
    setIsEditOpen(false)
    resetForm()
    toast.success("Facility updated successfully")
  }

  const handleDelete = () => {
    if (!selectedFacility) return
    
    const updatedFacilities = facilities.filter(f => f.id !== selectedFacility.id)
    setFacilities(updatedFacilities)
    setIsDeleteOpen(false)
    setSelectedFacility(null)
    toast.success("Facility deleted successfully")
  }

  const openEditModal = (facility: Facility) => {
    setSelectedFacility(facility)
    setFormData({
      name: facility.name,
      type: facility.type,
      location: facility.location,
      beds: facility.beds.toString(),
      status: facility.status
    })
    setIsEditOpen(true)
  }

  const handleEditCancel = () => {
    if (!selectedFacility) {
      setIsEditOpen(false)
      return
    }

    // Check if changes were made
    const hasChanges = 
      formData.name !== selectedFacility.name ||
      formData.type !== selectedFacility.type ||
      formData.location !== selectedFacility.location ||
      formData.beds !== selectedFacility.beds.toString() ||
      formData.status !== selectedFacility.status

    if (hasChanges) {
      setIsDiscardOpen(true)
    } else {
      setIsEditOpen(false)
      resetForm()
    }
  }

  const confirmDiscard = () => {
    setIsDiscardOpen(false)
    setIsEditOpen(false)
    setIsAddOpen(false)
    resetForm()
  }

  const openViewModal = (facility: Facility) => {
    setSelectedFacility(facility)
    setIsViewOpen(true)
  }

  const openDeleteModal = (facility: Facility) => {
    setSelectedFacility(facility)
    setIsDeleteOpen(true)
  }

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute requiredRole={UserRole.SYSTEM_ADMIN}>
      <DashboardLayout role={UserRole.SYSTEM_ADMIN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Facility Management</h1>
                <p className="text-muted-foreground">
                  Manage facilities, departments, and bed assignments
                </p>
              </div>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Facility
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search facilities..." 
                      className="pl-8" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facility Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Total Beds</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFacilities.length === 0 ? (
                       <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No facilities found.
                        </TableCell>
                       </TableRow>
                    ) : (
                      filteredFacilities.map((facility) => (
                        <TableRow key={facility.id}>
                          <TableCell className="font-medium">{facility.name}</TableCell>
                          <TableCell>{facility.type}</TableCell>
                          <TableCell>{facility.location}</TableCell>
                          <TableCell>{facility.beds}</TableCell>
                          <TableCell>
                            <Badge variant={facility.status === "active" ? "default" : "secondary"}>
                              {facility.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openViewModal(facility)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditModal(facility)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openDeleteModal(facility)} className="text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Facility Modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Add New Facility</DialogTitle>
              <DialogDescription>
                Enter the details of the new facility here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
                  className="col-span-3"
                  placeholder="e.g. West Wing Hospital"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                      <SelectItem value="Clinic">Clinic</SelectItem>
                      <SelectItem value="Medical Center">Medical Center</SelectItem>
                      <SelectItem value="Laboratory">Laboratory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g. 123 Main St"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="beds" className="text-right">
                  Beds
                </Label>
                <Input
                  id="beds"
                  type="number"
                  min="0"
                  onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                  value={formData.beds}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setFormData({ ...formData, beds: e.target.value })
                    }
                  }}
                  className="col-span-3"
                  placeholder="e.g. 100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleAddCancel}>Cancel</Button>
              <Button onClick={handleAdd}>Save Facility</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Facility Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Edit Facility</DialogTitle>
              <DialogDescription>
                Make changes to the facility here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Type
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                      <SelectItem value="Clinic">Clinic</SelectItem>
                      <SelectItem value="Medical Center">Medical Center</SelectItem>
                      <SelectItem value="Laboratory">Laboratory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  Location
                </Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-beds" className="text-right">
                  Beds
                </Label>
                <Input
                  id="edit-beds"
                  type="number"
                  min="0"
                  onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                  value={formData.beds}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setFormData({ ...formData, beds: e.target.value })
                    }
                  }}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleEditCancel}>Cancel</Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Facility Modal */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Facility Details</DialogTitle>
              <DialogDescription>
                View details for {selectedFacility?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Name</Label>
                <div className="col-span-3">{selectedFacility?.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Type</Label>
                <div className="col-span-3">{selectedFacility?.type}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Location</Label>
                <div className="col-span-3">{selectedFacility?.location}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Beds</Label>
                <div className="col-span-3">{selectedFacility?.beds}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Status</Label>
                <div className="col-span-3">
                   <Badge variant={selectedFacility?.status === "active" ? "default" : "secondary"}>
                      {selectedFacility?.status}
                   </Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the facility
                <span className="font-bold"> {selectedFacility?.name} </span>
                and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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

      </DashboardLayout>
    </ProtectedRoute>
  )
}