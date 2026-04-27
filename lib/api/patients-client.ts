export interface PatientRecord {
  id: string
  firstName: string
  middleName: string
  lastName: string
  gender: "MALE" | "FEMALE"
  age: number
  contactNumber: string
  dateRegistered: string
  status: "ACTIVE" | "INACTIVE" | "PENDING"
}

export interface ApiPatient {
  id: string
  mrn: string
  firstName: string
  middleName?: string | null
  lastName: string
  dateOfBirth: string
  gender: string | null
  contactPhone: string | null
  email: string | null
  isVipOrConfidential: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePatientBody {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender?: string
  contactPhone?: string
  email?: string
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, credentials: 'include' })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Request failed')
  return json.data as T
}

export const patientsClient = {
  list: (search?: string): Promise<ApiPatient[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    return apiFetch<ApiPatient[]>(`/api/patients${params}`)
  },

  getById: (id: string): Promise<ApiPatient> =>
    apiFetch<ApiPatient>(`/api/patients/${id}`),

  create: (body: CreatePatientBody): Promise<ApiPatient> =>
    apiFetch<ApiPatient>('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  update: (id: string, body: Partial<CreatePatientBody>): Promise<ApiPatient> =>
    apiFetch<ApiPatient>(`/api/patients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
}
