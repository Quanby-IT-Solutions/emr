"use client"

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
  visitType: "NEW" | "FOLLOW_UP"
  status: "SCHEDULED" | "ARRIVED" | "CHECKED_IN" | "CANCELLED"
  reasonForVisit: string
}

export const dummyAppointments: Appointment[] = [
  {
    id: "APT-2024-0001",
    patientId: "PAT-2024-0001",
    patientName: "Dela Cruz, Juan Santos",
    age: 45,
    gender: "MALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "09:00 AM",
    department: "GENERAL",
    physician: "Maria Santos",
    visitType: "FOLLOW_UP",
    status: "SCHEDULED",
    reasonForVisit: "Hypertension follow-up check-up"
  },
  {
    id: "APT-2024-0002",
    patientId: "PAT-2024-0002",
    patientName: "Reyes, Maria Garcia",
    age: 32,
    gender: "FEMALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "09:30 AM",
    department: "OB-GYN",
    physician: "Ana Rodriguez",
    visitType: "NEW",
    status: "ARRIVED",
    reasonForVisit: "Prenatal check-up"
  },
  {
    id: "APT-2024-0003",
    patientId: "PAT-2024-0003",
    patientName: "Santos, Pedro Martinez",
    age: 58,
    gender: "MALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "10:00 AM",
    department: "CARDIOLOGY",
    physician: "Roberto Cruz",
    visitType: "FOLLOW_UP",
    status: "SCHEDULED",
    reasonForVisit: "Chest pain, shortness of breath"
  },
  {
    id: "APT-2024-0004",
    patientId: "PAT-2024-0004",
    patientName: "Gonzales, Ana Cruz",
    age: 27,
    gender: "FEMALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "10:30 AM",
    department: "DERMATOLOGY",
    physician: "Sofia Mendoza",
    visitType: "NEW",
    status: "CHECKED_IN",
    reasonForVisit: "Skin rash and allergies"
  },
  {
    id: "APT-2024-0005",
    patientId: "PAT-2024-0005",
    patientName: "Mendoza, Jose Ramos",
    age: 41,
    gender: "MALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "11:00 AM",
    department: "ORTHOPEDICS",
    physician: "Carlos Bautista",
    visitType: "FOLLOW_UP",
    status: "SCHEDULED",
    reasonForVisit: "Knee pain and swelling"
  },
  {
    id: "APT-2024-0006",
    patientId: "PAT-2024-0006",
    patientName: "Aquino, Luz Torres",
    age: 65,
    gender: "FEMALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "11:30 AM",
    department: "GENERAL",
    physician: "Maria Santos",
    visitType: "FOLLOW_UP",
    status: "CANCELLED",
    reasonForVisit: "Diabetes management"
  },
  {
    id: "APT-2024-0007",
    patientId: "PAT-2024-0007",
    patientName: "Rivera, Carlos Bautista",
    age: 29,
    gender: "MALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "02:00 PM",
    department: "ENT",
    physician: "Elena Diaz",
    visitType: "NEW",
    status: "SCHEDULED",
    reasonForVisit: "Ear infection"
  },
  {
    id: "APT-2024-0008",
    patientId: "PAT-2024-0008",
    patientName: "Fernandez, Rosa Flores",
    age: 52,
    gender: "FEMALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "02:30 PM",
    department: "PEDIATRICS",
    physician: "Carmen Salazar",
    visitType: "NEW",
    status: "ARRIVED",
    reasonForVisit: "Child vaccination"
  },
  {
    id: "APT-2024-0009",
    patientId: "PAT-2024-0009",
    patientName: "Bautista, Ramon Cruz",
    age: 38,
    gender: "MALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "03:00 PM",
    department: "GENERAL",
    physician: "Maria Santos",
    visitType: "NEW",
    status: "SCHEDULED",
    reasonForVisit: "Annual physical examination"
  },
  {
    id: "APT-2024-0010",
    patientId: "PAT-2024-0010",
    patientName: "Cruz, Elena Martinez",
    age: 44,
    gender: "FEMALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "03:30 PM",
    department: "CARDIOLOGY",
    physician: "Roberto Cruz",
    visitType: "FOLLOW_UP",
    status: "SCHEDULED",
    reasonForVisit: "High blood pressure monitoring"
  },
  {
    id: "APT-2024-0011",
    patientId: "PAT-2024-0011",
    patientName: "Torres, Miguel Santos",
    age: 50,
    gender: "MALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "04:00 PM",
    department: "ORTHOPEDICS",
    physician: "Carlos Bautista",
    visitType: "NEW",
    status: "ARRIVED",
    reasonForVisit: "Lower back pain"
  },
  {
    id: "APT-2024-0012",
    patientId: "PAT-2024-0012",
    patientName: "Ramos, Carmen Dela Cruz",
    age: 36,
    gender: "FEMALE",
    appointmentDate: "2024-11-02",
    appointmentTime: "04:30 PM",
    department: "OB-GYN",
    physician: "Ana Rodriguez",
    visitType: "FOLLOW_UP",
    status: "SCHEDULED",
    reasonForVisit: "Pregnancy ultrasound"
  }
]