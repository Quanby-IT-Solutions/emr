"use client"

export type AppointmentStatus = 
  | "SCHEDULED" 
  | "ARRIVED" 
  | "CHECKED_IN" 
  | "CANCELLED" 
  | "NO_SHOW" 
  | "IN_TRIAGE"
  | "REFERRED"

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  age: number
  gender: "MALE" | "FEMALE"
  appointmentDate: string
  appointmentTime: string
  department: string
  physician: string
  reasonForVisit: string
  status: AppointmentStatus
  visitType: "NEW" | "FOLLOWUP"
}

export const dummyAppointments: Appointment[] = [
  {
    id: "APT-001",
    patientId: "PAT-001",
    patientName: "Dela Cruz, Juan Pablo",
    age: 45,
    gender: "MALE",
    appointmentDate: new Date().toISOString(),
    appointmentTime: "09:00",
    department: "CARDIOLOGY",
    physician: "Santos",
    reasonForVisit: "Chest pain and shortness of breath",
    status: "SCHEDULED",
    visitType: "NEW"
  },
  {
    id: "APT-002",
    patientId: "PAT-002",
    patientName: "Reyes, Maria Clara",
    age: 32,
    gender: "FEMALE",
    appointmentDate: new Date().toISOString(),
    appointmentTime: "09:30",
    department: "OBSTETRICS",
    physician: "Garcia",
    reasonForVisit: "Prenatal checkup",
    status: "ARRIVED",
    visitType: "FOLLOWUP"
  },
  {
    id: "APT-003",
    patientId: "PAT-003",
    patientName: "Gonzales, Pedro Luis",
    age: 28,
    gender: "MALE",
    appointmentDate: new Date().toISOString(),
    appointmentTime: "10:00",
    department: "ORTHOPEDICS",
    physician: "Ramos",
    reasonForVisit: "Knee injury from sports",
    status: "CHECKED_IN",
    visitType: "NEW"
  },
  {
    id: "APT-004",
    patientId: "PAT-004",
    patientName: "Santos, Ana Marie",
    age: 55,
    gender: "FEMALE",
    appointmentDate: new Date().toISOString(),
    appointmentTime: "10:30",
    department: "GENERAL",
    physician: "Cruz",
    reasonForVisit: "Annual physical examination",
    status: "SCHEDULED",
    visitType: "FOLLOWUP"
  },
  {
    id: "APT-005",
    patientId: "PAT-005",
    patientName: "Bautista, Carlos Miguel",
    age: 8,
    gender: "MALE",
    appointmentDate: new Date().toISOString(),
    appointmentTime: "11:00",
    department: "PEDIATRICS",
    physician: "Mendoza",
    reasonForVisit: "Fever and cough for 3 days",
    status: "ARRIVED",
    visitType: "NEW"
  }
]