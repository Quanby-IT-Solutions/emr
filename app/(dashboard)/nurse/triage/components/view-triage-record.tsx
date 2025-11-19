"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  User, 
  Calendar, 
  Clock, 
  Activity, 
  Heart, 
  Thermometer, 
  Wind, 
  Weight, 
  Ruler,
  Stethoscope,
  FileText,
  AlertCircle
} from "lucide-react"

// Mock data structure matching your TriageAssessment type
interface TriageRecord {
  dateOfTriage: Date
  timeOfTriage: string
  triageCategory: string
  chiefComplaint: string
  vitalSigns: {
    bpSystolic: string
    bpDiastolic: string
    heartRate: number
    temperature: number
    respiratoryRate: number
    oxygenSaturation: number
    weight: number
    height: number
  }
  triageNotes: string
  triageDisposition: string
  airwayStatus?: { assessment: string; interventions: string }
  breathingStatus?: { assessment: string; interventions: string }
  circulationStatus?: { assessment: string; interventions: string }
}

interface Patient {
  id: string
  name: string
  ageSex: string
  arrivalDetails: {
    date: Date
    time: string
    department: string
  }
  currentTriageCategory: string
  status: string
  triageDetails: TriageRecord[]
}

interface ViewTriageRecordProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPatient: { patient: Patient } | null
}

export default function ViewTriageRecord({ open, onOpenChange, selectedPatient }: ViewTriageRecordProps) {
  const [activeTab, setActiveTab] = useState("patient-info")
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null)

  if (!selectedPatient) return null

  const { patient } = selectedPatient
  
  // Sort triage records by most recent first
  const triageRecords = [...(patient.triageDetails || [])].sort((a, b) => {
    const dateA = new Date(a.dateOfTriage).getTime()
    const dateB = new Date(b.dateOfTriage).getTime()
    return dateB - dateA
  })
  
  const selectedRecord = selectedRecordIndex !== null ? triageRecords[selectedRecordIndex] : null

  const getCategoryVariant = (category: string) => {
    if (category === "EMERGENT") return "destructive"
    if (category === "URGENT") return "warning"
    if (category === "DEAD") return "dimmed"
    return "default"
  }

  const handleClose = () => {
    setActiveTab("patient-info")
    setSelectedRecordIndex(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl">View Triage Records</DialogTitle>
        </DialogHeader>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 border-b">
            <TabsList>
              <TabsTrigger value="patient-info" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Patient Info
              </TabsTrigger>
              <TabsTrigger value="triage-records" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Triage Records
              </TabsTrigger>
              <TabsTrigger 
                value="record-details" 
                disabled={selectedRecordIndex === null}
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Record Details
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Patient Info Tab */}
            <TabsContent value="patient-info" className="mt-0 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Patient Information</h3>
              </div>

              <Card className="border-blue-200 bg-blue-50/30">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Patient ID</Label>
                      <p className="font-medium">{patient.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Name</Label>
                      <p className="font-medium">{patient.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Age/Sex</Label>
                      <p className="font-medium">{patient.ageSex}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Current Status</Label>
                      <Badge variant={getCategoryVariant(patient.currentTriageCategory)}>
                        {patient.currentTriageCategory}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Arrival Date</Label>
                      <p className="font-medium">
                        {new Date(patient.arrivalDetails.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Arrival Time</Label>
                      <p className="font-medium">{patient.arrivalDetails.time}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Department</Label>
                    <p className="font-medium">{patient.arrivalDetails.department}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Patient Status</Label>
                    <Badge variant="default">{patient.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">
                  This patient has <strong>{triageRecords.length}</strong> triage record(s) on file. 
                  Select the &quot;Triage Records&quot; tab to view the complete history.
                </p>
              </div>
            </TabsContent>

            {/* Triage Records Tab */}
            <TabsContent value="triage-records" className="mt-0 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Triage History ({triageRecords.length})</h3>
              </div>

              {triageRecords.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No triage records found for this patient.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {triageRecords.map((record, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedRecordIndex === index
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                          : "hover:border-blue-300"
                      }`}
                      onClick={() => {
                        setSelectedRecordIndex(index)
                        setActiveTab("record-details")
                      }}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {new Date(record.dateOfTriage).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                            <span className="text-sm text-muted-foreground">{record.timeOfTriage}</span>
                          </div>
                          <Badge variant={getCategoryVariant(record.triageCategory)}>
                            {record.triageCategory}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Chief Complaint</Label>
                          <p className="text-sm font-medium">{record.chiefComplaint}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Record Details Tab */}
            <TabsContent value="record-details" className="mt-0">
              {selectedRecord ? (
                <Tabs defaultValue="overview" className="flex-row gap-4">
                  <TabsList className="h-full flex-col gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <TabsTrigger 
                            value="overview" 
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex w-full flex-col items-center gap-1 h-12"
                            aria-label="overview-tab"
                          >
                            <Activity className="h-5 w-5" />
                          </TabsTrigger>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="px-2 py-1 text-xs" side="right">
                        Overview
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <TabsTrigger 
                            value="vitals" 
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex w-full flex-col items-center gap-1 h-12"
                            aria-label="vitals-tab"
                          >
                            <Stethoscope className="h-5 w-5" />
                          </TabsTrigger>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="px-2 py-1 text-xs" side="right">
                        Vital Signs
                      </TooltipContent>
                    </Tooltip>

                    {(selectedRecord.airwayStatus || selectedRecord.breathingStatus || selectedRecord.circulationStatus) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <TabsTrigger 
                              value="abc" 
                              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex w-full flex-col items-center gap-1 h-12"
                              aria-label="abc-tab"
                            >
                              <Heart className="h-5 w-5" />
                            </TabsTrigger>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="px-2 py-1 text-xs" side="right">
                          ABC Assessment
                        </TooltipContent>
                      </Tooltip>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <TabsTrigger 
                            value="notes" 
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex w-full flex-col items-center gap-1 h-12"
                            aria-label="notes-tab"
                          >
                            <FileText className="h-5 w-5" />
                          </TabsTrigger>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="px-2 py-1 text-xs" side="right">
                        Notes & Disposition
                      </TooltipContent>
                    </Tooltip>
                  </TabsList>

                  <div className="flex-1 space-y-4">
                    {/* Overview Section */}
                    <TabsContent value="overview" className="mt-0 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold">Assessment Overview</h3>
                        </div>
                        <Badge variant={getCategoryVariant(selectedRecord.triageCategory)} className="text-base px-4 py-1">
                          {selectedRecord.triageCategory}
                        </Badge>
                      </div>

                      {/* Date/Time */}
                      <Card className="bg-gray-50">
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <Label className="text-xs text-muted-foreground">Assessment Date</Label>
                                <p className="font-medium">
                                  {new Date(selectedRecord.dateOfTriage).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <Label className="text-xs text-muted-foreground">Assessment Time</Label>
                                <p className="font-medium">{selectedRecord.timeOfTriage}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Chief Complaint */}
                      <Card>
                        <CardContent className="pt-4">
                          <Label className="text-sm text-muted-foreground">Chief Complaint</Label>
                          <p className="mt-1 font-medium">{selectedRecord.chiefComplaint}</p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Vital Signs Section */}
                    <TabsContent value="vitals" className="mt-0 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">Vital Signs</h3>
                        </div>
                        <Badge variant={getCategoryVariant(selectedRecord.triageCategory)} className="text-base px-4 py-1">
                          {selectedRecord.triageCategory}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <Card className="bg-red-50">
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Heart className="h-4 w-4 text-red-600" />
                              <Label className="font-semibold text-sm">Blood Pressure</Label>
                            </div>
                            <p className="text-lg font-bold text-red-600">
                              {selectedRecord.vitalSigns.bpSystolic}/{selectedRecord.vitalSigns.bpDiastolic} mmHg
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-green-50">
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="h-4 w-4 text-green-600" />
                              <Label className="font-semibold text-sm">Heart Rate</Label>
                            </div>
                            <p className="text-lg font-bold text-green-600">
                              {selectedRecord.vitalSigns.heartRate} bpm
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-purple-50">
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Wind className="h-4 w-4 text-purple-600" />
                              <Label className="font-semibold text-sm">Respiratory Rate</Label>
                            </div>
                            <p className="text-lg font-bold text-purple-600">
                              {selectedRecord.vitalSigns.respiratoryRate}/min
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-cyan-50">
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Wind className="h-4 w-4 text-cyan-600" />
                              <Label className="font-semibold text-sm">O₂ Saturation</Label>
                            </div>
                            <p className="text-lg font-bold text-cyan-600">
                              {selectedRecord.vitalSigns.oxygenSaturation}%
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-orange-50">
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Thermometer className="h-4 w-4 text-orange-600" />
                              <Label className="font-semibold text-sm">Temperature</Label>
                            </div>
                            <p className="text-lg font-bold text-orange-600">
                              {selectedRecord.vitalSigns.temperature}°C
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-amber-50">
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Weight className="h-4 w-4 text-amber-600" />
                              <Label className="font-semibold text-sm">Weight</Label>
                            </div>
                            <p className="text-lg font-bold text-amber-600">
                              {selectedRecord.vitalSigns.weight} kg
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-indigo-50">
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Ruler className="h-4 w-4 text-indigo-600" />
                              <Label className="font-semibold text-sm">Height</Label>
                            </div>
                            <p className="text-lg font-bold text-indigo-600">
                              {selectedRecord.vitalSigns.height} cm
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* ABC Assessment Section */}
                    {(selectedRecord.airwayStatus || selectedRecord.breathingStatus || selectedRecord.circulationStatus) && (
                      <TabsContent value="abc" className="mt-0 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">Rapid Assessment</h3>
                            </div>
                            <Badge variant={getCategoryVariant(selectedRecord.triageCategory)} className="text-base px-4 py-1">
                            {selectedRecord.triageCategory}
                            </Badge>
                        </div>

                        <div className="space-y-3">
                          {selectedRecord.airwayStatus && (
                            <Card className="bg-blue-50">
                              <CardContent className="pt-4">
                                <Label className="font-semibold text-sm text-blue-900">Airway</Label>
                                <p className="text-sm mt-2">{selectedRecord.airwayStatus.assessment}</p>
                                {selectedRecord.airwayStatus.interventions && (
                                  <div className="mt-2">
                                    <Label className="text-xs text-muted-foreground">Interventions</Label>
                                    <p className="text-sm">{selectedRecord.airwayStatus.interventions}</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {selectedRecord.breathingStatus && (
                            <Card className="bg-green-50">
                              <CardContent className="pt-4">
                                <Label className="font-semibold text-sm text-green-900">Breathing</Label>
                                <p className="text-sm mt-2">{selectedRecord.breathingStatus.assessment}</p>
                                {selectedRecord.breathingStatus.interventions && (
                                  <div className="mt-2">
                                    <Label className="text-xs text-muted-foreground">Interventions</Label>
                                    <p className="text-sm">{selectedRecord.breathingStatus.interventions}</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {selectedRecord.circulationStatus && (
                            <Card className="bg-red-50">
                              <CardContent className="pt-4">
                                <Label className="font-semibold text-sm text-red-900">Circulation</Label>
                                <p className="text-sm mt-2">{selectedRecord.circulationStatus.assessment}</p>
                                {selectedRecord.circulationStatus.interventions && (
                                  <div className="mt-2">
                                    <Label className="text-xs text-muted-foreground">Interventions</Label>
                                    <p className="text-sm">{selectedRecord.circulationStatus.interventions}</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </TabsContent>
                    )}

                    {/* Notes & Disposition Section */}
                    <TabsContent value="notes" className="mt-0 space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">Notes & Disposition</h3>
                      </div>

                      {/* Triage Notes */}
                      <Card>
                        <CardContent className="pt-4">
                          <Label className="text-sm text-muted-foreground">Triage Notes</Label>
                          <p className="mt-2 text-sm whitespace-pre-wrap">{selectedRecord.triageNotes || "No notes recorded"}</p>
                        </CardContent>
                      </Card>

                      {/* Disposition */}
                      <Card>
                        <CardContent className="pt-4">
                          <Label className="text-sm text-muted-foreground">Disposition</Label>
                          <p className="mt-1 font-medium">{selectedRecord.triageDisposition}</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  Select a triage record to view details
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}