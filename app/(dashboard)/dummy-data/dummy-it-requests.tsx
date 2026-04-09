export type RequestStatus = "Received" | "In Progress" | "Resolved" | "Closed"
export type RequestType = "Equipment Repair" | "Preventive Maintenance" | "Network/Internet" | "Network Cabling" | "Teleconferencing" | "VPN/Synapse" | "Zoom Webinar" | "HDTV/Website Posting"
export type PriorityLevel = "Low" | "Medium" | "High" | "Critical"

export interface ITServiceRequest {
  id: string
  ticketNumber: string
  requestType: RequestType
  subject: string
  description: string
  requestingDepartment: string
  requestedBy: string
  status: RequestStatus
  priority: PriorityLevel
  assignedTechnician: string | null
  dateSubmitted: string
  dueDate: string | null
  resolvedDate: string | null
  resolutionNotes: string | null
  equipmentDescription: string | null
}

export const dummyITRequests: ITServiceRequest[] = [
  {
    id: "IT-001",
    ticketNumber: "SR-2026-001",
    requestType: "Equipment Repair",
    subject: "Printer malfunction in Ward 3B",
    description: "HP LaserJet Pro in nursing station not printing. Shows paper jam error but no visible jam.",
    requestingDepartment: "Division of Nursing",
    requestedBy: "Maria Santos, RN",
    status: "In Progress",
    priority: "High",
    assignedTechnician: "Carlos Reyes",
    dateSubmitted: "2026-04-07",
    dueDate: "2026-04-09",
    resolvedDate: null,
    resolutionNotes: null,
    equipmentDescription: "HP LaserJet Pro M404dn - Asset #PGH-PRN-0342"
  },
  {
    id: "IT-002",
    ticketNumber: "SR-2026-002",
    requestType: "Network/Internet",
    subject: "Slow internet connection in OPD",
    description: "Outpatient Department experiencing extremely slow internet connectivity affecting patient registration.",
    requestingDepartment: "Outpatient Department",
    requestedBy: "Ana Cruz",
    status: "Received",
    priority: "Critical",
    assignedTechnician: null,
    dateSubmitted: "2026-04-09",
    dueDate: null,
    resolvedDate: null,
    resolutionNotes: null,
    equipmentDescription: null
  },
  {
    id: "IT-003",
    ticketNumber: "SR-2026-003",
    requestType: "VPN/Synapse",
    subject: "VPN access for new resident physician",
    description: "Request VPN access for Dr. Elena Marcos, new resident in Department of Surgery.",
    requestingDepartment: "Department of Surgery",
    requestedBy: "Dr. Jose Rivera",
    status: "Resolved",
    priority: "Medium",
    assignedTechnician: "Miguel Torres",
    dateSubmitted: "2026-04-05",
    dueDate: "2026-04-08",
    resolvedDate: "2026-04-07",
    resolutionNotes: "VPN credentials created and sent to requesting department. User verified access.",
    equipmentDescription: null
  },
  {
    id: "IT-004",
    ticketNumber: "SR-2026-004",
    requestType: "Teleconferencing",
    subject: "Zoom setup for department meeting",
    description: "Need Zoom Webinar setup for monthly Department of Medicine meeting on April 15.",
    requestingDepartment: "Department of Medicine",
    requestedBy: "Dr. Patricia Lim",
    status: "Received",
    priority: "Medium",
    assignedTechnician: null,
    dateSubmitted: "2026-04-08",
    dueDate: "2026-04-15",
    resolvedDate: null,
    resolutionNotes: null,
    equipmentDescription: "Conference Room 2A - Projector & Audio System"
  },
  {
    id: "IT-005",
    ticketNumber: "SR-2026-005",
    requestType: "Preventive Maintenance",
    subject: "Quarterly maintenance - Radiology workstations",
    description: "Scheduled PM for 6 workstations in Radiology Department including disk cleanup and updates.",
    requestingDepartment: "Department of Radiology",
    requestedBy: "IT Scheduled",
    status: "In Progress",
    priority: "Low",
    assignedTechnician: "Anna Dela Cruz",
    dateSubmitted: "2026-04-01",
    dueDate: "2026-04-12",
    resolvedDate: null,
    resolutionNotes: null,
    equipmentDescription: "6x Dell OptiPlex Workstations"
  },
  {
    id: "IT-006",
    ticketNumber: "SR-2026-006",
    requestType: "Equipment Repair",
    subject: "Monitor flickering - ER Triage",
    description: "Primary monitor at ER triage desk flickering intermittently. Staff reporting eye strain.",
    requestingDepartment: "Emergency Room",
    requestedBy: "Nurse Joy Reyes",
    status: "Received",
    priority: "High",
    assignedTechnician: null,
    dateSubmitted: "2026-04-09",
    dueDate: null,
    resolvedDate: null,
    resolutionNotes: null,
    equipmentDescription: "Dell 24\" Monitor - Asset #PGH-MON-0198"
  },
  {
    id: "IT-007",
    ticketNumber: "SR-2026-007",
    requestType: "Network Cabling",
    subject: "New network drop for OPD expansion",
    description: "Need 4 new network drops for the OPD expansion area on 2nd floor.",
    requestingDepartment: "Outpatient Department",
    requestedBy: "Facilities Management",
    status: "In Progress",
    priority: "Medium",
    assignedTechnician: "Carlos Reyes",
    dateSubmitted: "2026-04-03",
    dueDate: "2026-04-14",
    resolvedDate: null,
    resolutionNotes: null,
    equipmentDescription: "Cat6 Ethernet Cabling - 4 drops"
  },
  {
    id: "IT-008",
    ticketNumber: "SR-2026-008",
    requestType: "HDTV/Website Posting",
    subject: "Update PGH website - new OPD schedule",
    description: "Post updated OPD consultation schedules for April-May 2026 on the PGH website.",
    requestingDepartment: "Public Affairs Office",
    requestedBy: "Sarah Mendoza",
    status: "Closed",
    priority: "Low",
    assignedTechnician: "Miguel Torres",
    dateSubmitted: "2026-04-01",
    dueDate: "2026-04-03",
    resolvedDate: "2026-04-02",
    resolutionNotes: "Schedule posted to PGH website and HDTV display screens across OPD.",
    equipmentDescription: null
  },
  {
    id: "IT-009",
    ticketNumber: "SR-2026-009",
    requestType: "Equipment Repair",
    subject: "Barcode scanner not reading - Pharmacy",
    description: "Honeywell barcode scanner at pharmacy dispensing window stopped reading barcodes.",
    requestingDepartment: "Pharmacy",
    requestedBy: "RPh. Grace Tan",
    status: "Resolved",
    priority: "High",
    assignedTechnician: "Anna Dela Cruz",
    dateSubmitted: "2026-04-06",
    dueDate: "2026-04-07",
    resolvedDate: "2026-04-07",
    resolutionNotes: "Replaced USB cable and cleaned scanner lens. Working normally now.",
    equipmentDescription: "Honeywell Voyager 1450g - Asset #PGH-SCN-0067"
  },
  {
    id: "IT-010",
    ticketNumber: "SR-2026-010",
    requestType: "Zoom Webinar",
    subject: "CME webinar setup for Grand Rounds",
    description: "Setup Zoom Webinar for PGH Grand Rounds CME event on April 18, expected 200+ participants.",
    requestingDepartment: "Medical Education",
    requestedBy: "Dr. Roberto Aquino",
    status: "Received",
    priority: "Medium",
    assignedTechnician: null,
    dateSubmitted: "2026-04-09",
    dueDate: "2026-04-18",
    resolvedDate: null,
    resolutionNotes: null,
    equipmentDescription: "Auditorium A/V System + Zoom Webinar License"
  },
]

export const itTechnicians = [
  "Carlos Reyes",
  "Miguel Torres",
  "Anna Dela Cruz",
  "Roberto Santos",
  "Jenny Lim",
]
