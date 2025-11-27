"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, User, FileText } from "lucide-react" // Icons

// Import Components
import { PatientInfoCard } from "./view-components/patient-info-card"
import { MedRecordCalendarView, CalendarMedication, CalendarAdministration } from "./view-components/med-record-calendar-view"
import { MedicationAdminCard } from "./view-components/medication-admin-card"
import { MedicationProfile } from "@/app/(dashboard)/dummy-data/dummy-medication-admin"


interface ViewMedRecordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPatient: MedicationProfile | null
}

export function ViewMedRecordModal({ open, onOpenChange, selectedPatient }: ViewMedRecordModalProps) {
  
  // -- State for Left Sidebar Navigation --
  const [activeSidebarView, setActiveSidebarView] = useState<"patient-info" | "record">("patient-info")
  const [selectedAdminRecord, setSelectedAdminRecord] = useState<CalendarAdministration | null>(null)

  // Mock data fallback
  const mockPatient: MedicationProfile = {
    patient: {
      patientId: "PT-2025-001",
      patientName: "Robert Martinez",
      ageSex: "67/M",
      currentPhysician: "Dr. Sarah Chen, MD",
      currentWard: "Cardiology",
      currentRoom: "C-302",
      chiefComplaint: "Chest pain and shortness of breath",
      diagnosis: "Acute Coronary Syndrome, Hypertension",
      allergies: "Penicillin",
      lastAdministeredMedication: "lisinopril (Prinivil)",
      lastTimeAdministered: "0815",
      dosageGiven: "10mg",
      medicationOrders: [],
      administeredMedicationRecords: []
    }
  }

  const patientData = selectedPatient?.patient || mockPatient.patient

  // Data transformation - Added fields for detail view
  const transformedMedicationOrders: CalendarMedication[] = patientData.medicationOrders.map(order => {
    const administrations: CalendarAdministration[] = patientData.administeredMedicationRecords
      .filter(record => record.medicationId === order.medicationDetails.medicationId)
      .map(record => {
        const date = new Date(record.dateAdministered)
        return {
          date: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          time: record.timeAdministered,
          status: record.isAdministered ? 'taken' as const : 'refused' as const,
          administeringNurse: record.administeringNurse,
          // PASSING EXTRA DATA FOR DETAIL VIEW
          nurseNotes: record.nurseNotes,
          medicationName: `${record.medicationGenericName} (${record.medicationBrandName})`,
          dosageAdministered: record.dosageAdministered,
          classification: record.medicationClassification
        }
      })

    const isDiscontinued = order.status === "DISCONTINUED" || order.status === "CANCELLED" || order.status === "COMPLETED"
    
    return {
      medicationGenericName: `${order.medicationDetails.medicationGenericName.toUpperCase()} ${order.medicationDetails.dosageUnit.toUpperCase()} ${order.medicationDetails.dosageForm.toUpperCase()}`,
      dosage: order.orderedDosage,
      schedule: `${order.orderedFrequency} - ${order.routeOfAdministration}`,
      discontinuedDate: isDiscontinued ? new Date(order.stopDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : undefined,
      administrations,
      classification: order.medicationDetails.medicationClassification
    }
  })

  // -- Handler for clicking a box on the calendar --
  const handleRecordClick = (record: CalendarAdministration) => {
    setSelectedAdminRecord(record)
    setActiveSidebarView("record")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] lg:max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-2 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">View Medication Administration Records</DialogTitle>
            <div className="text-sm text-muted-foreground">
              eMAR | {patientData.patientName}
            </div>
          </div>
        </DialogHeader>
 
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-95 border-r overflow-y-auto flex flex-col">
            
            {/* Dynamic Header with Buttons */}
            <div className="px-1 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {activeSidebarView === "patient-info" ? (
                        <User className="h-5 w-5 text-blue-600" />
                    ) : (
                        <FileText className="h-5 w-5 text-purple-600" />
                    )}
                    <h3 className="text-lg font-semibold">
                        {activeSidebarView === "patient-info" ? "Patient Information" : "Medication Record"}
                    </h3>
                </div>

                {/* Navigation Buttons - Only show if a record has been selected at least once */}
                {selectedAdminRecord && (
                    <div className="flex gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setActiveSidebarView("patient-info")}
                            disabled={activeSidebarView === "patient-info"}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setActiveSidebarView("record")}
                            disabled={activeSidebarView === "record"}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Content Swapping */}
            {activeSidebarView === "patient-info" ? (
                <PatientInfoCard 
                  patientData={patientData}
                  medicationOrdersCount={transformedMedicationOrders.length}
                  showHeader={false} // Disable internal header
                />
            ) : (
                <MedicationAdminCard record={selectedAdminRecord} />
            )}
          </div>

          {/* Right Side - Calendar View Component */}
          <MedRecordCalendarView 
            transformedMedicationOrders={transformedMedicationOrders}
            onRecordClick={handleRecordClick} // Pass handler
          />
        </div>

        <div className="border-t px-6 py-2 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}