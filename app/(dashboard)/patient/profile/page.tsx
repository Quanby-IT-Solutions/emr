"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconShieldCheck,
} from "@tabler/icons-react"

type Address = {
  street?: string
  city?: string
  state?: string
  zipCode?: string
}

type PatientInsurance = {
  id: string
  providerName: string
  policyNumber: string
  groupNumber: string | null
  priority: "PRIMARY" | "SECONDARY" | "TERTIARY"
  isActive: boolean
}

type PatientData = {
  id: string
  mrn: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string | null
  contactPhone: string | null
  email: string | null
  address: Address | null
  isVipOrConfidential: boolean
  patientInsurances: PatientInsurance[]
}

const MOCK_PATIENT_DATA: PatientData = {
  id: "pat_123456789",
  mrn: "MRN-2024-001234",
  firstName: "Juan",
  lastName: "Dela Cruz",
  dateOfBirth: "1985-06-15",
  gender: "Male",
  contactPhone: "+63 917 123 4567",
  email: "juan.delacruz@email.com",
  address: {
    street: "123 Rizal Street, Barangay San Jose",
    city: "Manila",
    state: "Metro Manila",
    zipCode: "1000",
  },
  isVipOrConfidential: false,
  patientInsurances: [
    {
      id: "ins_001",
      providerName: "PhilHealth",
      policyNumber: "12-345678901-2",
      groupNumber: "GRP-001",
      priority: "PRIMARY",
      isActive: true,
    },
    {
      id: "ins_002",
      providerName: "Maxicare Healthcare Corporation",
      policyNumber: "MAX-2024-98765",
      groupNumber: "CORP-ABC-123",
      priority: "SECONDARY",
      isActive: true,
    },
  ],
}

export default function MyProfilePage() {
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<PatientData | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await new Promise((r) => setTimeout(r, 600))
      if (!cancelled) {
        setPatient(MOCK_PATIENT_DATA)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "PRIMARY":
        return <Badge variant="default">Primary</Badge>
      case "SECONDARY":
        return <Badge variant="secondary">Secondary</Badge>
      case "TERTIARY":
        return <Badge variant="outline">Tertiary</Badge>
      default:
        return null
    }
  }

  if (loading && !patient) {
    return (
      <ProtectedRoute requiredRole={UserRole.PATIENT}>
        <DashboardLayout role={UserRole.PATIENT}>
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
              <p className="text-muted-foreground">Loading profile…</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (!patient) {
    return (
      <ProtectedRoute requiredRole={UserRole.PATIENT}>
        <DashboardLayout role={UserRole.PATIENT}>
          <div className="flex h-96 items-center justify-center">
            <p className="text-muted-foreground">Profile not found</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">My profile</h1>
            <p className="max-w-3xl text-muted-foreground">
              Demographics and coverage shown here are read-only in the portal. Updates to legal
              identity or insurance are handled by registration or billing staff.
            </p>
          </div>

          <div className="space-y-6 px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/avatars/default.png" />
                    <AvatarFallback className="text-2xl">
                      {patient.firstName[0]}
                      {patient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {patient.firstName} {patient.lastName}
                    </h2>
                    <p className="text-muted-foreground">MRN: {patient.mrn}</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <Badge variant="outline" className="text-sm">
                        <IconCalendar className="mr-1 h-3 w-3" />
                        {calculateAge(patient.dateOfBirth)} years old
                      </Badge>
                      {patient.gender && <Badge variant="outline">{patient.gender}</Badge>}
                      {patient.isVipOrConfidential && (
                        <Badge variant="secondary" className="text-sm">
                          <IconShieldCheck className="mr-1 h-3 w-3" />
                          Confidential
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="h-5 w-5" />
                  Identity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">First name</p>
                    <p className="font-medium">{patient.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last name</p>
                    <p className="font-medium">{patient.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of birth</p>
                    <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{patient.gender ?? "Not specified"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Medical record number</p>
                    <p className="font-mono font-medium">{patient.mrn}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconMail className="h-5 w-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <IconMail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{patient.email ?? "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <IconPhone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{patient.contactPhone ?? "Not provided"}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <IconMapPin className="h-4 w-4" />
                    Address
                  </h4>
                  <p className="font-medium">{patient.address?.street ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">
                    {[patient.address?.city, patient.address?.state, patient.address?.zipCode]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insurance</CardTitle>
                <CardDescription>Plan information on file (read-only)</CardDescription>
              </CardHeader>
              <CardContent>
                {patient.patientInsurances.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">No insurance on file</p>
                ) : (
                  <div className="space-y-4">
                    {patient.patientInsurances
                      .filter((ins) => ins.isActive)
                      .sort((a, b) => {
                        const order: Record<string, number> = { PRIMARY: 1, SECONDARY: 2, TERTIARY: 3 }
                        return order[a.priority] - order[b.priority]
                      })
                      .map((insurance) => (
                        <Card key={insurance.id} className="bg-muted/40">
                          <CardContent className="pt-6">
                            <div className="mb-3 flex items-start justify-between">
                              <h4 className="text-lg font-semibold">{insurance.providerName}</h4>
                              {getPriorityBadge(insurance.priority)}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Policy</p>
                                <p className="font-medium">{insurance.policyNumber}</p>
                              </div>
                              {insurance.groupNumber && (
                                <div>
                                  <p className="text-muted-foreground">Group</p>
                                  <p className="font-medium">{insurance.groupNumber}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
