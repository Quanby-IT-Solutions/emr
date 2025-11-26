"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import MedicationTable from "./components/medication-table"
import PendingMedicationTable from "./components/pending-medication-table"
import { MedicationStepper } from "./components/medication-stepper"
import { useState } from "react"
import { MedicationProfileEntries, MedicationProfile } from "../../dummy-data/dummy-medication-admin"


export default function MedicationsPage() {
  const [medicationsData, setMedicationsData] = useState<MedicationProfile[]>(MedicationProfileEntries)
  const [activeStep, setActiveStep] = useState<"pending" | "administered">("pending")

  // Calculate pending medications count (those with pending orders)
  const pendingCount = medicationsData.filter(profile => 
    profile.patient.medicationOrders.length > 0
  ).length

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Medication Administration</h1>
            <p className="text-muted-foreground">
              Administer and track medications
            </p>
          </div>

          {/* Stepper Section */}
          <div className="px-4 lg:px-6">
            <MedicationStepper 
              activeStep={activeStep}
              onStepChange={setActiveStep}
              pendingCount={pendingCount}
            />
          </div>

          {/* Table Section */}
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
                  {activeStep === "pending" ? (
                    <PendingMedicationTable data={medicationsData} />
                  ) : (
                    <MedicationTable data={medicationsData} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}