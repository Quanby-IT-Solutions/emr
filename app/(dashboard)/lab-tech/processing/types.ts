export interface ProcessingAnalyte {
  id: string
  name: string
  value: string
  unit: string
  referenceRange: string
  flag: string
  previousValue?: string
}

export interface ProcessingOrder {
  id: string
  patient: { id: string; name: string; mrn: string; dob: string; gender: string }
  testPanel: string
  specimenType: string
  priority: "STAT" | "URGENT" | "ROUTINE"
  status: "PLACED" | "COLLECTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  orderedBy: string
  orderedAt: string
  collectedAt?: string
  collectedBy?: string
  specimenCondition?: string
  results?: {
    analytes: ProcessingAnalyte[]
    enteredBy: string
    enteredAt: string
    validatedBy?: string
    validatedAt?: string
    techNotes?: string
  }
  completedAt?: string
  encounterType: string
}

export interface LabResultPayload {
  analyteName: string
  loincCode?: string
  value: string
  unit?: string
  referenceRange?: string
  flag?: string
}
