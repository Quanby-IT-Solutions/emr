// ============================================
// OPTIONS/CHOICES
// ============================================

export const ARRIVAL_STATUS = [
  { value: "alive", label: "Alive" },
  { value: "dead-on-arrival", label: "Dead on Arrival" },
]

export const ARRIVAL_MODES = [
  { value: "ambulance", label: "Ambulance", icon: "Ambulance" },
  { value: "private-vehicle", label: "Private Vehicle", icon: "Car" },
  { value: "public-transport", label: "Public Transport", icon: "Bus" },
  { value: "walk-in", label: "Walk-in", icon: "Footprints" },
  { value: "transfer", label: "Transfer", icon: "Hospital" },
  { value: "other", label: "Other", icon: "Bike" },
]

export const DEPARTMENTS = [
  { value: "EMERGENCY", label: "Emergency" },
  { value: "OPD", label: "OPD" }, 
  { value: "WALK_IN", label: "Walk-in" },
  { value: "REFERRAL", label: "Referral" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "OTHER", label: "Other" },
]

export const SYMPTOMS_LIST = [
  { key: "fever", label: "Fever" },
  { key: "weakness", label: "Weakness" },
  { key: "chestPain", label: "Chest Pain" },
  { key: "difficultyBreathing", label: "Difficulty Breathing" },
  { key: "lossOfConsciousness", label: "Loss of Consciousness" },
  { key: "bleeding", label: "Bleeding" },
  { key: "others", label: "Others" },
]

export const DISPOSITIONS = [
  { value: 'Admit', label: 'Admit' },
  { value: 'Discharge', label: 'Discharge' },
  { value: 'Died', label: 'Died' },
  { value: 'Absconded', label: 'Absconded' },
  { value: 'THOC', label: 'Transfer to Hospital of Choice' },
  { value: 'DAMA', label: 'Discharge against medical advice' },
  { value: 'Under_obs', label: 'Under observation' },
  { value: 'Other', label: 'Other' }
]

export const TRIAGE_LEVELS = [
  { 
    value: 'EMERGENT', 
    label: 'Emergent',
    icon: 'Siren',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    iconColor: 'text-red-600',
    ringColor: 'has-data-[state=checked]:ring-red-500'
  },
  { 
    value: 'URGENT', 
    label: 'Urgent',
    icon: 'ClockAlert',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-900',
    iconColor: 'text-yellow-600',
    ringColor: 'has-data-[state=checked]:ring-yellow-500'
  },
  { 
    value: 'NON_URGENT', 
    label: 'Non-Urgent',
    icon: 'ClipboardPlus',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    iconColor: 'text-green-600',
    ringColor: 'has-data-[state=checked]:ring-green-500'
  },
  { 
    value: 'DEAD', 
    label: 'Dead',
    icon: 'Skull',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-900',
    iconColor: 'text-slate-600',
    ringColor: 'has-data-[state=checked]:ring-slate-500'
  }
]

// ============================================
// DUMMY DATA INTERFACE
// ============================================

export interface TriageAssessment {
  patient: {
    id: string
    name: string
    firstName: string
    middleName: string
    lastName: string
    ageSex: string
    age: string
    sex: string
    phoneNumber: number
    address: string
    occupation: string
    currentTriageCategory: "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD"
    status: "IN APT. QUEUE" | "REFERRED" | "FOR DISCHARGE" | "TRANSFERRED" | "OTHER"
    lastDateOfTriage: Date | null
    lastTimeOfTriage: string
    companion: {
      name: string
      contact: number | null
      relation: string
    }
    arrivalDetails: {
      arrivalStatus: "alive" | "dead-on-arrival"
      date: Date
      time: string
      modeOfTransport: string
      modeOfTransportOther: string
      transferredFrom: string | null
      department: string
      departmentOther: string
      referredBy: string | null
    }
    triageDetails: {
      chiefComplaint: string
      symptoms: {
        chestPain: boolean
        difficultyBreathing: boolean
        fever: boolean
        weakness: boolean
        lossOfConsciousness: boolean
        bleeding: boolean
        others: boolean
      }
      symptomsOther: string
      vitalSigns: {
        bloodPressure: string
        bpSystolic: string
        bpDiastolic: string
        heartRate: number
        respiratoryRate: number
        temperature: number
        oxygenSaturation: number
        weight: number
        height: number
      }
      painAssessment: {
        scale: number
        location: string
        duration: string
        characteristics: string
        aggravatingFactors: string
        relievingFactors: string
      }
      glasgowComaScale: {
        eyeOpening: number
        verbalResponse: number
        motorResponse: number
        totalScore: number
      }
      airwayStatus: {
        assessment: string
        airwayNotes: string
        interventions: string
      }
      breathingStatus: {
        assessment: string
        breathingNotes: string
        interventions: string
      }
      circulationStatus: {
        assessment: string
        circulationNotes: string
        interventions: string
      }
      triageCategory: "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD"
      triageType: "EMERGENCY" | "OPD" | "WALK_IN" | "REFERRAL" | "SCHEDULED" | "OTHER"
      triageDisposition: string
      triageDispositionOther: string | null
      triageNotes: string
      triageOfficer: {
        nurseId: string
        firstName: string
        lastName: string
      }
      dateOfTriage: Date
      timeOfTriage: string
    }[]
  }
}

// ============================================
// DUMMY DATA
// ============================================

export const TriageEntry: TriageAssessment[] = [
  {
    patient: {
      id: "PAT-2025-001",
      name: "Maria Santos Cruz",
      firstName: "Maria",
      middleName: "Santos",
      lastName: "Cruz",
      ageSex: "45/F",
      age: "45",
      sex: "Female",
      phoneNumber: 639171234567,
      address: "123 Maharlika Highway, Silang, Cavite",
      occupation: "Teacher",
      currentTriageCategory: "URGENT",
      status: "TRANSFERRED",
      lastDateOfTriage: new Date("2025-11-18T08:30:00"),
      lastTimeOfTriage: "08:30 AM",
      companion: {
        name: "Juan Cruz",
        contact: 639189876543,
        relation: "Husband"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-18T08:15:00"),
        time: "08:15 AM",
        modeOfTransport: "private-vehicle",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Severe chest pain radiating to left arm",
          symptoms: {
            chestPain: true,
            difficultyBreathing: true,
            fever: false,
            weakness: true,
            lossOfConsciousness: false,
            bleeding: false,
            others: false
          },
          symptomsOther: "",
          vitalSigns: {
            bloodPressure: "160/95",
            bpSystolic: "160",
            bpDiastolic: "95",
            heartRate: 110,
            respiratoryRate: 22,
            temperature: 37.2,
            oxygenSaturation: 94,
            weight: 68,
            height: 158
          },
          painAssessment: {
            scale: 8,
            location: "Central chest radiating to left arm",
            duration: "30 minutes",
            characteristics: "Crushing, pressure-like pain",
            aggravatingFactors: "Movement, deep breathing",
            relievingFactors: "None effective"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Clear, no obstruction",
            interventions: "None required"
          },
          breathingStatus: {
            assessment: "Labored",
            breathingNotes: "Tachypneic, shallow breathing",
            interventions: "O2 via nasal cannula at 4L/min"
          },
          circulationStatus: {
            assessment: "Compromised",
            circulationNotes: "Tachycardic, hypertensive, pale, diaphoretic",
            interventions: "IV line inserted, continuous monitoring"
          },
          triageCategory: "URGENT",
          triageType: "EMERGENCY",
          triageDisposition: "Admit",
          triageDispositionOther: null,
          triageNotes: "Possible acute coronary syndrome. ECG ordered. Cardiology consult requested.",
          triageOfficer: {
            nurseId: "RN-2025-015",
            firstName: "Ana",
            lastName: "Reyes"
          },
          dateOfTriage: new Date("2025-11-18T08:30:00"),
          timeOfTriage: "08:30 AM"
        }
      ]
    }
  },
  {
    patient: {
      id: "PAT-2025-002",
      name: "Roberto Tan Lim",
      firstName: "Roberto",
      middleName: "Tan",
      lastName: "Lim",
      ageSex: "32/M",
      age: "32",
      sex: "Male",
      phoneNumber: 639285551234,
      address: "456 Aguinaldo Highway, Tagaytay City",
      occupation: "Construction Worker",
      currentTriageCategory: "EMERGENT",
      status: "REFERRED",
      lastDateOfTriage: new Date("2025-11-18T14:45:00"),
      lastTimeOfTriage: "02:45 PM",
      companion: {
        name: "Pedro Santos",
        contact: 639176543210,
        relation: "Coworker"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-18T14:30:00"),
        time: "02:30 PM",
        modeOfTransport: "ambulance",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Fall from height with head injury",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: false,
            weakness: true,
            lossOfConsciousness: true,
            bleeding: true,
            others: false
          },
          symptomsOther: "",
          vitalSigns: {
            bloodPressure: "110/70",
            bpSystolic: "110",
            bpDiastolic: "70",
            heartRate: 95,
            respiratoryRate: 20,
            temperature: 36.8,
            oxygenSaturation: 96,
            weight: 72,
            height: 170
          },
          painAssessment: {
            scale: 7,
            location: "Head - occipital region",
            duration: "15 minutes since fall",
            characteristics: "Throbbing, constant pain",
            aggravatingFactors: "Head movement, noise",
            relievingFactors: "None"
          },
          glasgowComaScale: {
            eyeOpening: 3,
            verbalResponse: 4,
            motorResponse: 5,
            totalScore: 12
          },
          airwayStatus: {
            assessment: "Patent with C-spine precautions",
            airwayNotes: "Maintaining own airway, C-collar applied",
            interventions: "C-spine immobilization maintained"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Breathing spontaneously, adequate depth",
            interventions: "O2 via face mask at 10L/min as precaution"
          },
          circulationStatus: {
            assessment: "Stable",
            circulationNotes: "Laceration on scalp with active bleeding controlled",
            interventions: "Pressure dressing applied, IV line secured"
          },
          triageCategory: "EMERGENT",
          triageType: "EMERGENCY",
          triageDisposition: "Admit",
          triageDispositionOther: null,
          triageNotes: "Witnessed fall from 3-meter scaffolding. Brief LOC reported. CT scan ordered. Neurosurgery on standby.",
          triageOfficer: {
            nurseId: "RN-2025-023",
            firstName: "Carlos",
            lastName: "Mendoza"
          },
          dateOfTriage: new Date("2025-11-18T14:45:00"),
          timeOfTriage: "02:45 PM"
        }
      ]
    }
  },
  {
    patient: {
      id: "PAT-2025-003",
      name: "Elena Garcia Flores",
      firstName: "Elena",
      middleName: "Garcia",
      lastName: "Flores",
      ageSex: "67/F",
      age: "67",
      sex: "Female",
      phoneNumber: 639173334444,
      address: "789 Emilio Aguinaldo Highway, Mendez, Cavite",
      occupation: "Retired",
      currentTriageCategory: "NON_URGENT",
      status: "IN APT. QUEUE",
      lastDateOfTriage: new Date("2025-11-18T10:20:00"),
      lastTimeOfTriage: "10:20 AM",
      companion: {
        name: "Sofia Flores",
        contact: 639189998877,
        relation: "Daughter"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-18T10:00:00"),
        time: "10:00 AM",
        modeOfTransport: "private-vehicle",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "REFERRAL",
        departmentOther: "",
        referredBy: "Dr. Ramon Torres - Barangay Health Center"
      },
      triageDetails: [
        {
          chiefComplaint: "Persistent cough and low-grade fever for 5 days",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: true,
            weakness: true,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Productive cough with yellowish sputum",
          vitalSigns: {
            bloodPressure: "130/85",
            bpSystolic: "130",
            bpDiastolic: "85",
            heartRate: 78,
            respiratoryRate: 18,
            temperature: 37.8,
            oxygenSaturation: 97,
            weight: 55,
            height: 152
          },
          painAssessment: {
            scale: 2,
            location: "Throat and chest (mild)",
            duration: "5 days",
            characteristics: "Dull, intermittent discomfort",
            aggravatingFactors: "Coughing",
            relievingFactors: "Rest, warm fluids"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Clear, mild throat irritation noted",
            interventions: "None required"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Occasional productive cough, chest clear on auscultation",
            interventions: "None required"
          },
          circulationStatus: {
            assessment: "Normal",
            circulationNotes: "Adequate perfusion, no signs of distress",
            interventions: "None required"
          },
          triageCategory: "NON_URGENT",
          triageType: "WALK_IN",
          triageDisposition: "Under_obs",
          triageDispositionOther: null,
          triageNotes: "Stable patient with URI symptoms. Referred from health center for chest X-ray and complete blood count. Can wait for OPD consultation.",
          triageOfficer: {
            nurseId: "RN-2025-008",
            firstName: "Teresa",
            lastName: "Santos"
          },
          dateOfTriage: new Date("2025-11-18T10:20:00"),
          timeOfTriage: "10:20 AM"
        }
      ]
    }
  },
  {
    patient: {
      id: "PAT-2025-004",
      name: "Mark John Villanueva Reyes",
      firstName: "Mark John",
      middleName: "Villanueva",
      lastName: "Reyes",
      ageSex: "19/M",
      age: "19",
      sex: "Male",
      phoneNumber: 639275556789,
      address: "321 Gen. Trias Drive, Gen. Trias, Cavite",
      occupation: "College Student",
      currentTriageCategory: "URGENT",
      status: "REFERRED",
      lastDateOfTriage: new Date("2025-11-18T16:10:00"),
      lastTimeOfTriage: "04:10 PM",
      companion: {
        name: "Angelo Reyes",
        contact: 639181112233,
        relation: "Brother"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-18T15:55:00"),
        time: "03:55 PM",
        modeOfTransport: "transfer",
        modeOfTransportOther: "",
        transferredFrom: "Divine Mercy Medical Clinic",
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Severe abdominal pain for 4 hours",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: true,
            weakness: true,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Nausea and vomiting (3 episodes), no appetite",
          vitalSigns: {
            bloodPressure: "125/80",
            bpSystolic: "125",
            bpDiastolic: "80",
            heartRate: 98,
            respiratoryRate: 20,
            temperature: 38.5,
            oxygenSaturation: 98,
            weight: 65,
            height: 175
          },
          painAssessment: {
            scale: 9,
            location: "Right lower quadrant of abdomen",
            duration: "4 hours, progressively worsening",
            characteristics: "Sharp, constant, localized pain",
            aggravatingFactors: "Movement, pressure on area, coughing",
            relievingFactors: "Lying still on right side"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Clear, no compromise",
            interventions: "None required"
          },
          breathingStatus: {
            assessment: "Normal but guarded",
            breathingNotes: "Shallow breathing due to pain, reluctant to take deep breaths",
            interventions: "Encouraged deep breathing exercises"
          },
          circulationStatus: {
            assessment: "Normal",
            circulationNotes: "Warm extremities, adequate capillary refill",
            interventions: "IV line inserted for fluid resuscitation and medications"
          },
          triageCategory: "URGENT",
          triageType: "EMERGENCY",
          triageDisposition: "Admit",
          triageDispositionOther: null,
          triageNotes: "Classic presentation of acute appendicitis - McBurney's point tenderness positive, rebound tenderness present. NPO ordered. Surgeon notified for evaluation. CBC, urinalysis, and ultrasound requested.",
          triageOfficer: {
            nurseId: "RN-2025-031",
            firstName: "Jennifer",
            lastName: "Cruz"
          },
          dateOfTriage: new Date("2025-11-18T16:10:00"),
          timeOfTriage: "04:10 PM"
        }
      ]
    }
  }
];