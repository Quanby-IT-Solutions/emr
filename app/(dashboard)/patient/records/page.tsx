"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { IconFileText, IconDownload, IconClock, IconCheck, IconX, IconAlertCircle } from "@tabler/icons-react"
import { toast } from "sonner"

// Types matching Prisma schema exactly
type PortalRequest = {
  id: string
  patientId: string
  requestType: "LAB_RESULT" | "IMAGING_REPORT" | "CLINICAL_NOTE"
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED"
  requestedDataId: string | null
  createdAt: string
  completedAt: string | null
  notes: string | null
}

// 🎭 MOCK DATA
const MOCK_PORTAL_REQUESTS: PortalRequest[] = [
  {
    id: "req_001",
    patientId: "pat_123456789",
    requestType: "LAB_RESULT",
    status: "COMPLETED",
    requestedDataId: "lab_12345",
    createdAt: "2024-11-01T10:30:00",
    completedAt: "2024-11-03T14:20:00",
    notes: "Complete Blood Count (CBC) and Lipid Panel from October 2024 visit"
  },
  {
    id: "req_002",
    patientId: "pat_123456789",
    requestType: "IMAGING_REPORT",
    status: "COMPLETED",
    requestedDataId: "img_67890",
    createdAt: "2024-10-15T09:15:00",
    completedAt: "2024-10-18T11:45:00",
    notes: "Chest X-ray report from September 2024"
  },
  {
    id: "req_003",
    patientId: "pat_123456789",
    requestType: "CLINICAL_NOTE",
    status: "PROCESSING",
    requestedDataId: null,
    createdAt: "2024-11-12T14:00:00",
    completedAt: null,
    notes: "All clinical notes from my last 3 visits with Dr. Santos"
  },
  {
    id: "req_004",
    patientId: "pat_123456789",
    requestType: "LAB_RESULT",
    status: "PENDING",
    requestedDataId: null,
    createdAt: "2024-11-15T16:45:00",
    completedAt: null,
    notes: "HbA1c test results from November 2024"
  },
  {
    id: "req_005",
    patientId: "pat_123456789",
    requestType: "CLINICAL_NOTE",
    status: "REJECTED",
    requestedDataId: null,
    createdAt: "2024-10-05T11:20:00",
    completedAt: "2024-10-06T09:30:00",
    notes: "Request denied: Records from 2015 have been archived and require manual retrieval. Please contact Medical Records Department at (02) 8123-4567."
  },
  {
    id: "req_006",
    patientId: "pat_123456789",
    requestType: "LAB_RESULT",
    status: "COMPLETED",
    requestedDataId: "lab_45678",
    createdAt: "2024-09-20T13:10:00",
    completedAt: "2024-09-22T10:00:00",
    notes: "Diabetes screening tests (Fasting Blood Sugar, HbA1c)"
  }
]

export default function RequestRecordsPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [portalRequests, setPortalRequests] = useState<PortalRequest[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [requestNotes, setRequestNotes] = useState("")

  useEffect(() => {
    fetchPortalRequests()
  }, [])

  const fetchPortalRequests = async () => {
    setLoading(true)
    try {
      // 🎭 MOCK: Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 🎭 MOCK: Use mock data
      setPortalRequests(MOCK_PORTAL_REQUESTS)
      
      // 🔴 TODO: Replace with real API call when backend is ready
      // const response = await fetch('/api/patients/portal-requests')
      // if (response.ok) {
      //   const data = await response.json()
      //   setPortalRequests(data)
      // } else {
      //   toast.error("Failed to load requests")
      // }
    } catch (error) {
      console.error('Error fetching portal requests:', error)
      toast.error("Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedType) {
      toast.error("Please select a record type")
      return
    }

    setSubmitting(true)
    
    try {
      // 🎭 MOCK: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 🎭 MOCK: Create new request and add to list
      const newRequest: PortalRequest = {
        id: `req_${Date.now()}`,
        patientId: "pat_123456789",
        requestType: selectedType as any,
        status: "PENDING",
        requestedDataId: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
        notes: requestNotes || null
      }
      
      setPortalRequests(prev => [newRequest, ...prev])
      toast.success("Record request submitted successfully")
      setSelectedType("")
      setRequestNotes("")
      
      // 🔴 TODO: Replace with real API call when backend is ready
      // const response = await fetch('/api/patients/portal-requests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     requestType: selectedType,
      //     notes: requestNotes || null
      //   })
      // })
      // if (response.ok) {
      //   toast.success("Record request submitted successfully")
      //   setSelectedType("")
      //   setRequestNotes("")
      //   fetchPortalRequests()
      // } else {
      //   toast.error("Failed to submit record request")
      // }
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error("Failed to submit record request")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownload = (requestId: string) => {
    // 🎭 MOCK: Simulate download
    toast.success("Download started! Your records will be downloaded as a PDF.")
    
    // 🔴 TODO: Replace with real download logic when backend is ready
    // window.open(`/api/patients/portal-requests/${requestId}/download`, '_blank')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge variant="default" className="bg-green-600">
            <IconCheck className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case 'PROCESSING':
        return (
          <Badge variant="secondary">
            <IconClock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge variant="outline">
            <IconClock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge variant="destructive">
            <IconX className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'LAB_RESULT':
        return 'Laboratory Results'
      case 'IMAGING_REPORT':
        return 'Imaging Reports'
      case 'CLINICAL_NOTE':
        return 'Clinical Notes'
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole={UserRole.PATIENT}>
        <DashboardLayout role={UserRole.PATIENT}>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading requests...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Request Records</h1>
            <p className="text-muted-foreground">
              Request copies of your medical records
            </p>
          </div>

          <div className="px-4 lg:px-6 space-y-6">
            {/* New Request Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconFileText className="h-5 w-5" />
                  New Record Request
                </CardTitle>
                <CardDescription>
                  Select the type of records you would like to request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  <div>
                    <Label htmlFor="requestType">Record Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType} required>
                      <SelectTrigger id="requestType">
                        <SelectValue placeholder="Select record type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LAB_RESULT">
                          <div>
                            <p className="font-medium">Laboratory Results</p>
                            <p className="text-xs text-muted-foreground">
                              Lab test results and reports
                            </p>
                          </div>
                        </SelectItem>
                        <SelectItem value="IMAGING_REPORT">
                          <div>
                            <p className="font-medium">Imaging Reports</p>
                            <p className="text-xs text-muted-foreground">
                              X-rays, CT scans, MRI reports
                            </p>
                          </div>
                        </SelectItem>
                        <SelectItem value="CLINICAL_NOTE">
                          <div>
                            <p className="font-medium">Clinical Notes</p>
                            <p className="text-xs text-muted-foreground">
                              Visit notes and clinical documentation
                            </p>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Specify date range, specific tests, or other details..."
                      value={requestNotes}
                      onChange={(e) => setRequestNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <IconAlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Processing Information</p>
                        <p>
                          Record requests are typically processed within 5-7 business days. 
                          You will receive an email notification when your records are ready for download.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={submitting || !selectedType}>
                    <IconFileText className="h-4 w-4 mr-2" />
                    {submitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Previous Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconClock className="h-5 w-5" />
                  Previous Requests
                </CardTitle>
                <CardDescription>
                  View the status of your record requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portalRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No previous record requests
                  </p>
                ) : (
                  <div className="space-y-4">
                    {portalRequests
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((request) => (
                        <Card key={request.id} className="bg-slate-50">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {getRequestTypeLabel(request.requestType)}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Requested: {formatDate(request.createdAt)}
                                </p>
                              </div>
                              {getStatusBadge(request.status)}
                            </div>

                            {request.notes && (
                              <>
                                <Separator className="my-3" />
                                <div className="text-sm">
                                  <p className="text-muted-foreground">Request Details</p>
                                  <p className="font-medium mt-1">{request.notes}</p>
                                </div>
                              </>
                            )}

                            {request.completedAt && (
                              <>
                                <Separator className="my-3" />
                                <div className="text-sm">
                                  <p className="text-muted-foreground">Completed Date</p>
                                  <p className="font-medium mt-1">{formatDate(request.completedAt)}</p>
                                </div>
                              </>
                            )}

                            {request.status === 'COMPLETED' && (
                              <div className="mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDownload(request.id)}
                                >
                                  <IconDownload className="h-4 w-4 mr-2" />
                                  Download Records
                                </Button>
                              </div>
                            )}

                            {request.status === 'REJECTED' && (
                              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-900 font-medium">
                                  {request.notes}
                                </p>
                              </div>
                            )}

                            {request.status === 'PROCESSING' && (
                              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-sm text-amber-900">
                                  <span className="font-semibold">In Progress:</span> Your request is being processed by our medical records team. Estimated completion in 3-5 business days.
                                </p>
                              </div>
                            )}

                            {request.status === 'PENDING' && (
                              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <p className="text-sm text-slate-700">
                                  <span className="font-semibold">Awaiting Processing:</span> Your request has been received and will be processed shortly.
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}