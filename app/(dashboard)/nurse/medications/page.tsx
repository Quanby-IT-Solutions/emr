"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import MedicationTable from "./components/medication-table"
import PendingMedicationTable from "./components/pending-medication-table"
import { MedicationStepper } from "./components/medication-stepper"
import { useState } from "react"
import type { MedicationProfile } from "@/lib/api/medications-client"
import { ViewMedRecordModal } from "./components/view-med-record-modal"
import { AdministerMedicineWizard } from "./components/administer-med-modal"
import type { AdministrationData, MedicationOrder } from "@/components/shared/nurse/medication/types"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { medicationsClient, type ApiMedOrder } from "@/lib/api/medications-client"
import { toast } from "sonner"

type MedOrderDetails = {
  genericName?: string
  medicationName?: string
  brandName?: string
  classification?: string
  dosageForm?: string
  dosageUnit?: string
  dose?: string
  frequency?: string
  route?: string
  schedule?: string[]
  instructions?: string
  prescribedBy?: string
}

function ordersToProfiles(orders: ApiMedOrder[]): MedicationProfile[] {
  const grouped = new Map<string, ApiMedOrder[]>()
  for (const order of orders) {
    const pid = order.encounter.patient.id
    grouped.set(pid, [...(grouped.get(pid) ?? []), order])
  }

  return [...grouped.entries()].map(([, patientOrders]) => {
    const { encounter } = patientOrders[0]
    const { patient, currentLocation } = encounter

    const medOrders: MedicationOrder[] = patientOrders.map((o) => {
      const d = (o.details ?? {}) as MedOrderDetails
      return {
        medicationOrderId: o.id,
        medicationDetails: {
          medicationId: o.id,
          medicationGenericName: d.genericName ?? d.medicationName ?? "Unknown",
          medicationBrandName: d.brandName ?? "",
          medicationClassification: d.classification ?? "",
          dosageForm: d.dosageForm ?? "",
          dosageUnit: d.dosageUnit ?? "",
        },
        orderedDosage: d.dose ?? "",
        orderedFrequency: d.frequency ?? "",
        routeOfAdministration: d.route ?? "",
        timeAdminSchedule: d.schedule ?? [],
        startDate: new Date(o.createdAt),
        stopDate: new Date(o.createdAt),
        physician: d.prescribedBy ?? "Provider",
        specialInstructions: d.instructions ?? "",
        attemptAdministerToday: true,
        status: o.status === "VERIFIED" ? "PENDING" : "ACTIVE",
      }
    })

    const admins = patientOrders.flatMap((o) => {
      const d = (o.details ?? {}) as MedOrderDetails
      return o.medicationAdministrations.map((a) => ({
        administeredMedOrderId: a.id,
        medicationId: o.id,
        medicationGenericName: d.genericName ?? d.medicationName ?? "Medication",
        medicationBrandName: d.brandName ?? "",
        medicationClassification: d.classification ?? "",
        dosageAdministered: "-",
        timeAdministered: new Date(a.administrationTime).toLocaleTimeString(),
        dateAdministered: new Date(a.administrationTime),
        administeringNurse: `${a.nurse.firstName} ${a.nurse.lastName}`,
        isAdministered: a.status === "GIVEN",
        nurseNotes: "",
        refusalReason: a.reasonForOmission ?? "",
      }))
    })

    const last = admins[0]
    return {
      patient: {
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        ageSex: patient.gender ?? "N/A",
        currentPhysician: "Provider",
        currentWard: currentLocation?.unit ?? "-",
        currentRoom: currentLocation?.roomNumber ?? "-",
        chiefComplaint: "-",
        diagnosis: "-",
        allergies: "-",
        lastAdministeredMedication: last?.medicationGenericName ?? "-",
        lastTimeAdministered: last?.timeAdministered ?? "-",
        dosageGiven: last?.dosageAdministered ?? "-",
        medicationOrders: medOrders,
        administeredMedicationRecords: admins,
      },
    } satisfies MedicationProfile
  })
}

export default function MedicationsPage() {
  const queryClient = useQueryClient()
  const [activeStep, setActiveStep] = useState<"pending" | "administered">("pending")
  const [openViewRecord, setOpenViewRecord] = useState(false)
  const [openAdministerModal, setOpenAdministerModal] = useState(false)
  const [selectedPatientProfile, setSelectedPatientProfile] = useState<MedicationProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["medication-administrations"],
    queryFn: () => medicationsClient.listPendingOrders(),
  })

  const medicationsData = data ? ordersToProfiles(data.orders) : []

  const administerMutation = useMutation({
    mutationFn: (body: Parameters<typeof medicationsClient.administer>[0]) =>
      medicationsClient.administer(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medication-administrations"] })
      toast.success("Medication administered successfully")
      setOpenAdministerModal(false)
      setSelectedPatientProfile(null)
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to record administration")
    },
  })

  const pendingCount = medicationsData.filter((p) => p.patient.medicationOrders.length > 0).length

  const filteredMedRecords = medicationsData.filter((p) =>
    p.patient.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewRecord = (profile: MedicationProfile) => {
    setSelectedPatientProfile(profile)
    setOpenViewRecord(true)
  }

  const handleAdminister = (profile: MedicationProfile) => {
    setSelectedPatientProfile(profile)
    setOpenAdministerModal(true)
  }

  const handleAdministrationSubmit = (data: AdministrationData, medOrder: MedicationOrder) => {
    administerMutation.mutate({
      orderId: medOrder.medicationOrderId,
      status: data.isAdministered ? "GIVEN" : "REFUSED",
      administrationTime: new Date(
        `${new Date().toDateString()} ${data.timeAdministered}`
      ).toISOString(),
      reasonForOmission: data.isAdministered ? undefined : data.refusalReason,
    })
  }

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Medication Administration</h1>
            <p className="text-muted-foreground">Administer and track medications</p>
          </div>

          <div className="px-4 lg:px-6">
            <MedicationStepper
              activeStep={activeStep}
              onStepChange={setActiveStep}
              pendingCount={pendingCount}
            />
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="grid md:grid-cols-6">
                <div className="md:col-span-5">
                  <CardTitle className="mb-1">
                    {activeStep === "pending"
                      ? "Pending Medications"
                      : "Medication Administration Records"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search Patient name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {isLoading ? (
                    <p className="text-center text-muted-foreground py-8">Loading medication orders...</p>
                  ) : activeStep === "pending" ? (
                    <PendingMedicationTable
                      data={filteredMedRecords}
                      onViewRecord={handleViewRecord}
                      onAdminister={handleAdminister}
                    />
                  ) : (
                    <MedicationTable data={filteredMedRecords} onViewRecord={handleViewRecord} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <ViewMedRecordModal
            open={openViewRecord}
            onOpenChange={setOpenViewRecord}
            selectedPatient={selectedPatientProfile}
          />

          <AdministerMedicineWizard
            open={openAdministerModal}
            onOpenChange={setOpenAdministerModal}
            patient={selectedPatientProfile?.patient || null}
            selectedOrder={selectedPatientProfile?.patient?.medicationOrders?.[0] || null}
            onSubmit={handleAdministrationSubmit}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
