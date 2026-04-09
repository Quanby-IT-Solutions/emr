export type AdmissionType = "Emergency" | "Elective" | "Transfer"
export type PatientStatus = "Stable" | "For Observation" | "Critical" | "For Discharge"
export type DischargeStep = "Discharge Summary" | "Medications Explained" | "Home Instructions" | "Follow-up Booked" | "PhilHealth Clearance" | "Pharmacy Clearance" | "Final Vitals" | "Wheeled Out"

export interface WardPatient {
  id: string
  patientName: string
  hospitalNumber: string
  age: number
  sex: "M" | "F"
  ward: string
  bedNumber: string
  admissionDate: string
  admissionType: AdmissionType
  admittingPhysician: string
  diagnosis: string
  status: PatientStatus
  allergies: string[]
  currentMedications: string[]
  dietOrders: string
  isolationPrecautions: string | null
  codeStatus: "Full Code" | "DNR"
}

export const dummyWardPatients: WardPatient[] = [
  {
    id: "WP-001", patientName: "Juan Dela Cruz", hospitalNumber: "PGH-2024-00145",
    age: 72, sex: "M", ward: "Ward 3B - Internal Medicine", bedNumber: "3B-01",
    admissionDate: "2026-04-05", admissionType: "Emergency", admittingPhysician: "Dr. Jose Rivera",
    diagnosis: "Community-Acquired Pneumonia", status: "For Observation",
    allergies: ["Penicillin"], currentMedications: ["Ceftriaxone 1g IV q12h", "Paracetamol 500mg PO q6h PRN"],
    dietOrders: "Regular diet", isolationPrecautions: "Droplet precautions", codeStatus: "Full Code",
  },
  {
    id: "WP-002", patientName: "Rosa Santos", hospitalNumber: "PGH-2024-00230",
    age: 65, sex: "F", ward: "Ward 3B - Internal Medicine", bedNumber: "3B-02",
    admissionDate: "2026-04-07", admissionType: "Elective", admittingPhysician: "Dr. Corey McDonald",
    diagnosis: "Type 2 Diabetes Mellitus, Uncontrolled", status: "Stable",
    allergies: [], currentMedications: ["Metformin 500mg PO BID", "Insulin Glargine 20U SC HS"],
    dietOrders: "Diabetic diet 1800 kcal", isolationPrecautions: null, codeStatus: "Full Code",
  },
  {
    id: "WP-003", patientName: "Pedro Reyes", hospitalNumber: "PGH-2024-00312",
    age: 45, sex: "M", ward: "Ward 3B - Internal Medicine", bedNumber: "3B-03",
    admissionDate: "2026-04-03", admissionType: "Emergency", admittingPhysician: "Dr. Jose Rivera",
    diagnosis: "Acute Myocardial Infarction", status: "For Observation",
    allergies: ["Aspirin", "Sulfa drugs"], currentMedications: ["Clopidogrel 75mg PO daily", "Atorvastatin 40mg PO HS", "Metoprolol 50mg PO BID"],
    dietOrders: "Low sodium, low fat diet", isolationPrecautions: null, codeStatus: "Full Code",
  },
  {
    id: "WP-004", patientName: "Elena Marcos", hospitalNumber: "PGH-2024-00456",
    age: 38, sex: "F", ward: "Ward 3B - Internal Medicine", bedNumber: "3B-05",
    admissionDate: "2026-04-08", admissionType: "Transfer", admittingPhysician: "Dr. Patricia Lim",
    diagnosis: "Systemic Lupus Erythematosus Flare", status: "Stable",
    allergies: ["Ibuprofen"], currentMedications: ["Prednisone 40mg PO daily", "Hydroxychloroquine 200mg PO BID"],
    dietOrders: "Regular diet", isolationPrecautions: null, codeStatus: "Full Code",
  },
  {
    id: "WP-005", patientName: "Roberto Aquino", hospitalNumber: "PGH-2024-00567",
    age: 55, sex: "M", ward: "Ward 3B - Internal Medicine", bedNumber: "3B-06",
    admissionDate: "2026-04-02", admissionType: "Elective", admittingPhysician: "Dr. David Kim",
    diagnosis: "Chronic Kidney Disease Stage 4", status: "For Discharge",
    allergies: [], currentMedications: ["Amlodipine 10mg PO daily", "Furosemide 40mg PO daily"],
    dietOrders: "Renal diet - low protein, low potassium", isolationPrecautions: null, codeStatus: "Full Code",
  },
  {
    id: "WP-006", patientName: "Grace Tan", hospitalNumber: "PGH-2024-00678",
    age: 30, sex: "F", ward: "Ward 5A - Oncology", bedNumber: "5A-02",
    admissionDate: "2026-04-06", admissionType: "Elective", admittingPhysician: "Dr. Martha Chen",
    diagnosis: "Acute Lymphoblastic Leukemia - Chemo Cycle 3", status: "For Observation",
    allergies: ["Latex"], currentMedications: ["Vincristine IV per protocol", "Ondansetron 8mg IV PRN"],
    dietOrders: "High protein diet", isolationPrecautions: "Neutropenic precautions", codeStatus: "Full Code",
  },
  {
    id: "WP-007", patientName: "Carlos Mendoza", hospitalNumber: "PGH-2024-00789",
    age: 60, sex: "M", ward: "Ward 3B - Internal Medicine", bedNumber: "3B-08",
    admissionDate: "2026-04-09", admissionType: "Emergency", admittingPhysician: "Dr. Jose Rivera",
    diagnosis: "Cerebrovascular Accident (Stroke)", status: "Critical",
    allergies: ["Morphine"], currentMedications: ["Aspirin 80mg PO daily", "Mannitol 20% 100mL IV q6h"],
    dietOrders: "NPO (nothing per orem)", isolationPrecautions: null, codeStatus: "Full Code",
  },
  {
    id: "WP-008", patientName: "Anna Lim", hospitalNumber: "PGH-2024-00890",
    age: 42, sex: "F", ward: "PACU", bedNumber: "PACU-01",
    admissionDate: "2026-04-09", admissionType: "Transfer", admittingPhysician: "Dr. David Kim",
    diagnosis: "Post Cholecystectomy (Laparoscopic)", status: "For Observation",
    allergies: [], currentMedications: ["Ketorolac 30mg IV q8h", "Tramadol 50mg IV PRN"],
    dietOrders: "Clear liquids", isolationPrecautions: null, codeStatus: "Full Code",
  },
]

export interface DischargeRecord {
  id: string
  patientId: string
  patientName: string
  hospitalNumber: string
  ward: string
  bedNumber: string
  admissionDate: string
  dischargeOrderDate: string
  dischargeOrderBy: string
  checklist: Record<DischargeStep, boolean>
  homeInstructions: string
  followUpDate: string | null
  followUpClinic: string | null
  dischargeVitals: {
    bp: string
    hr: number
    rr: number
    temp: number
    o2sat: number
  } | null
  discharged: boolean
  dischargeDate: string | null
}

export const dummyDischargeRecords: DischargeRecord[] = [
  {
    id: "DC-001", patientId: "WP-005", patientName: "Roberto Aquino",
    hospitalNumber: "PGH-2024-00567", ward: "Ward 3B", bedNumber: "3B-06",
    admissionDate: "2026-04-02", dischargeOrderDate: "2026-04-09",
    dischargeOrderBy: "Dr. David Kim",
    checklist: {
      "Discharge Summary": true, "Medications Explained": true, "Home Instructions": false,
      "Follow-up Booked": true, "PhilHealth Clearance": true, "Pharmacy Clearance": false,
      "Final Vitals": false, "Wheeled Out": false,
    },
    homeInstructions: "Continue renal diet. Take medications as prescribed. Return to OPD in 2 weeks.",
    followUpDate: "2026-04-23", followUpClinic: "Nephrology OPD",
    dischargeVitals: null, discharged: false, dischargeDate: null,
  },
]

export interface ShiftEndorsement {
  id: string
  ward: string
  shiftDate: string
  shiftType: "AM (7:00-15:00)" | "PM (15:00-23:00)" | "Night (23:00-07:00)"
  outgoingNurse: string
  incomingNurse: string
  totalPatients: number
  admissions: number
  discharges: number
  transfers: number
  patientSummaries: {
    patientName: string
    bedNumber: string
    keyStatus: string
    pendingTasks: string[]
    notableEvents: string
  }[]
  createdAt: string
}

export const dummyShiftEndorsements: ShiftEndorsement[] = [
  {
    id: "SE-001", ward: "Ward 3B", shiftDate: "2026-04-09",
    shiftType: "AM (7:00-15:00)", outgoingNurse: "Nurse Joy Reyes", incomingNurse: "Nurse Maria Santos",
    totalPatients: 6, admissions: 1, discharges: 0, transfers: 0,
    patientSummaries: [
      { patientName: "Juan Dela Cruz", bedNumber: "3B-01", keyStatus: "Stable, afebrile. On IV antibiotics Day 4", pendingTasks: ["Vital signs q4h", "Repeat CBC at 14:00"], notableEvents: "Completed chest X-ray this AM. Tolerating oral diet." },
      { patientName: "Rosa Santos", bedNumber: "3B-02", keyStatus: "CBG monitoring q6h. Last CBG 145 mg/dL", pendingTasks: ["CBG at 12:00", "Insulin dose per sliding scale"], notableEvents: "Endocrine consult done. Adjusting insulin regimen." },
      { patientName: "Pedro Reyes", bedNumber: "3B-03", keyStatus: "Post-MI Day 6. Hemodynamically stable", pendingTasks: ["Cardiac enzymes at 14:00", "Monitor for chest pain"], notableEvents: "Echo scheduled for tomorrow AM." },
      { patientName: "Elena Marcos", bedNumber: "3B-05", keyStatus: "SLE flare improving. Prednisone taper started", pendingTasks: ["ANA panel results pending", "Joint assessment q shift"], notableEvents: "Transferred from ICU yesterday. Improving." },
      { patientName: "Roberto Aquino", bedNumber: "3B-06", keyStatus: "FOR DISCHARGE. Awaiting clearances", pendingTasks: ["Complete discharge checklist", "Pharmacy clearance pending"], notableEvents: "Discharge order by Dr. Kim. Patient and family counseled." },
      { patientName: "Carlos Mendoza", bedNumber: "3B-08", keyStatus: "CVA. GCS 12. Neuro checks q2h", pendingTasks: ["Neuro checks q2h", "CT scan follow-up at 16:00", "NGT feeding at 12:00"], notableEvents: "New admission this AM from ER. Right-sided weakness, slurred speech." },
    ],
    createdAt: "2026-04-09T15:00:00",
  },
]

export interface IncidentReport {
  id: string
  incidentDate: string
  incidentTime: string
  ward: string
  patientName: string | null
  patientId: string | null
  reportedBy: string
  incidentType: "Patient Fall" | "Medication Error" | "Allergic Reaction" | "Equipment Failure" | "Needle Stick" | "Other"
  severity: "Minor" | "Moderate" | "Severe"
  description: string
  immediateAction: string
  physicianNotified: boolean
  status: "Open" | "Under Review" | "Closed"
}

export const dummyIncidentReports: IncidentReport[] = [
  {
    id: "IR-001", incidentDate: "2026-04-08", incidentTime: "22:30",
    ward: "Ward 3B", patientName: "Juan Dela Cruz", patientId: "WP-001",
    reportedBy: "Nurse Maria Santos", incidentType: "Patient Fall", severity: "Minor",
    description: "Patient found sitting on floor beside bed. Attempted to go to bathroom without calling nurse. No visible injuries.",
    immediateAction: "Assisted patient back to bed. Performed full assessment. Vitals stable. Applied bed alarm. Reminded patient to use call bell.",
    physicianNotified: true, status: "Under Review",
  },
  {
    id: "IR-002", incidentDate: "2026-04-07", incidentTime: "10:15",
    ward: "Ward 5A", patientName: "Grace Tan", patientId: "WP-006",
    reportedBy: "Nurse Joy Reyes", incidentType: "Allergic Reaction", severity: "Moderate",
    description: "Patient developed urticaria (hives) and mild dyspnea after chemotherapy infusion. Known latex allergy - non-latex gloves were used.",
    immediateAction: "Stopped infusion immediately. Administered Diphenhydramine 50mg IV as ordered. Monitored vitals q15min. Symptoms resolved within 1 hour.",
    physicianNotified: true, status: "Closed",
  },
]
