// ─── Lab Tech Dummy Data ─────────────────────────────────────────────────────

// ─── Enums / Constants ───────────────────────────────────────────────────────

export const LabOrderStatus = {
  PLACED: "PLACED",
  COLLECTED: "COLLECTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CORRECTED: "CORRECTED",
  CANCELLED: "CANCELLED",
} as const
export type LabOrderStatus = (typeof LabOrderStatus)[keyof typeof LabOrderStatus]

export const LabPriority = {
  STAT: "STAT",
  URGENT: "URGENT",
  ROUTINE: "ROUTINE",
} as const
export type LabPriority = (typeof LabPriority)[keyof typeof LabPriority]

export const SpecimenCondition = {
  SATISFACTORY: "Satisfactory",
  HEMOLYZED: "Hemolyzed",
  LIPEMIC: "Lipemic",
  ICTERIC: "Icteric",
  CLOTTED: "Clotted",
  INSUFFICIENT: "Insufficient Quantity",
} as const
export type SpecimenCondition = (typeof SpecimenCondition)[keyof typeof SpecimenCondition]

export const ResultFlag = {
  NORMAL: "Normal",
  ABNORMAL: "Abnormal",
  CRITICAL: "Critical",
} as const
export type ResultFlag = (typeof ResultFlag)[keyof typeof ResultFlag]

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface LabAnalyte {
  id: string
  name: string
  value: string
  unit: string
  referenceRange: string
  flag: ResultFlag
  previousValue?: string
  correctedFrom?: string
  correctionReason?: string
}

export interface LabResult {
  panelName: string
  analytes: LabAnalyte[]
  enteredBy: string
  enteredAt: string
  validatedBy?: string
  validatedAt?: string
  techNotes?: string
}

export interface LabOrder {
  id: string
  patient: {
    id: string
    name: string
    mrn: string
    dob: string
    gender: string
  }
  testPanel: string
  specimenType: string
  priority: LabPriority
  status: LabOrderStatus
  orderedBy: string
  orderedAt: string
  collectedAt?: string
  collectedBy?: string
  specimenCondition?: SpecimenCondition
  results?: LabResult
  completedAt?: string
  encounterType: string
}

export interface LabPatient {
  id: string
  name: string
  mrn: string
  dob: string
  gender: string
  recentOrderCount: number
  lastLabDate: string
  activeOrders: number
  criticalCount: number
}

export interface CriticalValueLog {
  id: string
  patient: string
  mrn: string
  test: string
  value: string
  unit: string
  flag: ResultFlag
  notifiedClinician: string
  acknowledged: boolean
  acknowledgedAt?: string
  resultedAt: string
}

export interface TATEntry {
  id: string
  patient: string
  testPanel: string
  orderedAt: string
  collectedAt: string
  resultedAt: string
  tatMinutes: number
  targetMinutes: number
  withinTarget: boolean
  priority: LabPriority
}

export interface TestVolume {
  testPanel: string
  today: number
  thisWeek: number
  thisMonth: number
  criticalRate: string
}

// ─── Mock Lab Orders ─────────────────────────────────────────────────────────

export const labOrders: LabOrder[] = [
  {
    id: "LO-001",
    patient: { id: "P001", name: "John Smith", mrn: "MRN-001234", dob: "1985-03-12", gender: "Male" },
    testPanel: "Complete Blood Count (CBC)",
    specimenType: "Whole Blood (EDTA)",
    priority: "STAT",
    status: "PLACED",
    orderedBy: "Dr. Sarah Chen",
    orderedAt: "2026-04-09 06:30",
    encounterType: "EMERGENCY",
  },
  {
    id: "LO-002",
    patient: { id: "P002", name: "Maria Garcia", mrn: "MRN-001235", dob: "1992-07-25", gender: "Female" },
    testPanel: "Basic Metabolic Panel (BMP)",
    specimenType: "Serum (SST)",
    priority: "URGENT",
    status: "PLACED",
    orderedBy: "Dr. James Wilson",
    orderedAt: "2026-04-09 07:00",
    encounterType: "INPATIENT",
  },
  {
    id: "LO-003",
    patient: { id: "P003", name: "David Anderson", mrn: "MRN-001236", dob: "1978-11-02", gender: "Male" },
    testPanel: "Coagulation Panel",
    specimenType: "Citrated Plasma",
    priority: "STAT",
    status: "COLLECTED",
    orderedBy: "Dr. Sarah Chen",
    orderedAt: "2026-04-09 05:45",
    collectedAt: "2026-04-09 06:15",
    collectedBy: "Tech. R. Martinez",
    specimenCondition: "Satisfactory",
    encounterType: "EMERGENCY",
  },
  {
    id: "LO-004",
    patient: { id: "P004", name: "Sophia Nguyen", mrn: "MRN-001237", dob: "1998-01-30", gender: "Female" },
    testPanel: "Liver Function Tests (LFT)",
    specimenType: "Serum (SST)",
    priority: "ROUTINE",
    status: "COLLECTED",
    orderedBy: "Dr. Michael Park",
    orderedAt: "2026-04-08 22:00",
    collectedAt: "2026-04-09 06:00",
    collectedBy: "Tech. A. Johnson",
    specimenCondition: "Satisfactory",
    encounterType: "INPATIENT",
  },
  {
    id: "LO-005",
    patient: { id: "P005", name: "Michael Brown", mrn: "MRN-001238", dob: "1990-09-18", gender: "Male" },
    testPanel: "Complete Blood Count (CBC)",
    specimenType: "Whole Blood (EDTA)",
    priority: "ROUTINE",
    status: "IN_PROGRESS",
    orderedBy: "Dr. Emily Torres",
    orderedAt: "2026-04-09 04:00",
    collectedAt: "2026-04-09 05:30",
    collectedBy: "Tech. R. Martinez",
    specimenCondition: "Satisfactory",
    encounterType: "OUTPATIENT",
  },
  {
    id: "LO-006",
    patient: { id: "P006", name: "Emily Wong", mrn: "MRN-001239", dob: "1983-05-10", gender: "Female" },
    testPanel: "Urinalysis",
    specimenType: "Clean-Catch Urine",
    priority: "ROUTINE",
    status: "IN_PROGRESS",
    orderedBy: "Dr. James Wilson",
    orderedAt: "2026-04-09 03:00",
    collectedAt: "2026-04-09 04:00",
    collectedBy: "Tech. A. Johnson",
    specimenCondition: "Satisfactory",
    encounterType: "OUTPATIENT",
  },
  {
    id: "LO-007",
    patient: { id: "P007", name: "Daniel Kim", mrn: "MRN-001240", dob: "1988-12-05", gender: "Male" },
    testPanel: "Basic Metabolic Panel (BMP)",
    specimenType: "Serum (SST)",
    priority: "URGENT",
    status: "IN_PROGRESS",
    orderedBy: "Dr. Sarah Chen",
    orderedAt: "2026-04-09 06:00",
    collectedAt: "2026-04-09 06:30",
    collectedBy: "Tech. R. Martinez",
    specimenCondition: "Hemolyzed",
    encounterType: "EMERGENCY",
  },
  {
    id: "LO-008",
    patient: { id: "P008", name: "Olivia Chen", mrn: "MRN-001241", dob: "1995-06-15", gender: "Female" },
    testPanel: "Thyroid Panel",
    specimenType: "Serum (SST)",
    priority: "ROUTINE",
    status: "COMPLETED",
    orderedBy: "Dr. Michael Park",
    orderedAt: "2026-04-08 10:00",
    collectedAt: "2026-04-08 10:30",
    collectedBy: "Tech. A. Johnson",
    specimenCondition: "Satisfactory",
    completedAt: "2026-04-08 14:00",
    encounterType: "OUTPATIENT",
    results: {
      panelName: "Thyroid Panel",
      analytes: [
        { id: "A001", name: "TSH", value: "4.8", unit: "mIU/L", referenceRange: "0.4–4.0", flag: "Abnormal" },
        { id: "A002", name: "Free T4", value: "0.9", unit: "ng/dL", referenceRange: "0.8–1.8", flag: "Normal" },
        { id: "A003", name: "Free T3", value: "2.5", unit: "pg/mL", referenceRange: "2.3–4.2", flag: "Normal" },
      ],
      enteredBy: "Tech. A. Johnson",
      enteredAt: "2026-04-08 13:30",
      validatedBy: "Tech. R. Martinez",
      validatedAt: "2026-04-08 14:00",
      techNotes: "Mildly elevated TSH. Recommend clinical correlation.",
    },
  },
  {
    id: "LO-009",
    patient: { id: "P001", name: "John Smith", mrn: "MRN-001234", dob: "1985-03-12", gender: "Male" },
    testPanel: "Basic Metabolic Panel (BMP)",
    specimenType: "Serum (SST)",
    priority: "STAT",
    status: "COMPLETED",
    orderedBy: "Dr. Sarah Chen",
    orderedAt: "2026-04-08 18:00",
    collectedAt: "2026-04-08 18:15",
    collectedBy: "Tech. R. Martinez",
    specimenCondition: "Satisfactory",
    completedAt: "2026-04-08 19:30",
    encounterType: "EMERGENCY",
    results: {
      panelName: "Basic Metabolic Panel (BMP)",
      analytes: [
        { id: "A010", name: "Sodium", value: "128", unit: "mEq/L", referenceRange: "136–145", flag: "Critical", previousValue: "140" },
        { id: "A011", name: "Potassium", value: "5.6", unit: "mEq/L", referenceRange: "3.5–5.0", flag: "Critical", previousValue: "4.2" },
        { id: "A012", name: "Chloride", value: "100", unit: "mEq/L", referenceRange: "98–106", flag: "Normal" },
        { id: "A013", name: "CO2", value: "22", unit: "mEq/L", referenceRange: "23–29", flag: "Abnormal" },
        { id: "A014", name: "BUN", value: "32", unit: "mg/dL", referenceRange: "7–20", flag: "Abnormal", previousValue: "18" },
        { id: "A015", name: "Creatinine", value: "2.1", unit: "mg/dL", referenceRange: "0.7–1.3", flag: "Critical", previousValue: "1.0" },
        { id: "A016", name: "Glucose", value: "95", unit: "mg/dL", referenceRange: "70–100", flag: "Normal" },
        { id: "A017", name: "Calcium", value: "8.8", unit: "mg/dL", referenceRange: "8.5–10.5", flag: "Normal" },
      ],
      enteredBy: "Tech. R. Martinez",
      enteredAt: "2026-04-08 19:15",
      validatedBy: "Tech. A. Johnson",
      validatedAt: "2026-04-08 19:30",
      techNotes: "CRITICAL: Na 128, K 5.6, Cr 2.1 — Clinician Dr. Chen notified at 19:20.",
    },
  },
  {
    id: "LO-010",
    patient: { id: "P003", name: "David Anderson", mrn: "MRN-001236", dob: "1978-11-02", gender: "Male" },
    testPanel: "Complete Blood Count (CBC)",
    specimenType: "Whole Blood (EDTA)",
    priority: "ROUTINE",
    status: "COMPLETED",
    orderedBy: "Dr. Emily Torres",
    orderedAt: "2026-04-08 08:00",
    collectedAt: "2026-04-08 08:30",
    collectedBy: "Tech. A. Johnson",
    specimenCondition: "Satisfactory",
    completedAt: "2026-04-08 10:00",
    encounterType: "INPATIENT",
    results: {
      panelName: "Complete Blood Count (CBC)",
      analytes: [
        { id: "A020", name: "WBC", value: "12.5", unit: "x10³/µL", referenceRange: "4.5–11.0", flag: "Abnormal", previousValue: "11.2" },
        { id: "A021", name: "RBC", value: "4.5", unit: "x10⁶/µL", referenceRange: "4.5–5.5", flag: "Normal" },
        { id: "A022", name: "Hemoglobin", value: "13.2", unit: "g/dL", referenceRange: "13.5–17.5", flag: "Abnormal" },
        { id: "A023", name: "Hematocrit", value: "39.0", unit: "%", referenceRange: "38.0–50.0", flag: "Normal" },
        { id: "A024", name: "Platelets", value: "220", unit: "x10³/µL", referenceRange: "150–400", flag: "Normal" },
        { id: "A025", name: "MCV", value: "87", unit: "fL", referenceRange: "80–100", flag: "Normal" },
        { id: "A026", name: "MCH", value: "29.3", unit: "pg", referenceRange: "27–33", flag: "Normal" },
        { id: "A027", name: "MCHC", value: "33.8", unit: "g/dL", referenceRange: "32–36", flag: "Normal" },
      ],
      enteredBy: "Tech. A. Johnson",
      enteredAt: "2026-04-08 09:45",
      validatedBy: "Tech. R. Martinez",
      validatedAt: "2026-04-08 10:00",
    },
  },
  {
    id: "LO-011",
    patient: { id: "P006", name: "Emily Wong", mrn: "MRN-001239", dob: "1983-05-10", gender: "Female" },
    testPanel: "Coagulation Panel",
    specimenType: "Citrated Plasma",
    priority: "ROUTINE",
    status: "COMPLETED",
    orderedBy: "Dr. James Wilson",
    orderedAt: "2026-04-07 14:00",
    collectedAt: "2026-04-07 14:30",
    collectedBy: "Tech. R. Martinez",
    specimenCondition: "Satisfactory",
    completedAt: "2026-04-07 16:00",
    encounterType: "OUTPATIENT",
    results: {
      panelName: "Coagulation Panel",
      analytes: [
        { id: "A030", name: "PT", value: "13.5", unit: "seconds", referenceRange: "11.0–13.5", flag: "Normal" },
        { id: "A031", name: "INR", value: "1.0", unit: "", referenceRange: "0.9–1.1", flag: "Normal" },
        { id: "A032", name: "aPTT", value: "32", unit: "seconds", referenceRange: "25–35", flag: "Normal" },
        { id: "A033", name: "Fibrinogen", value: "280", unit: "mg/dL", referenceRange: "200–400", flag: "Normal" },
      ],
      enteredBy: "Tech. R. Martinez",
      enteredAt: "2026-04-07 15:45",
      validatedBy: "Tech. A. Johnson",
      validatedAt: "2026-04-07 16:00",
    },
  },
  {
    id: "LO-012",
    patient: { id: "P004", name: "Sophia Nguyen", mrn: "MRN-001237", dob: "1998-01-30", gender: "Female" },
    testPanel: "Comprehensive Metabolic Panel (CMP)",
    specimenType: "Serum (SST)",
    priority: "ROUTINE",
    status: "CORRECTED",
    orderedBy: "Dr. Michael Park",
    orderedAt: "2026-04-07 08:00",
    collectedAt: "2026-04-07 08:30",
    collectedBy: "Tech. A. Johnson",
    specimenCondition: "Satisfactory",
    completedAt: "2026-04-07 11:00",
    encounterType: "INPATIENT",
    results: {
      panelName: "Comprehensive Metabolic Panel (CMP)",
      analytes: [
        { id: "A040", name: "Sodium", value: "140", unit: "mEq/L", referenceRange: "136–145", flag: "Normal" },
        { id: "A041", name: "Potassium", value: "4.0", unit: "mEq/L", referenceRange: "3.5–5.0", flag: "Normal" },
        { id: "A042", name: "Chloride", value: "102", unit: "mEq/L", referenceRange: "98–106", flag: "Normal" },
        { id: "A043", name: "CO2", value: "25", unit: "mEq/L", referenceRange: "23–29", flag: "Normal" },
        { id: "A044", name: "BUN", value: "15", unit: "mg/dL", referenceRange: "7–20", flag: "Normal" },
        { id: "A045", name: "Creatinine", value: "0.9", unit: "mg/dL", referenceRange: "0.6–1.1", flag: "Normal" },
        { id: "A046", name: "Glucose", value: "92", unit: "mg/dL", referenceRange: "70–100", flag: "Normal" },
        { id: "A047", name: "Calcium", value: "9.5", unit: "mg/dL", referenceRange: "8.5–10.5", flag: "Normal" },
        { id: "A048", name: "Total Protein", value: "7.0", unit: "g/dL", referenceRange: "6.0–8.3", flag: "Normal" },
        { id: "A049", name: "Albumin", value: "4.0", unit: "g/dL", referenceRange: "3.5–5.0", flag: "Normal" },
        { id: "A050", name: "Bilirubin, Total", value: "0.8", unit: "mg/dL", referenceRange: "0.1–1.2", flag: "Normal" },
        { id: "A051", name: "ALP", value: "75", unit: "U/L", referenceRange: "44–147", flag: "Normal" },
        { id: "A052", name: "ALT", value: "58", unit: "U/L", referenceRange: "7–56", flag: "Abnormal", correctedFrom: "85", correctionReason: "Instrument recalibration — original value from uncalibrated analyzer batch." },
        { id: "A053", name: "AST", value: "30", unit: "U/L", referenceRange: "10–40", flag: "Normal" },
      ],
      enteredBy: "Tech. A. Johnson",
      enteredAt: "2026-04-07 10:30",
      validatedBy: "Tech. R. Martinez",
      validatedAt: "2026-04-07 11:00",
      techNotes: "ALT corrected from 85 to 58 U/L after instrument recalibration. Original value from uncalibrated analyzer batch.",
    },
  },
  {
    id: "LO-013",
    patient: { id: "P008", name: "Olivia Chen", mrn: "MRN-001241", dob: "1995-06-15", gender: "Female" },
    testPanel: "Urinalysis",
    specimenType: "Clean-Catch Urine",
    priority: "ROUTINE",
    status: "COMPLETED",
    orderedBy: "Dr. Emily Torres",
    orderedAt: "2026-04-08 09:00",
    collectedAt: "2026-04-08 09:30",
    collectedBy: "Tech. A. Johnson",
    specimenCondition: "Satisfactory",
    completedAt: "2026-04-08 11:00",
    encounterType: "OUTPATIENT",
    results: {
      panelName: "Urinalysis",
      analytes: [
        { id: "A060", name: "Color", value: "Yellow", unit: "", referenceRange: "Yellow", flag: "Normal" },
        { id: "A061", name: "Clarity", value: "Clear", unit: "", referenceRange: "Clear", flag: "Normal" },
        { id: "A062", name: "Specific Gravity", value: "1.020", unit: "", referenceRange: "1.005–1.030", flag: "Normal" },
        { id: "A063", name: "pH", value: "6.0", unit: "", referenceRange: "5.0–8.0", flag: "Normal" },
        { id: "A064", name: "Protein", value: "Negative", unit: "", referenceRange: "Negative", flag: "Normal" },
        { id: "A065", name: "Glucose", value: "Negative", unit: "", referenceRange: "Negative", flag: "Normal" },
        { id: "A066", name: "Ketones", value: "Negative", unit: "", referenceRange: "Negative", flag: "Normal" },
        { id: "A067", name: "Blood", value: "Negative", unit: "", referenceRange: "Negative", flag: "Normal" },
        { id: "A068", name: "Leukocyte Esterase", value: "Negative", unit: "", referenceRange: "Negative", flag: "Normal" },
        { id: "A069", name: "Nitrites", value: "Negative", unit: "", referenceRange: "Negative", flag: "Normal" },
      ],
      enteredBy: "Tech. A. Johnson",
      enteredAt: "2026-04-08 10:45",
      validatedBy: "Tech. R. Martinez",
      validatedAt: "2026-04-08 11:00",
    },
  },
  {
    id: "LO-014",
    patient: { id: "P005", name: "Michael Brown", mrn: "MRN-001238", dob: "1990-09-18", gender: "Male" },
    testPanel: "Lipid Panel",
    specimenType: "Serum (SST)",
    priority: "ROUTINE",
    status: "COMPLETED",
    orderedBy: "Dr. Michael Park",
    orderedAt: "2026-04-07 07:00",
    collectedAt: "2026-04-07 07:30",
    collectedBy: "Tech. R. Martinez",
    specimenCondition: "Lipemic",
    completedAt: "2026-04-07 09:30",
    encounterType: "OUTPATIENT",
    results: {
      panelName: "Lipid Panel",
      analytes: [
        { id: "A070", name: "Total Cholesterol", value: "245", unit: "mg/dL", referenceRange: "<200", flag: "Abnormal" },
        { id: "A071", name: "Triglycerides", value: "210", unit: "mg/dL", referenceRange: "<150", flag: "Abnormal" },
        { id: "A072", name: "HDL", value: "38", unit: "mg/dL", referenceRange: ">40", flag: "Abnormal" },
        { id: "A073", name: "LDL (calc)", value: "165", unit: "mg/dL", referenceRange: "<100", flag: "Abnormal" },
      ],
      enteredBy: "Tech. R. Martinez",
      enteredAt: "2026-04-07 09:15",
      validatedBy: "Tech. A. Johnson",
      validatedAt: "2026-04-07 09:30",
      techNotes: "Specimen noted as lipemic. Results may be affected. Clinical correlation recommended.",
    },
  },
  {
    id: "LO-015",
    patient: { id: "P002", name: "Maria Garcia", mrn: "MRN-001235", dob: "1992-07-25", gender: "Female" },
    testPanel: "Complete Blood Count (CBC)",
    specimenType: "Whole Blood (EDTA)",
    priority: "ROUTINE",
    status: "CANCELLED",
    orderedBy: "Dr. James Wilson",
    orderedAt: "2026-04-08 16:00",
    encounterType: "INPATIENT",
  },
]

// ─── Mock Patients ───────────────────────────────────────────────────────────

export const labPatients: LabPatient[] = [
  { id: "P001", name: "John Smith", mrn: "MRN-001234", dob: "1985-03-12", gender: "Male", recentOrderCount: 5, lastLabDate: "2026-04-09", activeOrders: 1, criticalCount: 3 },
  { id: "P002", name: "Maria Garcia", mrn: "MRN-001235", dob: "1992-07-25", gender: "Female", recentOrderCount: 3, lastLabDate: "2026-04-09", activeOrders: 1, criticalCount: 0 },
  { id: "P003", name: "David Anderson", mrn: "MRN-001236", dob: "1978-11-02", gender: "Male", recentOrderCount: 4, lastLabDate: "2026-04-09", activeOrders: 1, criticalCount: 0 },
  { id: "P004", name: "Sophia Nguyen", mrn: "MRN-001237", dob: "1998-01-30", gender: "Female", recentOrderCount: 3, lastLabDate: "2026-04-09", activeOrders: 1, criticalCount: 0 },
  { id: "P005", name: "Michael Brown", mrn: "MRN-001238", dob: "1990-09-18", gender: "Male", recentOrderCount: 2, lastLabDate: "2026-04-09", activeOrders: 1, criticalCount: 0 },
  { id: "P006", name: "Emily Wong", mrn: "MRN-001239", dob: "1983-05-10", gender: "Female", recentOrderCount: 3, lastLabDate: "2026-04-09", activeOrders: 1, criticalCount: 0 },
  { id: "P007", name: "Daniel Kim", mrn: "MRN-001240", dob: "1988-12-05", gender: "Male", recentOrderCount: 2, lastLabDate: "2026-04-09", activeOrders: 1, criticalCount: 0 },
  { id: "P008", name: "Olivia Chen", mrn: "MRN-001241", dob: "1995-06-15", gender: "Female", recentOrderCount: 4, lastLabDate: "2026-04-08", activeOrders: 0, criticalCount: 0 },
]

// ─── Mock Critical Value Log ─────────────────────────────────────────────────

export const criticalValueLog: CriticalValueLog[] = [
  { id: "CV-001", patient: "John Smith", mrn: "MRN-001234", test: "Sodium", value: "128 mEq/L", unit: "mEq/L", flag: "Critical", notifiedClinician: "Dr. Sarah Chen", acknowledged: true, acknowledgedAt: "2026-04-08 19:25", resultedAt: "2026-04-08 19:15" },
  { id: "CV-002", patient: "John Smith", mrn: "MRN-001234", test: "Potassium", value: "5.6 mEq/L", unit: "mEq/L", flag: "Critical", notifiedClinician: "Dr. Sarah Chen", acknowledged: true, acknowledgedAt: "2026-04-08 19:25", resultedAt: "2026-04-08 19:15" },
  { id: "CV-003", patient: "John Smith", mrn: "MRN-001234", test: "Creatinine", value: "2.1 mg/dL", unit: "mg/dL", flag: "Critical", notifiedClinician: "Dr. Sarah Chen", acknowledged: true, acknowledgedAt: "2026-04-08 19:25", resultedAt: "2026-04-08 19:15" },
  { id: "CV-004", patient: "Daniel Kim", mrn: "MRN-001240", test: "Potassium", value: "5.8 mEq/L", unit: "mEq/L", flag: "Critical", notifiedClinician: "Dr. Sarah Chen", acknowledged: false, resultedAt: "2026-04-09 07:45" },
  { id: "CV-005", patient: "David Anderson", mrn: "MRN-001236", test: "Hemoglobin", value: "6.2 g/dL", unit: "g/dL", flag: "Critical", notifiedClinician: "Dr. Emily Torres", acknowledged: false, resultedAt: "2026-04-09 08:10" },
]

// ─── Mock TAT Entries ────────────────────────────────────────────────────────

export const tatEntries: TATEntry[] = [
  { id: "TAT-001", patient: "Olivia Chen", testPanel: "Thyroid Panel", orderedAt: "2026-04-08 10:00", collectedAt: "2026-04-08 10:30", resultedAt: "2026-04-08 14:00", tatMinutes: 240, targetMinutes: 360, withinTarget: true, priority: "ROUTINE" },
  { id: "TAT-002", patient: "John Smith", testPanel: "BMP", orderedAt: "2026-04-08 18:00", collectedAt: "2026-04-08 18:15", resultedAt: "2026-04-08 19:30", tatMinutes: 90, targetMinutes: 60, withinTarget: false, priority: "STAT" },
  { id: "TAT-003", patient: "David Anderson", testPanel: "CBC", orderedAt: "2026-04-08 08:00", collectedAt: "2026-04-08 08:30", resultedAt: "2026-04-08 10:00", tatMinutes: 120, targetMinutes: 180, withinTarget: true, priority: "ROUTINE" },
  { id: "TAT-004", patient: "Emily Wong", testPanel: "Coagulation Panel", orderedAt: "2026-04-07 14:00", collectedAt: "2026-04-07 14:30", resultedAt: "2026-04-07 16:00", tatMinutes: 120, targetMinutes: 180, withinTarget: true, priority: "ROUTINE" },
  { id: "TAT-005", patient: "Sophia Nguyen", testPanel: "CMP", orderedAt: "2026-04-07 08:00", collectedAt: "2026-04-07 08:30", resultedAt: "2026-04-07 11:00", tatMinutes: 180, targetMinutes: 240, withinTarget: true, priority: "ROUTINE" },
  { id: "TAT-006", patient: "Michael Brown", testPanel: "Lipid Panel", orderedAt: "2026-04-07 07:00", collectedAt: "2026-04-07 07:30", resultedAt: "2026-04-07 09:30", tatMinutes: 150, targetMinutes: 180, withinTarget: true, priority: "ROUTINE" },
  { id: "TAT-007", patient: "Olivia Chen", testPanel: "Urinalysis", orderedAt: "2026-04-08 09:00", collectedAt: "2026-04-08 09:30", resultedAt: "2026-04-08 11:00", tatMinutes: 120, targetMinutes: 180, withinTarget: true, priority: "ROUTINE" },
]

// ─── Mock Test Volume ────────────────────────────────────────────────────────

export const testVolumes: TestVolume[] = [
  { testPanel: "Complete Blood Count (CBC)", today: 12, thisWeek: 78, thisMonth: 312, criticalRate: "2.1%" },
  { testPanel: "Basic Metabolic Panel (BMP)", today: 9, thisWeek: 62, thisMonth: 248, criticalRate: "3.4%" },
  { testPanel: "Comprehensive Metabolic Panel (CMP)", today: 6, thisWeek: 45, thisMonth: 180, criticalRate: "1.8%" },
  { testPanel: "Liver Function Tests (LFT)", today: 4, thisWeek: 28, thisMonth: 112, criticalRate: "0.9%" },
  { testPanel: "Coagulation Panel", today: 5, thisWeek: 35, thisMonth: 140, criticalRate: "1.2%" },
  { testPanel: "Thyroid Panel", today: 3, thisWeek: 22, thisMonth: 88, criticalRate: "0.5%" },
  { testPanel: "Urinalysis", today: 7, thisWeek: 48, thisMonth: 192, criticalRate: "0.3%" },
  { testPanel: "Lipid Panel", today: 4, thisWeek: 30, thisMonth: 120, criticalRate: "0.0%" },
]
