"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/lib/auth/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientChartTabs } from "@/components/shared/chart/patient-chart-tabs";
import { ProblemsAllergiesStrip } from "./components/problems-allergies-strip";
import { IconUser, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/lib/auth/context';

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
  const { user } = useAuth();

  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    setNotFound(false);
    fetch(`/api/patients/${patientId}/chart`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((json) => {
        if (json?.data) setChartData(json.data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [patientId]);

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

  if (loading) {
    return (
      <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
        <DashboardLayout role={UserRole.CLINICIAN}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-muted-foreground">Loading patient chart...</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (notFound || (!loading && !chartData)) {
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

  if (!chartData) return null;

  const staffId = user?.staffId ?? '';

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
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <IconUser className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {chartData.patient.firstName} {chartData.patient.lastName}
                      </CardTitle>
                      <CardDescription>
                        MRN: {chartData.patient.mrn} | Age: {calculateAge(chartData.patient.dateOfBirth)} |{' '}
                        Gender: {chartData.patient.gender || 'N/A'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {chartData.patient.encounters.filter((e: any) => e.status === 'ACTIVE').length} Active Encounters
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(chartData.patient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact Phone</p>
                    <p className="font-medium">{chartData.patient.contactPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{chartData.patient.email || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ProblemsAllergiesStrip
              problems={chartData.patient.patientHistories}
              allergies={chartData.patient.allergies}
            />

            <PatientChartTabs
              patientData={chartData}
              role={UserRole.CLINICIAN}
              staffId={staffId}
            />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
