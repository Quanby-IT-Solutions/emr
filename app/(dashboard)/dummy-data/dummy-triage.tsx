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
      department: "EMERGENCY" | "OPD" | "WALK_IN" | "REFERRAL" | "SCHEDULED" | "OTHER"
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
      // triageType: "EMERGENCY" | "OPD" | "WALK_IN" | "REFERRAL" | "SCHEDULED" | "OTHER"
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
      id: "PT-2025-001",
      name: "Maria Santos Cruz",
      firstName: "Maria",
      middleName: "Santos",
      lastName: "Cruz",
      ageSex: "34F",
      age: "34",
      sex: "Female",
      phoneNumber: 9171234567,
      address: "123 Barangay Poblacion, Nasugbu, Batangas",
      occupation: "Teacher",
      currentTriageCategory: "NON_URGENT",
      status: "TRANSFERRED",
      lastDateOfTriage: new Date("2025-11-17"),
      lastTimeOfTriage: "14:30",
      companion: {
        name: "Roberto Cruz",
        contact: 9178765432,
        relation: "Husband"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-17"),
        time: "14:15",
        modeOfTransport: "private-vehicle",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Severe ankle pain for 6 hours",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: true,
            weakness: true,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Nausea, vomiting",
          vitalSigns: {
            bloodPressure: "130/85",
            bpSystolic: "130",
            bpDiastolic: "85",
            heartRate: 98,
            respiratoryRate: 20,
            temperature: 38.2,
            oxygenSaturation: 97,
            weight: 58,
            height: 160
          },
          painAssessment: {
            scale: 8,
            location: "Right lower quadrant",
            duration: "6 hours",
            characteristics: "Sharp, constant",
            aggravatingFactors: "Movement, pressure",
            relievingFactors: "None"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Normal",
            interventions: "None"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Clear",
            interventions: "None"
          },
          circulationStatus: {
            assessment: "Normal",
            circulationNotes: "Good perfusion",
            interventions: "None"
          },
          triageCategory: "NON_URGENT",
          // triageType: "WALK_IN",
          triageDisposition: "Discharge",
          triageDispositionOther: null,
          triageNotes: "X-ray negative for fracture. Ankle sprain diagnosed. RICE protocol advised. Analgesics prescribed.",
          triageOfficer: {
            nurseId: "N-2025-017",
            firstName: "Sandra",
            lastName: "Villanueva"
          },
          dateOfTriage: new Date("2025-11-18"),
          timeOfTriage: "11:30"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-002",
      name: "Jose Manuel Ramos",
      firstName: "Jose",
      middleName: "Manuel",
      lastName: "Ramos",
      ageSex: "67M",
      age: "67",
      sex: "Male",
      phoneNumber: 9189876543,
      address: "456 Brgy. Wawa, Nasugbu, Batangas",
      occupation: "Retired",
      currentTriageCategory: "EMERGENT",
      status: "TRANSFERRED",
      lastDateOfTriage: new Date("2025-11-19"),
      lastTimeOfTriage: "08:45",
      companion: {
        name: "Elena Ramos",
        contact: 9171112222,
        relation: "Wife"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-19"),
        time: "08:30",
        modeOfTransport: "ambulance",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Crushing chest pain radiating to left arm, onset 30 minutes ago",
          symptoms: {
            chestPain: true,
            difficultyBreathing: true,
            fever: false,
            weakness: true,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Diaphoresis, nausea",
          vitalSigns: {
            bloodPressure: "160/95",
            bpSystolic: "160",
            bpDiastolic: "95",
            heartRate: 110,
            respiratoryRate: 24,
            temperature: 36.8,
            oxygenSaturation: 92,
            weight: 78,
            height: 172
          },
          painAssessment: {
            scale: 9,
            location: "Substernal, radiating to left arm",
            duration: "30 minutes",
            characteristics: "Crushing, pressure-like",
            aggravatingFactors: "Exertion",
            relievingFactors: "Rest (minimal)"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Clear",
            interventions: "Oxygen via nasal cannula 4L/min"
          },
          breathingStatus: {
            assessment: "Labored",
            breathingNotes: "Tachypneic, mild distress",
            interventions: "O2 supplementation"
          },
          circulationStatus: {
            assessment: "Compromised",
            circulationNotes: "Diaphoretic, cool extremities",
            interventions: "2 IV lines, cardiac monitor, 12-lead ECG done"
          },
          triageCategory: "EMERGENT",
          // triageType: "EMERGENCY",
          triageDisposition: "Admit",
          triageDispositionOther: null,
          triageNotes: "Suspected STEMI. Cardiology notified. Aspirin 300mg given.",
          triageOfficer: {
            nurseId: "N-2025-008",
            firstName: "Carlos",
            lastName: "Mendoza"
          },
          dateOfTriage: new Date("2025-11-19"),
          timeOfTriage: "08:45"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-003",
      name: "Angela Marie Flores",
      firstName: "Angela",
      middleName: "Marie",
      lastName: "Flores",
      ageSex: "28F",
      age: "28",
      sex: "Female",
      phoneNumber: 9172223333,
      address: "789 Brgy. Bilaran, Nasugbu, Batangas",
      occupation: "Nurse",
      currentTriageCategory: "NON_URGENT",
      status: "IN APT. QUEUE",
      lastDateOfTriage: new Date("2025-11-16"),
      lastTimeOfTriage: "10:20",
      companion: {
        name: "Patricia Flores",
        contact: 9183334444,
        relation: "Sister"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-16"),
        time: "10:00",
        modeOfTransport: "walk-in",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "OPD",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Mild cough and sore throat for 3 days",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: true,
            weakness: false,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Rhinorrhea, headache",
          vitalSigns: {
            bloodPressure: "110/70",
            bpSystolic: "110",
            bpDiastolic: "70",
            heartRate: 76,
            respiratoryRate: 16,
            temperature: 37.5,
            oxygenSaturation: 99,
            weight: 54,
            height: 165
          },
          painAssessment: {
            scale: 2,
            location: "Throat",
            duration: "3 days",
            characteristics: "Scratchy, mild",
            aggravatingFactors: "Swallowing",
            relievingFactors: "Warm fluids"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Clear, no distress",
            interventions: "None"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Clear lung sounds bilaterally",
            interventions: "None"
          },
          circulationStatus: {
            assessment: "Normal",
            circulationNotes: "Good perfusion",
            interventions: "None"
          },
          triageCategory: "NON_URGENT",
          // triageType: "OPD",
          triageDisposition: "Discharge",
          triageDispositionOther: null,
          triageNotes: "Upper respiratory tract infection. Prescribed antibiotics and rest.",
          triageOfficer: {
            nurseId: "N-2025-012",
            firstName: "Linda",
            lastName: "Santos"
          },
          dateOfTriage: new Date("2025-11-16"),
          timeOfTriage: "10:20"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-004",
      name: "Pedro Luis Garcia",
      firstName: "Pedro",
      middleName: "Luis",
      lastName: "Garcia",
      ageSex: "45M",
      age: "45",
      sex: "Male",
      phoneNumber: 9194445555,
      address: "234 Brgy. Calayo, Nasugbu, Batangas",
      occupation: "Construction Worker",
      currentTriageCategory: "URGENT",
      status: "REFERRED",
      lastDateOfTriage: new Date("2025-11-18"),
      lastTimeOfTriage: "16:10",
      companion: {
        name: "Ricardo Santos",
        contact: 9175556666,
        relation: "Co-worker"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-18"),
        time: "15:50",
        modeOfTransport: "private-vehicle",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Laceration on right forearm from workplace accident",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: false,
            weakness: false,
            lossOfConsciousness: false,
            bleeding: true,
            others: false
          },
          symptomsOther: "",
          vitalSigns: {
            bloodPressure: "125/80",
            bpSystolic: "125",
            bpDiastolic: "80",
            heartRate: 88,
            respiratoryRate: 18,
            temperature: 36.9,
            oxygenSaturation: 98,
            weight: 72,
            height: 170
          },
          painAssessment: {
            scale: 6,
            location: "Right forearm",
            duration: "20 minutes",
            characteristics: "Sharp, throbbing",
            aggravatingFactors: "Movement",
            relievingFactors: "Pressure"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "No issues",
            interventions: "None"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Regular",
            interventions: "None"
          },
          circulationStatus: {
            assessment: "Stable",
            circulationNotes: "Bleeding controlled with pressure dressing",
            interventions: "Pressure dressing applied, IV access"
          },
          triageCategory: "URGENT",
          // triageType: "EMERGENCY",
          triageDisposition: "Discharge",
          triageDispositionOther: null,
          triageNotes: "15cm laceration requiring sutures. Tetanus prophylaxis given. Wound cleaned and sutured.",
          triageOfficer: {
            nurseId: "N-2025-019",
            firstName: "Mark",
            lastName: "Velasco"
          },
          dateOfTriage: new Date("2025-11-18"),
          timeOfTriage: "16:10"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-005",
      name: "Carmen Rosa Diaz",
      firstName: "Carmen",
      middleName: "Rosa",
      lastName: "Diaz",
      ageSex: "52F",
      age: "52",
      sex: "Female",
      phoneNumber: 9186667777,
      address: "567 Brgy. Looc, Nasugbu, Batangas",
      occupation: "Vendor",
      currentTriageCategory: "NON_URGENT",
      status: "FOR DISCHARGE",
      lastDateOfTriage: new Date("2025-11-14"),
      lastTimeOfTriage: "09:15",
      companion: {
        name: "Sofia Diaz",
        contact: 9177778888,
        relation: "Daughter"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-14"),
        time: "09:00",
        modeOfTransport: "public-transport",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "OPD",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Follow-up for hypertension management",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: false,
            weakness: false,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Occasional headache",
          vitalSigns: {
            bloodPressure: "140/90",
            bpSystolic: "140",
            bpDiastolic: "90",
            heartRate: 80,
            respiratoryRate: 16,
            temperature: 36.6,
            oxygenSaturation: 98,
            weight: 65,
            height: 158
          },
          painAssessment: {
            scale: 1,
            location: "Head",
            duration: "Intermittent",
            characteristics: "Dull, mild",
            aggravatingFactors: "Stress",
            relievingFactors: "Rest"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Normal",
            interventions: "None"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Clear",
            interventions: "None"
          },
          circulationStatus: {
            assessment: "Normal",
            circulationNotes: "Regular pulse",
            interventions: "None"
          },
          triageCategory: "NON_URGENT",
          // triageType: "SCHEDULED",
          triageDisposition: "Discharge",
          triageDispositionOther: null,
          triageNotes: "BP slightly elevated. Medication adjusted. Advised lifestyle modifications.",
          triageOfficer: {
            nurseId: "N-2025-006",
            firstName: "Grace",
            lastName: "Bautista"
          },
          dateOfTriage: new Date("2025-11-14"),
          timeOfTriage: "09:15"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-006",
      name: "Miguel Antonio Salazar",
      firstName: "Miguel",
      middleName: "Antonio",
      lastName: "Salazar",
      ageSex: "19M",
      age: "19",
      sex: "Male",
      phoneNumber: 9198889999,
      address: "890 Brgy. Papaya, Nasugbu, Batangas",
      occupation: "Student",
      currentTriageCategory: "EMERGENT",
      status: "REFERRED",
      lastDateOfTriage: new Date("2025-11-15"),
      lastTimeOfTriage: "22:30",
      companion: {
        name: "Miguel Salazar Sr.",
        contact: 9179990000,
        relation: "Father"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-15"),
        time: "22:10",
        modeOfTransport: "ambulance",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Motorcycle accident with head trauma",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: false,
            weakness: true,
            lossOfConsciousness: true,
            bleeding: true,
            others: true
          },
          symptomsOther: "Dizziness, confusion",
          vitalSigns: {
            bloodPressure: "135/88",
            bpSystolic: "135",
            bpDiastolic: "88",
            heartRate: 95,
            respiratoryRate: 22,
            temperature: 37.0,
            oxygenSaturation: 95,
            weight: 68,
            height: 175
          },
          painAssessment: {
            scale: 7,
            location: "Head, right shoulder",
            duration: "30 minutes",
            characteristics: "Throbbing, aching",
            aggravatingFactors: "Movement, light",
            relievingFactors: "None"
          },
          glasgowComaScale: {
            eyeOpening: 3,
            verbalResponse: 4,
            motorResponse: 6,
            totalScore: 13
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "C-spine immobilized",
            interventions: "Cervical collar in place"
          },
          breathingStatus: {
            assessment: "Adequate",
            breathingNotes: "Slightly tachypneic",
            interventions: "O2 via face mask 6L/min"
          },
          circulationStatus: {
            assessment: "Stable",
            circulationNotes: "Scalp laceration, abrasions on right side",
            interventions: "IV access, bleeding controlled"
          },
          triageCategory: "EMERGENT",
          // triageType: "EMERGENCY",
          triageDisposition: "Admit",
          triageDispositionOther: null,
          triageNotes: "GCS 13. Head CT ordered. Possible concussion. Trauma team activated.",
          triageOfficer: {
            nurseId: "N-2025-022",
            firstName: "Jennifer",
            lastName: "Cruz"
          },
          dateOfTriage: new Date("2025-11-15"),
          timeOfTriage: "22:30"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-007",
      name: "Rosario Luz Torres",
      firstName: "Rosario",
      middleName: "Luz",
      lastName: "Torres",
      ageSex: "71F",
      age: "71",
      sex: "Female",
      phoneNumber: 9170001111,
      address: "345 Brgy. Bucana, Nasugbu, Batangas",
      occupation: "Retired",
      currentTriageCategory: "DEAD",
      status: "OTHER",
      lastDateOfTriage: new Date("2025-11-13"),
      lastTimeOfTriage: "03:45",
      companion: {
        name: "Luis Torres",
        contact: 9181112222,
        relation: "Son"
      },
      arrivalDetails: {
        arrivalStatus: "dead-on-arrival",
        date: new Date("2025-11-13"),
        time: "03:30",
        modeOfTransport: "ambulance",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Found unresponsive at home, CPR in progress",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: false,
            weakness: false,
            lossOfConsciousness: true,
            bleeding: false,
            others: false
          },
          symptomsOther: "",
          vitalSigns: {
            bloodPressure: "0/0",
            bpSystolic: "0",
            bpDiastolic: "0",
            heartRate: 0,
            respiratoryRate: 0,
            temperature: 35.2,
            oxygenSaturation: 0,
            weight: 62,
            height: 155
          },
          painAssessment: {
            scale: 0,
            location: "N/A",
            duration: "N/A",
            characteristics: "N/A",
            aggravatingFactors: "N/A",
            relievingFactors: "N/A"
          },
          glasgowComaScale: {
            eyeOpening: 1,
            verbalResponse: 1,
            motorResponse: 1,
            totalScore: 3
          },
          airwayStatus: {
            assessment: "No spontaneous breathing",
            airwayNotes: "Intubation attempted",
            interventions: "Advanced airway management"
          },
          breathingStatus: {
            assessment: "Absent",
            breathingNotes: "No respiratory effort",
            interventions: "Bag-valve-mask ventilation"
          },
          circulationStatus: {
            assessment: "Cardiac arrest",
            circulationNotes: "No pulse, asystole on monitor",
            interventions: "CPR performed for 45 minutes, multiple epinephrine doses"
          },
          triageCategory: "DEAD",
          // triageType: "EMERGENCY",
          triageDisposition: "Died",
          triageDispositionOther: null,
          triageNotes: "Resuscitation efforts ceased at 04:15. Time of death declared. Family notified.",
          triageOfficer: {
            nurseId: "N-2025-004",
            firstName: "Ramon",
            lastName: "Alvarez"
          },
          dateOfTriage: new Date("2025-11-13"),
          timeOfTriage: "03:45"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-008",
      name: "Isabella Marie Gonzales",
      firstName: "Isabella",
      middleName: "Marie",
      lastName: "Gonzales",
      ageSex: "8F",
      age: "8",
      sex: "Female",
      phoneNumber: 9192223333,
      address: "678 Brgy. Aga, Nasugbu, Batangas",
      occupation: "Student",
      currentTriageCategory: "URGENT",
      status: "TRANSFERRED",
      lastDateOfTriage: new Date("2025-11-17"),
      lastTimeOfTriage: "19:20",
      companion: {
        name: "Ana Gonzales",
        contact: 9183334444,
        relation: "Mother"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-17"),
        time: "19:00",
        modeOfTransport: "private-vehicle",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "High fever with difficulty breathing for 2 days",
          symptoms: {
            chestPain: false,
            difficultyBreathing: true,
            fever: true,
            weakness: true,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Persistent cough, decreased appetite",
          vitalSigns: {
            bloodPressure: "95/60",
            bpSystolic: "95",
            bpDiastolic: "60",
            heartRate: 125,
            respiratoryRate: 32,
            temperature: 39.5,
            oxygenSaturation: 90,
            weight: 25,
            height: 128
          },
          painAssessment: {
            scale: 4,
            location: "Chest",
            duration: "2 days",
            characteristics: "Tight, uncomfortable",
            aggravatingFactors: "Coughing, deep breathing",
            relievingFactors: "Sitting up"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Audible wheezing",
            interventions: "None initially"
          },
          breathingStatus: {
            assessment: "Labored",
            breathingNotes: "Tachypneic, intercostal retractions, wheezing",
            interventions: "O2 via nasal cannula 3L/min, nebulization started"
          },
          circulationStatus: {
            assessment: "Adequate",
            circulationNotes: "Warm, flushed due to fever",
            interventions: "IV access for fluids and medications"
          },
          triageCategory: "URGENT",
          // triageType: "EMERGENCY",
          triageDisposition: "Admit",
          triageDispositionOther: null,
          triageNotes: "Suspected pneumonia. Chest X-ray ordered. Pediatrics consulted. Antipyretics and antibiotics started.",
          triageOfficer: {
            nurseId: "N-2025-010",
            firstName: "Maria",
            lastName: "Alonzo"
          },
          dateOfTriage: new Date("2025-11-17"),
          timeOfTriage: "19:20"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-009",
      name: "Fernando Jose Aquino",
      firstName: "Fernando",
      middleName: "Jose",
      lastName: "Aquino",
      ageSex: "41M",
      age: "41",
      sex: "Male",
      phoneNumber: 9174445555,
      address: "912 Brgy. Mataas na Pulo, Nasugbu, Batangas",
      occupation: "Driver",
      currentTriageCategory: "NON_URGENT",
      status: "FOR DISCHARGE",
      lastDateOfTriage: new Date("2025-11-18"),
      lastTimeOfTriage: "11:30",
      companion: {
        name: "Gloria Aquino",
        contact: 9185556666,
        relation: "Wife"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-18"),
        time: "11:10",
        modeOfTransport: "walk-in",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "WALK_IN",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Ankle sprain from slipping yesterday",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: false,
            weakness: false,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Swelling, limited mobility",
          vitalSigns: {
            bloodPressure: "120/78",
            bpSystolic: "120",
            bpDiastolic: "78",
            heartRate: 72,
            respiratoryRate: 16,
            temperature: 36.7,
            oxygenSaturation: 99,
            weight: 70,
            height: 168
          },
          painAssessment: {
            scale: 5,
            location: "Left ankle",
            duration: "24 hours",
            characteristics: "Aching, throbbing",
            aggravatingFactors: "Weight bearing, movement",
            relievingFactors: "Rest, elevation, ice"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Normal",
            interventions: "Noney"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Clear",
            interventions: "None"
          },
          circulationStatus: {
            assessment: "Normal",
            circulationNotes: "Good perfusion",
            interventions: "None"
          },
          triageCategory: "NON_URGENT",
          // triageType: "EMERGENCY",
          triageDisposition: "Discharge",
          triageDispositionOther: null,
          triageNotes: "Ankle sprain. X-ray ordered. Antipyretics and antibiotics started.",
          triageOfficer: {
            nurseId: "N-2025-010",
            firstName: "Maria",
            lastName: "Alonzo"
          },
          dateOfTriage: new Date("2025-11-18"),
          timeOfTriage: "11:30"
        }
      ]
    },
  },
  {
    patient: {
      id: "PT-2025-010",
      name: "Daniel Ramon Pascual",
      firstName: "Daniel",
      middleName: "Ramon",
      lastName: "Pascual",
      ageSex: "55M",
      age: "55",
      sex: "Male",
      phoneNumber: 9196667777,
      address: "234 Brgy. Catandaan, Nasugbu, Batangas",
      occupation: "Fisherman",
      currentTriageCategory: "URGENT",
      status: "TRANSFERRED",
      lastDateOfTriage: new Date("2025-11-16"),
      lastTimeOfTriage: "06:15",
      companion: {
        name: "Marco Pascual",
        contact: 9187778888,
        relation: "Brother"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-16"),
        time: "05:50",
        modeOfTransport: "private-vehicle",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Severe shortness of breath and coughing up blood",
          symptoms: {
            chestPain: true,
            difficultyBreathing: true,
            fever: false,
            weakness: true,
            lossOfConsciousness: false,
            bleeding: true,
            others: false
          },
          symptomsOther: "",
          vitalSigns: {
            bloodPressure: "145/92",
            bpSystolic: "145",
            bpDiastolic: "92",
            heartRate: 105,
            respiratoryRate: 28,
            temperature: 37.2,
            oxygenSaturation: 88,
            weight: 68,
            height: 165
          },
          painAssessment: {
            scale: 7,
            location: "Chest, bilateral",
            duration: "2 hours",
            characteristics: "Sharp, pleuritic",
            aggravatingFactors: "Deep breathing, coughing",
            relievingFactors: "Sitting upright"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Blood-tinged sputum present",
            interventions: "Suctioning as needed"
          },
          breathingStatus: {
            assessment: "Severely compromised",
            breathingNotes: "Marked dyspnea, decreased breath sounds right base",
            interventions: "High-flow O2 via non-rebreather mask 15L/min"
          },
          circulationStatus: {
            assessment: "Adequate",
            circulationNotes: "Tachycardic, anxious",
            interventions: "IV access established"
          },
          triageCategory: "URGENT",
          // triageType: "EMERGENCY",
          triageDisposition: "Admit",
          triageDispositionOther: null,
          triageNotes: "Suspected pulmonary embolism or pneumothorax. Chest X-ray and CT angiography ordered. Pulmonology consulted.",
          triageOfficer: {
            nurseId: "N-2025-003",
            firstName: "Roberto",
            lastName: "Fernandez"
          },
          dateOfTriage: new Date("2025-11-16"),
          timeOfTriage: "06:15"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-011",
      name: "Katerina Joy Morales",
      firstName: "Katerina",
      middleName: "Joy",
      lastName: "Morales",
      ageSex: "23F",
      age: "23",
      sex: "Female",
      phoneNumber: 9178889999,
      address: "567 Brgy. Kayrilaw, Nasugbu, Batangas",
      occupation: "Call Center Agent",
      currentTriageCategory: "NON_URGENT",
      status: "FOR DISCHARGE",
      lastDateOfTriage: new Date("2025-11-19"),
      lastTimeOfTriage: "13:45",
      companion: {
        name: "Jessica Morales",
        contact: 9189990000,
        relation: "Sister"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-19"),
        time: "13:30",
        modeOfTransport: "walk-in",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "OPD",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Urinary tract infection symptoms for 2 days",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: true,
            weakness: false,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Dysuria, frequency, urgency",
          vitalSigns: {
            bloodPressure: "115/72",
            bpSystolic: "115",
            bpDiastolic: "72",
            heartRate: 82,
            respiratoryRate: 16,
            temperature: 37.8,
            oxygenSaturation: 99,
            weight: 56,
            height: 162
          },
          painAssessment: {
            scale: 4,
            location: "Suprapubic area",
            duration: "2 days",
            characteristics: "Burning, cramping",
            aggravatingFactors: "Urination",
            relievingFactors: "Fluids"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Normal",
            interventions: "None"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Clear",
            interventions: "None"
          },
          circulationStatus: {
            assessment: "Normal",
            circulationNotes: "Good perfusion",
            interventions: "None"
          },
          triageCategory: "NON_URGENT",
          // triageType: "OPD",
          triageDisposition: "Discharge",
          triageDispositionOther: null,
          triageNotes: "UTI confirmed. Urinalysis done. Antibiotics prescribed. Advised increased fluid intake.",
          triageOfficer: {
            nurseId: "N-2025-020",
            firstName: "Melissa",
            lastName: "Santiago"
          },
          dateOfTriage: new Date("2025-11-19"),
          timeOfTriage: "13:45"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-012",
      name: "Antonio Manuel Reyes",
      firstName: "Antonio",
      middleName: "Manuel",
      lastName: "Reyes",
      ageSex: "38M",
      age: "38",
      sex: "Male",
      phoneNumber: 9160001111,
      address: "890 Brgy. Bulihan, Nasugbu, Batangas",
      occupation: "Electrician",
      currentTriageCategory: "EMERGENT",
      status: "REFERRED",
      lastDateOfTriage: new Date("2025-11-14"),
      lastTimeOfTriage: "17:40",
      companion: {
        name: "Rosa Reyes",
        contact: 9171112222,
        relation: "Wife"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-14"),
        time: "17:25",
        modeOfTransport: "ambulance",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Electrical burn injury to hands and chest",
          symptoms: {
            chestPain: true,
            difficultyBreathing: false,
            fever: false,
            weakness: true,
            lossOfConsciousness: true,
            bleeding: false,
            others: true
          },
          symptomsOther: "Burns, confusion",
          vitalSigns: {
            bloodPressure: "155/98",
            bpSystolic: "155",
            bpDiastolic: "98",
            heartRate: 118,
            respiratoryRate: 22,
            temperature: 37.1,
            oxygenSaturation: 94,
            weight: 75,
            height: 173
          },
          painAssessment: {
            scale: 9,
            location: "Both hands, anterior chest",
            duration: "15 minutes",
            characteristics: "Severe burning",
            aggravatingFactors: "Touch, movement",
            relievingFactors: "None"
          },
          glasgowComaScale: {
            eyeOpening: 3,
            verbalResponse: 4,
            motorResponse: 5,
            totalScore: 12
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "No inhalation injury apparent",
            interventions: "O2 via nasal cannula"
          },
          breathingStatus: {
            assessment: "Adequate",
            breathingNotes: "Mild tachypnea",
            interventions: "Supplemental oxygen"
          },
          circulationStatus: {
            assessment: "Compromised",
            circulationNotes: "2nd and 3rd degree burns to hands and chest, approximately 12% TBSA",
            interventions: "Two large bore IVs, fluid resuscitation initiated, cardiac monitoring"
          },
          triageCategory: "EMERGENT",
          // triageType: "EMERGENCY",
          triageDisposition: "Admit",
          triageDispositionOther: null,
          triageNotes: "High voltage electrical injury. Burn unit consulted. ECG shows sinus tachycardia. Fluid resuscitation per Parkland formula started.",
          triageOfficer: {
            nurseId: "N-2025-007",
            firstName: "Patricia",
            lastName: "Dela Cruz"
          },
          dateOfTriage: new Date("2025-11-14"),
          timeOfTriage: "17:40"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-013",
      name: "Sophia Anne Castillo",
      firstName: "Sophia",
      middleName: "Anne",
      lastName: "Castillo",
      ageSex: "15F",
      age: "15",
      sex: "Female",
      phoneNumber: 9182223333,
      address: "123 Brgy. Kaylaway, Nasugbu, Batangas",
      occupation: "Student",
      currentTriageCategory: "NON_URGENT",
      status: "FOR DISCHARGE",
      lastDateOfTriage: new Date("2025-11-15"),
      lastTimeOfTriage: "14:50",
      companion: {
        name: "Margaret Castillo",
        contact: 9193334444,
        relation: "Mother"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-15"),
        time: "14:35",
        modeOfTransport: "private-vehicle",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "WALK_IN",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Allergic reaction with rash after eating seafood",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: false,
            weakness: false,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Itching, urticaria",
          vitalSigns: {
            bloodPressure: "105/68",
            bpSystolic: "105",
            bpDiastolic: "68",
            heartRate: 78,
            respiratoryRate: 16,
            temperature: 36.8,
            oxygenSaturation: 99,
            weight: 48,
            height: 158
          },
          painAssessment: {
            scale: 2,
            location: "Generalized skin",
            duration: "1 hour",
            characteristics: "Itchy, uncomfortable",
            aggravatingFactors: "Scratching",
            relievingFactors: "Cool compress"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "No swelling",
            interventions: "None"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "No wheezing or distress",
            interventions: "None"
          },
          circulationStatus: {
            assessment: "Normal",
            circulationNotes: "Urticarial rash on trunk and extremities",
            interventions: "None"
          },
          triageCategory: "NON_URGENT",
          // triageType: "WALK_IN",
          triageDisposition: "Discharge",
          triageDispositionOther: null,
          triageNotes: "Mild allergic reaction. Antihistamine administered. Advised to avoid seafood. EpiPen prescription given.",
          triageOfficer: {
            nurseId: "N-2025-014",
            firstName: "Diana",
            lastName: "Lopez"
          },
          dateOfTriage: new Date("2025-11-15"),
          timeOfTriage: "14:50"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-014",
      name: "Rafael Luis Mendoza",
      firstName: "Rafael",
      middleName: "Luis",
      lastName: "Mendoza",
      ageSex: "62M",
      age: "62",
      sex: "Male",
      phoneNumber: 9174445555,
      address: "456 Brgy. Maugat, Nasugbu, Batangas",
      occupation: "Farmer",
      currentTriageCategory: "URGENT",
      status: "REFERRED",
      lastDateOfTriage: new Date("2025-11-13"),
      lastTimeOfTriage: "11:20",
      companion: {
        name: "Carla Mendoza",
        contact: 9185556666,
        relation: "Daughter"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-13"),
        time: "11:00",
        modeOfTransport: "transfer",
        modeOfTransportOther: "",
        transferredFrom: "Lian Rural Health Unit",
        department: "REFERRAL",
        departmentOther: "",
        referredBy: "Dr. Emma Rodriguez"
      },
      triageDetails: [
        {
          chiefComplaint: "Diabetic foot ulcer with signs of infection",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: true,
            weakness: true,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Foul-smelling discharge from wound",
          vitalSigns: {
            bloodPressure: "150/88",
            bpSystolic: "150",
            bpDiastolic: "88",
            heartRate: 92,
            respiratoryRate: 18,
            temperature: 38.7,
            oxygenSaturation: 96,
            weight: 82,
            height: 168
          },
          painAssessment: {
            scale: 7,
            location: "Right foot",
            duration: "1 week",
            characteristics: "Throbbing, constant",
            aggravatingFactors: "Weight bearing, touch",
            relievingFactors: "Elevation"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Normal",
            interventions: "None"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Clear",
            interventions: "None"
          },
          circulationStatus: {
            assessment: "Compromised",
            circulationNotes: "Infected ulcer right foot dorsum, 4x5cm, purulent drainage, surrounding erythema",
            interventions: "IV access, antibiotics initiated"
          },
          triageCategory: "URGENT",
          // triageType: "REFERRAL",
          triageDisposition: "Admit",
          triageDispositionOther: null,
          triageNotes: "Diabetic foot infection Grade 3. Wound culture sent. IV antibiotics started. Surgery consult for possible debridement.",
          triageOfficer: {
            nurseId: "N-2025-011",
            firstName: "Teresa",
            lastName: "Ramos"
          },
          dateOfTriage: new Date("2025-11-13"),
          timeOfTriage: "11:20"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-015",
      name: "Cristina Mae Vera",
      firstName: "Cristina",
      middleName: "Mae",
      lastName: "Vera",
      ageSex: "29F",
      age: "29",
      sex: "Female",
      phoneNumber: 9196667777,
      address: "789 Brgy. Banilad, Nasugbu, Batangas",
      occupation: "Secretary",
      currentTriageCategory: "EMERGENT",
      status: "REFERRED",
      lastDateOfTriage: new Date("2025-11-18"),
      lastTimeOfTriage: "20:15",
      companion: {
        name: "Michael Vera",
        contact: 9187778888,
        relation: "Husband"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-18"),
        time: "20:00",
        modeOfTransport: "ambulance",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Sudden severe headache with vomiting - worst headache of life",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: false,
            weakness: false,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Photophobia, neck stiffness, vomiting",
          vitalSigns: {
            bloodPressure: "165/100",
            bpSystolic: "165",
            bpDiastolic: "100",
            heartRate: 88,
            respiratoryRate: 20,
            temperature: 37.0,
            oxygenSaturation: 98,
            weight: 60,
            height: 163
          },
          painAssessment: {
            scale: 10,
            location: "Entire head, worse occipital",
            duration: "45 minutes",
            characteristics: "Sudden onset, thunderclap, worst ever",
            aggravatingFactors: "Light, movement",
            relievingFactors: "None"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Clear",
            interventions: "None"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Regular",
            interventions: "None"
          },
          circulationStatus: {
            assessment: "Stable",
            circulationNotes: "Hypertensive, alert but in severe distress",
            interventions: "IV access, anti-hypertensives given"
          },
          triageCategory: "EMERGENT",
          // triageType: "EMERGENCY",
          triageDisposition: "Admit",
          triageDispositionOther: null,
          triageNotes: "Suspected subarachnoid hemorrhage. Neurology emergency. CT brain ordered STAT. NPO. Seizure precautions.",
          triageOfficer: {
            nurseId: "N-2025-002",
            firstName: "Benjamin",
            lastName: "Castro"
          },
          dateOfTriage: new Date("2025-11-18"),
          timeOfTriage: "20:15"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-016",
      name: "Lucas Gabriel Soriano",
      firstName: "Lucas",
      middleName: "Gabriel",
      lastName: "Soriano",
      ageSex: "5M",
      age: "5",
      sex: "Male",
      phoneNumber: 9178889999,
      address: "321 Brgy. Malapad na Parang, Nasugbu, Batangas",
      occupation: "Child",
      currentTriageCategory: "NON_URGENT",
      status: "FOR DISCHARGE",
      lastDateOfTriage: new Date("2025-11-17"),
      lastTimeOfTriage: "10:40",
      companion: {
        name: "Julia Soriano",
        contact: 9189990000,
        relation: "Mother"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-17"),
        time: "10:25",
        modeOfTransport: "walk-in",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "OPD",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Minor cuts on knee from playground fall",
          symptoms: {
            chestPain: false,
            difficultyBreathing: false,
            fever: false,
            weakness: false,
            lossOfConsciousness: false,
            bleeding: true,
            others: false
          },
          symptomsOther: "",
          vitalSigns: {
            bloodPressure: "90/55",
            bpSystolic: "90",
            bpDiastolic: "55",
            heartRate: 100,
            respiratoryRate: 22,
            temperature: 36.5,
            oxygenSaturation: 99,
            weight: 18,
            height: 110
          },
          painAssessment: {
            scale: 3,
            location: "Right knee",
            duration: "30 minutes",
            characteristics: "Stinging",
            aggravatingFactors: "Bending knee",
            relievingFactors: "Keeping still"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "Normal",
            interventions: "None"
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Clear",
            interventions: "None"
          },
          circulationStatus: {
            assessment: "Normal",
            circulationNotes: "Minor abrasions, bleeding controlled",
            interventions: "Wound cleaned"
          },
          triageCategory: "NON_URGENT",
          // triageType: "WALK_IN",
          triageDisposition: "Discharge",
          triageDispositionOther: null,
          triageNotes: "Superficial abrasions. Wound cleaned and dressed. Tetanus status up to date. Home care instructions given to mother.",
          triageOfficer: {
            nurseId: "N-2025-018",
            firstName: "Michelle",
            lastName: "Garcia"
          },
          dateOfTriage: new Date("2025-11-17"),
          timeOfTriage: "10:40"
        }
      ]
    }
  },
  {
    patient: {
      id: "PT-2025-017",
      name: "Victoria Rose Ignacio",
      firstName: "Victoria",
      middleName: "Rose",
      lastName: "Ignacio",
      ageSex: "47F",
      age: "47",
      sex: "Female",
      phoneNumber: 9160001111,
      address: "654 Brgy. Natipuan, Nasugbu, Batangas",
      occupation: "Business Owner",
      currentTriageCategory: "URGENT",
      status: "TRANSFERRED",
      lastDateOfTriage: new Date("2025-11-19"),
      lastTimeOfTriage: "15:30",
      companion: {
        name: "Martin Ignacio",
        contact: 9171112222,
        relation: "Husband"
      },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date("2025-11-19"),
        time: "15:10",
        modeOfTransport: "private-vehicle",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: "EMERGENCY",
        departmentOther: "",
        referredBy: null
      },
      triageDetails: [
        {
          chiefComplaint: "Severe allergic reaction with facial swelling and difficulty swallowing",
          symptoms: {
            chestPain: false,
            difficultyBreathing: true,
            fever: false,
            weakness: false,
            lossOfConsciousness: false,
            bleeding: false,
            others: true
          },
          symptomsOther: "Throat tightness, tongue swelling, generalized urticaria",
          vitalSigns: {
            bloodPressure: "100/65",
            bpSystolic: "100",
            bpDiastolic: "65",
            heartRate: 115,
            respiratoryRate: 26,
            temperature: 37.1,
            oxygenSaturation: 93,
            weight: 63,
            height: 160
          },
          painAssessment: {
            scale: 5,
            location: "Throat",
            duration: "20 minutes",
            characteristics: "Tight, constricting",
            aggravatingFactors: "Swallowing",
            relievingFactors: "None"
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15
          },
          airwayStatus: {
            assessment: "Partially compromised",
            airwayNotes: "Tongue and lip swelling, stridor absent",
            interventions: "Prepared for intubation if needed"
          },
          breathingStatus: {
            assessment: "Labored",
            breathingNotes: "Tachypneic, anxious",
            interventions: "O2 via face mask 10L/min"
          },
          circulationStatus: {
            assessment: "Adequate",
            circulationNotes: "Tachycardic, BP low-normal",
            interventions: "IV access, epinephrine 0.3mg IM given, IV fluids running"
          },
          triageCategory: "URGENT",
          // triageType: "EMERGENCY",
          triageDisposition: "Under_obs",
          triageDispositionOther: null,
          triageNotes: "Anaphylaxis to unknown allergen. Epinephrine given with good response. IV steroids and antihistamines administered. Observation for 4-6 hours.",
          triageOfficer: {
            nurseId: "N-2025-005",
            firstName: "Angela",
            lastName: "Miranda"
          },
          dateOfTriage: new Date("2025-11-19"),
          timeOfTriage: "15:30"
        }
      ]
    }
  }
]