"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { IconHistory, IconActivity, IconUsers, IconAlertCircle, IconHeart } from "@tabler/icons-react"
import { toast } from "sonner"

// Types matching Prisma schema exactly
type PatientHistory = {
  id: string
  patientId: string
  type: "MEDICAL_HISTORY" | "SURGICAL_HISTORY" | "FAMILY_HISTORY" | "SOCIAL_HISTORY"
  icd10Code: string | null
  entry: string
  status: "ACTIVE" | "RESOLVED" | "HISTORICAL"
  onsetDate: string | null
}

type Allergy = {
  id: string
  patientId: string
  substance: string
  reaction: string | null
  severity: "MILD" | "MODERATE" | "SEVERE" | "UNKNOWN" | null
  status: "ACTIVE" | "REFUTED"
}

// 🎭 MOCK DATA
const MOCK_PATIENT_HISTORIES: PatientHistory[] = [
  {
    id: "hist_001",
    patientId: "pat_123456789",
    type: "MEDICAL_HISTORY",
    icd10Code: "E11.9",
    entry: "Type 2 Diabetes Mellitus",
    status: "ACTIVE",
    onsetDate: "2018-03-15"
  },
  {
    id: "hist_002",
    patientId: "pat_123456789",
    type: "MEDICAL_HISTORY",
    icd10Code: "I10",
    entry: "Essential Hypertension",
    status: "ACTIVE",
    onsetDate: "2020-07-22"
  },
  {
    id: "hist_003",
    patientId: "pat_123456789",
    type: "MEDICAL_HISTORY",
    icd10Code: "J45.909",
    entry: "Childhood Asthma",
    status: "RESOLVED",
    onsetDate: "1990-05-10"
  },
  {
    id: "hist_004",
    patientId: "pat_123456789",
    type: "SURGICAL_HISTORY",
    icd10Code: "K35.80",
    entry: "Appendectomy",
    status: "HISTORICAL",
    onsetDate: "2010-11-08"
  },
  {
    id: "hist_005",
    patientId: "pat_123456789",
    type: "SURGICAL_HISTORY",
    icd10Code: "K80.20",
    entry: "Laparoscopic Cholecystectomy (Gallbladder Removal)",
    status: "HISTORICAL",
    onsetDate: "2019-06-14"
  },
  {
    id: "hist_006",
    patientId: "pat_123456789",
    type: "FAMILY_HISTORY",
    icd10Code: "I25.10",
    entry: "Father - Coronary Artery Disease (CAD), diagnosed at age 55",
    status: "ACTIVE",
    onsetDate: null
  },
  {
    id: "hist_007",
    patientId: "pat_123456789",
    type: "FAMILY_HISTORY",
    icd10Code: "C50.919",
    entry: "Mother - Breast Cancer, diagnosed at age 62",
    status: "ACTIVE",
    onsetDate: null
  },
  {
    id: "hist_008",
    patientId: "pat_123456789",
    type: "FAMILY_HISTORY",
    icd10Code: "E11.9",
    entry: "Sibling - Type 2 Diabetes Mellitus",
    status: "ACTIVE",
    onsetDate: null
  },
  {
    id: "hist_009",
    patientId: "pat_123456789",
    type: "SOCIAL_HISTORY",
    icd10Code: null,
    entry: "Non-smoker (never smoked)",
    status: "ACTIVE",
    onsetDate: null
  },
  {
    id: "hist_010",
    patientId: "pat_123456789",
    type: "SOCIAL_HISTORY",
    icd10Code: null,
    entry: "Occasional alcohol consumption (social drinker, 1-2 drinks per month)",
    status: "ACTIVE",
    onsetDate: null
  },
  {
    id: "hist_011",
    patientId: "pat_123456789",
    type: "SOCIAL_HISTORY",
    icd10Code: null,
    entry: "Regular exercise (walks 30 minutes daily, 5 times a week)",
    status: "ACTIVE",
    onsetDate: null
  },
  {
    id: "hist_012",
    patientId: "pat_123456789",
    type: "SOCIAL_HISTORY",
    icd10Code: null,
    entry: "Occupation: Office Manager (sedentary work)",
    status: "ACTIVE",
    onsetDate: null
  }
]

const MOCK_ALLERGIES: Allergy[] = [
  {
    id: "allergy_001",
    patientId: "pat_123456789",
    substance: "Penicillin",
    reaction: "Severe rash, hives, and difficulty breathing",
    severity: "SEVERE",
    status: "ACTIVE"
  },
  {
    id: "allergy_002",
    patientId: "pat_123456789",
    substance: "Shellfish (Shrimp, Crab)",
    reaction: "Anaphylaxis - facial swelling, throat tightness",
    severity: "SEVERE",
    status: "ACTIVE"
  },
  {
    id: "allergy_003",
    patientId: "pat_123456789",
    substance: "Ibuprofen",
    reaction: "Stomach upset and mild nausea",
    severity: "MILD",
    status: "ACTIVE"
  },
  {
    id: "allergy_004",
    patientId: "pat_123456789",
    substance: "Latex",
    reaction: "Skin irritation and itching",
    severity: "MODERATE",
    status: "ACTIVE"
  }
]

export default function MedicalHistoryPage() {
  const [loading, setLoading] = useState(true)
  const [patientHistories, setPatientHistories] = useState<PatientHistory[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])

  useEffect(() => {
    fetchMedicalData()
  }, [])

  const fetchMedicalData = async () => {
    setLoading(true)
    try {
      // 🎭 MOCK: Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 🎭 MOCK: Use mock data
      setPatientHistories(MOCK_PATIENT_HISTORIES)
      setAllergies(MOCK_ALLERGIES)
      
      // 🔴 TODO: Replace with real API calls when backend is ready
      // const historyResponse = await fetch('/api/patients/history')
      // if (historyResponse.ok) {
      //   const historyData = await historyResponse.json()
      //   setPatientHistories(historyData)
      // }
      //
      // const allergyResponse = await fetch('/api/patients/allergies')
      // if (allergyResponse.ok) {
      //   const allergyData = await allergyResponse.json()
      //   setAllergies(allergyData)
      // }
    } catch (error) {
      console.error('Error fetching medical data:', error)
      toast.error("Failed to load medical history")
    } finally {
      setLoading(false)
    }
  }

  // Filter histories by type
  const medicalHistory = patientHistories.filter(h => h.type === "MEDICAL_HISTORY")
  const surgicalHistory = patientHistories.filter(h => h.type === "SURGICAL_HISTORY")
  const familyHistory = patientHistories.filter(h => h.type === "FAMILY_HISTORY")
  const socialHistory = patientHistories.filter(h => h.type === "SOCIAL_HISTORY")
  
  // Filter active allergies
  const activeAllergies = allergies.filter(a => a.status === "ACTIVE")

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not recorded'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'SEVERE':
        return 'destructive'
      case 'MODERATE':
        return 'default'
      case 'MILD':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default">Active</Badge>
      case 'RESOLVED':
        return <Badge variant="secondary">Resolved</Badge>
      case 'HISTORICAL':
        return <Badge variant="outline">Historical</Badge>
      case 'REFUTED':
        return <Badge variant="destructive">Refuted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole={UserRole.PATIENT}>
        <DashboardLayout role={UserRole.PATIENT}>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading medical history...</p>
            </div>
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
            <h1 className="text-2xl font-bold">Medical History</h1>
            <p className="text-muted-foreground">
              View your complete medical history and allergies
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="medical" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="medical">
                  <IconHistory className="h-4 w-4 mr-2" />
                  Medical
                </TabsTrigger>
                <TabsTrigger value="surgical">
                  <IconActivity className="h-4 w-4 mr-2" />
                  Surgical
                </TabsTrigger>
                <TabsTrigger value="allergies">
                  <IconAlertCircle className="h-4 w-4 mr-2" />
                  Allergies
                </TabsTrigger>
                <TabsTrigger value="family">
                  <IconUsers className="h-4 w-4 mr-2" />
                  Family
                </TabsTrigger>
                <TabsTrigger value="social">
                  <IconHeart className="h-4 w-4 mr-2" />
                  Social
                </TabsTrigger>
              </TabsList>

              {/* Medical History Tab */}
              <TabsContent value="medical">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                    <CardDescription>Your active and historical medical conditions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {medicalHistory.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No medical history recorded
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {medicalHistory.map((item) => (
                          <Card key={item.id} className="bg-slate-50">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg">{item.entry}</h4>
                                  {item.icd10Code && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      ICD-10: {item.icd10Code}
                                    </p>
                                  )}
                                </div>
                                {getStatusBadge(item.status)}
                              </div>
                              {item.onsetDate && (
                                <>
                                  <Separator className="my-3" />
                                  <div className="text-sm">
                                    <p className="text-muted-foreground">Onset Date</p>
                                    <p className="font-medium">{formatDate(item.onsetDate)}</p>
                                  </div>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Surgical History Tab */}
              <TabsContent value="surgical">
                <Card>
                  <CardHeader>
                    <CardTitle>Surgical History</CardTitle>
                    <CardDescription>Previous surgical procedures and operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {surgicalHistory.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No surgical history recorded
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {surgicalHistory.map((item) => (
                          <Card key={item.id} className="bg-slate-50">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg">{item.entry}</h4>
                                  {item.icd10Code && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      ICD-10: {item.icd10Code}
                                    </p>
                                  )}
                                </div>
                                {getStatusBadge(item.status)}
                              </div>
                              {item.onsetDate && (
                                <>
                                  <Separator className="my-3" />
                                  <div className="text-sm">
                                    <p className="text-muted-foreground">Procedure Date</p>
                                    <p className="font-medium">{formatDate(item.onsetDate)}</p>
                                  </div>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Allergies Tab */}
              <TabsContent value="allergies">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <IconAlertCircle className="h-5 w-5" />
                      Active Allergies
                    </CardTitle>
                    <CardDescription>Important allergy information for your safety</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activeAllergies.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No allergies recorded
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {activeAllergies.map((allergy) => (
                          <Card key={allergy.id} className="border-red-200 bg-red-50">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg text-red-900">
                                    {allergy.substance}
                                  </h4>
                                  {allergy.reaction && (
                                    <p className="text-sm text-red-700 mt-1">
                                      Reaction: {allergy.reaction}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2">
                                  {allergy.severity && (
                                    <Badge variant={getSeverityColor(allergy.severity) as any}>
                                      {allergy.severity}
                                    </Badge>
                                  )}
                                  {getStatusBadge(allergy.status)}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Family History Tab */}
              <TabsContent value="family">
                <Card>
                  <CardHeader>
                    <CardTitle>Family History</CardTitle>
                    <CardDescription>Medical conditions in your family</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {familyHistory.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No family history recorded
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {familyHistory.map((item) => (
                          <Card key={item.id} className="bg-slate-50">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg">{item.entry}</h4>
                                  {item.icd10Code && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      ICD-10: {item.icd10Code}
                                    </p>
                                  )}
                                </div>
                                {getStatusBadge(item.status)}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Social History Tab */}
              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle>Social History</CardTitle>
                    <CardDescription>Lifestyle and social factors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {socialHistory.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No social history recorded
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {socialHistory.map((item) => (
                          <Card key={item.id} className="bg-slate-50">
                            <CardContent className="pt-6">
                              <p className="font-medium">{item.entry}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}