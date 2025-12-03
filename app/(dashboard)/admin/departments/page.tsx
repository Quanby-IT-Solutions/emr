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
import { useAdminData, Department } from "@/components/admin-context"

export default function DepartmentsPage() {
  const { departments, facilities, addDepartment, updateDepartment, deleteDepartment } = useAdminData()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDiscardOpen, setIsDiscardOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    facilityId: "",
    type: "CLINICAL"
  })

  const resetForm = () => {
    setFormData({
      name: "",
      facilityId: "",
      type: "CLINICAL"
    })
    setSelectedDepartment(null)
  }

  const handleAdd = () => {
    if (!formData.name || !formData.facilityId || !formData.type) {
      toast.error("Please fill in all required fields")
      return
    }

    const selectedFacility = facilities.find(f => f.id === formData.facilityId)

    const newDepartment: Department = {
      id: `dept_${Date.now()}`,
      name: formData.name,
      facilityId: formData.facilityId,
      facilityName: selectedFacility ? selectedFacility.name : "Unknown",
      type: formData.type as "CLINICAL" | "ADMINISTRATIVE",
      totalBeds: 0 // Default to 0 for new departments
    }
    addDepartment(newDepartment)
    setIsAddOpen(false)
    resetForm()
    // Toast handled in context
  }

  const handleAddCancel = () => {
    const hasChanges = 
      formData.name !== "" ||
      formData.facilityId !== "" ||
      formData.type !== "CLINICAL"

    if (hasChanges) {
      setIsDiscardOpen(true)
    } else {
      setIsAddOpen(false)
      resetForm()
    }
  }

  const handleEdit = () => {
    if (!selectedDepartment) return

    if (!formData.name || !formData.facilityId || !formData.type) {
      toast.error("Please fill in all required fields")
      return
    }
    
    const selectedFacility = facilities.find(f => f.id === formData.facilityId)

    const updatedDepartment: Department = {
      ...selectedDepartment,
      name: formData.name, 
      facilityId: formData.facilityId,
      facilityName: selectedFacility ? selectedFacility.name : selectedDepartment.facilityName,
      type: formData.type as "CLINICAL" | "ADMINISTRATIVE"
      // totalBeds remains unchanged as it's not in the form
    }
    updateDepartment(updatedDepartment)
    setIsEditOpen(false)
    resetForm()
    // Toast handled in context
  }

  const handleDelete = () => {
    if (!selectedDepartment) return
    
    deleteDepartment(selectedDepartment.id)
    setIsDeleteOpen(false)
    setSelectedDepartment(null)
    // Toast handled in context
  }

  const openEditModal = (department: Department) => {
    setSelectedDepartment(department)
    setFormData({
      name: department.name,
      facilityId: department.facilityId,
      type: department.type
    })
    setIsEditOpen(true)
  }

  const handleEditCancel = () => {
    if (!selectedDepartment) {
      setIsEditOpen(false)
      return
    }

    const hasChanges = 
      formData.name !== selectedDepartment.name ||
      formData.facilityId !== selectedDepartment.facilityId ||
      formData.type !== selectedDepartment.type

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

  const openViewModal = (department: Department) => {
    setSelectedDepartment(department)
    setIsViewOpen(true)
  }

  const openDeleteModal = (department: Department) => {
    setSelectedDepartment(department)
    setIsDeleteOpen(true)
  }

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.facilityName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute requiredRole={UserRole.SYSTEM_ADMIN}>
      <DashboardLayout role={UserRole.SYSTEM_ADMIN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Department Management</h1>
                <p className="text-muted-foreground">
                  Manage hospital departments and assignments
                </p>
              </div>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
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
                      placeholder="Search departments..." 
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
                      <TableHead>Department Name</TableHead>
                      <TableHead>Facility (Parent)</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Total Beds</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.length === 0 ? (
                       <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          No departments found.
                        </TableCell>
                       </TableRow>
                    ) : (
                      filteredDepartments.map((department) => (
                        <TableRow key={department.id}>
                          <TableCell className="font-medium">{department.name}</TableCell>
                          <TableCell>{department.facilityName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {department.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{department.totalBeds}</TableCell>
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
                                <DropdownMenuItem onClick={() => openViewModal(department)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditModal(department)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openDeleteModal(department)} className="text-destructive focus:text-destructive">
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

        {/* Add Department Modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Enter the details of the new department here.
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g. Cardiology"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="facility" className="text-right">
                  Facility
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.facilityId} 
                    onValueChange={(value) => setFormData({ ...formData, facilityId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                      <SelectItem value="CLINICAL">Clinical</SelectItem>
                      <SelectItem value="ADMINISTRATIVE">Administrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleAddCancel}>Cancel</Button>
              <Button onClick={handleAdd}>Save Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Department Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Make changes to the department here.
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-facility" className="text-right">
                  Facility
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.facilityId} 
                    onValueChange={(value) => setFormData({ ...formData, facilityId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                      <SelectItem value="CLINICAL">Clinical</SelectItem>
                      <SelectItem value="ADMINISTRATIVE">Administrative</SelectItem>
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

        {/* View Department Modal */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Department Details</DialogTitle>
              <DialogDescription>
                View details for {selectedDepartment?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">ID</Label>
                <div className="col-span-3">{selectedDepartment?.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Name</Label>
                <div className="col-span-3">{selectedDepartment?.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Facility</Label>
                <div className="col-span-3">{selectedDepartment?.facilityName}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Type</Label>
                <div className="col-span-3">{selectedDepartment?.type}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Total Beds</Label>
                <div className="col-span-3">{selectedDepartment?.totalBeds}</div>
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
                This action cannot be undone. This will permanently delete the department
                <span className="font-bold"> {selectedDepartment?.name} </span>
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
