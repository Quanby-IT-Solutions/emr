"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

const mockMedications = [
  { id: 1, patient: "John Doe", medication: "Aspirin 81mg", time: "10:00 AM", status: "pending" },
  { id: 2, patient: "Jane Smith", medication: "Metformin 500mg", time: "10:00 AM", status: "pending" },
  { id: 3, patient: "Bob Wilson", medication: "Lisinopril 10mg", time: "10:30 AM", status: "verified" },
]

export default function MedicationsPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Medication Administration</h1>
            <p className="text-muted-foreground">
              Administer and track medications
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Scheduled Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Administer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMedications.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.patient}</TableCell>
                        <TableCell>{med.medication}</TableCell>
                        <TableCell>{med.time}</TableCell>
                        <TableCell>
                          <Badge variant={med.status === "verified" ? "default" : "secondary"}>
                            {med.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Checkbox />
                            <Button variant="ghost" size="sm">Record</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
