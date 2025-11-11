"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/lib/auth/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { IconSearch, IconUser } from '@tabler/icons-react';
import { useState } from 'react';

const mockPatients = [
  { id: "1", name: "John Doe", mrn: "MRN-001", lastVisit: "2025-10-20", status: "active" },
  { id: "2", name: "Jane Smith", mrn: "MRN-002", lastVisit: "2025-10-25", status: "scheduled" },
  { id: "3", name: "Bob Wilson", mrn: "MRN-003", lastVisit: "2025-10-15", status: "discharged" },
];

export default function ClinicianPatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patients based on search
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewPatientChart = (patientId: string) => {
    router.push(`/clinician/chart?patientId=${patientId}`);
  };

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">My Patients</h1>
            <p className="text-muted-foreground">
              View and manage your patient panel
            </p>
          </div>
          
          <div className="px-4 lg:px-6 space-y-4">
            {/* Search Bar */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, MRN, or status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Patient List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Patient List ({filteredPatients.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPatients.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <IconUser className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No patients found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.mrn}</TableCell>
                          <TableCell>{patient.lastVisit}</TableCell>
                          <TableCell>
                            <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                              {patient.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => viewPatientChart(patient.id)}
                            >
                              View Chart
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}