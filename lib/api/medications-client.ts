export interface Medications {
  medicationId: string
  medicationGenericName: string
  medicationBrandName: string
  medicationClassification: string
  dosageForm: string
  dosageUnit: string
  routeOfAdministration: string
}

export interface MedicationProfile {
  patient: {
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
    medicationOrders: {
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
      attemptAdministerToday: boolean
      status: "PENDING" | "ACTIVE" | "ON HOLD" | "FLAGGED" | "EXPIRED" | "DISCONTINUED" | "COMPLETED" | "CANCELLED"
    }[]
    administeredMedicationRecords: {
      administeredMedOrderId: string
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
      refusalReason: string
    }[]
  }
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, credentials: 'include' })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Request failed')
  return json.data as T
}

export interface ApiMedAdminRecord {
  id: string
  orderId: string
  nurseId: string
  administrationTime: string
  status: 'GIVEN' | 'HELD' | 'REFUSED' | 'PARTIAL_DOSE'
  reasonForOmission: string | null
  witnessId: string | null
  nurse: { id: string; firstName: string; lastName: string }
}

export interface ApiMedOrder {
  id: string
  encounterId: string
  orderType: string
  status: string
  priority: string
  details: Record<string, unknown> | null
  createdAt: string
  encounter: {
    id: string
    patient: {
      id: string
      mrn: string
      firstName: string
      lastName: string
      dateOfBirth: string
      gender: string | null
    }
    currentLocation: {
      id: string
      unit: string
      roomNumber: string | null
      bedNumber: string | null
    } | null
  }
  medicationAdministrations: ApiMedAdminRecord[]
}

export const medicationsClient = {
  listPendingOrders: (): Promise<{ orders: ApiMedOrder[] }> =>
    apiFetch<{ orders: ApiMedOrder[] }>('/api/medication-administrations'),

  administer: (body: {
    orderId: string
    status: 'GIVEN' | 'HELD' | 'REFUSED' | 'PARTIAL_DOSE'
    administrationTime?: string
    reasonForOmission?: string
    witnessId?: string
  }): Promise<{ administration: ApiMedAdminRecord }> =>
    apiFetch<{ administration: ApiMedAdminRecord }>('/api/medication-administrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
}
