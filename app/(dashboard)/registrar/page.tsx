import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconUser, IconFileCheck, IconAlertCircle, IconFileText, IconCurrencyDollar } from "@tabler/icons-react"
import Link from "next/link"

const pendingRecordRequests = [
  { patient: "John Smith", type: "Medical Certificate", date: "2026-04-09", status: "Processing" },
  { patient: "Maria Garcia", type: "Certified True Copy", date: "2026-04-08", status: "Pending" },
  { patient: "Michael Brown", type: "Photocopy of Records", date: "2026-04-06", status: "Processing" },
]

const pendingRegistrations = [
  { patient: "Rosa Santos", time: "9:15 AM", clinic: "Internal Medicine", provider: "Dr. Corey McDonald" },
  { patient: "Pedro Reyes", time: "9:30 AM", clinic: "Family Medicine", provider: "Dr. Ana Reyes" },
  { patient: "Elena Marcos", time: "10:00 AM", clinic: "Surgery OPD", provider: "Dr. David Kim" },
]

const actionItems = [
  { message: "COLB for Baby Boy Reyes - supporting docs incomplete", type: "warning" },
  { message: "PhilHealth CF4 pending for Maria Garcia (PH-002)", type: "warning" },
  { message: "COLB for Baby Girl Aquino - delayed registration, needs supplemental process", type: "error" },
]

export default function RegistrarDashboard() {
  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Registrar Dashboard</h1>
            <p className="text-muted-foreground">Patient registration, record management, and PhilHealth processing.</p>
          </div>

          {/* Today's Registration Counter */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered Today</CardTitle>
                <IconFileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">OPD: 22 · Elective: 6 · Emergency: 4</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Record Requests</CardTitle>
                <IconFileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">5</div>
                <p className="text-xs text-muted-foreground">Certificates, copies, retrievals</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PhilHealth Queue</CardTitle>
                <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">POS, benefit claims pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Needed</CardTitle>
                <IconAlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{actionItems.length}</div>
                <p className="text-xs text-muted-foreground">COLB, incomplete records</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button asChild><Link href="/registrar/registration"><IconUser className="mr-2 h-4 w-4" />New Patient Registration</Link></Button>
                  <Button variant="outline" asChild><Link href="/registrar/patients"><IconFileCheck className="mr-2 h-4 w-4" />Record Search</Link></Button>
                  <Button variant="outline" asChild><Link href="/registrar/documents"><IconFileText className="mr-2 h-4 w-4" />Document Issuance</Link></Button>
                  <Button variant="outline" asChild><Link href="/registrar/philhealth"><IconCurrencyDollar className="mr-2 h-4 w-4" />PhilHealth</Link></Button>
                  <Button variant="outline" asChild><Link href="/registrar/colb">COLB Processing</Link></Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-2 lg:px-6">
            {/* Appointments Pending Registration */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Appointments Pending Registration</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Time</TableHead><TableHead>Clinic</TableHead><TableHead>Provider</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {pendingRegistrations.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{r.patient}</TableCell>
                        <TableCell>{r.time}</TableCell>
                        <TableCell>{r.clinic}</TableCell>
                        <TableCell className="text-sm">{r.provider}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pending Record Requests + Action Items */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Pending Record Requests</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {pendingRecordRequests.map((r, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div><p className="text-sm font-medium">{r.patient}</p><p className="text-xs text-muted-foreground">{r.type}</p></div>
                      <Badge variant="secondary">{r.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Expiring / Action Needed</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {actionItems.map((item, i) => (
                    <div key={i} className={`flex items-start gap-2 rounded-lg border p-3 ${item.type === "error" ? "border-red-200 bg-red-50 dark:bg-red-950/20" : "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20"}`}>
                      <IconAlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${item.type === "error" ? "text-red-600" : "text-yellow-600"}`} />
                      <p className="text-sm">{item.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
