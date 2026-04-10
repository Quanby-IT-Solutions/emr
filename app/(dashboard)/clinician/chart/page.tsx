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
  },
  "4": {
    patient: {
      id: "4",
      mrn: "MRN-007",
      firstName: "Maria",
      lastName: "Garcia",
      dateOfBirth: "1988-01-30",
      gender: "Female",
      contactPhone: "+1-555-0234",
      email: "maria.garcia@email.com",
      primaryDiagnosis: "Acute Appendicitis",
      allergies: [
        {
          id: "a4",
          substance: "Sulfonamides",
          reaction: "Rash",
          severity: "MODERATE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e7",
          type: "EMERGENCY",
          status: "ACTIVE",
          startDateTime: "2026-04-09T14:30:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: {
            unit: "Emergency Room",
            roomNumber: "ER",
            bedNumber: "Bay 3"
          },
          _count: {
            clinicalNotes: 2,
            orders: 6
          }
        }
      ],
      patientHistories: [
        {
          id: "h9",
          type: "MEDICAL_HISTORY",
          entry: "Acute Appendicitis",
          icd10Code: "K35.80",
          status: "ACTIVE",
          onsetDate: "2026-04-09"
        },
        {
          id: "h10",
          type: "MEDICAL_HISTORY",
          entry: "Migraine without Aura",
          icd10Code: "G43.009",
          status: "ACTIVE",
          onsetDate: "2015-06-01"
        }
      ]
    },
    recentOrders: [
      {
        id: "o3",
        orderType: "LAB",
        status: "IN_PROGRESS",
        priority: "STAT",
        createdAt: "2026-04-09T14:45:00",
        placer: {
          firstName: "Sarah",
          lastName: "Johnson"
        }
      }
    ]
  },
  "5": {
    patient: {
      id: "5",
      mrn: "MRN-012",
      firstName: "James",
      lastName: "Lee",
      dateOfBirth: "1965-05-14",
      gender: "Male",
      contactPhone: "+1-555-0345",
      email: "james.lee@email.com",
      primaryDiagnosis: "Osteoarthritis of Knee",
      allergies: [],
      encounters: [
        {
          id: "e8",
          type: "OUTPATIENT",
          status: "ACTIVE",
          startDateTime: "2026-04-09T10:00:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 1,
            orders: 3
          }
        }
      ],
      patientHistories: [
        {
          id: "h11",
          type: "MEDICAL_HISTORY",
          entry: "Osteoarthritis of Knee",
          icd10Code: "M17.11",
          status: "ACTIVE",
          onsetDate: "2020-03-15"
        },
        {
          id: "h12",
          type: "MEDICAL_HISTORY",
          entry: "Benign Prostatic Hyperplasia",
          icd10Code: "N40.0",
          status: "ACTIVE",
          onsetDate: "2022-09-01"
        }
      ]
    },
    recentOrders: []
  },
  "6": {
    patient: {
      id: "6",
      mrn: "MRN-011",
      firstName: "Linda",
      lastName: "Park",
      dateOfBirth: "1958-09-03",
      gender: "Female",
      contactPhone: "+1-555-0456",
      email: "linda.park@email.com",
      primaryDiagnosis: "Congestive Heart Failure",
      allergies: [
        {
          id: "a5",
          substance: "ACE Inhibitors",
          reaction: "Angioedema",
          severity: "SEVERE",
          status: "ACTIVE"
        },
        {
          id: "a6",
          substance: "Iodine Contrast",
          reaction: "Urticaria",
          severity: "MODERATE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e9",
          type: "INPATIENT",
          status: "ACTIVE",
          startDateTime: "2026-04-03T11:00:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: {
            unit: "Cardiology Ward",
            roomNumber: "205",
            bedNumber: "B"
          },
          _count: {
            clinicalNotes: 6,
            orders: 15
          }
        }
      ],
      patientHistories: [
        {
          id: "h13",
          type: "MEDICAL_HISTORY",
          entry: "Congestive Heart Failure",
          icd10Code: "I50.9",
          status: "ACTIVE",
          onsetDate: "2023-01-10"
        },
        {
          id: "h14",
          type: "MEDICAL_HISTORY",
          entry: "Atrial Fibrillation",
          icd10Code: "I48.91",
          status: "ACTIVE",
          onsetDate: "2022-06-20"
        },
        {
          id: "h15",
          type: "MEDICAL_HISTORY",
          entry: "Type 2 Diabetes Mellitus",
          icd10Code: "E11.9",
          status: "ACTIVE",
          onsetDate: "2018-04-01"
        }
      ]
    },
    recentOrders: [
      {
        id: "o4",
        orderType: "MEDICATION",
        status: "VERIFIED",
        priority: "ROUTINE",
        createdAt: "2026-04-03T12:00:00",
        placer: {
          firstName: "Sarah",
          lastName: "Johnson"
        }
      }
    ]
  },
  "7": {
    patient: {
      id: "7",
      mrn: "MRN-015",
      firstName: "Sarah",
      lastName: "Kim",
      dateOfBirth: "1995-12-20",
      gender: "Female",
      contactPhone: "+1-555-0567",
      email: "sarah.kim@email.com",
      primaryDiagnosis: "Generalized Anxiety Disorder",
      allergies: [],
      encounters: [
        {
          id: "e10",
          type: "OUTPATIENT",
          status: "PLANNED",
          startDateTime: "2026-04-15T09:00:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 0,
            orders: 1
          }
        }
      ],
      patientHistories: [
        {
          id: "h16",
          type: "MEDICAL_HISTORY",
          entry: "Generalized Anxiety Disorder",
          icd10Code: "F41.1",
          status: "ACTIVE",
          onsetDate: "2019-08-01"
        }
      ]
    },
    recentOrders: []
  },
  "8": {
    patient: {
      id: "8",
      mrn: "MRN-018",
      firstName: "Ahmed",
      lastName: "Hassan",
      dateOfBirth: "1980-06-11",
      gender: "Male",
      contactPhone: "+1-555-0678",
      email: "ahmed.hassan@email.com",
      primaryDiagnosis: "Essential Hypertension",
      allergies: [
        {
          id: "a7",
          substance: "NSAIDs",
          reaction: "GI Bleeding",
          severity: "SEVERE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e11",
          type: "OUTPATIENT",
          status: "PLANNED",
          startDateTime: "2026-04-12T14:00:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
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
          id: "h17",
          type: "MEDICAL_HISTORY",
          entry: "Essential Hypertension",
          icd10Code: "I10",
          status: "ACTIVE",
          onsetDate: "2016-02-01"
        },
        {
          id: "h18",
          type: "MEDICAL_HISTORY",
          entry: "Peptic Ulcer Disease",
          icd10Code: "K27.9",
          status: "RESOLVED",
          onsetDate: "2021-05-15"
        }
      ]
    },
    recentOrders: []
  },
  "9": {
    patient: {
      id: "9",
      mrn: "MRN-022",
      firstName: "Emily",
      lastName: "Chen",
      dateOfBirth: "1992-02-28",
      gender: "Female",
      contactPhone: "+1-555-0789",
      email: "emily.chen@email.com",
      primaryDiagnosis: "Pneumonia",
      allergies: [
        {
          id: "a8",
          substance: "Codeine",
          reaction: "Nausea / Vomiting",
          severity: "MILD",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e12",
          type: "EMERGENCY",
          status: "DISCHARGED",
          startDateTime: "2026-04-05T02:15:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 3,
            orders: 8
          }
        }
      ],
      patientHistories: [
        {
          id: "h19",
          type: "MEDICAL_HISTORY",
          entry: "Pneumonia",
          icd10Code: "J18.9",
          status: "ACTIVE",
          onsetDate: "2026-04-05"
        },
        {
          id: "h20",
          type: "MEDICAL_HISTORY",
          entry: "Iron Deficiency Anemia",
          icd10Code: "D50.9",
          status: "ACTIVE",
          onsetDate: "2023-07-01"
        }
      ]
    },
    recentOrders: []
  },
  "10": {
    patient: {
      id: "10",
      mrn: "MRN-003",
      firstName: "David",
      lastName: "Wilson",
      dateOfBirth: "1975-08-19",
      gender: "Male",
      contactPhone: "+1-555-0890",
      email: "david.wilson@email.com",
      primaryDiagnosis: "Chronic Low Back Pain",
      allergies: [],
      encounters: [
        {
          id: "e13",
          type: "OUTPATIENT",
          status: "DISCHARGED",
          startDateTime: "2026-03-10T09:30:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 2,
            orders: 4
          }
        }
      ],
      patientHistories: [
        {
          id: "h21",
          type: "MEDICAL_HISTORY",
          entry: "Chronic Low Back Pain",
          icd10Code: "M54.5",
          status: "ACTIVE",
          onsetDate: "2019-11-01"
        },
        {
          id: "h22",
          type: "MEDICAL_HISTORY",
          entry: "Obesity",
          icd10Code: "E66.01",
          status: "ACTIVE",
          onsetDate: "2017-01-15"
        }
      ]
    },
    recentOrders: []
  },
  "11": {
    patient: {
      id: "11",
      mrn: "MRN-025",
      firstName: "Patricia",
      lastName: "Martinez",
      dateOfBirth: "1968-04-07",
      gender: "Female",
      contactPhone: "+1-555-0901",
      email: "patricia.martinez@email.com",
      primaryDiagnosis: "Total Hip Replacement (Post-Op)",
      allergies: [
        {
          id: "a9",
          substance: "Morphine",
          reaction: "Respiratory depression",
          severity: "SEVERE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e14",
          type: "INPATIENT",
          status: "DISCHARGED",
          startDateTime: "2026-04-02T07:00:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: null,
          _count: {
            clinicalNotes: 5,
            orders: 11
          }
        }
      ],
      patientHistories: [
        {
          id: "h23",
          type: "MEDICAL_HISTORY",
          entry: "Osteoarthritis of Right Hip",
          icd10Code: "M16.11",
          status: "ACTIVE",
          onsetDate: "2021-03-01"
        },
        {
          id: "h24",
          type: "MEDICAL_HISTORY",
          entry: "Hypothyroidism",
          icd10Code: "E03.9",
          status: "ACTIVE",
          onsetDate: "2015-10-01"
        }
      ]
    },
    recentOrders: []
  },
  "12": {
    patient: {
      id: "12",
      mrn: "MRN-030",
      firstName: "Michael",
      lastName: "Brown",
      dateOfBirth: "1953-10-25",
      gender: "Male",
      contactPhone: "+1-555-1012",
      email: "michael.brown@email.com",
      primaryDiagnosis: "Acute STEMI",
      allergies: [
        {
          id: "a10",
          substance: "Aspirin",
          reaction: "Bronchospasm",
          severity: "SEVERE",
          status: "ACTIVE"
        },
        {
          id: "a11",
          substance: "Heparin",
          reaction: "Heparin-Induced Thrombocytopenia",
          severity: "SEVERE",
          status: "ACTIVE"
        }
      ],
      encounters: [
        {
          id: "e15",
          type: "EMERGENCY",
          status: "ACTIVE",
          startDateTime: "2026-04-09T18:45:00",
          attendingProvider: {
            firstName: "Sarah",
            lastName: "Johnson",
            jobTitle: "Attending Physician"
          },
          currentLocation: {
            unit: "Emergency Room",
            roomNumber: "ER",
            bedNumber: "Bay 7"
          },
          _count: {
            clinicalNotes: 1,
            orders: 9
          }
        }
      ],
      patientHistories: [
        {
          id: "h25",
          type: "MEDICAL_HISTORY",
          entry: "Acute ST-Elevation Myocardial Infarction",
          icd10Code: "I21.3",
          status: "ACTIVE",
          onsetDate: "2026-04-09"
        },
        {
          id: "h26",
          type: "MEDICAL_HISTORY",
          entry: "Coronary Artery Disease",
          icd10Code: "I25.10",
          status: "ACTIVE",
          onsetDate: "2020-08-01"
        },
        {
          id: "h27",
          type: "MEDICAL_HISTORY",
          entry: "COPD",
          icd10Code: "J44.1",
          status: "ACTIVE",
          onsetDate: "2018-12-01"
        }
      ]
    },
    recentOrders: [
      {
        id: "o5",
        orderType: "MEDICATION",
        status: "IN_PROGRESS",
        priority: "STAT",
        createdAt: "2026-04-09T19:00:00",
        placer: {
          firstName: "Sarah",
          lastName: "Johnson"
        }
      }
    ]
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