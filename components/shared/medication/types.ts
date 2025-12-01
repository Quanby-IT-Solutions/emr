// types.ts

export interface AdministeredRecord {
    medicationId: string
    medicationGenericName: string
    medicationBrandName: string
    medicationClassification: string
    dosageAdministered: string
    timeAdministered: string
    dateAdministered: Date
    administeringNurse: string
    isAdministered: boolean
    nurseNotes: string
}

export interface MedicationOrder {
  medicationOrderId: string
  medicationDetails: {
    medicationId: string
    medicationGenericName: string
    medicationBrandName: string
    medicationClassification: string
    dosageForm: string
    dosageUnit: string
  }
  orderedDosage: string
  orderedFrequency: string
  routeOfAdministration: string
  timeAdminSchedule: string[]
  startDate: Date
  stopDate: Date
  physician: string
  specialInstructions: string
  status: "PENDING" | "ACTIVE" | "ON HOLD" | "FLAGGED" | "EXPIRED" | "DISCONTINUED" | "COMPLETED" | "CANCELLED"
}

export interface Patient {
  patientId: string
  patientName: string
  ageSex: string
  currentPhysician: string
  currentWard: string
  currentRoom: string
  chiefComplaint: string
  diagnosis: string
  allergies: string
  lastAdministeredMedication: string
  lastTimeAdministered: string
  dosageGiven: string
  medicationOrders: MedicationOrder[]
  administeredMedicationRecords: AdministeredRecord[]
}

export interface VerificationChecks {
  rightPatient: boolean
  rightMedication: boolean
  rightDose: boolean
  rightRoute: boolean
  rightTime: boolean
}

export interface AdministrationData {
  medicationOrderId: string
  dosageAdministered: string
  timeAdministered: string
  dateAdministered: Date
  isAdministered: boolean
  refusalReason?: string
  nurseNotes: string
  verificationChecks: VerificationChecks
}

export type AdministrationStatus = "administered" | "refused" | null