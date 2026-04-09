"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dummyPhilHealthRecords, PhilHealthRecord } from "@/app/(dashboard)/dummy-data/dummy-registrar"
import { toast } from "sonner"
import { IconSearch, IconEye, IconCurrencyPeso } from "@tabler/icons-react"

const zBenefitPackages = [
  { code: "Z-001", name: "Acute Lymphocytic Leukemia (Pediatric)", coverage: 310000 },
  { code: "Z-002", name: "Breast Cancer (Early Stage)", coverage: 100000 },
  { code: "Z-003", name: "Prostate Cancer", coverage: 100000 },
  { code: "Z-004", name: "Kidney Transplant", coverage: 600000 },
  { code: "Z-005", name: "Coronary Artery Bypass Graft", coverage: 550000 },
  { code: "Z-006", name: "Cervical Cancer", coverage: 120000 },
  { code: "Z-007", name: "Colon/Rectum Cancer (Early Stage)", coverage: 100000 },
]

const posTransactions = [
  { id: "POS-001", date: "2026-04-08", patient: "Maria Elena Garcia", pin: "01-234567890-1", amount: 16000, caseRate: "Pneumonia", status: "Approved" },
  { id: "POS-002", date: "2026-04-07", patient: "David Lee Anderson", pin: "N/A", amount: 0, caseRate: "N/A", status: "No PhilHealth" },
  { id: "POS-003", date: "2026-04-07", patient: "Sophia Grace Nguyen", pin: "01-887766554-3", amount: 32000, caseRate: "Appendectomy", status: "Approved" },
  { id: "POS-004", date: "2026-04-06", patient: "Emily Elizabeth Wong", pin: "01-998877665-4", amount: 24000, caseRate: "Cholecystectomy", status: "Pending Verification" },
]

export default function PhilHealthProcessingPage() {
  const [records, setRecords] = useState(dummyPhilHealthRecords)
  const [detailOpen, setDetailOpen] = useState(false)
  const [lookupOpen, setLookupOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<PhilHealthRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [lookupPIN, setLookupPIN] = useState("")
  const [lookupResult, setLookupResult] = useState<{found: boolean; name?: string; category?: string; validity?: string} | null>(null)

  const filteredRecords = records.filter(r =>
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.philhealthNumber.includes(searchQuery)
  )

  const handleMemberLookup = () => {
    if (!lookupPIN) {
      toast.error("Please enter a PhilHealth PIN")
      return
    }
    // Simulate lookup
    const found = Math.random() > 0.3
    if (found) {
      setLookupResult({ found: true, name: "Juan Dela Cruz", category: "Employed", validity: "2026-12-31" })
    } else {
      setLookupResult({ found: false })
    }
  }

  const handleFormUpdate = (id: string, form: string, completed: boolean) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== id) return r
      const updatedForms = { ...r.formsStatus, [form]: completed }
      return { ...r, formsStatus: updatedForms }
    }))
    toast.success(`${form} marked as ${completed ? "Complete" : "Pending"}`)
  }

  const handleStatusUpdate = (id: string, newStatus: PhilHealthRecord["status"]) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
    toast.success(`Record updated to ${newStatus}`)
    setDetailOpen(false)
  }

  const totalBenefits = posTransactions.filter(t => t.status === "Approved").reduce((sum, t) => sum + t.amount, 0)

  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">PhilHealth Records & Benefit Processing</h1>
              <p className="text-muted-foreground">Member verification, forms management, POS transactions, and Z-Benefit tracking.</p>
            </div>
            <Button onClick={() => { setLookupOpen(true); setLookupPIN(""); setLookupResult(null) }}><IconSearch className="h-4 w-4 mr-2" />Member Lookup</Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 px-4 lg:px-6">
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Active Claims</p><p className="text-3xl font-bold">{records.filter(r => r.status === "Active").length}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pending Verification</p><p className="text-3xl font-bold text-yellow-600">{records.filter(r => r.status === "Pending Verification").length}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">POS Approved Today</p><p className="text-3xl font-bold text-green-600">{posTransactions.filter(t => t.status === "Approved").length}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Benefits (Today)</p><p className="text-2xl font-bold">₱{totalBenefits.toLocaleString()}</p></CardContent></Card>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="claims">
              <TabsList>
                <TabsTrigger value="claims">Claims & Forms</TabsTrigger>
                <TabsTrigger value="pos">POS Transactions</TabsTrigger>
                <TabsTrigger value="zbenefit">Z-Benefit Packages</TabsTrigger>
              </TabsList>

              {/* Claims Tab */}
              <TabsContent value="claims" className="space-y-4">
                <Input placeholder="Search by patient name or PhilHealth PIN..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="max-w-sm" />
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Claim ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>PhilHealth #</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Case Type</TableHead>
                          <TableHead>CSF</TableHead>
                          <TableHead>CF1</TableHead>
                          <TableHead>CF2</TableHead>
                          <TableHead>Benefit</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map(r => (
                          <TableRow key={r.id}>
                            <TableCell className="font-mono text-sm">{r.id}</TableCell>
                            <TableCell className="font-medium">{r.patientName}</TableCell>
                            <TableCell className="font-mono text-xs">{r.philhealthNumber}</TableCell>
                            <TableCell><Badge variant="outline">{r.membershipType}</Badge></TableCell>
                            <TableCell>{r.benefitPackage}</TableCell>
                            <TableCell><Badge variant={r.formsStatus.csf ? "default" : "secondary"} className="text-xs">{r.formsStatus.csf ? "Complete" : "Pending"}</Badge></TableCell>
                            <TableCell><Badge variant={r.formsStatus.cf1 ? "default" : "secondary"} className="text-xs">{r.formsStatus.cf1 ? "Complete" : "Pending"}</Badge></TableCell>
                            <TableCell><Badge variant={r.formsStatus.cf2 ? "default" : "secondary"} className="text-xs">{r.formsStatus.cf2 ? "Complete" : "Pending"}</Badge></TableCell>
                            <TableCell className="font-mono">₱{r.philhealthDeduction.toLocaleString()}</TableCell>
                            <TableCell><Badge variant={r.status === "Closed" ? "outline" : r.status === "Active" ? "default" : "secondary"}>{r.status}</Badge></TableCell>
                            <TableCell><Button size="sm" variant="ghost" onClick={() => { setSelectedRecord(r); setDetailOpen(true) }}><IconEye className="h-4 w-4" /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* POS Tab */}
              <TabsContent value="pos">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><IconCurrencyPeso className="h-5 w-5" />Point of Service Transactions</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow><TableHead>Transaction ID</TableHead><TableHead>Date</TableHead><TableHead>Patient</TableHead><TableHead>PhilHealth PIN</TableHead><TableHead>Case Rate</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow>
                      </TableHeader>
                      <TableBody>
                        {posTransactions.map(t => (
                          <TableRow key={t.id}>
                            <TableCell className="font-mono text-sm">{t.id}</TableCell>
                            <TableCell>{t.date}</TableCell>
                            <TableCell className="font-medium">{t.patient}</TableCell>
                            <TableCell className="font-mono text-xs">{t.pin}</TableCell>
                            <TableCell>{t.caseRate}</TableCell>
                            <TableCell className="font-mono">₱{t.amount.toLocaleString()}</TableCell>
                            <TableCell><Badge variant={t.status === "Approved" ? "default" : t.status === "No PhilHealth" ? "destructive" : "secondary"}>{t.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Z-Benefit Tab */}
              <TabsContent value="zbenefit">
                <Card>
                  <CardHeader><CardTitle>Z-Benefit Packages</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Package Name</TableHead><TableHead>Coverage Amount</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {zBenefitPackages.map(z => (
                          <TableRow key={z.code}>
                            <TableCell className="font-mono">{z.code}</TableCell>
                            <TableCell className="font-medium">{z.name}</TableCell>
                            <TableCell className="font-mono">₱{z.coverage.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Member Lookup Dialog */}
        <Dialog open={lookupOpen} onOpenChange={setLookupOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>PhilHealth Member Lookup</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>PhilHealth Identification Number (PIN)</Label>
                <div className="flex gap-2">
                  <Input value={lookupPIN} onChange={e => setLookupPIN(e.target.value)} placeholder="XX-XXXXXXXXX-X" className="font-mono" />
                  <Button onClick={handleMemberLookup}>Verify</Button>
                </div>
              </div>
              {lookupResult && (
                <Card className={lookupResult.found ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}>
                  <CardContent className="pt-4">
                    {lookupResult.found ? (
                      <div className="space-y-2">
                        <Badge variant="default">Member Found</Badge>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                          <div><Label className="text-muted-foreground">Name</Label><p className="font-medium">{lookupResult.name}</p></div>
                          <div><Label className="text-muted-foreground">Category</Label><p>{lookupResult.category}</p></div>
                          <div><Label className="text-muted-foreground">Validity</Label><p className="text-green-600 font-medium">Valid until {lookupResult.validity}</p></div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <Badge variant="destructive">Not Found</Badge>
                        <p className="text-sm text-muted-foreground mt-2">No PhilHealth member found with the given PIN. Please verify the number or check eligibility at the PhilHealth LHIO office.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Claim Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Claim Details — {selectedRecord?.id}</DialogTitle></DialogHeader>
            {selectedRecord && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><Label className="text-muted-foreground">Patient</Label><p className="font-medium">{selectedRecord.patientName}</p></div>
                  <div><Label className="text-muted-foreground">PhilHealth #</Label><p className="font-mono">{selectedRecord.philhealthNumber}</p></div>
                  <div><Label className="text-muted-foreground">Category</Label><p>{selectedRecord.membershipType}</p></div>
                  <div><Label className="text-muted-foreground">Benefit Package</Label><p>{selectedRecord.benefitPackage}</p></div>
                  <div><Label className="text-muted-foreground">PhilHealth Deduction</Label><p className="font-mono font-medium">₱{selectedRecord.philhealthDeduction.toLocaleString()}</p></div>
                  <div><Label className="text-muted-foreground">Total Bill</Label><p className="font-mono">₱{selectedRecord.totalBill.toLocaleString()}</p></div>
                </div>
                <hr />
                <div>
                  <h3 className="font-semibold mb-2">Forms Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(selectedRecord.formsStatus) as Array<keyof typeof selectedRecord.formsStatus>).map(form => (
                      <div key={form} className="flex items-center justify-between rounded-lg border p-2">
                        <span className="text-sm font-medium">{form}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={selectedRecord.formsStatus[form] ? "default" : "secondary"}>{selectedRecord.formsStatus[form] ? "Complete" : "Pending"}</Badge>
                          {!selectedRecord.formsStatus[form] && (
                            <Button size="sm" variant="outline" onClick={() => handleFormUpdate(selectedRecord.id, form, true)}>Complete</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              {selectedRecord?.status === "Pending Verification" && <Button onClick={() => handleStatusUpdate(selectedRecord.id, "Active")}>Verify & Activate</Button>}
              {selectedRecord?.status === "Active" && <Button onClick={() => handleStatusUpdate(selectedRecord.id, "Closed")}>Close Claim</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
