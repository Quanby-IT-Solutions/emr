"use client";

import { useRouter } from 'next/navigation';
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/lib/auth/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IconSearch, IconUser, IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';

const mockPatients = [
  { 
    id: "1", 
    name: "John Doe", 
    mrn: "MRN-001",
    room: "301A", 
    condition: "Stable", 
    lastVitals: "10 min ago",
    allergyCount: 2,
    encounterCount: 3
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    mrn: "MRN-002",
    room: "302B", 
    condition: "Critical", 
    lastVitals: "5 min ago",
    allergyCount: 1,
    encounterCount: 2
  },
  { 
    id: "3", 
    name: "Bob Wilson", 
    mrn: "MRN-003",
    room: "303A", 
    condition: "Stable", 
    lastVitals: "1 hour ago",
    allergyCount: 0,
    encounterCount: 2
  },
];

export default function NursePatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patients based on search
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewPatientChart = (patientId: string) => {
    router.push(`/nurse/chart?patientId=${patientId}`);
  };

  const getConditionVariant = (condition: string) => {
    switch (condition) {
      case 'Critical': return 'destructive';
      case 'Stable': return 'default';
      case 'Fair': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">My Patients</h1>
            <p className="text-muted-foreground">
              Patients currently under your care
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
                    placeholder="Search by name, MRN, or room number..."
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
                  Assigned Patients ({filteredPatients.length})
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
                        <TableHead>Room</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Last Vitals</TableHead>
                        <TableHead>Alerts</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.mrn}</TableCell>
                          <TableCell>{patient.room}</TableCell>
                          <TableCell>
                            <Badge variant={getConditionVariant(patient.condition) as any}>
                              {patient.condition}
                            </Badge>
                          </TableCell>
                          <TableCell>{patient.lastVitals}</TableCell>
                          <TableCell>
                            {patient.allergyCount > 0 ? (
                              <div className="flex items-center gap-1 text-red-600">
                                <IconAlertCircle className="h-4 w-4" />
                                <span className="text-sm">{patient.allergyCount} Allergies</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">None</span>
                            )}
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