export type DocumentType = "Medical Certificate" | "Certified True Copy" | "Photocopy of Records" | "Passcode Retrieval" | "Laboratory Results" | "Discharge Summary" | "Clinical Abstract" | "Birth Certificate (COLB)" | "Death Certificate" | "Medico-Legal Certificate"
export type DocumentStatus = "Pending" | "Processing" | "Ready for Release" | "Released" | "Denied"
export type PatientCategory = "Charity" | "PhilHealth" | "Pay"
export type RegistrationType = "New OPD" | "Elective Admission" | "Emergency Admission" | "OB-Gyne Admitting"
export type COLBStatus = "Prepared" | "Signed" | "Transmitted" | "Registered at LCR"
export type RetrievalStatus = "Requested" | "Retrieved" | "Out for Consultation" | "Returned" | "Missing"

export interface DocumentRequest {
  id: string
  patientId: string
  patientName: string
  hospitalNumber: string
  documentType: DocumentType
  purpose: string
  requestedBy: string
  requestedDate: string
  status: DocumentStatus
  releasedDate: string | null
  releasedTo: string | null
  feeAmount: number
  isPaid: boolean
  verificationComplete: boolean
}

export const dummyDocumentRequests: DocumentRequest[] = [
  {
    id: "DOC-001", patientId: "P001", patientName: "John Smith", hospitalNumber: "PGH-2024-00145",
    documentType: "Medical Certificate", purpose: "Employment requirement",
    requestedBy: "John Smith (Self)", requestedDate: "2026-04-09", status: "Processing",
    releasedDate: null, releasedTo: null, feeAmount: 100, isPaid: true, verificationComplete: true,
  },
  {
    id: "DOC-002", patientId: "P002", patientName: "Maria Garcia", hospitalNumber: "PGH-2024-00230",
    documentType: "Certified True Copy", purpose: "Insurance claim",
    requestedBy: "Elena Garcia (Authorized Representative)", requestedDate: "2026-04-08", status: "Pending",
    releasedDate: null, releasedTo: null, feeAmount: 150, isPaid: false, verificationComplete: false,
  },
  {
    id: "DOC-003", patientId: "P003", patientName: "David Anderson", hospitalNumber: "PGH-2024-00312",
    documentType: "Discharge Summary", purpose: "Follow-up at private clinic",
    requestedBy: "David Anderson (Self)", requestedDate: "2026-04-07", status: "Released",
    releasedDate: "2026-04-08", releasedTo: "David Anderson", feeAmount: 75, isPaid: true, verificationComplete: true,
  },
  {
    id: "DOC-004", patientId: "P004", patientName: "Sophia Nguyen", hospitalNumber: "PGH-2024-00456",
    documentType: "Laboratory Results", purpose: "Second opinion consultation",
    requestedBy: "Sophia Nguyen (Self)", requestedDate: "2026-04-09", status: "Ready for Release",
    releasedDate: null, releasedTo: null, feeAmount: 50, isPaid: true, verificationComplete: true,
  },
  {
    id: "DOC-005", patientId: "P005", patientName: "Michael Brown", hospitalNumber: "PGH-2024-00567",
    documentType: "Photocopy of Records", purpose: "Legal proceedings",
    requestedBy: "Atty. Roberto Cruz (with authorization letter)", requestedDate: "2026-04-06", status: "Processing",
    releasedDate: null, releasedTo: null, feeAmount: 200, isPaid: true, verificationComplete: true,
  },
]

export interface COLBRecord {
  id: string
  babyName: string
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  sex: "Male" | "Female"
  motherName: string
  motherPhilHealth: string | null
  fatherName: string
  attendingPhysician: string
  registrationType: "Timely" | "Delayed"
  status: COLBStatus
  preparedDate: string
  transmittalDate: string | null
  lcrReferenceNumber: string | null
  supportingDocsComplete: boolean
}

export const dummyCOLBRecords: COLBRecord[] = [
  {
    id: "COLB-001", babyName: "Baby Boy Santos", dateOfBirth: "2026-04-07", timeOfBirth: "14:32",
    placeOfBirth: "PGH Delivery Room 2", sex: "Male",
    motherName: "Rosa Santos", motherPhilHealth: "01-234567890-1",
    fatherName: "Juan Santos", attendingPhysician: "Dr. Ana Reyes",
    registrationType: "Timely", status: "Transmitted",
    preparedDate: "2026-04-07", transmittalDate: "2026-04-08", lcrReferenceNumber: "LCR-2026-04-0098",
    supportingDocsComplete: true,
  },
  {
    id: "COLB-002", babyName: "Baby Girl Dela Cruz", dateOfBirth: "2026-04-08", timeOfBirth: "03:15",
    placeOfBirth: "PGH Delivery Room 1", sex: "Female",
    motherName: "Elena Dela Cruz", motherPhilHealth: "01-987654321-0",
    fatherName: "Pedro Dela Cruz", attendingPhysician: "Dr. Patricia Lim",
    registrationType: "Timely", status: "Signed",
    preparedDate: "2026-04-08", transmittalDate: null, lcrReferenceNumber: null,
    supportingDocsComplete: true,
  },
  {
    id: "COLB-003", babyName: "Baby Boy Reyes", dateOfBirth: "2026-04-09", timeOfBirth: "09:45",
    placeOfBirth: "PGH OB-Gyne Ward", sex: "Male",
    motherName: "Maria Reyes", motherPhilHealth: null,
    fatherName: "Carlos Reyes", attendingPhysician: "Dr. Jose Rivera",
    registrationType: "Timely", status: "Prepared",
    preparedDate: "2026-04-09", transmittalDate: null, lcrReferenceNumber: null,
    supportingDocsComplete: false,
  },
  {
    id: "COLB-004", babyName: "Baby Girl Aquino", dateOfBirth: "2026-02-15", timeOfBirth: "11:20",
    placeOfBirth: "PGH Delivery Room 3", sex: "Female",
    motherName: "Grace Aquino", motherPhilHealth: "01-112233445-5",
    fatherName: "Roberto Aquino", attendingPhysician: "Dr. Ana Reyes",
    registrationType: "Delayed", status: "Prepared",
    preparedDate: "2026-04-09", transmittalDate: null, lcrReferenceNumber: null,
    supportingDocsComplete: false,
  },
]

export interface PhilHealthRecord {
  id: string
  patientId: string
  patientName: string
  hospitalNumber: string
  philhealthNumber: string
  membershipType: "Member" | "Dependent" | "Indigent"
  memberStatus: "Active" | "Inactive" | "Pending Verification"
  status: "Active" | "Pending Verification" | "Closed"
  admissionDate: string | null
  benefitPackage: string
  formsStatus: {
    cf1: boolean
    cf2: boolean
    cf4: boolean
    csf: boolean
  }
  totalBill: number
  philhealthDeduction: number
  zBenefitPackage: string | null
  posTransaction: boolean
}

export const dummyPhilHealthRecords: PhilHealthRecord[] = [
  {
    id: "PH-001", patientId: "P001", patientName: "John Smith", hospitalNumber: "PGH-2024-00145",
    philhealthNumber: "01-050678901-2", membershipType: "Member", memberStatus: "Active", status: "Active",
    admissionDate: "2026-04-05", benefitPackage: "All Case Rate - Medical",
    formsStatus: { cf1: true, cf2: true, cf4: true, csf: true },
    totalBill: 85000, philhealthDeduction: 32000, zBenefitPackage: null, posTransaction: false,
  },
  {
    id: "PH-002", patientId: "P002", patientName: "Maria Garcia", hospitalNumber: "PGH-2024-00230",
    philhealthNumber: "01-234567890-1", membershipType: "Dependent", memberStatus: "Active", status: "Active",
    admissionDate: "2026-04-07", benefitPackage: "All Case Rate - Surgical",
    formsStatus: { cf1: true, cf2: true, cf4: false, csf: false },
    totalBill: 120000, philhealthDeduction: 45000, zBenefitPackage: null, posTransaction: false,
  },
  {
    id: "PH-003", patientId: "P003", patientName: "David Anderson", hospitalNumber: "PGH-2024-00312",
    philhealthNumber: "N/A", membershipType: "Indigent", memberStatus: "Active", status: "Active",
    admissionDate: "2026-04-03", benefitPackage: "No Balance Billing",
    formsStatus: { cf1: true, cf2: true, cf4: true, csf: true },
    totalBill: 65000, philhealthDeduction: 65000, zBenefitPackage: null, posTransaction: true,
  },
  {
    id: "PH-004", patientId: "P006", patientName: "Emily Wong", hospitalNumber: "PGH-2024-00678",
    philhealthNumber: "01-998877665-4", membershipType: "Member", memberStatus: "Active", status: "Active",
    admissionDate: "2026-04-01", benefitPackage: "Z-Benefit Package",
    formsStatus: { cf1: true, cf2: true, cf4: true, csf: true },
    totalBill: 850000, philhealthDeduction: 600000, zBenefitPackage: "Kidney Transplant Package", posTransaction: false,
  },
  {
    id: "PH-005", patientId: "P008", patientName: "Olivia Chen", hospitalNumber: "PGH-2024-00789",
    philhealthNumber: "01-556677889-0", membershipType: "Member", memberStatus: "Pending Verification", status: "Pending Verification",
    admissionDate: null, benefitPackage: "OPD Consultation",
    formsStatus: { cf1: false, cf2: false, cf4: false, csf: false },
    totalBill: 0, philhealthDeduction: 0, zBenefitPackage: null, posTransaction: false,
  },
]

export interface RecordRetrievalRequest {
  id: string
  patientId: string
  patientName: string
  hospitalNumber: string
  requestedDate: string
  requestedBy: string
  purpose: string
  status: RetrievalStatus
  retrievedDate: string | null
  returnedDate: string | null
}

export const dummyRetrievalRequests: RecordRetrievalRequest[] = [
  {
    id: "RR-001", patientId: "P001", patientName: "John Smith", hospitalNumber: "PGH-2024-00145",
    requestedDate: "2026-04-09", requestedBy: "OPD - Internal Medicine",
    purpose: "Follow-up consultation", status: "Retrieved",
    retrievedDate: "2026-04-09", returnedDate: null,
  },
  {
    id: "RR-002", patientId: "P002", patientName: "Maria Garcia", hospitalNumber: "PGH-2024-00230",
    requestedDate: "2026-04-09", requestedBy: "OPD - Surgery",
    purpose: "Pre-operative assessment", status: "Requested",
    retrievedDate: null, returnedDate: null,
  },
  {
    id: "RR-003", patientId: "P005", patientName: "Michael Brown", hospitalNumber: "PGH-2024-00567",
    requestedDate: "2026-04-08", requestedBy: "OPD - Orthopedics",
    purpose: "Post-surgery follow-up", status: "Out for Consultation",
    retrievedDate: "2026-04-08", returnedDate: null,
  },
  {
    id: "RR-004", patientId: "P006", patientName: "Emily Wong", hospitalNumber: "PGH-2024-00678",
    requestedDate: "2026-04-07", requestedBy: "Ward 5A - Oncology",
    purpose: "Chemotherapy treatment", status: "Returned",
    retrievedDate: "2026-04-07", returnedDate: "2026-04-08",
  },
]
