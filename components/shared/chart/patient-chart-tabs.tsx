"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  IconBuildingHospital,
  IconHistory,
  IconPill,
  IconFileText,
  IconChartBar
} from '@tabler/icons-react'
import { UserRole } from "@/lib/auth/roles"
import { EncountersTab } from "./tabs/encounters-tab"
import { FlowsheetTab } from "./tabs/flowsheet-tab"
import { ClinicalNotesTab } from "./tabs/clinical-notes-tab"
import { MedicalHistoryTab } from "./tabs/medical-history-tab"
import { OrdersTab } from "./tabs/orders-tab"

interface PatientChartTabsProps {
  patientData: any
  role: UserRole
  staffId: string
}

export function PatientChartTabs({ patientData, role, staffId }: PatientChartTabsProps) {
  return (
    <Tabs defaultValue="encounters" className="w-full">
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="encounters">
          <IconBuildingHospital className="h-4 w-4 mr-2" />
          Encounters
        </TabsTrigger>
        <TabsTrigger value="chart">
          <IconChartBar className="h-4 w-4 mr-2" />
          Chart
        </TabsTrigger>
        <TabsTrigger value="clinical-notes">
          <IconFileText className="h-4 w-4 mr-2" />
          Clinical Notes
        </TabsTrigger>
        <TabsTrigger value="history">
          <IconHistory className="h-4 w-4 mr-2" />
          Medical History
        </TabsTrigger>
        <TabsTrigger value="orders">
          <IconPill className="h-4 w-4 mr-2" />
          Orders
        </TabsTrigger>
      </TabsList>

      <EncountersTab patientData={patientData} />
      
      <FlowsheetTab 
        patientData={patientData}
        role={role}
        staffId={staffId}
      />
      
      <ClinicalNotesTab 
        patientData={patientData}
        role={role}
        staffId={staffId}
      />
      
      <MedicalHistoryTab 
        patientData={patientData}
        role={role}
        staffId={staffId}
      />
      
      <OrdersTab patientData={patientData} />
    </Tabs>
  )
}