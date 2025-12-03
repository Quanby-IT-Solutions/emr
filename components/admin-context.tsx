"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { toast } from "sonner"

// --- Types ---

export type Facility = {
  id: string
  name: string
  address: string
  contactPhone: string
  isActive: boolean
}

export type Department = {
  id: string
  name: string
  facilityId: string
  facilityName: string
  type: "CLINICAL" | "ADMINISTRATIVE"
  totalBeds: number
}

// --- Mock Data ---

const initialFacilities: Facility[] = [
  { id: "fac_1", name: "Main Hospital", address: "123 Downtown St", contactPhone: "555-0100", isActive: true },
  { id: "fac_2", name: "North Clinic", address: "456 North Ave", contactPhone: "555-0101", isActive: true },
  { id: "fac_3", name: "East Medical Center", address: "789 East Blvd", contactPhone: "555-0102", isActive: true },
]

const initialDepartments: Department[] = [
  { id: "dept_1", name: "Cardiology", facilityId: "fac_1", facilityName: "Main Hospital", type: "CLINICAL", totalBeds: 45 },
  { id: "dept_2", name: "Neurology", facilityId: "fac_1", facilityName: "Main Hospital", type: "CLINICAL", totalBeds: 30 },
  { id: "dept_3", name: "Human Resources", facilityId: "fac_2", facilityName: "North Clinic", type: "ADMINISTRATIVE", totalBeds: 0 },
  { id: "dept_4", name: "Emergency", facilityId: "fac_3", facilityName: "East Medical Center", type: "CLINICAL", totalBeds: 20 },
]

// --- Context ---

interface AdminContextType {
  facilities: Facility[]
  departments: Department[]
  addFacility: (facility: Facility) => void
  updateFacility: (facility: Facility) => void
  deleteFacility: (id: string) => void
  addDepartment: (department: Department) => void
  updateDepartment: (department: Department) => void
  deleteDepartment: (id: string) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities)
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)

  // Facility Actions
  const addFacility = (facility: Facility) => {
    setFacilities((prev) => [...prev, facility])
    toast.success("Facility added successfully")
  }

  const updateFacility = (updatedFacility: Facility) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === updatedFacility.id ? updatedFacility : f))
    )
    
    // Update related departments if facility name changed
    setDepartments((prevDepts) => 
      prevDepts.map(d => {
        if (d.facilityId === updatedFacility.id) {
          return { ...d, facilityName: updatedFacility.name }
        }
        return d
      })
    )
    
    toast.success("Facility updated successfully")
  }

  const deleteFacility = (id: string) => {
    // Check if facility has departments
    const hasDeps = departments.some(d => d.facilityId === id)
    if (hasDeps) {
      toast.error("Cannot delete facility with assigned departments.")
      return
    }

    setFacilities((prev) => prev.filter((f) => f.id !== id))
    toast.success("Facility deleted successfully")
  }

  // Department Actions
  const addDepartment = (department: Department) => {
    setDepartments((prev) => [...prev, department])
    toast.success("Department added successfully")
  }

  const updateDepartment = (department: Department) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === department.id ? department : d))
    )
    toast.success("Department updated successfully")
  }

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id))
    toast.success("Department deleted successfully")
  }

  return (
    <AdminContext.Provider
      value={{
        facilities,
        departments,
        addFacility,
        updateFacility,
        deleteFacility,
        addDepartment,
        updateDepartment,
        deleteDepartment,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdminData() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdminData must be used within an AdminProvider")
  }
  return context
}
