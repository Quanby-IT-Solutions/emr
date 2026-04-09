"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/lib/auth/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientChartTabs } from "@/components/shared/chart/patient-chart-tabs";
import { ProblemsAllergiesStrip } from "./components/problems-allergies-strip";
import { IconUser, IconAlertCircle } from '@tabler/icons-react';

// Mock patient data (same as before)
const mockPatientData: Record<string, any> = {
  "1": {
    patient: {
      id: "1",
      mrn: "MRN-001",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      contactPhone: "+1-555-0123",
      email: "john.doe@email.com",
      primaryDiagnosis: "Type 2 Diabetes Mellitus",
      allergies: [
        {
          id: "a1",
          substance: "Penicillin",
          reaction: "Anaphylaxis",
          severity: "SEVERE",
          status: "ACTIVE"
        },
        {
          id: "a2",
          substance: "Peanuts",
          reaction: "Anaphylaxis",
          severity: "SEVERE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e1",
          type: "INPATIENT",
          status: "ACTIVE",
          startDateTime: "2025-11-01T08:00:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: {
            unit: "Medical Ward",
            roomNumber: "301",
            bedNumber: "A"
          },
          _count: {
            clinicalNotes: 5,
            orders: 12
          }
        }
      ],
      patientHistories: [
        {
          id: "h1",
          type: "MEDICAL_HISTORY",
          entry: "Type 2 Diabetes Mellitus",
          icd10Code: "E11.9",
          status: "ACTIVE",
          onsetDate: "2020-01-01"
        },
        {
          id: "h2",
          type: "MEDICAL_HISTORY",
          entry: "Hypertension",
          icd10Code: "I10",
          status: "ACTIVE",
          onsetDate: "2018-06-15"
        },
        {
          id: "h3",
          type: "MEDICAL_HISTORY",
          entry: "Hyperlipidemia",
          icd10Code: "E78.5",
          status: "ACTIVE",
          onsetDate: "2019-03-10"
        }
      ]
    },
    recentOrders: [
      {
        id: "o1",
        orderType: "MEDICATION",
        status: "VERIFIED",
        priority: "ROUTINE",
        createdAt: "2025-11-02T09:00:00",
        placer: {
          firstName: "Sarah",
          lastName: "Johnson"
        }
      },
      {
        id: "o2",
        orderType: "LAB",
        status: "IN_PROGRESS",
        priority: "STAT",
        createdAt: "2025-11-02T07:30:00",
        placer: {
          firstName: "Sarah",
          lastName: "Johnson"
        }
      }
    ]
  },
  "2": {
    patient: {
      id: "2",
      mrn: "MRN-002",
      firstName: "Jane",
      lastName: "Smith",
      dateOfBirth: "1992-07-22",
      gender: "Female",
      contactPhone: "+1-555-0456",
      email: "jane.smith@email.com",
      primaryDiagnosis: "Asthma",
      allergies: [
        {
          id: "a3",
          substance: "Latex",
          reaction: "Contact dermatitis",
          severity: "MODERATE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e4",
          type: "OUTPATIENT",
          status: "PLANNED",
          startDateTime: "2025-10-25T14:00:00",
          attendingProvider: {
            firstName: "David",
            lastName: "Martinez",
            jobTitle: "OB/GYN"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 0,
            orders: 2
          }
        }
      ],
      patientHistories: [
        {
          id: "h5",
          type: "MEDICAL_HISTORY",
          entry: "Asthma",
          icd10Code: "J45.909",
          status: "ACTIVE",
          onsetDate: "2005-05-01"
        },
        {
          id: "h6",
          type: "MEDICAL_HISTORY",
          entry: "Iron Deficiency Anemia",
          icd10Code: "D50.9",
          status: "ACTIVE",
          onsetDate: "2021-08-15"
        }
      ]
    },
    recentOrders: []
  },
  "3": {
    patient: {
      id: "3",
      mrn: "MRN-003",
      firstName: "Bob",
      lastName: "Wilson",
      dateOfBirth: "1978-11-30",
      gender: "Male",
      contactPhone: "+1-555-0789",
      email: "bob.wilson@email.com",
      primaryDiagnosis: "Chronic Kidney Disease Stage 3",
      allergies: [],
      encounters: [
        {
          id: "e6",
          type: "EMERGENCY",
          status: "DISCHARGED",
          startDateTime: "2025-10-15T03:00:00",
          attendingProvider: {
            firstName: "Lisa",
            lastName: "Park",
            jobTitle: "Emergency Medicine"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 4,
            orders: 10
          }
        }
      ],
      patientHistories: [
        {
          id: "h7",
          type: "MEDICAL_HISTORY",
          entry: "Chronic Kidney Disease Stage 3",
          icd10Code: "N18.3",
          status: "ACTIVE",
          onsetDate: "2022-03-01"
        },
        {
          id: "h8",
          type: "MEDICAL_HISTORY",
          entry: "Gout",
          icd10Code: "M10.9",
          status: "ACTIVE",
          onsetDate: "2023-01-20"
        }
      ]
    },
    recentOrders: []
  }
};

export default function ClinicianChartPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ClinicianChartContent />
    </Suspense>
  );
}

function ClinicianChartContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  
  const data = patientId ? mockPatientData[patientId] : null;

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!patientId) {
    return (
      <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
        <DashboardLayout role={UserRole.CLINICIAN}>
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No patient selected. Please go to &quot;My Patients&quot; and click &quot;View Chart&quot; on a patient.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!data) {
    return (
      <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
        <DashboardLayout role={UserRole.CLINICIAN}>
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Card className="border-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <IconAlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-500">Patient not found</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // Mock staff ID - in production, get from auth context
  const mockStaffId = "staff_doctor_1";

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Patient Chart</h1>
            <p className="text-muted-foreground">
              Comprehensive patient hospital records
            </p>
          </div>

          <div className="px-4 lg:px-6 space-y-6">
            {/* Patient Demographics */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <IconUser className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {data.patient.firstName} {data.patient.lastName}
                      </CardTitle>
                      <CardDescription>
                        MRN: {data.patient.mrn} | Age: {calculateAge(data.patient.dateOfBirth)} | 
                        Gender: {data.patient.gender || 'N/A'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.patient.primaryDiagnosis && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        Dx: {data.patient.primaryDiagnosis}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {data.patient.encounters.filter((e: any) => e.status === 'ACTIVE').length} Active Encounters
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(data.patient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact Phone</p>
                    <p className="font-medium">{data.patient.contactPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{data.patient.email || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problems & Allergies Strip */}
            <ProblemsAllergiesStrip
              problems={data.patient.patientHistories}
              allergies={data.patient.allergies}
            />

            {/* Tabs Component */}
            <PatientChartTabs 
              patientData={data} 
              role={UserRole.CLINICIAN}
              staffId={mockStaffId}
            />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}