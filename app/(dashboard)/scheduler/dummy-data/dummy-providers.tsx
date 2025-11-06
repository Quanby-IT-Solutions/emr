// Appointment details
export interface Appointment {
  time: string
  patient: string
}

// Provider model
export interface Provider {
  name: string
  department: string
  shift: string // replaces "availability[]" as a daily window
  availability: string[] // used in WEEKLY mode
  appointments: Appointment[]
  officeLocation: string
  contactSchedulerOnly: string
  publicContact: string
}

// Department model
export interface DepartmentList {
  department: string
  clinicLocation: string
  officePhone: string
  providers: Provider[]
}

// Weekly availability structure
export type WeeklyAvailability = {
  [providerName: string]: {
    [day: string]: string[]
  }
}

// Mock Data
export const Departments: DepartmentList[] = [
  {
    department: "Internal Medicine",
    clinicLocation: "Main Hospital Building - 2nd Floor",
    officePhone: "(555) 901-2234",
    providers: [
      {
        name: "Corey McDonald",
        department: "Internal Medicine",
        shift: "9:00 AM - 3:00 PM",
        availability: ["9:00 AM - 11:00 AM", "1:00 PM - 3:00 PM"],
        appointments: [
          { time: "9:30 AM", patient: "John Doe" },
          { time: "1:45 PM", patient: "Jane Smith" },
        ],
        officeLocation: "Room 205B",
        contactSchedulerOnly: "310-862-0026",
        publicContact: "(555) 722-3321"
      },
      {
        name: "Liam Macintyre",
        department: "Internal Medicine",
        shift: "6:00 AM - 12:00 PM",
        availability: ["7:00 AM - 8:00 AM", "9:00 AM - 10:30 AM"],
        appointments: [
          { time: "7:30 AM", patient: "Sam Clide" },
          { time: "9:00 AM", patient: "Janet Halworth" },
        ],
        officeLocation: "Room 204A",
        contactSchedulerOnly: "310-862-0039",
        publicContact: "(555) 722-4463"
      },
    ],
  },
  {
    department: "Family Medicine",
    clinicLocation: "Outpatient Clinic - Suite 14",
    officePhone: "(555) 589-9930",
    providers: [
      {
        name: "Kurt Clark",
        department: "Family Medicine",
        shift: "8:00 AM - 12:00 PM",
        availability: ["8:00 AM - 12:00 PM"],
        appointments: [
          { time: "10:15 AM", patient: "Bob Adams" },
          { time: "11:30 AM", patient: "Alice Lee" },
        ],
        officeLocation: "Room 102A",
        contactSchedulerOnly: "702-589-9930",
        publicContact: "(555) 111-2222"
      },
      {
        name: "Brandon Funk",
        department: "Family Medicine",
        shift: "10:00 AM - 4:00 PM",
        availability: ["10:00 AM - 4:00 PM"],
        appointments: [
          { time: "2:00 PM", patient: "Tom Harris" },
        ],
        officeLocation: "Suite 16 — Pediatrics Wing",
        contactSchedulerOnly: "702-589-8830",
        publicContact: "(555) 789-2221"
      },
    ],
  },
]


// Weekly Availability
export const mockWeeklyAvailability: WeeklyAvailability = {
  "Corey McDonald": {
    Monday: ["9:00 AM", "10:00 AM", "1:00 PM"],
    Tuesday: ["9:30 AM"],
    Wednesday: [],
    Thursday: ["11:00 AM", "3:00 PM"],
    Friday: ["8:30 AM", "1:30 PM"],
  },
  "Liam Macintyre": {
    Monday: ["7:00 AM", "9:00 AM"],
    Tuesday: ["9:30 AM"],
    Wednesday: ["7:30 AM"],
    Thursday: ["9:00 AM", "9:45 AM"],
    Friday: ["9:30 AM"],
  },
  "Kurt Clark": {
    Monday: ["10:30 AM"],
    Tuesday: ["9:00 AM", "2:00 PM"],
    Wednesday: ["11:00 AM"],
    Thursday: [],
    Friday: ["3:30 PM"],
  },
  "Brandon Funk": {
    Monday: ["8:00 AM", "1:30 PM"],
    Tuesday: [],
    Wednesday: ["10:00 AM"],
    Thursday: ["9:45 AM"],
    Friday: ["11:30 AM"],
  },
}