"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface VitalsData {
  bpSystolic: number
  bpDiastolic: number
  heartRate: number
  temperature: number
  oxygenSaturation: number
  painLevel: number
}

export type PatientStatus = 
  | 'Scheduled'
  | 'Arrived'
  | 'CheckedIn'
  | 'InTriage'
  | 'InEmergency'
  | 'Cancelled'
  | 'NoShow'
  | 'Referred'

interface Patient {
  id: string
  name?: string
  status?: PatientStatus
  vitals?: VitalsData
  triageNotes?: string
  hasHistory?: boolean
  historyData?: {
    allergies: string[]
    medications: string[]
    pastHistory: string
    socialHistory: string
  }
  breakGlassLog?: Array<{
    timestamp: string
    reason: string
    accessedBy: string
  }>
}

interface PatientState {
  patients: Patient[]
  encounters: Record<string, string>
}

type PatientAction =
  | { type: 'UPDATE_VITALS'; payload: { id: string; vitals: VitalsData } }
  | { type: 'UPDATE_TRIAGE_NOTES'; payload: { id: string; notes: string } }
  | { type: 'UPDATE_HISTORY'; payload: { id: string; historyData: any } }
  | { type: 'UPDATE_STATUS'; payload: { id: string; status: PatientStatus } }
  | { type: 'GRANT_BREAK_GLASS'; payload: { id: string; reason: string; accessedBy: string } }

const initialState: PatientState = {
  patients: [],
  encounters: {}
}

function patientReducer(state: PatientState, action: PatientAction): PatientState {
  switch (action.type) {
    case 'UPDATE_VITALS': {
      const existingPatient = state.patients.find(p => p.id === action.payload.id)
      if (existingPatient) {
        return {
          ...state,
          patients: state.patients.map(p =>
            p.id === action.payload.id
              ? { ...p, vitals: action.payload.vitals }
              : p
          )
        }
      }
      return {
        ...state,
        patients: [...state.patients, { id: action.payload.id, vitals: action.payload.vitals }]
      }
    }

    case 'UPDATE_TRIAGE_NOTES': {
      const existingPatient = state.patients.find(p => p.id === action.payload.id)
      if (existingPatient) {
        return {
          ...state,
          patients: state.patients.map(p =>
            p.id === action.payload.id
              ? { ...p, triageNotes: action.payload.notes }
              : p
          )
        }
      }
      return {
        ...state,
        patients: [...state.patients, { id: action.payload.id, triageNotes: action.payload.notes }]
      }
    }

    case 'UPDATE_STATUS': {
      const existingPatient = state.patients.find(p => p.id === action.payload.id)
      if (existingPatient) {
        return {
          ...state,
          patients: state.patients.map(p =>
            p.id === action.payload.id
              ? { ...p, status: action.payload.status }
              : p
          )
        }
      }
      return {
        ...state,
        patients: [...state.patients, { id: action.payload.id, status: action.payload.status }]
      }
    }

    case 'UPDATE_HISTORY': {
      const existingPatient = state.patients.find(p => p.id === action.payload.id)
      if (existingPatient) {
        return {
          ...state,
          patients: state.patients.map(p =>
            p.id === action.payload.id
              ? { ...p, hasHistory: true, historyData: action.payload.historyData }
              : p
          )
        }
      }
      return {
        ...state,
        patients: [...state.patients, { 
          id: action.payload.id, 
          hasHistory: true, 
          historyData: action.payload.historyData 
        }]
      }
    }

    case 'GRANT_BREAK_GLASS': {
      const log = {
        timestamp: new Date().toISOString(),
        reason: action.payload.reason,
        accessedBy: action.payload.accessedBy
      }
      const existingPatient = state.patients.find(p => p.id === action.payload.id)
      if (existingPatient) {
        return {
          ...state,
          patients: state.patients.map(p =>
            p.id === action.payload.id
              ? { ...p, breakGlassLog: [...(p.breakGlassLog || []), log] }
              : p
          )
        }
      }
      return {
        ...state,
        patients: [...state.patients, { id: action.payload.id, breakGlassLog: [log] }]
      }
    }

    default:
      return state
  }
}

interface PatientContextType {
  state: PatientState
  dispatch: React.Dispatch<PatientAction>
  createEncounter: (patientId: string) => string
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export function PatientProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(patientReducer, initialState)

  const createEncounter = (patientId: string): string => {
    const encounterId = `ENC-${Date.now()}`
    // In real implementation, this would make an API call
    return encounterId
  }

  return (
    <PatientContext.Provider value={{ state, dispatch, createEncounter }}>
      {children}
    </PatientContext.Provider>
  )
}

export function usePatientContext() {
  const context = useContext(PatientContext)
  if (!context) {
    throw new Error('usePatientContext must be used within PatientProvider')
  }
  return context
}