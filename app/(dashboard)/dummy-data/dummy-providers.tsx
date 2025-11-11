// Appointment details
export interface Appointment {
  time: string
  patient: string
}

// Provider model
export interface Provider {
  name: string
  department: string
  shift: string
  availability: string[]
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

// Departments and Providers
export const Departments: DepartmentList[] = [
  // ----------------- INTERNAL MEDICINE -----------------
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
        publicContact: "(555) 722-3321",
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
        publicContact: "(555) 722-4463",
      },
      {
        name: "Martha Chen",
        department: "Internal Medicine",
        shift: "11:00 AM - 5:00 PM",
        availability: ["11:00 AM - 1:00 PM", "3:00 PM - 5:00 PM"],
        appointments: [{ time: "4:00 PM", patient: "Alberto Ruiz" }],
        officeLocation: "Room 207C",
        contactSchedulerOnly: "310-862-0051",
        publicContact: "(555) 722-5582",
      },
      // Additional providers
      {
        name: "David Kim",
        department: "Internal Medicine",
        shift: "8:00 AM - 2:00 PM",
        availability: ["8:00 AM - 10:00 AM", "12:00 PM - 2:00 PM"],
        appointments: [{ time: "9:15 AM", patient: "Megan Fox" }],
        officeLocation: "Room 208A",
        contactSchedulerOnly: "310-862-0062",
        publicContact: "(555) 722-6677",
      },
      {
        name: "Elena Gonzalez",
        department: "Internal Medicine",
        shift: "1:00 PM - 7:00 PM",
        availability: ["1:00 PM - 3:00 PM", "5:00 PM - 7:00 PM"],
        appointments: [{ time: "2:30 PM", patient: "Lucas Brown" }],
        officeLocation: "Room 209B",
        contactSchedulerOnly: "310-862-0073",
        publicContact: "(555) 722-7788",
      },
      {
        name: "Mohammed Ali",
        department: "Internal Medicine",
        shift: "7:00 AM - 1:00 PM",
        availability: ["7:00 AM - 9:00 AM", "11:00 AM - 1:00 PM"],
        appointments: [{ time: "8:00 AM", patient: "Nina Patel" }],
        officeLocation: "Room 210C",
        contactSchedulerOnly: "310-862-0084",
        publicContact: "(555) 722-8899",
      },
    ],
  },

  // ----------------- FAMILY MEDICINE -----------------
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
        publicContact: "(555) 111-2222",
      },
      {
        name: "Brandon Funk",
        department: "Family Medicine",
        shift: "10:00 AM - 4:00 PM",
        availability: ["10:00 AM - 4:00 PM"],
        appointments: [{ time: "2:00 PM", patient: "Tom Harris" }],
        officeLocation: "Suite 16 — Pediatrics Wing",
        contactSchedulerOnly: "702-589-8830",
        publicContact: "(555) 789-2221",
      },
      {
        name: "Sandra Ng",
        department: "Family Medicine",
        shift: "1:00 PM - 7:00 PM",
        availability: ["1:00 PM - 3:00 PM", "4:00 PM - 6:00 PM"],
        appointments: [{ time: "5:30 PM", patient: "Tracy Mills" }],
        officeLocation: "Room 104B",
        contactSchedulerOnly: "702-589-0011",
        publicContact: "(555) 789-9999",
      },
      // Additional providers
      {
        name: "Olivia Martinez",
        department: "Family Medicine",
        shift: "7:00 AM - 1:00 PM",
        availability: ["7:00 AM - 9:00 AM", "11:00 AM - 1:00 PM"],
        appointments: [{ time: "8:30 AM", patient: "David Smith" }],
        officeLocation: "Room 105A",
        contactSchedulerOnly: "702-589-0022",
        publicContact: "(555) 789-0000",
      },
      {
        name: "Ryan Scott",
        department: "Family Medicine",
        shift: "2:00 PM - 8:00 PM",
        availability: ["2:00 PM - 4:00 PM", "6:00 PM - 8:00 PM"],
        appointments: [{ time: "3:15 PM", patient: "Anna Bell" }],
        officeLocation: "Room 106B",
        contactSchedulerOnly: "702-589-0033",
        publicContact: "(555) 789-1111",
      },
      {
        name: "Priya Singh",
        department: "Family Medicine",
        shift: "9:00 AM - 3:00 PM",
        availability: ["9:00 AM - 11:00 AM", "1:00 PM - 3:00 PM"],
        appointments: [{ time: "10:45 AM", patient: "Zoe Lin" }],
        officeLocation: "Room 107C",
        contactSchedulerOnly: "702-589-0044",
        publicContact: "(555) 789-2222",
      },
    ],
  },

  // ----------------- PEDIATRICS -----------------
  {
    department: "Pediatrics",
    clinicLocation: "Children’s Wing - 1st Floor",
    officePhone: "(555) 777-1144",
    providers: [
      {
        name: "Amelia Park",
        department: "Pediatrics",
        shift: "8:00 AM - 2:00 PM",
        availability: ["8:00 AM - 12:00 PM"],
        appointments: [{ time: "9:45 AM", patient: "Emma Lopez" }],
        officeLocation: "Room 101C",
        contactSchedulerOnly: "702-701-2020",
        publicContact: "(555) 444-1111",
      },
      {
        name: "Isaac Johnson",
        department: "Pediatrics",
        shift: "10:00 AM - 4:00 PM",
        availability: ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"],
        appointments: [{ time: "3:30 PM", patient: "Leo Kim" }],
        officeLocation: "Room 102C",
        contactSchedulerOnly: "702-701-2021",
        publicContact: "(555) 444-2222",
      },
      {
        name: "Sophia Carter",
        department: "Pediatrics",
        shift: "12:00 PM - 6:00 PM",
        availability: ["12:00 PM - 2:00 PM", "4:00 PM - 6:00 PM"],
        appointments: [{ time: "5:00 PM", patient: "Noah Brown" }],
        officeLocation: "Room 103C",
        contactSchedulerOnly: "702-701-2022",
        publicContact: "(555) 444-3333",
      },
    ],
  },

  // ----------------- CARDIOLOGY -----------------
  {
    department: "Cardiology",
    clinicLocation: "Specialty Clinic - 3rd Floor",
    officePhone: "(555) 602-7788",
    providers: [
      {
        name: "Dr. Alan Roberts",
        department: "Cardiology",
        shift: "7:00 AM - 1:00 PM",
        availability: ["7:00 AM - 9:00 AM", "11:00 AM - 1:00 PM"],
        appointments: [{ time: "8:15 AM", patient: "Harvey Dent" }],
        officeLocation: "Room 301",
        contactSchedulerOnly: "213-901-2230",
        publicContact: "(555) 666-1000",
      },
      {
        name: "Dr. Priya Patel",
        department: "Cardiology",
        shift: "9:00 AM - 3:00 PM",
        availability: ["9:00 AM - 11:00 AM", "1:00 PM - 3:00 PM"],
        appointments: [{ time: "2:00 PM", patient: "Sarah Kim" }],
        officeLocation: "Room 303",
        contactSchedulerOnly: "213-901-2231",
        publicContact: "(555) 666-2000",
      },
      {
        name: "Dr. Ethan Morales",
        department: "Cardiology",
        shift: "12:00 PM - 6:00 PM",
        availability: ["12:00 PM - 2:00 PM", "4:00 PM - 6:00 PM"],
        appointments: [{ time: "5:00 PM", patient: "James White" }],
        officeLocation: "Room 305",
        contactSchedulerOnly: "213-901-2232",
        publicContact: "(555) 666-3000",
      },
      // Additional providers
      {
        name: "Dr. Fiona Zhang",
        department: "Cardiology",
        shift: "8:00 AM - 2:00 PM",
        availability: ["8:00 AM - 10:00 AM", "12:00 PM - 2:00 PM"],
        appointments: [{ time: "9:30 AM", patient: "Oliver Stone" }],
        officeLocation: "Room 307",
        contactSchedulerOnly: "213-901-2233",
        publicContact: "(555) 666-4000",
      },
      {
        name: "Dr. Michael Liu",
        department: "Cardiology",
        shift: "10:00 AM - 4:00 PM",
        availability: ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"],
        appointments: [{ time: "11:15 AM", patient: "Emma Watson" }],
        officeLocation: "Room 309",
        contactSchedulerOnly: "213-901-2234",
        publicContact: "(555) 666-5000",
      },
    ],
  },

  // ----------------- DERMATOLOGY -----------------
  {
    department: "Dermatology",
    clinicLocation: "East Wing - 4th Floor",
    officePhone: "(555) 902-1199",
    providers: [
      {
        name: "Laura Bennett",
        department: "Dermatology",
        shift: "8:00 AM - 1:00 PM",
        availability: ["8:00 AM - 10:00 AM", "11:00 AM - 1:00 PM"],
        appointments: [{ time: "10:45 AM", patient: "Clara Olsen" }],
        officeLocation: "Room 401",
        contactSchedulerOnly: "213-800-5510",
        publicContact: "(555) 777-4000",
      },
      {
        name: "Kevin Brooks",
        department: "Dermatology",
        shift: "10:00 AM - 4:00 PM",
        availability: ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"],
        appointments: [{ time: "3:00 PM", patient: "Laura Santos" }],
        officeLocation: "Room 403",
        contactSchedulerOnly: "213-800-5511",
        publicContact: "(555) 777-5000",
      },
      {
        name: "Rebecca Lin",
        department: "Dermatology",
        shift: "1:00 PM - 6:00 PM",
        availability: ["1:00 PM - 3:00 PM", "4:00 PM - 6:00 PM"],
        appointments: [{ time: "2:30 PM", patient: "Maria Gonzalez" }],
        officeLocation: "Room 405",
        contactSchedulerOnly: "213-800-5512",
        publicContact: "(555) 777-6000",
      },
    ],
  },
]

// Weekly Availability
export const mockWeeklyAvailability: WeeklyAvailability = {
  // ----------------- INTERNAL MEDICINE -----------------
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
  "Martha Chen": {
    Monday: ["11:00 AM", "3:00 PM"],
    Tuesday: ["12:00 PM"],
    Wednesday: ["2:00 PM"],
    Thursday: ["1:00 PM", "4:00 PM"],
    Friday: ["3:00 PM"],
  },
  "David Kim": {
    Monday: ["8:00 AM", "12:00 PM"],
    Tuesday: ["9:00 AM"],
    Wednesday: ["8:30 AM", "12:30 PM"],
    Thursday: ["10:00 AM"],
    Friday: ["8:15 AM", "1:30 PM"],
  },
  "Elena Gonzalez": {
    Monday: ["1:00 PM", "5:00 PM"],
    Tuesday: ["3:00 PM"],
    Wednesday: ["1:30 PM", "6:00 PM"],
    Thursday: ["2:00 PM", "5:00 PM"],
    Friday: ["1:00 PM", "6:00 PM"],
  },
  "Mohammed Ali": {
    Monday: ["7:00 AM", "11:00 AM"],
    Tuesday: ["8:00 AM", "12:00 PM"],
    Wednesday: ["7:30 AM", "11:30 AM"],
    Thursday: ["9:00 AM", "12:00 PM"],
    Friday: ["8:00 AM", "1:00 PM"],
  },

  // ----------------- FAMILY MEDICINE -----------------
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
  "Sandra Ng": {
    Monday: ["2:00 PM", "5:00 PM"],
    Tuesday: ["4:30 PM"],
    Wednesday: [],
    Thursday: ["3:00 PM", "6:00 PM"],
    Friday: ["5:30 PM"],
  },
  "Olivia Martinez": {
    Monday: ["7:30 AM", "11:30 AM"],
    Tuesday: ["8:00 AM", "12:00 PM"],
    Wednesday: [],
    Thursday: ["7:00 AM", "11:00 AM"],
    Friday: ["8:30 AM"],
  },
  "Ryan Scott": {
    Monday: ["2:30 PM", "6:00 PM"],
    Tuesday: ["3:00 PM"],
    Wednesday: ["2:15 PM", "7:00 PM"],
    Thursday: [],
    Friday: ["2:00 PM", "6:30 PM"],
  },
  "Priya Singh": {
    Monday: ["9:00 AM", "1:00 PM"],
    Tuesday: ["10:00 AM"],
    Wednesday: ["1:30 PM"],
    Thursday: ["9:00 AM", "2:00 PM"],
    Friday: ["10:30 AM", "1:00 PM"],
  },

  // ----------------- PEDIATRICS -----------------
  "Amelia Park": {
    Monday: ["8:30 AM", "10:00 AM"],
    Tuesday: ["11:00 AM"],
    Wednesday: ["9:00 AM", "12:00 PM"],
    Thursday: [],
    Friday: ["10:30 AM"],
  },
  "Isaac Johnson": {
    Monday: ["10:30 AM", "2:30 PM"],
    Tuesday: ["3:00 PM"],
    Wednesday: [],
    Thursday: ["11:30 AM", "4:00 PM"],
    Friday: ["2:00 PM"],
  },
  "Sophia Carter": {
    Monday: ["12:30 PM", "5:00 PM"],
    Tuesday: [],
    Wednesday: ["4:00 PM"],
    Thursday: ["2:00 PM", "5:30 PM"],
    Friday: ["1:00 PM"],
  },

  // ----------------- CARDIOLOGY -----------------
  "Dr. Alan Roberts": {
    Monday: ["7:15 AM", "9:00 AM"],
    Tuesday: ["8:00 AM", "12:00 PM"],
    Wednesday: ["9:30 AM"],
    Thursday: [],
    Friday: ["10:00 AM"],
  },
  "Dr. Priya Patel": {
    Monday: ["10:00 AM", "1:00 PM"],
    Tuesday: [],
    Wednesday: ["11:30 AM"],
    Thursday: ["9:00 AM", "2:00 PM"],
    Friday: ["1:30 PM"],
  },
  "Dr. Ethan Morales": {
    Monday: ["12:30 PM", "5:00 PM"],
    Tuesday: ["3:30 PM"],
    Wednesday: [],
    Thursday: ["4:30 PM"],
    Friday: ["2:00 PM"],
  },
  "Dr. Fiona Zhang": {
    Monday: ["8:00 AM", "12:00 PM"],
    Tuesday: ["8:30 AM", "1:30 PM"],
    Wednesday: [],
    Thursday: ["9:00 AM", "12:30 PM"],
    Friday: ["8:00 AM", "1:00 PM"],
  },
  "Dr. Michael Liu": {
    Monday: ["10:00 AM", "2:00 PM"],
    Tuesday: ["11:00 AM"],
    Wednesday: [],
    Thursday: ["10:30 AM", "2:30 PM"],
    Friday: ["11:15 AM", "3:45 PM"],
  },

  // ----------------- DERMATOLOGY -----------------
  "Laura Bennett": {
    Monday: ["8:00 AM", "11:00 AM"],
    Tuesday: ["9:00 AM", "12:30 PM"],
    Wednesday: [],
    Thursday: ["8:30 AM", "1:00 PM"],
    Friday: ["10:00 AM"],
  },
  "Kevin Brooks": {
    Monday: ["10:30 AM", "3:00 PM"],
    Tuesday: [],
    Wednesday: ["2:00 PM"],
    Thursday: ["11:00 AM", "1:30 PM"],
    Friday: ["12:00 PM"],
  },
  "Rebecca Lin": {
    Monday: ["1:00 PM", "4:00 PM"],
    Tuesday: ["3:00 PM"],
    Wednesday: [],
    Thursday: ["2:30 PM", "5:00 PM"],
    Friday: ["4:30 PM"],
  },
}
