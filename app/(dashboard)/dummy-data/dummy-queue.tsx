export type QueueStatus = "Waiting" | "In Consultation" | "Done" | "No-show"
export type PriorityType = "Regular" | "Senior Citizen" | "PWD" | "Pregnant" | "Emergency Referral"

export interface QueueEntry {
  id: string
  queueNumber: number
  patientId: string
  patientName: string
  ageSex: string
  appointmentType: "Booked" | "Walk-in"
  department: string
  provider: string
  status: QueueStatus
  priorityType: PriorityType
  arrivalTime: string
  startTime: string | null
  endTime: string | null
  estimatedWaitMinutes: number
}

export const dummyQueueEntries: QueueEntry[] = [
  {
    id: "Q-001", queueNumber: 1, patientId: "P1001", patientName: "Juan Dela Cruz", ageSex: "72/M",
    appointmentType: "Booked", department: "Internal Medicine", provider: "Dr. Corey McDonald",
    status: "In Consultation", priorityType: "Senior Citizen", arrivalTime: "07:30 AM",
    startTime: "08:00 AM", endTime: null, estimatedWaitMinutes: 0,
  },
  {
    id: "Q-002", queueNumber: 2, patientId: "P1002", patientName: "Rosa Santos", ageSex: "65/F",
    appointmentType: "Booked", department: "Internal Medicine", provider: "Dr. Corey McDonald",
    status: "Waiting", priorityType: "Senior Citizen", arrivalTime: "07:45 AM",
    startTime: null, endTime: null, estimatedWaitMinutes: 15,
  },
  {
    id: "Q-003", queueNumber: 3, patientId: "P1003", patientName: "Maria Garcia", ageSex: "28/F",
    appointmentType: "Booked", department: "Family Medicine", provider: "Dr. Ana Reyes",
    status: "In Consultation", priorityType: "Pregnant", arrivalTime: "07:50 AM",
    startTime: "08:05 AM", endTime: null, estimatedWaitMinutes: 0,
  },
  {
    id: "Q-004", queueNumber: 4, patientId: "P1004", patientName: "Pedro Reyes", ageSex: "45/M",
    appointmentType: "Walk-in", department: "Internal Medicine", provider: "Dr. Liam Macintyre",
    status: "Waiting", priorityType: "Regular", arrivalTime: "08:00 AM",
    startTime: null, endTime: null, estimatedWaitMinutes: 30,
  },
  {
    id: "Q-005", queueNumber: 5, patientId: "P1005", patientName: "Elena Marcos", ageSex: "38/F",
    appointmentType: "Booked", department: "Surgery OPD", provider: "Dr. David Kim",
    status: "Waiting", priorityType: "PWD", arrivalTime: "08:10 AM",
    startTime: null, endTime: null, estimatedWaitMinutes: 10,
  },
  {
    id: "Q-006", queueNumber: 6, patientId: "P1006", patientName: "Roberto Aquino", ageSex: "55/M",
    appointmentType: "Walk-in", department: "Family Medicine", provider: "Dr. Ana Reyes",
    status: "Waiting", priorityType: "Regular", arrivalTime: "08:15 AM",
    startTime: null, endTime: null, estimatedWaitMinutes: 45,
  },
  {
    id: "Q-007", queueNumber: 7, patientId: "P1007", patientName: "Grace Tan", ageSex: "30/F",
    appointmentType: "Booked", department: "Dermatology", provider: "Dr. Martha Chen",
    status: "Done", priorityType: "Regular", arrivalTime: "07:20 AM",
    startTime: "07:35 AM", endTime: "08:05 AM", estimatedWaitMinutes: 0,
  },
  {
    id: "Q-008", queueNumber: 8, patientId: "P1008", patientName: "Carlos Mendoza", ageSex: "60/M",
    appointmentType: "Booked", department: "Orthopedics", provider: "Dr. Jose Rivera",
    status: "No-show", priorityType: "Senior Citizen", arrivalTime: "",
    startTime: null, endTime: null, estimatedWaitMinutes: 0,
  },
  {
    id: "Q-009", queueNumber: 9, patientId: "P1009", patientName: "Anna Lim", ageSex: "42/F",
    appointmentType: "Walk-in", department: "Internal Medicine", provider: "Dr. Corey McDonald",
    status: "Waiting", priorityType: "Emergency Referral", arrivalTime: "08:20 AM",
    startTime: null, endTime: null, estimatedWaitMinutes: 5,
  },
  {
    id: "Q-010", queueNumber: 10, patientId: "P1010", patientName: "Miguel Torres", ageSex: "33/M",
    appointmentType: "Booked", department: "Urology", provider: "Dr. Patricia Lim",
    status: "Waiting", priorityType: "Regular", arrivalTime: "08:25 AM",
    startTime: null, endTime: null, estimatedWaitMinutes: 35,
  },
]
