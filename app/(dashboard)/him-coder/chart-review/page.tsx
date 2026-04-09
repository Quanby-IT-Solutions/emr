"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { IconUser, IconStethoscope, IconBed } from "@tabler/icons-react"
import {
  NotesPanel,
  LabResultsPanel,
  ImagingPanel,
  OrdersPanel,
  type ChartNote,
  type LabResult,
  type ImagingReport,
  type OrderSummary,
} from "./components/clinical-notes-viewer"
import { DeficiencyChecklist, type DeficiencyItem } from "./components/deficiency-checklist"

// --- Mock Data ---

const encounterInfo = {
  id: "ENC-2026-0041",
  patient: "John Doe",
  mrn: "MRN-001",
  dob: "Jan 15, 1958",
  age: 68,
  sex: "Male",
  encounterType: "IPD" as const,
  admissionDate: "Apr 1, 2026",
  dischargeDate: "Apr 9, 2026",
  attendingProvider: "Dr. Sarah Johnson",
  unit: "Medical Ward",
  room: "Room 301-A",
  disposition: "Discharged to Home",
}

const mockNotes: ChartNote[] = [
  {
    id: "n1",
    noteType: "H&P (History & Physical)",
    author: "Dr. Sarah Johnson",
    date: "Apr 1, 2026 10:30",
    status: "Signed",
    sections: [
      { title: "Chief Complaint", content: "Uncontrolled blood glucose and shortness of breath." },
      { title: "HPI", content: "68-year-old male with poorly controlled Type 2 DM presenting with 3-day history of polyuria, polydipsia, and progressive dyspnea on exertion." },
      { title: "Physical Exam", content: "Afebrile. BP 148/92, HR 96. Lungs: bibasilar crackles. Extremities: 1+ bilateral pedal edema." },
      { title: "Assessment & Plan", content: "1. Type 2 DM, uncontrolled — adjust insulin regimen, monitor BG q6h. 2. CHF exacerbation — IV furosemide, strict I&O, daily weights." },
    ],
  },
  {
    id: "n2",
    noteType: "SOAP Progress Note",
    author: "Dr. Sarah Johnson",
    date: "Apr 5, 2026 08:15",
    status: "Signed",
    sections: [
      { title: "Subjective", content: "Patient reports improved breathing. No overnight dyspnea." },
      { title: "Objective", content: "BP 130/80, HR 78. Lungs clear. Weight down 3 kg from admission." },
      { title: "Assessment", content: "CHF responding well to diuresis. DM control improving." },
      { title: "Plan", content: "Continue current regimen. Repeat BMP afternoon. Begin discharge planning." },
    ],
  },
  {
    id: "n3",
    noteType: "Discharge Summary",
    author: "Dr. Sarah Johnson",
    date: "Apr 9, 2026 09:00",
    status: "Unsigned",
    sections: [
      { title: "Admission Diagnosis", content: "Type 2 DM, uncontrolled; CHF exacerbation." },
      { title: "Hospital Course", content: "Patient responded to insulin adjustment and diuretic therapy. Weight decreased 4.2 kg. Blood glucose stabilized." },
      { title: "Discharge Diagnosis", content: "Type 2 DM — improved. CHF — compensated." },
      { title: "Discharge Medications", content: "Insulin glargine 20 units SQ QHS, Furosemide 40mg PO daily, Lisinopril 20mg PO daily, Metformin 1000mg PO BID." },
      { title: "Follow-Up", content: "PCP in 3 days. Endocrinology in 2 weeks. Cardiology in 1 week." },
    ],
  },
  {
    id: "n4",
    noteType: "Consultation — Cardiology",
    author: "Dr. Michael Chen",
    date: "Apr 3, 2026 14:20",
    status: "Cosigned",
    sections: [
      { title: "Reason for Consultation", content: "CHF management during acute DM decompensation." },
      { title: "Findings", content: "Echo shows EF 40%, mild LV dilation. No significant valvular disease." },
      { title: "Recommendations", content: "Optimize heart failure medications. Consider adding spironolactone after potassium stabilization." },
    ],
  },
]

const progressNotes = mockNotes.filter((n) =>
  n.noteType.includes("SOAP") || n.noteType.includes("Progress")
)

const dischargeSummaries = mockNotes.filter((n) =>
  n.noteType.includes("Discharge")
)

const hpNotes = mockNotes.filter((n) =>
  n.noteType.includes("H&P")
)

const consultNotes = mockNotes.filter((n) =>
  n.noteType.includes("Consultation")
)

const mockLabResults: LabResult[] = [
  { id: "l1", testName: "HbA1c", value: "9.8", unit: "%", referenceRange: "4.0–5.6", flag: "Critical", date: "Apr 1, 2026" },
  { id: "l2", testName: "Glucose (Fasting)", value: "245", unit: "mg/dL", referenceRange: "70–100", flag: "Abnormal", date: "Apr 1, 2026" },
  { id: "l3", testName: "BNP", value: "680", unit: "pg/mL", referenceRange: "< 100", flag: "Abnormal", date: "Apr 1, 2026" },
  { id: "l4", testName: "Creatinine", value: "1.4", unit: "mg/dL", referenceRange: "0.7–1.3", flag: "Abnormal", date: "Apr 2, 2026" },
  { id: "l5", testName: "Potassium", value: "4.5", unit: "mEq/L", referenceRange: "3.5–5.0", flag: "Normal", date: "Apr 5, 2026" },
  { id: "l6", testName: "Sodium", value: "138", unit: "mEq/L", referenceRange: "136–145", flag: "Normal", date: "Apr 5, 2026" },
  { id: "l7", testName: "Glucose (Fasting)", value: "130", unit: "mg/dL", referenceRange: "70–100", flag: "Abnormal", date: "Apr 8, 2026" },
  { id: "l8", testName: "BNP", value: "180", unit: "pg/mL", referenceRange: "< 100", flag: "Abnormal", date: "Apr 8, 2026" },
]

const mockImaging: ImagingReport[] = [
  {
    id: "i1",
    study: "Chest X-Ray PA/Lat",
    radiologist: "Dr. Kevin Wright",
    date: "Apr 1, 2026",
    finding: "Bilateral pleural effusions, small. Mild cardiomegaly. No consolidation.",
    impression: "Findings consistent with congestive heart failure.",
    critical: false,
  },
  {
    id: "i2",
    study: "Echocardiogram",
    radiologist: "Dr. Anna Lopez",
    date: "Apr 3, 2026",
    finding: "LV ejection fraction 40%. Mild LV dilation. No significant valvular abnormality. Trivial pericardial effusion.",
    impression: "Moderate systolic dysfunction. Recommend follow-up in 3 months.",
    critical: false,
  },
]

const mockOrders: OrderSummary[] = [
  { id: "o1", type: "Medication", item: "Insulin Glargine 20 units SQ QHS", status: "Completed", orderedBy: "Dr. Sarah Johnson", date: "Apr 1, 2026" },
  { id: "o2", type: "Medication", item: "Furosemide 40mg IV BID", status: "Completed", orderedBy: "Dr. Sarah Johnson", date: "Apr 1, 2026" },
  { id: "o3", type: "Lab", item: "Basic Metabolic Panel", status: "Completed", orderedBy: "Dr. Sarah Johnson", date: "Apr 5, 2026" },
  { id: "o4", type: "Lab", item: "HbA1c", status: "Completed", orderedBy: "Dr. Sarah Johnson", date: "Apr 1, 2026" },
  { id: "o5", type: "Lab", item: "BNP", status: "Completed", orderedBy: "Dr. Sarah Johnson", date: "Apr 1, 2026" },
  { id: "o6", type: "Imaging", item: "Chest X-Ray PA/Lat", status: "Completed", orderedBy: "Dr. Sarah Johnson", date: "Apr 1, 2026" },
  { id: "o7", type: "Imaging", item: "Echocardiogram", status: "Completed", orderedBy: "Dr. Michael Chen", date: "Apr 3, 2026" },
  { id: "o8", type: "Discharge", item: "Discharge to Home", status: "Completed", orderedBy: "Dr. Sarah Johnson", date: "Apr 9, 2026" },
]

const mockDeficiencies: DeficiencyItem[] = [
  { id: "d1", label: "H&P Signed", required: true, status: "Complete" },
  { id: "d2", label: "Discharge Summary Signed", required: true, status: "Missing" },
  { id: "d3", label: "Consultation Note Cosigned", required: true, status: "Complete" },
  { id: "d4", label: "Operative Note Present", required: false, status: "Complete" },
  { id: "d5", label: "Progress Notes Signed (all)", required: true, status: "Complete" },
  { id: "d6", label: "Consent Forms Scanned", required: true, status: "Complete" },
  { id: "d7", label: "Discharge Instructions Documented", required: true, status: "Incomplete" },
  { id: "d8", label: "Medication Reconciliation Completed", required: true, status: "Complete" },
]

const encounterTypeBadge: Record<string, string> = {
  OPD: "bg-blue-100 text-blue-800 border-blue-300",
  ER: "bg-orange-100 text-orange-800 border-orange-300",
  IPD: "bg-purple-100 text-purple-800 border-purple-300",
}

export default function ChartReviewPage() {
  const [activeDocTab, setActiveDocTab] = useState("all-notes")

  return (
    <ProtectedRoute requiredRole={UserRole.HIM_CODER}>
      <DashboardLayout role={UserRole.HIM_CODER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Chart Review</h1>
            <p className="text-muted-foreground">
              Review patient chart for completeness before coding
            </p>
          </div>

          {/* Encounter & Patient Information */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <IconUser className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-base">{encounterInfo.patient}</p>
                      <p className="text-muted-foreground">MRN: {encounterInfo.mrn}</p>
                      <p className="text-muted-foreground">DOB: {encounterInfo.dob} ({encounterInfo.age} yrs, {encounterInfo.sex})</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <IconStethoscope className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{encounterInfo.id}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={encounterTypeBadge[encounterInfo.encounterType]}>{encounterInfo.encounterType}</Badge>
                        <span className="text-muted-foreground">{encounterInfo.attendingProvider}</span>
                      </div>
                      <p className="text-muted-foreground">
                        {encounterInfo.admissionDate} → {encounterInfo.dischargeDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <IconBed className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{encounterInfo.unit}</p>
                      <p className="text-muted-foreground">{encounterInfo.room}</p>
                      <p className="text-muted-foreground">Disposition: {encounterInfo.disposition}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: Clinical Docs + Deficiency Checklist */}
          <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
            {/* Clinical Documentation Viewer — 2/3 width */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Clinical Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeDocTab} onValueChange={setActiveDocTab}>
                    <TabsList className="h-auto flex-wrap justify-start">
                      <TabsTrigger value="all-notes">All Notes</TabsTrigger>
                      <TabsTrigger value="hp">H&P</TabsTrigger>
                      <TabsTrigger value="progress">Progress Notes</TabsTrigger>
                      <TabsTrigger value="discharge">Discharge Summary</TabsTrigger>
                      <TabsTrigger value="consult">Consultations</TabsTrigger>
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="labs">Lab Results</TabsTrigger>
                      <TabsTrigger value="imaging">Imaging</TabsTrigger>
                    </TabsList>

                    <div className="mt-4">
                      <TabsContent value="all-notes">
                        <NotesPanel notes={mockNotes} />
                      </TabsContent>
                      <TabsContent value="hp">
                        <NotesPanel notes={hpNotes} />
                      </TabsContent>
                      <TabsContent value="progress">
                        <NotesPanel notes={progressNotes} />
                      </TabsContent>
                      <TabsContent value="discharge">
                        <NotesPanel notes={dischargeSummaries} />
                      </TabsContent>
                      <TabsContent value="consult">
                        <NotesPanel notes={consultNotes} />
                      </TabsContent>
                      <TabsContent value="orders">
                        <OrdersPanel orders={mockOrders} />
                      </TabsContent>
                      <TabsContent value="labs">
                        <LabResultsPanel results={mockLabResults} />
                      </TabsContent>
                      <TabsContent value="imaging">
                        <ImagingPanel reports={mockImaging} />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Deficiency Checklist — 1/3 width */}
            <div>
              <DeficiencyChecklist
                items={mockDeficiencies}
                onMarkComplete={() => {}}
                onFlagDeficiency={() => {}}
                onSendToCoding={() => {}}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
