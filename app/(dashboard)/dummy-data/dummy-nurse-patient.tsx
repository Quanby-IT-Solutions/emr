import { id } from "date-fns/locale";
import { en } from "zod/v4/locales";

export interface NursePatient {
  id: string;
  name: string;
  mrn: string;
  room: string;
  condition: string;
  lastVitals: string;
  allergyCount: number;
  encounterCount: number;
}

export interface NursePatientChart {
  [patientId: string]: {
    patient: {
      id: string;
      mrn: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: string;
      contactPhone: string;
      email: string;
      allergies: {
        id: string;
        substance: string;
        reaction: string;
        severity: string;
        status: string;
      }[];
      encounters: {
        id: string;
        type: string;
        status: string;
        startDateTime: string;
        attendingProvider: {
          firstName: string;
          lastName: string;
          jobTitle: string;
        };
      }[];
      patientHistories: {
        id: string;
        condition: string;
        startDateTime: string;
        endDateTime: string;
        attendingProvider: {
          firstName: string;
          lastName: string;
          jobTitle: string;
        };
      }[];
    };
    encounters: {
      id: string;
      type: string;
      status: string;
      startDateTime: string;
      attendingProvider: {
        firstName: string;
        lastName: string;
        jobTitle: string;
      };
      currentLocation: {
        unit: string;
        roomNumber: string;
        bedNumber: string;
      };
      _count: {
        clinicalNotes: number;
        orders: number;
      };
    }[];
    recentOrders: {
      id: string;
      orderType: string;
      status: string;
      priority: string;
      createdAt: string;
      placer: {
        firstName: string;
        lastName: string;
      };
    }[];
  };
}

export const nursePatientList: NursePatient[] = [
  { 
    id: "1", 
    name: "John Doe", 
    mrn: "MRN-001",
    room: "301A", 
    condition: "Stable", 
    lastVitals: "10 min ago",
    allergyCount: 2,
    encounterCount: 3
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    mrn: "MRN-002",
    room: "302B", 
    condition: "Critical", 
    lastVitals: "5 min ago",
    allergyCount: 1,
    encounterCount: 2
  },
  { 
    id: "3", 
    name: "Bob Wilson", 
    mrn: "MRN-003",
    room: "303A", 
    condition: "Stable", 
    lastVitals: "1 hour ago",
    allergyCount: 0,
    encounterCount: 2
  },
  { 
    id: "4", 
    name: "Alice Johnson",
    mrn: "MRN-004",
    room: "304B", 
    condition: "Critical", 
    lastVitals: "2 hours ago",
    allergyCount: 1,
    encounterCount: 1
  },
  { 
    id: "5",
    name: "Michael Brown", 
    mrn: "MRN-005",
    room: "305A", 
    condition: "Stable", 
    lastVitals: "3 hours ago",
    allergyCount: 0,
    encounterCount: 3
  },
  { 
    id: "6", 
    name: "Emily Davis", 
    mrn: "MRN-006",
    room: "306B", 
    condition: "Stable", 
    lastVitals: "4 hours ago",
    allergyCount: 0,
    encounterCount: 2
  },
  { 
    id: "7", 
    name: "David Wilson", 
    mrn: "MRN-007",
    room: "307A", 
    condition: "Stable", 
    lastVitals: "5 hours ago",
    allergyCount: 0,
    encounterCount: 1
  },
  { 
    id: "8", 
    name: "Sarah Miller", 
    mrn: "MRN-008",
    room: "308B", 
    condition: "Critical", 
    lastVitals: "6 hours ago",
    allergyCount: 1,
    encounterCount: 3
  },
  {
    id: "9", 
    name: "Chris Lee", 
    mrn: "MRN-009",
    room: "309A", 
    condition: "Stable", 
    lastVitals: "7 hours ago",
    allergyCount: 2,
    encounterCount: 2   
  },
  {
    id: "10", 
    name: "Olivia Harris", 
    mrn: "MRN-010",
    room: "310B", 
    condition: "Stable",  
    lastVitals: "8 hours ago",
    allergyCount: 1,
    encounterCount: 1
  } 
];

export const nursePatientChart: Record<string, unknown> = {
  "1": {
    patient: {
      id: "1",
      mrn: "MRN-001",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      contactPhone: "+1-555-0123",
      email: "john.doe@email.com",
      allergies: [
        {
          id: "a1",
          substance: "Penicillin",
          reaction: "Severe rash and hives",
          severity: "SEVERE",
          status: "ACTIVE"
        },
        {
          id: "a2",
          substance: "Peanuts",
          reaction: "Anaphylaxis",
          severity: "SEVERE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e1",
          type: "INPATIENT",
          status: "ACTIVE",
          startDateTime: "2025-11-01T08:00:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: {
            unit: "Medical Ward",
            roomNumber: "301",
            bedNumber: "A"
          },
          _count: {
            clinicalNotes: 5,
            orders: 12
          }
        }
      ],
      patientHistories: [
        {
          id: "h1",
          type: "MEDICAL_HISTORY",
          entry: "Type 2 Diabetes Mellitus",
          icd10Code: "E11.9",
          status: "ACTIVE",
          onsetDate: "2020-01-01"
        }
      ]
    },
    recentOrders: [
      {
        id: "o1",
        orderType: "MEDICATION",
        status: "VERIFIED",
        priority: "ROUTINE",
        createdAt: "2025-11-02T09:00:00",
        placer: {
          firstName: "Sarah",
          lastName: "Johnson"
        }
      }
    ]
  },
  "2": {
    patient: {
      id: "2",
      mrn: "MRN-002",
      firstName: "Jane",
      lastName: "Smith",
      dateOfBirth: "1992-07-22",
      gender: "Female",
      contactPhone: "+1-555-0456",
      email: "jane.smith@email.com",
      allergies: [
        {
          id: "a3",
          substance: "Latex",
          reaction: "Contact dermatitis",
          severity: "MODERATE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e4",
          type: "OUTPATIENT",
          status: "PLANNED",
          startDateTime: "2025-10-25T14:00:00",
          attendingProvider: {
            firstName: "David",
            lastName: "Martinez",
            jobTitle: "OB/GYN"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 0,
            orders: 2
          }
        }
      ],
      patientHistories: [
        {
          id: "h5",
          type: "MEDICAL_HISTORY",
          entry: "Asthma",
          icd10Code: "J45.909",
          status: "ACTIVE",
          onsetDate: "2005-05-01"
        }
      ]
    },
    recentOrders: []
  },
  "3": {
    patient: {
      id: "3",
      mrn: "MRN-003",
      firstName: "Bob",
      lastName: "Wilson",
      dateOfBirth: "1978-11-30",
      gender: "Male",
      contactPhone: "+1-555-0789",
      email: "bob.wilson@email.com",
      allergies: [],
      encounters: [
        {
          id: "e6",
          type: "EMERGENCY",
          status: "DISCHARGED",
          startDateTime: "2025-10-15T03:00:00",
          attendingProvider: {
            firstName: "Lisa",
            lastName: "Park",
            jobTitle: "Emergency Medicine"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 4,
            orders: 10
          }
        }
      ],
      patientHistories: [
        {
          id: "h7",
          type: "MEDICAL_HISTORY",
          entry: "Chronic Kidney Disease Stage 3",
          icd10Code: "N18.3",
          status: "ACTIVE",
          onsetDate: "2022-03-01"
        }
      ]
    },
    recentOrders: []
  },
  "4": {
    patient: {
      id: "4",
      mrn: "MRN-004",
      firstName: "Alice",
      lastName: "Johnson",
      dateOfBirth: "1995-09-12",
      gender: "Female",
      contactPhone: "+1-555-0123",
      email: "alice.johnson@email.com",
      allergies: [],
      encounters: [
        {
          id: "e8",
          type: "INPATIENT",
          status: "ACTIVE",
          startDateTime: "2025-11-05T10:00:00",
          attendingProvider: {
            firstName: "Mark",
            lastName: "Lee",
            jobTitle: "Hospitalist"
          },
          }
      ],
      patientHistories: []
    },
    recentOrders: [
      {
        id: "o4",
        orderType: "LAB",
        status: "IN_PROGRESS",
        priority: "ROUTINE",
        createdAt: "2025-11-02T07:30:00",
        placer: {
          firstName: "Mark",
          lastName: "Lee"
        }
      }
    ]
  },
  "5": {
    patient: {
      id: "5",
      mrn: "MRN-005",
      firstName: "Michael",
      lastName: "Brown",
      dateOfBirth: "1988-02-28",
      gender: "Male",
      contactPhone: "+1-555-9876",
      email: "michael.brown@email.com",
      allergies: [],
      encounters: [
        {
          id: "e10",
          type: "INPATIENT",
          status: "DISCHARGED",
          startDateTime: "2025-11-10T15:00:00",
          attendingProvider: {
            firstName: "Sophia",
            lastName: "Nguyen",
            jobTitle: "Family Medicine"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 0,
            orders: 3
          }
        },
        {
          id: "e11",
          type: "INPATIENT",
          status: "DISCHARGED",
          startDateTime: "2025-11-15T08:00:00",
          attendingProvider: {
            firstName: "James",
            lastName: "Wilson",
            jobTitle: "Cardiologist"
          },
          currentLocation: {
            unit: "Surgical Ward",
            roomNumber: "201",
            bedNumber: "B"
          },
          _count: {
            clinicalNotes: 5,
            orders: 12
          }
        },
        {
          id: "e12",
          type: "OUTPATIENT",
          status: "PLANNED",
          startDateTime: "2025-11-20T14:00:00",
          attendingProvider: {
            firstName: "Olivia",
            lastName: "Lee",
            jobTitle: "Dermatologist"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 0,
            orders: 2
          }
        }
      ],
      patientHistories: []
    },
    recentOrders: [
      {
        id: "o5",
        orderType: "LAB",
        status: "VERIFIED",
        priority: "ROUTINE",
        createdAt: "2025-11-02T09:00:00",
        placer: {
          firstName: "Sarah",
          lastName: "Johnson"
        }
      },
      {
        id: "o6",
        orderType: "MEDICATION",
        status: "IN_PROGRESS",
        priority: "STAT",
        createdAt: "2025-11-02T07:30:00",
        placer: {
          firstName: "Sarah",
          lastName: "Johnson"
        }
      }
    ]
  },
  "6": {
    patient: {
      id: "6",
      mrn: "MRN-006",
      firstName: "Emily",
      lastName: "Davis",
      dateOfBirth: "1992-07-10",
      gender: "Female",
      contactPhone: "+1-555-9876",
      email: "emily.davis@email.com",
      allergies: [],
      encounters: [
        {
          id: "e13",
          type: "OUTPATIENT",
          status: "DISCHARGED",
          startDateTime: "2025-11-25T14:00:00",
          attendingProvider: {
            firstName: "David",
            lastName: "Martinez",
            jobTitle: "OB/GYN"
          }
        },
        {
          id: "e14",
          type: "INPATIENT",
          status: "ACTIVE",
          startDateTime: "2025-11-30T08:00:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: {
            unit: "Medical Ward",
            roomNumber: "301",
            bedNumber: "A"
          },
          _count: {
            clinicalNotes: 5,
            orders: 12
          }
        }
      ],
      patientHistories: [
        {
          id: "h11",
          type: "MEDICAL_HISTORY",
          entry: "Hypertension",
          icd10Code: "I10",
          status: "ACTIVE",
          onsetDate: "2018-06-15"
        },
      ]
    },
    recentOrders: [
      {
        id: "o7",
        orderType: "MEDICATION",
        status: "VERIFIED",
        priority: "ROUTINE",
        createdAt: "2025-11-02T09:00:00",
        placer: {
          firstName: "Sarah",
          lastName: "Johnson"
        }
      },
      {
        id: "o8",
        orderType: "LAB",
        status: "IN_PROGRESS",
        priority: "STAT",
        createdAt: "2025-11-02T07:30:00",
        placer: {
          firstName: "Sarah",
          lastName: "Johnson"
        }
      }
    ]
  },
  "7": {
    patient: {
      id: "7",
      mrn: "MRN-007",
      firstName: "David",
      lastName: "Wilson",
      dateOfBirth: "1988-05-20",
      gender: "Male",
      contactPhone: "+1-555-5678",
      email: "david.wilson@email.com",
      allergies: [],
      encounters: [
        {
          id: "e15",
          type: "INPATIENT",
          status: "ACTIVE",
          startDateTime: "2025-12-01T08:00:00",
          attendingProvider: {
            firstName: "Emily",
            lastName: "Scott",
            jobTitle: "Attending Physician"
          },
          currentLocation: {
            unit: "Surgical Ward",
            roomNumber: "201",
            bedNumber: "B"
          },
          _count: {
            clinicalNotes: 5,
            orders: 12
          }
        }
      ],
      patientHistories: [
        {
          id: "h12",
          type: "MEDICAL_HISTORY",
          entry: "Hypertension",
          icd10Code: "I10",
          status: "ACTIVE",
          onsetDate: "2018-06-15"
        }
      ]
    },
    recentOrders: [
      {
        id: "o9",
        orderType: "MEDICATION",
        status: "VERIFIED",
        priority: "ROUTINE",
        createdAt: "2025-11-02T09:00:00",
        placer: {
          firstName: "Emily",
          lastName: "Scott"
        }
      },
      {
        id: "o10",
        orderType: "LAB",
        status: "IN_PROGRESS",
        priority: "STAT",
        createdAt: "2025-11-02T07:30:00",
        placer: {
          firstName: "Emily",
          lastName: "Scott"
        }
      }
    ]
  },
  "8": {
    patient: {
      id: "8",
      mrn: "MRN-008",
      firstName: "Sarah",
      lastName: "Miller",
      dateOfBirth: "1995-09-12",
      gender: "Female",
      contactPhone: "+1-555-8765",
      email: "sarah.miller@email.com",
      allergies: [
        {
          id: "a4",
          substance: "Latex",
          reaction: "Contact dermatitis",
          severity: "MODERATE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e16",
          type: "INPATIENT",
          status: "D",
          startDateTime: "2025-12-01T08:00:00",
          attendingProvider: {
            firstName: "Beatrice",
            lastName: "Lawson",
            jobTitle: "Attending Physician"
          },
          currentLocation: {
            unit: "Inpatient Ward",
            roomNumber: "201",
            bedNumber: "B"
          },
          _count: {
            clinicalNotes: 5,
            orders: 12
          }
        },
        {
          id: "e17",
          type: "INPATIENT",
          status: "ACTIVE",
          startDateTime: "2025-12-01T08:00:00",
          attendingProvider: {
            firstName: "Beatrice",
            lastName: "Lawson",
            jobTitle: "Attending Physician"
          },
          currentLocation: {
            unit: "Inpatient Ward",
            roomNumber: "201",
            bedNumber: "B"
          },
          _count: {
            clinicalNotes: 5,
            orders: 12
          }
        }
      ],
      patientHistories: []
    },
    recentOrders: [
      {
        id: "o11",
        orderType: "MEDICATION",
        status: "VERIFIED",
        priority: "ROUTINE",
        createdAt: "2025-11-02T09:00:00",
        placer: {
          firstName: "Beatrice",
          lastName: "Lawson"
        }
      }
    ]
  },
  "9": {
    patient: {
      id: "9",
      mrn: "MRN-009",
      firstName: "Chris",
      lastName: "Lee",
      dateOfBirth: "1990-03-18",
      gender: "Female",
      contactPhone: "+1-555-3456",
      email: "chris.lee@email.com",
      allergies: [
        {
          id: "a5",
          substance: "Aspirin",
          reaction: "Gastrointestinal bleeding",
          severity: "SEVERE",
          status: "ACTIVE"
        },
        {
          id: "a6",
          substance: "Peanuts",
          reaction: "Anaphylaxis",
          severity: "SEVERE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e18",
          type: "INPATIENT",
          status: "ACTIVE",
          startDateTime: "2025-12-01T08:00:00",
          attendingProvider: {
            firstName: "Beatrice",
            lastName: "Lawson",
            jobTitle: "Attending Physician"
          },
          currentLocation: {
            unit: "Inpatient Ward",
            roomNumber: "201",
            bedNumber: "B"
          },
          _count: {
            clinicalNotes: 5,
            orders: 12
          }
        },
        {
          id: "e19",
          type: "SURGERY",
          status: "PLANNED",
          startDateTime: "2025-12-10T10:00:00",
          attendingProvider: {
            firstName: "Chloe",
            lastName: "Kim",
            jobTitle: "Surgeon"
          },
          currentLocation: {
            unit: "Surgical Ward",
            roomNumber: "202",
            bedNumber: "A"
          },
          _count: {
            clinicalNotes: 5,
            orders: 12  
          }
        }
      ],
      patientHistories: [
        {
          id: "h14",
          type: "MEDICAL_HISTORY",
          entry: "Peanut Allergy",
          icd10Code: "Z91.010",
          status: "ACTIVE",
          onsetDate: "2010-04-15"
        },
        {
          id: "h15",
          type: "MEDICAL_HISTORY",
          entry: "Aspirin Allergy",
          icd10Code: "Z91.010",
          status: "ACTIVE",
          onsetDate: "2010-04-15"
        }
      ]
    },
    recentOrders: [
      {
        id: "o12",
        orderType: "MEDICATION",
        status: "VERIFIED",
        priority: "ROUTINE",
        createdAt: "2025-11-02T09:00:00",
        placer: {
          firstName: "Beatrice",
          lastName: "Lawson"
        }
      }
    ]
  },
  "10": {
    patient: {
      id: "10",
      mrn: "MRN-010",
      firstName: "Olivia",
      lastName: "Harris",
      dateOfBirth: "1990-03-18",
      gender: "Female",
      contactPhone: "+1-555-3456",
      email: "olivia.harris@email.com",
      allergies: [
        {
          id: "a7",
          substance: "Penicillin",
          reaction: "Severe rash and hives",
          severity: "SEVERE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e20",
          type: "OUTPATIENT",
          status: "PLANNED",
          startDateTime: "2025-12-01T08:00:00",
          attendingProvider: {
            firstName: "Carlos",
            lastName: "Lopez",
            jobTitle: "Primary Care Physician"
          },
          }
      ],
      patientHistories: [
        {
          id: "h16",
          type: "MEDICAL_HISTORY",
          entry: "Penicillin Allergy",
          icd10Code: "Z91.010",
          status: "ACTIVE",
          onsetDate: "2010-04-15"
        }
      ]
    },
    recentOrders: [
      {
        id: "o13",
        orderType: "MEDICATION",
        status: "VERIFIED",
        priority: "ROUTINE",
        createdAt: "2025-11-02T09:00:00",
        placer: {
          firstName: "Carlos",
          lastName: "Lopez"
        }
      }
    ]
  }
};