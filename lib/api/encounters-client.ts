export interface ApiEncounterDetail {
  id: string
  patientId: string
  type: string
  status: string
  startDateTime: string
  admissionDateTime: string | null
  endDateTime: string | null
  currentLocationId: string | null
  attendingProviderId: string | null
  dischargeChecklist: Record<string, boolean> | null
  patient: {
    id: string
    mrn: string
    firstName: string
    lastName: string
    dateOfBirth?: string
    gender?: string | null
  }
  currentLocation: {
    id: string
    unit: string
    roomNumber: string | null
    bedNumber: string | null
    department?: { id: string; name: string } | null
  } | null
  attendingProvider: {
    id: string
    firstName: string
    lastName: string
  } | null
}

export interface ApiFlowsheetObservation {
  id: string
  encounterId: string
  recorderId: string
  recordedAt: string
  observationType: string
  value: string
  unit: string | null
  recorder: {
    id: string
    firstName: string
    lastName: string
    jobTitle: string | null
  }
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, credentials: 'include' })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? json?.error ?? 'Request failed')
  return json.data as T
}

export const encountersClient = {
  list: (status?: string): Promise<ApiEncounterDetail[]> =>
    apiFetch<ApiEncounterDetail[]>(`/api/encounters${status ? `?status=${status}` : ''}`),

  getById: (id: string): Promise<ApiEncounterDetail> =>
    apiFetch<ApiEncounterDetail>(`/api/encounters/${id}`),

  transfer: (
    id: string,
    body: { toLocationId: string; fromLocationId?: string; transportStaffId?: string }
  ) =>
    apiFetch<{ encounter: ApiEncounterDetail; transfer: unknown }>(`/api/encounters/${id}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  triage: (
    id: string,
    body: {
      chiefComplaint: string
      triageCategory: string
      triageDisposition: string
      triageNotes?: string
      vitals?: { type: string; value: string; unit?: string }[]
    }
  ) =>
    apiFetch<{ note: unknown; observations: unknown[] }>(`/api/encounters/${id}/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  getFlowsheet: (id: string, opts?: { take?: number; skip?: number }): Promise<{ observations: ApiFlowsheetObservation[] }> => {
    const params = new URLSearchParams()
    if (opts?.take) params.set('take', String(opts.take))
    if (opts?.skip) params.set('skip', String(opts.skip))
    const qs = params.toString()
    return apiFetch<{ observations: ApiFlowsheetObservation[] }>(
      `/api/encounters/${id}/flowsheet${qs ? `?${qs}` : ''}`
    )
  },

  recordObservation: (
    id: string,
    body: { observationType: string; value: string; unit?: string | null }
  ): Promise<{ observation: ApiFlowsheetObservation }> =>
    apiFetch<{ observation: ApiFlowsheetObservation }>(`/api/encounters/${id}/flowsheet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  updateDischargeChecklist: (
    id: string,
    partial: Record<string, boolean>
  ): Promise<{ encounter: ApiEncounterDetail }> =>
    apiFetch<{ encounter: ApiEncounterDetail }>(`/api/encounters/${id}/discharge-checklist`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial),
    }),

  discharge: (id: string): Promise<{ encounter: ApiEncounterDetail; note: unknown }> =>
    apiFetch<{ encounter: ApiEncounterDetail; note: unknown }>(`/api/encounters/${id}/discharge`, {
      method: 'POST',
    }),
}
