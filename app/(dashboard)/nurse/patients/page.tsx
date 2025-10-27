"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mockPatients = [
  { id: 1, name: "John Doe", room: "301A", condition: "Stable", lastVitals: "10 min ago" },
  { id: 2, name: "Jane Smith", room: "302B", condition: "Critical", lastVitals: "5 min ago" },
  { id: 3, name: "Bob Wilson", room: "303A", condition: "Stable", lastVitals: "1 hour ago" },
]

export default function NursePatientsPage() {
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

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Last Vitals</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.room}</TableCell>
                        <TableCell>
                          <Badge variant={patient.condition === "Critical" ? "destructive" : "default"}>
                            {patient.condition}
                          </Badge>
                        </TableCell>
                        <TableCell>{patient.lastVitals}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View Chart</Button>
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
