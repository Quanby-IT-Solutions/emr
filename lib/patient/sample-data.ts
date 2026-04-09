/**
 * Demo-only fixtures for Patient Portal (read-only) UI.
 * Not persisted; replace with API and release policies when integrated.
 */

export type VisitSummary = {
  id: string
  encounterId: string
  visitDate: string
  visitType: string
  department: string
  providerName: string
  summary: string
}

export type PortalMedication = {
  id: string
  name: string
  dose: string
  route: string
  frequency: string
  status: "Active" | "Completed"
  startDate: string
  instructions: string | null
}

export type PortalAllergy = {
  id: string
  substance: string
  reaction: string | null
  severity: "MILD" | "MODERATE" | "SEVERE" | "UNKNOWN"
  status: "ACTIVE"
}

export type PortalProblem = {
  id: string
  description: string
  icd10Code: string | null
  status: "ACTIVE" | "RESOLVED"
  onsetDate: string | null
}

export type LabResultRow = {
  id: string
  panelName: string
  analyte: string
  value: string
  unit: string | null
  refRange: string
  flag: "H" | "L" | "Critical" | "A" | null
  resultDate: string
  releasedToPortal: boolean
  releaseNote?: string
}

export type ImagingReportRow = {
  id: string
  modality: string
  study: string
  accession: string
  reportDate: string
  impression: string
  critical: boolean
  viewerAvailable: boolean
  releasedToPortal: boolean
}

export const sampleVisitSummaries: VisitSummary[] = [
  {
    id: "vs-1",
    encounterId: "ENC-2026-88421",
    visitDate: "2026-03-18",
    visitType: "OPD",
    department: "Endocrinology",
    providerName: "Dr. Maria Santos",
    summary:
      "Follow-up Type 2 diabetes. HbA1c discussed; medication adherence reviewed. Plan: continue metformin, lifestyle counseling, repeat labs in 3 months.",
  },
  {
    id: "vs-2",
    encounterId: "ENC-2026-88102",
    visitDate: "2026-02-04",
    visitType: "ER",
    department: "Emergency",
    providerName: "Dr. Jose Reyes",
    summary:
      "Evaluated for elevated BP and headache. Imaging not indicated. Discharged home with PCP follow-up and medication review.",
  },
]

export const samplePortalMedications: PortalMedication[] = [
  {
    id: "rx-1",
    name: "Metformin",
    dose: "500 mg",
    route: "Oral",
    frequency: "Twice daily",
    status: "Active",
    startDate: "2024-01-10",
    instructions: "Take with meals.",
  },
  {
    id: "rx-2",
    name: "Lisinopril",
    dose: "10 mg",
    route: "Oral",
    frequency: "Once daily",
    status: "Active",
    startDate: "2023-06-01",
    instructions: null,
  },
  {
    id: "rx-3",
    name: "Atorvastatin",
    dose: "20 mg",
    route: "Oral",
    frequency: "At bedtime",
    status: "Active",
    startDate: "2025-11-02",
    instructions: null,
  },
]

export const samplePortalAllergies: PortalAllergy[] = [
  {
    id: "alg-1",
    substance: "Penicillin",
    reaction: "Rash, hives, shortness of breath",
    severity: "SEVERE",
    status: "ACTIVE",
  },
  {
    id: "alg-2",
    substance: "Shellfish",
    reaction: "Throat tightness, facial swelling",
    severity: "SEVERE",
    status: "ACTIVE",
  },
  {
    id: "alg-3",
    substance: "Ibuprofen",
    reaction: "Nausea",
    severity: "MILD",
    status: "ACTIVE",
  },
]

export const samplePortalProblems: PortalProblem[] = [
  {
    id: "pr-1",
    description: "Type 2 diabetes mellitus",
    icd10Code: "E11.9",
    status: "ACTIVE",
    onsetDate: "2018-03-15",
  },
  {
    id: "pr-2",
    description: "Essential hypertension",
    icd10Code: "I10",
    status: "ACTIVE",
    onsetDate: "2020-07-22",
  },
  {
    id: "pr-3",
    description: "Hyperlipidemia",
    icd10Code: "E78.5",
    status: "ACTIVE",
    onsetDate: "2023-01-05",
  },
]

export const sampleLabResults: LabResultRow[] = [
  {
    id: "lr-1",
    panelName: "Comprehensive metabolic panel",
    analyte: "Glucose",
    value: "142",
    unit: "mg/dL",
    refRange: "70–99",
    flag: "H",
    resultDate: "2026-04-01",
    releasedToPortal: true,
  },
  {
    id: "lr-2",
    panelName: "Comprehensive metabolic panel",
    analyte: "Creatinine",
    value: "0.9",
    unit: "mg/dL",
    refRange: "0.7–1.3",
    flag: null,
    resultDate: "2026-04-01",
    releasedToPortal: true,
  },
  {
    id: "lr-3",
    panelName: "CBC",
    analyte: "WBC",
    value: "11.8",
    unit: "10³/µL",
    refRange: "4.5–11.0",
    flag: "H",
    resultDate: "2026-03-28",
    releasedToPortal: true,
  },
  {
    id: "lr-4",
    panelName: "Lipid panel",
    analyte: "LDL",
    value: "118",
    unit: "mg/dL",
    refRange: "<100",
    flag: "H",
    resultDate: "2026-03-28",
    releasedToPortal: true,
  },
  {
    id: "lr-5",
    panelName: "Troponin",
    analyte: "High-sensitivity troponin I",
    value: "8",
    unit: "ng/L",
    refRange: "≤34 (site-specific)",
    flag: null,
    resultDate: "2026-04-08",
    releasedToPortal: false,
    releaseNote: "Pending release per hospital policy (e.g. delay after final verification).",
  },
]

/** Signed clinical documentation released to the portal (Clinical Documentation → Patient Portal). */
export type ReleasedClinicalNote = {
  id: string
  encounterId: string
  noteType: string
  authoredBy: string
  signedAt: string
  excerpt: string
}

export const sampleReleasedClinicalNotes: ReleasedClinicalNote[] = [
  {
    id: "note-1",
    encounterId: "ENC-2026-88421",
    noteType: "SOAP — Progress note",
    authoredBy: "Dr. Maria Santos, MD",
    signedAt: "2026-03-18T16:20:00",
    excerpt:
      "Subjective: Doing well on current regimen. Objective: BP 128/78, weight stable. Assessment: T2DM controlled. Plan: Continue metformin; labs in 3 months.",
  },
  {
    id: "note-2",
    encounterId: "ENC-2026-88102",
    noteType: "ED Provider note",
    authoredBy: "Dr. Jose Reyes, MD",
    signedAt: "2026-02-04T22:10:00",
    excerpt:
      "Patient evaluated for headache and elevated BP. No focal deficits. Discharge instructions given; follow up with PCP within one week.",
  },
]

export const sampleImagingReports: ImagingReportRow[] = [
  {
    id: "img-1",
    modality: "XR",
    study: "Chest 2 views",
    accession: "ACC-2026-44102",
    reportDate: "2026-03-30",
    impression: "No acute cardiopulmonary process.",
    critical: false,
    viewerAvailable: true,
    releasedToPortal: true,
  },
  {
    id: "img-2",
    modality: "CT",
    study: "CT head without contrast",
    accession: "ACC-2026-44088",
    reportDate: "2026-02-04",
    impression: "No intracranial hemorrhage or mass effect.",
    critical: false,
    viewerAvailable: true,
    releasedToPortal: true,
  },
]
