"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/context"
import { UserRole, ROLE_LABELS } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  IconUser,
  IconMail,
  IconShield,
  IconBuildingHospital,
  IconBriefcase,
} from "@tabler/icons-react"

const PATIENT_PROFILE = {
  firstName: "Juan",
  lastName: "Dela Cruz",
  mrn: "MRN-2024-001234",
  dateOfBirth: "1985-06-15",
  gender: "Male",
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">Loading profile…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        <p className="text-muted-foreground">Redirecting to login…</p>
      </div>
    )
  }

  const isPatient = user.role === UserRole.PATIENT
  const isStaff = !isPatient

  const staffInfo = isStaff && user.staffFirstName
    ? { firstName: user.staffFirstName, lastName: user.staffLastName ?? '', jobTitle: user.staffJobTitle ?? '', department: user.staffDepartment ?? '' }
    : null
  const patientInfo = isPatient ? PATIENT_PROFILE : null

  const getInitials = (first: string, last: string) =>
    `${first[0]}${last[0]}`.toUpperCase()

  const roleLabel = ROLE_LABELS[user.role]

  return (
    <DashboardLayout role={user.role}>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="max-w-3xl text-muted-foreground">
            View your account information and role details.
          </p>
        </div>

        <div className="space-y-6 px-4 lg:px-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {staffInfo
                      ? getInitials(staffInfo.firstName, staffInfo.lastName)
                      : patientInfo
                        ? getInitials(patientInfo.firstName, patientInfo.lastName)
                        : user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {staffInfo
                      ? `${staffInfo.firstName} ${staffInfo.lastName}`
                      : patientInfo
                        ? `${patientInfo.firstName} ${patientInfo.lastName}`
                        : user.username}
                  </h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="default">{roleLabel}</Badge>
                    {patientInfo?.mrn && (
                      <Badge variant="outline">MRN: {patientInfo.mrn}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{roleLabel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff Details */}
          {isStaff && staffInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconBuildingHospital className="h-5 w-5" />
                  Staff Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">First name</p>
                    <p className="font-medium">{staffInfo.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last name</p>
                    <p className="font-medium">{staffInfo.lastName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconBriefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Job title</p>
                      <p className="font-medium">{staffInfo.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconShield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{staffInfo.department}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Patient Details */}
          {isPatient && patientInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="h-5 w-5" />
                  Patient Information
                </CardTitle>
                <CardDescription>Demographics on file</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">First name</p>
                    <p className="font-medium">{patientInfo.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last name</p>
                    <p className="font-medium">{patientInfo.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of birth</p>
                    <p className="font-medium">
                      {new Date(patientInfo.dateOfBirth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{patientInfo.gender}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Medical record number</p>
                    <p className="font-mono font-medium">{patientInfo.mrn}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconMail className="h-5 w-5" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <IconMail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-center text-sm text-muted-foreground">
                Contact details are managed by your organization&apos;s registration or HR
                department.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
