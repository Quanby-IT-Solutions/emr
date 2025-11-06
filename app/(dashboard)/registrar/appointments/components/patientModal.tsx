"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Appointment } from "./dummy"
import { 
  User, 
  Calendar, 
  FileText, 
  Shield,
  CreditCard,
  UserCheck,
  X,
  Edit,
  AlertCircle,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Gauge
} from "lucide-react"
import { format } from "date-fns"
import { usePatientContext } from '../context/PatientContext'

interface PatientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  onConfirmCheckIn: (notes: string, paymentType: string) => void
}

export function PatientModal({ open, onOpenChange, appointment, onConfirmCheckIn }: PatientModalProps) {
  const { state, dispatch } = usePatientContext()
  const [checkInNotes, setCheckInNotes] = useState("")
  const [paymentType, setPaymentType] = useState("CASH")
  const [showHistoryForm, setShowHistoryForm] = useState(false)
  const [historyData, setHistoryData] = useState({
    allergies: [] as string[],
    medications: [] as string[],
    pastHistory: "",
    socialHistory: ""
  })

  if (!appointment) return null

  const handleCheckIn = () => {
    onConfirmCheckIn(checkInNotes, paymentType)
    setCheckInNotes("")
    setPaymentType("CASH")
  }

  const handleSaveHistory = () => {
    dispatch({
      type: 'UPDATE_HISTORY',
      payload: {
        id: appointment.patientId,
        historyData
      }
    })

    alert('Patient history saved successfully')
    setShowHistoryForm(false)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      SCHEDULED: { variant: "outline", label: "Scheduled" },
      ARRIVED: { variant: "secondary", label: "Arrived" },
      CHECKED_IN: { variant: "default", label: "Checked In" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
      NO_SHOW: { variant: "destructive", label: "No Show" },
      IN_TRIAGE: { variant: "outline", label: "In Triage" },
      REFERRED: { variant: "secondary", label: "Referred" }
    }
    const status_info = variants[status] || variants.SCHEDULED
    return <Badge variant={status_info.variant}>{status_info.label}</Badge>
  }

  const patient = state.patients.find(p => p.id === appointment.patientId)
  const hasHistory = patient?.hasHistory || false
  const vitals = patient?.vitals

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Patient Check-In</span>
            {getStatusBadge(appointment.status)}
          </DialogTitle>
          <DialogDescription>
            Appointment ID: {appointment.id}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Patient Details</TabsTrigger>
            <TabsTrigger value="vitals">
              <Activity className="h-4 w-4 mr-2" />
              Vital Signs
              {vitals && <Badge className="ml-2" variant="secondary">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
          </TabsList>

          {/* DETAILS TAB */}
          <TabsContent value="details" className="space-y-6 mt-4">
            {/* Patient Demographics */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Patient ID</p>
                  <p className="font-medium">{appointment.patientId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">{appointment.patientName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{appointment.age} years old</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{appointment.gender === "MALE" ? "Male" : "Female"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Contact Number</p>
                  <p className="font-medium">+63 917 123 4567</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Appointment Info */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{format(new Date(appointment.appointmentDate), "PPP")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">{appointment.appointmentTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{appointment.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Attending Physician</p>
                  <p className="font-medium">Dr. {appointment.physician}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Visit Type</p>
                  <p className="font-medium">
                    {appointment.visitType === "NEW" ? "New Patient" : "Follow-up Visit"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reason for Visit */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Chief Complaint
              </h3>
              <div className="text-sm">
                <p className="text-muted-foreground">Reason for Visit</p>
                <p className="font-medium mt-1">{appointment.reasonForVisit}</p>
              </div>
            </div>

            <Separator />

            {/* Insurance Info */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Insurance Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">PhilHealth Number</p>
                  <p className="font-medium">12-345678901-2</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Member Type</p>
                  <p className="font-medium">Member</p>
                </div>
                <div>
                  <p className="text-muted-foreground">HMO Provider</p>
                  <p className="font-medium">Maxicare</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Card Number</p>
                  <p className="font-medium">MAX-987654321</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Type */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h3>
              <div className="space-y-2">
                <Label htmlFor="paymentType">Select Payment Type *</Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger id="paymentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="PHILHEALTH">PhilHealth</SelectItem>
                    <SelectItem value="HMO">HMO</SelectItem>
                    <SelectItem value="PHILHEALTH_HMO">PhilHealth + HMO</SelectItem>
                    <SelectItem value="CHARITY">Charity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Check-In Notes */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Check-In Notes
              </h3>
              <div className="space-y-2">
                <Label htmlFor="checkInNotes">Registrar Remarks (Optional)</Label>
                <Textarea
                  id="checkInNotes"
                  placeholder="Enter any special notes or observations about the patient..."
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          {/* VITALS TAB */}
          <TabsContent value="vitals" className="space-y-4 mt-4">
            {vitals ? (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Blood Pressure Card */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <Heart className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Blood Pressure</p>
                            <p className="text-2xl font-bold text-blue-900">
                              {vitals.bpSystolic}/{vitals.bpDiastolic}
                            </p>
                            <p className="text-xs text-muted-foreground">mmHg</p>
                          </div>
                        </div>
                        {(vitals.bpSystolic > 140 || vitals.bpDiastolic > 90) && (
                          <Badge variant="destructive">High</Badge>
                        )}
                        {(vitals.bpSystolic < 90 || vitals.bpDiastolic < 60) && (
                          <Badge variant="destructive">Low</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Heart Rate Card */}
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-green-100 rounded-full">
                            <Activity className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Heart Rate</p>
                            <p className="text-2xl font-bold text-green-900">
                              {vitals.heartRate}
                            </p>
                            <p className="text-xs text-muted-foreground">bpm</p>
                          </div>
                        </div>
                        {(vitals.heartRate > 100 || vitals.heartRate < 60) && (
                          <Badge variant="destructive">Abnormal</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Temperature Card */}
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-orange-100 rounded-full">
                            <Thermometer className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Temperature</p>
                            <p className="text-2xl font-bold text-orange-900">
                              {vitals.temperature}°C
                            </p>
                            <p className="text-xs text-muted-foreground">Celsius</p>
                          </div>
                        </div>
                        {vitals.temperature > 37.5 && (
                          <Badge variant="destructive">Fever</Badge>
                        )}
                        {vitals.temperature < 36 && (
                          <Badge variant="destructive">Hypothermia</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Oxygen Saturation Card */}
                  <Card className="bg-cyan-50 border-cyan-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-cyan-100 rounded-full">
                            <Wind className="h-6 w-6 text-cyan-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">O₂ Saturation</p>
                            <p className="text-2xl font-bold text-cyan-900">
                              {vitals.oxygenSaturation}%
                            </p>
                            <p className="text-xs text-muted-foreground">SpO₂</p>
                          </div>
                        </div>
                        {vitals.oxygenSaturation < 95 && (
                          <Badge variant="destructive">Low</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pain Level Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-full">
                          <Gauge className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Pain Level</p>
                          <p className="text-2xl font-bold">{vitals.painLevel}/10</p>
                        </div>
                        <Badge 
                          variant={vitals.painLevel <= 3 ? "secondary" : vitals.painLevel <= 6 ? "outline" : "destructive"}
                        >
                          {vitals.painLevel === 0 ? "No Pain" : 
                           vitals.painLevel <= 3 ? "Mild" :
                           vitals.painLevel <= 6 ? "Moderate" : "Severe"}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            vitals.painLevel === 0 ? 'bg-green-500' :
                            vitals.painLevel <= 3 ? 'bg-yellow-500' :
                            vitals.painLevel <= 6 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${vitals.painLevel * 10}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Triage Notes if available */}
                {patient?.triageNotes && (
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Triage Notes
                      </h4>
                      <p className="text-sm whitespace-pre-wrap">{patient.triageNotes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Timestamp */}
                <div className="text-sm text-muted-foreground text-center">
                  Vitals recorded at {new Date().toLocaleString()}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No vital signs recorded yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vitals will be recorded during triage workflow
                </p>
              </div>
            )}
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history" className="space-y-4 mt-4">
            {!hasHistory && (
              <div className="space-y-3">
                {!showHistoryForm ? (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription>
                      <p className="font-semibold text-yellow-900">No medical history on file</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHistoryForm(true)}
                        className="mt-2"
                      >
                        Complete History Intake
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Known Allergies</Label>
                      <Textarea
                        placeholder="Enter allergies (one per line)"
                        rows={3}
                        onChange={(e) =>
                          setHistoryData(prev => ({
                            ...prev,
                            allergies: e.target.value.split('\n').filter(a => a.trim())
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Medications</Label>
                      <Textarea
                        placeholder="Enter medications (one per line)"
                        rows={3}
                        onChange={(e) =>
                          setHistoryData(prev => ({
                            ...prev,
                            medications: e.target.value.split('\n').filter(m => m.trim())
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Past Medical History</Label>
                      <Textarea
                        placeholder="Previous conditions, surgeries, hospitalizations..."
                        rows={4}
                        onChange={(e) =>
                          setHistoryData(prev => ({ ...prev, pastHistory: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Social History</Label>
                      <Textarea
                        placeholder="Smoking, alcohol, occupation, living situation..."
                        rows={3}
                        onChange={(e) =>
                          setHistoryData(prev => ({ ...prev, socialHistory: e.target.value }))
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowHistoryForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveHistory} className="bg-blue-600 hover:bg-blue-700">
                        Save History
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Show saved history if available */}
            {hasHistory && patient?.historyData && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Allergies</h4>
                      {patient.historyData.allergies?.length > 0 ? (
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {patient.historyData.allergies.map((allergy, idx) => (
                            <li key={idx}>{allergy}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No known allergies</p>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Current Medications</h4>
                      {patient.historyData.medications?.length > 0 ? (
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {patient.historyData.medications.map((med, idx) => (
                            <li key={idx}>{med}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No current medications</p>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Past Medical History</h4>
                      <p className="text-sm whitespace-pre-wrap">
                        {patient.historyData.pastHistory || "No past medical history recorded"}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Social History</h4>
                      <p className="text-sm whitespace-pre-wrap">
                        {patient.historyData.socialHistory || "No social history recorded"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  variant="outline"
                  onClick={() => setShowHistoryForm(true)}
                  className="w-full"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Update History
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            variant="secondary"
            onClick={() => {/* Handle edit */}}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Info
          </Button>
          <Button 
            onClick={handleCheckIn}
            disabled={appointment.status === "CHECKED_IN"}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Confirm Check-In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}