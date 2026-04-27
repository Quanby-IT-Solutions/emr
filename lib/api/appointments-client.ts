import type { ApiPatient } from './patients-client'

export interface AppointmentEntry {
  id?: string
  patientId: string
  patientName: string
  ageSex: string
  appointmentDate: string
  appointmentTime: string
  department: string
  departmentLocation: string
  provider: string
  officeLocation: string
  visitType: "Follow-up" | "New"
  bookingStatus: "Confirmed" | "Pending" | "Cancelled"
}

export interface ApiProvider {
  id: string
  firstName: string
  lastName: string
}

export interface ApiAppointment {
  id: string
  patientId: string
  providerId: string
  startTime: string
  endTime: string
  status: string
  appointmentType: string | null
  encounterId: string | null
  patient: Pick<ApiPatient, 'id' | 'mrn' | 'firstName' | 'lastName' | 'dateOfBirth' | 'gender'>
  provider: ApiProvider
}

export interface ApiEncounter {
  id: string
  patientId: string
  type: string
  status: string
  startDateTime: string
}

export interface CreateAppointmentBody {
  patientId: string
  providerName?: string
  providerId?: string
  startTime: string
  endTime?: string
  appointmentType?: string
}

export interface WalkInBody {
  patientId?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: string
  contactPhone?: string
  providerName?: string
  providerId?: string
  appointmentType?: string
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, credentials: 'include' })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Request failed')
  return json.data as T
}

export const appointmentsClient = {
  list: (opts?: { patientId?: string; status?: string; date?: string }): Promise<ApiAppointment[]> => {
    const p = new URLSearchParams()
    if (opts?.patientId) p.set('patientId', opts.patientId)
    if (opts?.status) p.set('status', opts.status)
    if (opts?.date) p.set('date', opts.date)
    const qs = p.toString()
    return apiFetch<ApiAppointment[]>(`/api/appointments${qs ? `?${qs}` : ''}`)
  },

  create: (body: CreateAppointmentBody): Promise<ApiAppointment> =>
    apiFetch<ApiAppointment>('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  cancel: (id: string): Promise<ApiAppointment> =>
    apiFetch<ApiAppointment>(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    }),

  confirm: (id: string): Promise<ApiAppointment> =>
    apiFetch<ApiAppointment>(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'confirm' }),
    }),

  checkIn: (id: string): Promise<{ appointment: ApiAppointment; encounter: ApiEncounter }> =>
    apiFetch<{ appointment: ApiAppointment; encounter: ApiEncounter }>(
      `/api/appointments/${id}/check-in`,
      { method: 'POST' }
    ),

  noShow: (id: string): Promise<ApiAppointment> =>
    apiFetch<ApiAppointment>(`/api/appointments/${id}/no-show`, { method: 'POST' }),

  createWalkIn: (body: WalkInBody): Promise<{ appointment: ApiAppointment; encounter: ApiEncounter }> =>
    apiFetch<{ appointment: ApiAppointment; encounter: ApiEncounter }>('/api/appointments/walk-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
}
