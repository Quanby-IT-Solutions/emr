"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { IconUser, IconMail, IconMapPin, IconCalendar, IconEdit, IconCheck, IconX, IconShieldCheck } from "@tabler/icons-react"
import { toast } from "sonner"

// Types matching Prisma schema
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

// 🎭 MOCK DATA - Replace with real API call later
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
    zipCode: "1000"
  },
  isVipOrConfidential: false,
  patientInsurances: [
    {
      id: "ins_001",
      providerName: "PhilHealth",
      policyNumber: "12-345678901-2",
      groupNumber: "GRP-001",
      priority: "PRIMARY",
      isActive: true
    },
    {
      id: "ins_002",
      providerName: "Maxicare Healthcare Corporation",
      policyNumber: "MAX-2024-98765",
      groupNumber: "CORP-ABC-123",
      priority: "SECONDARY",
      isActive: true
    }
  ]
}

export default function MyProfilePage() {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<PatientData | null>(null)
  const [editData, setEditData] = useState<Partial<PatientData>>({})

  // Fetch patient data on mount
  useEffect(() => {
    fetchPatientData()
  }, [])

  const fetchPatientData = async () => {
    setLoading(true)
    try {
      // 🎭 MOCK: Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 🎭 MOCK: Use mock data instead of API call
      setPatient(MOCK_PATIENT_DATA)
      setEditData(MOCK_PATIENT_DATA)
      
      // 🔴 TODO: Replace with real API call when backend is ready
      // const response = await fetch('/api/patients/profile')
      // if (response.ok) {
      //   const data = await response.json()
      //   setPatient(data)
      //   setEditData(data)
      // } else {
      //   toast.error("Failed to load profile")
      // }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditData(patient!)
    setEditing(true)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // 🎭 MOCK: Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 🎭 MOCK: Update local state
      const updatedData = { ...patient!, ...editData }
      setPatient(updatedData)
      setEditing(false)
      toast.success("Profile updated successfully")
      
      // 🔴 TODO: Replace with real API call when backend is ready
      // const response = await fetch(`/api/patients/${patient?.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     firstName: editData.firstName,
      //     lastName: editData.lastName,
      //     contactPhone: editData.contactPhone,
      //     email: editData.email,
      //     address: editData.address
      //   })
      // })
      // if (response.ok) {
      //   const updatedData = await response.json()
      //   setPatient(updatedData)
      //   setEditing(false)
      //   toast.success("Profile updated successfully")
      // } else {
      //   toast.error("Failed to update profile")
      // }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditData(patient!)
    setEditing(false)
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'PRIMARY':
        return <Badge variant="default">Primary</Badge>
      case 'SECONDARY':
        return <Badge variant="secondary">Secondary</Badge>
      case 'TERTIARY':
        return <Badge variant="outline">Tertiary</Badge>
      default:
        return null
    }
  }

  if (loading && !patient) {
    return (
      <ProtectedRoute requiredRole={UserRole.PATIENT}>
        <DashboardLayout role={UserRole.PATIENT}>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
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
          <div className="flex items-center justify-center h-96">
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
          {/* Header with Edit Button */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">
                  View and update your profile information
                </p>
              </div>
              {!editing ? (
                <Button onClick={handleEdit}>
                  <IconEdit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    <IconX className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    <IconCheck className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 lg:px-6 space-y-6">
            {/* Profile Header Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/avatars/default.png" />
                    <AvatarFallback className="text-2xl">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {patient.firstName} {patient.lastName}
                    </h2>
                    <p className="text-muted-foreground">MRN: {patient.mrn}</p>
                    <div className="flex gap-4 mt-4 flex-wrap">
                      <Badge variant="outline" className="text-sm">
                        <IconCalendar className="h-3 w-3 mr-1" />
                        {calculateAge(patient.dateOfBirth)} years old
                      </Badge>
                      {patient.gender && (
                        <Badge variant="outline" className="text-sm">
                          {patient.gender}
                        </Badge>
                      )}
                      {patient.isVipOrConfidential && (
                        <Badge variant="secondary" className="text-sm">
                          <IconShieldCheck className="h-3 w-3 mr-1" />
                          Confidential
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>First Name</Label>
                    {editing ? (
                      <Input
                        value={editData.firstName || ''}
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 font-medium">{patient.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    {editing ? (
                      <Input
                        value={editData.lastName || ''}
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 font-medium">{patient.lastName}</p>
                    )}
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <p className="mt-1 font-medium">{formatDate(patient.dateOfBirth)}</p>
                    <p className="text-xs text-muted-foreground">Cannot be changed</p>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <p className="mt-1 font-medium">{patient.gender || 'Not specified'}</p>
                    <p className="text-xs text-muted-foreground">Cannot be changed</p>
                  </div>
                  <div>
                    <Label>Medical Record Number (MRN)</Label>
                    <p className="mt-1 font-medium">{patient.mrn}</p>
                    <p className="text-xs text-muted-foreground">Cannot be changed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconMail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Email Address</Label>
                    {editing ? (
                      <Input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 font-medium">{patient.email || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    {editing ? (
                      <Input
                        value={editData.contactPhone || ''}
                        onChange={(e) => setEditData({ ...editData, contactPhone: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 font-medium">{patient.contactPhone || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <IconMapPin className="h-4 w-4" />
                    Residential Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label>Street Address</Label>
                      {editing ? (
                        <Input
                          value={editData.address?.street || ''}
                          onChange={(e) => setEditData({ 
                            ...editData, 
                            address: { ...editData.address, street: e.target.value }
                          })}
                        />
                      ) : (
                        <p className="mt-1 font-medium">{patient.address?.street || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <Label>City</Label>
                      {editing ? (
                        <Input
                          value={editData.address?.city || ''}
                          onChange={(e) => setEditData({ 
                            ...editData, 
                            address: { ...editData.address, city: e.target.value }
                          })}
                        />
                      ) : (
                        <p className="mt-1 font-medium">{patient.address?.city || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <Label>State/Province</Label>
                      {editing ? (
                        <Input
                          value={editData.address?.state || ''}
                          onChange={(e) => setEditData({ 
                            ...editData, 
                            address: { ...editData.address, state: e.target.value }
                          })}
                        />
                      ) : (
                        <p className="mt-1 font-medium">{patient.address?.state || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <Label>ZIP Code</Label>
                      {editing ? (
                        <Input
                          value={editData.address?.zipCode || ''}
                          onChange={(e) => setEditData({ 
                            ...editData, 
                            address: { ...editData.address, zipCode: e.target.value }
                          })}
                        />
                      ) : (
                        <p className="mt-1 font-medium">{patient.address?.zipCode || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Information */}
            <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
                <CardDescription>Your insurance coverage details</CardDescription>
              </CardHeader>
              <CardContent>
                {patient.patientInsurances.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No insurance information on file
                  </p>
                ) : (
                  <div className="space-y-4">
                    {patient.patientInsurances
                      .filter(ins => ins.isActive)
                      .sort((a, b) => {
                        const order = { PRIMARY: 1, SECONDARY: 2, TERTIARY: 3 }
                        return order[a.priority] - order[b.priority]
                      })
                      .map((insurance) => (
                        <Card key={insurance.id} className="bg-slate-50">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-lg">{insurance.providerName}</h4>
                              {getPriorityBadge(insurance.priority)}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Policy Number</p>
                                <p className="font-medium">{insurance.policyNumber}</p>
                              </div>
                              {insurance.groupNumber && (
                                <div>
                                  <p className="text-muted-foreground">Group Number</p>
                                  <p className="font-medium">{insurance.groupNumber}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  To update insurance information, please contact our billing department
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}