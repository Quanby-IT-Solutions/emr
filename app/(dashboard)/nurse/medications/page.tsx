// page.tsx
"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import MedicationTable from "./components/medication-table"
import PendingMedicationTable from "./components/pending-medication-table"
import { MedicationStepper } from "./components/medication-stepper"
import { useState } from "react"
import { MedicationProfileEntries, MedicationProfile } from "../../dummy-data/dummy-medication-admin"
import { ViewMedRecordModal } from "./components/view-med-record-modal"
import { AdministerMedicineWizard } from "./components/administer-med-modal"
// Import MedicationOrder here, as it's now used in the handler signature
import { AdministrationData, Patient, AdministeredRecord, MedicationOrder } from "@/components/shared/medication/types" 
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"


export default function MedicationsPage() {
  const [medicationsData, setMedicationsData] = useState<MedicationProfile[]>(MedicationProfileEntries)
  const [activeStep, setActiveStep] = useState<"pending" | "administered">("pending")

  const [openViewRecord, setOpenViewRecord] = useState(false)
  const [openAdministerModal, setOpenAdministerModal] = useState(false)
  const [selectedPatientProfile, setSelectedPatientProfile] = useState<MedicationProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate pending medications count (those with pending orders)
  const pendingCount = medicationsData.filter(profile => 
    profile.patient.medicationOrders.length > 0
  ).length

  const filteredMedRecords = medicationsData.filter(profile => 
    profile.patient.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  ) 

  const handleViewRecord = (profile: MedicationProfile) => {
    setSelectedPatientProfile(profile)
    setOpenViewRecord(true)
  }

  const handleAdminister = (profile: MedicationProfile) => {
    setSelectedPatientProfile(profile)
    setOpenAdministerModal(true)
  }

  const handleAdministrationSubmit = (data: AdministrationData, medOrder: MedicationOrder) => {
    if (!selectedPatientProfile) return

    setMedicationsData(prevData => {
      return prevData.map(profile => {
        // Find the patient profile being updated
        if (profile.patient.patientId === selectedPatientProfile.patient.patientId) {
          
          const administeredOrder = medOrder 

          // Clone the entire patient object to update it immutably
          const updatedPatient: Patient = { ...profile.patient }

          if (administeredOrder) {
            // Update last administered details for the table display
            updatedPatient.lastAdministeredMedication = data.isAdministered 
              ? administeredOrder.medicationDetails.medicationGenericName
              : `${administeredOrder.medicationDetails.medicationGenericName} (Refused)`

            updatedPatient.lastTimeAdministered = data.timeAdministered
            updatedPatient.dosageGiven = data.isAdministered ? data.dosageAdministered : 'N/A'
            
            // Replace the old order with the new updated order
            updatedPatient.medicationOrders = updatedPatient.medicationOrders.map(
              order => order.medicationOrderId === administeredOrder.medicationOrderId
                ? administeredOrder // Use the updated order object
                : order
            )

            // Add a new record to the administeredMedicationRecords array
            const newRecord: AdministeredRecord = {
              medicationId: administeredOrder.medicationDetails.medicationId,
              medicationGenericName: administeredOrder.medicationDetails.medicationGenericName,
              medicationBrandName: administeredOrder.medicationDetails.medicationBrandName,
              medicationClassification: administeredOrder.medicationDetails.medicationClassification,
              dosageAdministered: data.dosageAdministered,
              timeAdministered: data.timeAdministered,
              dateAdministered: data.dateAdministered,
              administeringNurse: "RN Jane Doe (Demo)", //  hardcoded for now
              isAdministered: data.isAdministered,
              nurseNotes: data.nurseNotes,
              refusalReason: data.refusalReason
            }
            updatedPatient.administeredMedicationRecords = [...updatedPatient.administeredMedicationRecords, newRecord]
          }

          // Return the entire MedicationProfile object with the updated patient data
          return {
            ...profile,
            patient: updatedPatient,
          } as MedicationProfile
        }
        return profile
      })
    })

    // Close the modal and reset state
    setOpenAdministerModal(false)
    setSelectedPatientProfile(null) 
  }

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Medication Administration</h1>
            <p className="text-muted-foreground">
              Administer and track medications
            </p>
          </div>

          {/* Stepper Section */}
          <div className="px-4 lg:px-6">
            <MedicationStepper 
              activeStep={activeStep}
              onStepChange={setActiveStep}
              pendingCount={pendingCount}
            />
          </div>

          {/* Table Section */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="grid md:grid-cols-6">
                <div className="md:col-span-5">
                  <CardTitle className="mb-1">
                    {activeStep === "pending" 
                      ? "Pending Medications" 
                      : "Medication Administration Records"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  {/* <Label htmlFor="search">Search</Label> */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search Patient name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 "
                    />
                  </div>
                  
                  {activeStep === "pending" ? (
                    <PendingMedicationTable data={filteredMedRecords} onViewRecord={handleViewRecord} onAdminister={handleAdminister}/>
                  ) : (
                    <MedicationTable data={filteredMedRecords} onViewRecord={handleViewRecord} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        <ViewMedRecordModal 
          open={openViewRecord} 
          onOpenChange={setOpenViewRecord} 
          selectedPatient={selectedPatientProfile}
        />

        <AdministerMedicineWizard 
          open={openAdministerModal} 
          onOpenChange={setOpenAdministerModal}
          patient={selectedPatientProfile?.patient || null}
          selectedOrder={selectedPatientProfile?.patient?.medicationOrders?.[0] || null}
          onSubmit={handleAdministrationSubmit}
        />

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}