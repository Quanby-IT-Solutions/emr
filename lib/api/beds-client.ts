export interface ApiBed {
  id: string
  departmentId: string | null
  roomNumber: string
  bedNumber: string
  unit: string
  floor: string
  bedType: string
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'OUT_OF_SERVICE'
  department: {
    id: string
    name: string
    code: string
    type: string
  } | null
  activeEncounter: {
    id: string
    status: string
    startDateTime: string
    consultant: string | null
    patient: {
      id: string
      mrn: string
      firstName: string
      lastName: string
      dateOfBirth: string
      gender: string | null
    }
  } | null
  currentPatient: {
    id: string
    mrn: string
    firstName: string
    lastName: string
  } | null
}

export interface ApiDepartment {
  id: string
  name: string
  code: string
  type: string
  availableBeds: number
}

export interface AssignBedBody {
  bedId: string
  mrn?: string
  patientId?: string
  encounterId?: string
  notes?: string
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, credentials: 'include' })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Request failed')
  return json.data as T
}

export const bedsClient = {
  list: (opts?: { departmentId?: string; status?: string; search?: string }): Promise<ApiBed[]> => {
    const p = new URLSearchParams()
    if (opts?.departmentId) p.set('departmentId', opts.departmentId)
    if (opts?.status) p.set('status', opts.status)
    if (opts?.search) p.set('search', opts.search)
    const qs = p.toString()
    return apiFetch<ApiBed[]>(`/api/beds${qs ? `?${qs}` : ''}`)
  },

  listAvailable: (opts?: { departmentId?: string; search?: string }): Promise<ApiBed[]> => {
    const p = new URLSearchParams()
    if (opts?.departmentId) p.set('departmentId', opts.departmentId)
    if (opts?.search) p.set('search', opts.search)
    const qs = p.toString()
    return apiFetch<ApiBed[]>(`/api/beds/available${qs ? `?${qs}` : ''}`)
  },

  getById: (id: string): Promise<ApiBed> => apiFetch<ApiBed>(`/api/beds/${id}`),

  updateStatus: (id: string, status: string): Promise<ApiBed> =>
    apiFetch<ApiBed>(`/api/beds/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),

  assign: (body: AssignBedBody) =>
    apiFetch<{ bed: unknown; encounter: unknown }>('/api/beds/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  listDepartments: (): Promise<ApiDepartment[]> =>
    apiFetch<ApiDepartment[]>('/api/departments/inpatient'),
}
