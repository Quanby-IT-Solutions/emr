"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/lib/auth/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientChartTabs } from "@/components/shared/chart/patient-chart-tabs";
import { IconUser, IconAlertCircle, IconHeart } from '@tabler/icons-react';
import { useAuth } from '@/lib/auth/context';

export default function NurseChartPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <NurseChartContent />
    </Suspense>
  );
}

function NurseChartContent() {
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
      <ProtectedRoute requiredRole={UserRole.NURSE}>
        <DashboardLayout role={UserRole.NURSE}>
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
      <ProtectedRoute requiredRole={UserRole.NURSE}>
        <DashboardLayout role={UserRole.NURSE}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-muted-foreground">Loading patient chart...</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (notFound || (!loading && !chartData)) {
    return (
      <ProtectedRoute requiredRole={UserRole.NURSE}>
        <DashboardLayout role={UserRole.NURSE}>
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
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Patient Chart - Nursing View</h1>
            <p className="text-muted-foreground">
              Patient care information and nursing assessments
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
                  <Badge variant="outline">
                    <IconHeart className="h-4 w-4 mr-1" />
                    Nursing Care
                  </Badge>
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
                    <p className="text-muted-foreground">Current Location</p>
                    <p className="font-medium">
                      {chartData.patient.encounters[0]?.currentLocation
                        ? `${chartData.patient.encounters[0].currentLocation.unit} - Room ${chartData.patient.encounters[0].currentLocation.roomNumber}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {chartData.patient.allergies.length > 0 && (
              <Card className="border-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <IconAlertCircle className="h-5 w-5" />
                    ALLERGY ALERT - {chartData.patient.allergies.length} Active Allergy(ies)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {chartData.patient.allergies.map((allergy: any) => (
                      <div key={allergy.id} className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
                        <div>
                          <p className="font-semibold text-red-900 text-lg">{allergy.substance}</p>
                          <p className="text-sm text-red-700">{allergy.reaction}</p>
                        </div>
                        <Badge variant="destructive" className="text-base px-3 py-1">
                          {allergy.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <PatientChartTabs
              patientData={chartData}
              role={UserRole.NURSE}
              staffId={staffId}
            />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
