"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { IconSearch, IconHistory, IconAlertTriangle } from "@tabler/icons-react"

import { labPatients, labOrders, type LabPatient } from "@/app/(dashboard)/dummy-data/dummy-lab-orders"
import { PatientLabHistorySheet } from "./components/patient-lab-history-sheet"

export default function LabTechPatientsPage() {
  const [search, setSearch] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<LabPatient | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return labPatients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <ProtectedRoute requiredRole={UserRole.LAB_TECH}>
      <DashboardLayout role={UserRole.LAB_TECH}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Patient Information</h1>
            <p className="text-muted-foreground">
              Search patients and view their lab order history
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Patients</CardTitle>
                  <div className="relative w-72">
                    <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or MRN..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filtered.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    No patients match your search.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>DOB</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Recent Orders</TableHead>
                        <TableHead>Active Orders</TableHead>
                        <TableHead>Last Lab Date</TableHead>
                        <TableHead>Flags</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(patient => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.mrn}</TableCell>
                          <TableCell className="text-sm">{patient.dob}</TableCell>
                          <TableCell className="text-sm">{patient.gender}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{patient.recentOrderCount}</Badge>
                          </TableCell>
                          <TableCell>
                            {patient.activeOrders > 0 ? (
                              <Badge variant="outline">{patient.activeOrders} active</Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">None</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">{patient.lastLabDate}</TableCell>
                          <TableCell>
                            {patient.criticalCount > 0 ? (
                              <Badge variant="destructive" className="gap-1 text-xs">
                                <IconAlertTriangle className="h-3 w-3" />
                                {patient.criticalCount} Critical
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="border"
                                  onClick={() => { setSelectedPatient(patient); setSheetOpen(true) }}
                                >
                                  <IconHistory className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Lab History</TooltipContent>
                            </Tooltip>
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

        <PatientLabHistorySheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          patient={selectedPatient}
          orders={labOrders}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
