"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { TriageAssessment } from "../../dummy-data/dummy-triage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Siren, ClockAlert, ClipboardPlus, AlertCircle, RefreshCcw, UserPlus, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TriageFilters } from "./components/triage-filters"
import { TriageTable } from "./components/triage-table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ERTriageTable } from "./components/er-triage-table"
import { TriageWizard } from "@/app/(dashboard)/nurse/triage/components/new-triage-modal"
import type { TriageWizardOutput } from "@/app/(dashboard)/nurse/triage/components/new-triage-modal"
import { FollowUpWizard } from "./components/followup-triage-modal"
import type { FollowUpWizardOutput } from "./components/followup-triage-modal"
import ViewTriageRecord from "./components/view-triage-record"
import { encountersClient, type ApiEncounterDetail } from "@/lib/api/encounters-client"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const getCurrentTime24Hour = () => {
  const now = new Date()
  return now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

function encounterToTriageAssessment(enc: ApiEncounterDetail): TriageAssessment {
  const p = enc.patient
  const dob = p.dateOfBirth ? new Date(p.dateOfBirth) : null
  const ageYears = dob
    ? Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 0
  const sex = p.gender === "Male" ? "M" : p.gender === "Female" ? "F" : "?"

  return {
    patient: {
      id: enc.id,
      name: `${p.lastName}, ${p.firstName}`,
      firstName: p.firstName,
      middleName: "",
      lastName: p.lastName,
      ageSex: `${ageYears}${sex}`,
      age: String(ageYears),
      sex: p.gender ?? "Unknown",
      phoneNumber: 0,
      address: "",
      occupation: "",
      currentTriageCategory: "NON_URGENT",
      status: "IN APT. QUEUE",
      lastDateOfTriage: null,
      lastTimeOfTriage: "",
      companion: { name: "", contact: null, relation: "" },
      arrivalDetails: {
        arrivalStatus: "alive",
        date: new Date(enc.startDateTime),
        time: new Date(enc.startDateTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        modeOfTransport: "",
        modeOfTransportOther: "",
        transferredFrom: null,
        department: enc.type === "EMERGENCY" ? "EMERGENCY" : enc.type === "INPATIENT" ? "OPD" : "OPD",
        departmentOther: "",
        referredBy: null,
      },
      triageDetails: [],
    },
  }
}

export default function TriagePage() {
  const [triageData, setTriageData] = useState<TriageAssessment[]>([])
  const [encounters, setEncounters] = useState<ApiEncounterDetail[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [openFollowUp, setOpenFollowUp] = useState(false)
  const [openViewRecord, setOpenViewRecord] = useState(false)
  const [selectedTriageType, setSelectedTriageType] = useState("all")
  const [selectedTriageCategory, setSelectedTriageCategory] = useState("all")
  const [selectedArrivalDate, setSelectedArrivalDate] = useState<Date | null>(null)
  const [selectedLastTriageDate, setSelectedLastTriageDate] = useState<Date | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<TriageAssessment | null>(null)
  const [isERMode, setIsERMode] = useState(false)
  const [openNewTriage, setOpenNewTriage] = useState(false)
  const [openEncounterSelect, setOpenEncounterSelect] = useState(false)
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>("")

  const fetchEncounters = useCallback(async () => {
    try {
      const data = await encountersClient.list("ACTIVE")
      setEncounters(data)
      setTriageData(data.map(encounterToTriageAssessment))
    } catch {
      toast.error("Failed to load triage cases")
    }
  }, [])

  useEffect(() => {
    fetchEncounters()
  }, [fetchEncounters])

  const totalAssessments = triageData.length
  const totalEmergent = triageData.filter(p => p.patient.currentTriageCategory === "EMERGENT").length
  const totalUrgent = triageData.filter(p => p.patient.currentTriageCategory === "URGENT").length
  const totalNonUrgent = triageData.filter(p => p.patient.currentTriageCategory === "NON_URGENT").length

  const filteredTriageData = useMemo(() => {
    return triageData.filter(entry => {
      const searchMatch = entry.patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      const triageTypeMatch =
        selectedTriageType === "all" ||
        entry.patient.arrivalDetails.department === selectedTriageType
      const triageCategoryMatch =
        selectedTriageCategory === "all" ||
        entry.patient.currentTriageCategory === selectedTriageCategory
      const arrivalDateMatch =
        !selectedArrivalDate ||
        entry.patient.arrivalDetails.date.toDateString() === new Date(selectedArrivalDate).toDateString()
      const lastTriageDateMatch =
        !selectedLastTriageDate ||
        entry.patient.lastDateOfTriage?.toDateString() === new Date(selectedLastTriageDate).toDateString()
      return searchMatch && triageTypeMatch && triageCategoryMatch && arrivalDateMatch && lastTriageDateMatch
    })
  }, [triageData, searchQuery, selectedTriageType, selectedTriageCategory, selectedArrivalDate, selectedLastTriageDate])

  const handleERCheck = (checked: boolean) => {
    setIsERMode(checked)
    if (checked) setSelectedTriageType("EMERGENCY")
    else setSelectedTriageType("all")
  }

  const handleFollowUp = (patient: TriageAssessment) => {
    setSelectedPatient(patient)
    setOpenFollowUp(true)
  }

  const handleNewTriage = () => {
    setSelectedEncounterId("")
    setOpenEncounterSelect(true)
  }

  const handleEncounterSelected = () => {
    if (!selectedEncounterId) return
    setOpenEncounterSelect(false)
    setOpenNewTriage(true)
  }

  const handleViewTriage = (patient: TriageAssessment) => {
    setSelectedPatient(patient)
    setOpenViewRecord(true)
  }

  const handleCardFilter = (category: string) => {
    setSelectedTriageCategory(current => (current === category ? "all" : category))
  }

  const handleRecordTriage = async (data: TriageWizardOutput) => {
    const f = data.form
    const rapidAssess = data.rapidAssessment
    const currentTime = getCurrentTime24Hour()

    const vitals: { type: string; value: string; unit: string }[] = []
    if (f.bpSystolic)      vitals.push({ type: "SYSTOLIC_BP",      value: f.bpSystolic,        unit: "MMHG"    })
    if (f.bpDiastolic)     vitals.push({ type: "DIASTOLIC_BP",     value: f.bpDiastolic,       unit: "MMHG"    })
    if (f.pulseRate)       vitals.push({ type: "HEART_RATE",       value: f.pulseRate,          unit: "BPM"     })
    if (f.respirationRate) vitals.push({ type: "RESPIRATORY_RATE", value: f.respirationRate,   unit: "BRPM"    })
    if (f.temperature)     vitals.push({ type: "TEMPERATURE",      value: f.temperature,       unit: "CELSIUS" })
    if (f.oxygenSaturation) vitals.push({ type: "SPO2",            value: f.oxygenSaturation,  unit: "PERCENT" })
    if (f.weight)          vitals.push({ type: "WEIGHT",           value: f.weight,             unit: "KG"      })
    if (f.painScale)       vitals.push({ type: "PAIN_SCORE",       value: f.painScale,          unit: "POINTS"  })

    if (selectedEncounterId) {
      try {
        await encountersClient.triage(selectedEncounterId, {
          chiefComplaint: f.complaint ?? "",
          triageCategory: f.triagePriority ?? "NON_URGENT",
          triageDisposition: f.disposition ?? "",
          triageNotes: f.triageNotes ?? undefined,
          vitals: vitals as { type: string; value: string; unit: string }[],
        })
        toast.success("Triage assessment recorded")
        // Refresh the encounter list and update local state
        await fetchEncounters()
        return
      } catch {
        toast.error("Failed to save triage to database — updating local view only")
      }
    }

    // Fallback: update local state only
    let newPatientId = f.patientId
    if (!newPatientId) {
      const existingIds = triageData.map(entry => entry.patient.id)
      const numericIds = existingIds
        .filter(id => id.startsWith("PT-2025-"))
        .map(id => parseInt(id.replace("PT-2025-", "")))
        .filter(num => !isNaN(num))
      const lastId = numericIds.length > 0 ? Math.max(...numericIds) : 0
      newPatientId = `PT-2025-${String(lastId + 1).padStart(3, "0")}`
    }

    let firstName = f.firstName
    let middleName = f.middleName
    let lastName = f.lastName
    if (!firstName && !lastName && f.patientName) {
      const parts = f.patientName.split(",")
      if (parts.length === 2) {
        lastName = parts[0].trim()
        const namesPart = parts[1].trim().split(" ")
        firstName = namesPart[0] || ""
        middleName = namesPart.slice(1).join(" ") || ""
      } else {
        firstName = f.patientName
      }
    }

    const newRecord: TriageAssessment = {
      patient: {
        id: newPatientId,
        name: f.patientName || `${lastName}, ${firstName} ${middleName}`.trim(),
        firstName: firstName ?? "",
        middleName: middleName ?? "",
        lastName: lastName ?? "",
        ageSex: `${f.age}/${f.sex}`,
        age: f.age ?? "",
        sex: f.sex ?? "",
        phoneNumber: Number(f.phoneNumber) || 0,
        address: f.address ?? "",
        occupation: f.occupation ?? "",
        currentTriageCategory: (f.triagePriority as "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD") || "NON_URGENT",
        status: "IN APT. QUEUE",
        lastDateOfTriage: f.arrivalDate ?? null,
        lastTimeOfTriage: f.arrivalTime ?? currentTime,
        companion: {
          name: f.companionName ?? "",
          contact: f.companionContact ? Number(f.companionContact) : null,
          relation: f.companionRelation ?? "",
        },
        arrivalDetails: {
          arrivalStatus: (f.arrivalStatus as "alive" | "dead-on-arrival") ?? "alive",
          date: f.arrivalDate ?? new Date(),
          time: f.arrivalTime ?? currentTime,
          modeOfTransport: f.arrivalMode ?? "",
          modeOfTransportOther: f.arrivalModeOther ?? "",
          transferredFrom: f.transferredFrom || null,
          department: (f.department as "EMERGENCY" | "OPD" | "WALK_IN" | "REFERRAL" | "SCHEDULED" | "OTHER") || "OPD",
          departmentOther: f.departmentOther || "",
          referredBy: f.referredBy || null,
        },
        triageDetails: [
          {
            chiefComplaint: f.complaint ?? "",
            symptoms: f.symptoms,
            symptomsOther: f.symptomsOther ?? "",
            vitalSigns: {
              bloodPressure: `${f.bpSystolic ?? ""}/${f.bpDiastolic ?? ""}`,
              bpSystolic: f.bpSystolic ?? "",
              bpDiastolic: f.bpDiastolic ?? "",
              heartRate: Number(f.pulseRate) || 0,
              respiratoryRate: Number(f.respirationRate) || 0,
              temperature: Number(f.temperature) || 0,
              oxygenSaturation: Number(f.oxygenSaturation) || 0,
              weight: Number(f.weight) || 0,
              height: Number(f.height) || 0,
            },
            painAssessment: {
              scale: Number(f.painScale) || 0,
              location: f.painLocation ?? "",
              duration: f.painDuration ?? "",
              characteristics: f.painCharacteristics ?? "",
              aggravatingFactors: f.painAggravatingFactors ?? "",
              relievingFactors: f.painRelievingFactors ?? "",
            },
            glasgowComaScale: {
              eyeOpening: Number(f.gcsEyeOpening) || 0,
              verbalResponse: Number(f.gcsVerbalResponse) || 0,
              motorResponse: Number(f.gcsMotorResponse) || 0,
              totalScore:
                (Number(f.gcsEyeOpening) || 0) +
                (Number(f.gcsVerbalResponse) || 0) +
                (Number(f.gcsMotorResponse) || 0),
            },
            airwayStatus: {
              assessment: rapidAssess.airway.obs ?? "",
              airwayNotes: rapidAssess.airway.obs ?? "",
              interventions: rapidAssess.airway.intv ?? "",
            },
            breathingStatus: {
              assessment: rapidAssess.breathing.obs ?? "",
              breathingNotes: rapidAssess.breathing.obs ?? "",
              interventions: rapidAssess.breathing.intv ?? "",
            },
            circulationStatus: {
              assessment: rapidAssess.circulation.obs ?? "",
              circulationNotes: rapidAssess.circulation.obs ?? "",
              interventions: rapidAssess.circulation.intv ?? "",
            },
            triageCategory: (f.triagePriority as "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD") || "NON_URGENT",
            triageDisposition: f.disposition ?? "",
            triageDispositionOther: f.dispositionOther ?? null,
            triageNotes: f.triageNotes ?? "",
            triageOfficer: { nurseId: "N-001", firstName: "System", lastName: "User" },
            dateOfTriage: new Date(),
            timeOfTriage: currentTime,
          },
        ],
      },
    }

    setTriageData(prev => [newRecord, ...prev])
  }

  const handleRecordFollowUp = (data: FollowUpWizardOutput) => {
    const f = data.form
    const rapidAssess = data.rapidAssessment
    const currentTime = getCurrentTime24Hour()
    const originalDepartment = selectedPatient?.patient.arrivalDetails.department

    const newTriageDetail = {
      chiefComplaint: selectedPatient?.patient.triageDetails[selectedPatient.patient.triageDetails.length - 1]?.chiefComplaint || "",
      symptoms: selectedPatient?.patient.triageDetails[selectedPatient.patient.triageDetails.length - 1]?.symptoms || {
        chestPain: false, difficultyBreathing: false, fever: false, weakness: false,
        lossOfConsciousness: false, bleeding: false, others: false,
      },
      symptomsOther: selectedPatient?.patient.triageDetails[selectedPatient.patient.triageDetails.length - 1]?.symptomsOther || "",
      vitalSigns: {
        bloodPressure: `${f.bpSystolic ?? ""}/${f.bpDiastolic ?? ""}`,
        bpSystolic: f.bpSystolic ?? "",
        bpDiastolic: f.bpDiastolic ?? "",
        heartRate: Number(f.pulseRate) || 0,
        respiratoryRate: Number(f.respirationRate) || 0,
        temperature: Number(f.temperature) || 0,
        oxygenSaturation: Number(f.oxygenSaturation) || 0,
        weight: Number(f.weight) || 0,
        height: Number(f.height) || 0,
      },
      painAssessment: {
        scale: Number(f.painScale) || 0,
        location: f.painLocation ?? "",
        duration: f.painDuration ?? "",
        characteristics: f.painCharacteristics ?? "",
        aggravatingFactors: f.painAggravatingFactors ?? "",
        relievingFactors: f.painRelievingFactors ?? "",
      },
      glasgowComaScale: {
        eyeOpening: Number(f.gcsEyeOpening) || 0,
        verbalResponse: Number(f.gcsVerbalResponse) || 0,
        motorResponse: Number(f.gcsMotorResponse) || 0,
        totalScore: (Number(f.gcsEyeOpening) || 0) + (Number(f.gcsVerbalResponse) || 0) + (Number(f.gcsMotorResponse) || 0),
      },
      airwayStatus: { assessment: rapidAssess.airway.obs ?? "", airwayNotes: rapidAssess.airway.obs ?? "", interventions: rapidAssess.airway.intv ?? "" },
      breathingStatus: { assessment: rapidAssess.breathing.obs ?? "", breathingNotes: rapidAssess.breathing.obs ?? "", interventions: rapidAssess.breathing.intv ?? "" },
      circulationStatus: { assessment: rapidAssess.circulation.obs ?? "", circulationNotes: rapidAssess.circulation.obs ?? "", interventions: rapidAssess.circulation.intv ?? "" },
      triageCategory: (f.triagePriority as "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD") || "NON_URGENT",
      triageType: originalDepartment as "EMERGENCY" | "OPD" | "WALK_IN" | "REFERRAL" | "SCHEDULED" | "OTHER" | undefined,
      triageDisposition: f.disposition ?? "",
      triageDispositionOther: f.dispositionOther ?? null,
      triageNotes: f.triageNotes ?? "",
      triageOfficer: { nurseId: "N-001", firstName: "System", lastName: "User" },
      dateOfTriage: new Date(),
      timeOfTriage: currentTime,
    }

    setTriageData(prev =>
      prev.map(entry => {
        if (entry.patient.id === data.patientId) {
          return {
            ...entry,
            patient: {
              ...entry.patient,
              currentTriageCategory: (f.triagePriority as "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD") || entry.patient.currentTriageCategory,
              lastDateOfTriage: new Date(),
              lastTimeOfTriage: currentTime,
              triageDetails: [...entry.patient.triageDetails, newTriageDetail],
            },
          }
        }
        return entry
      })
    )
    setSelectedPatient(null)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Triage Assessment</h1>
                <p className="text-muted-foreground">Conduct patient triage assessments</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-3 bg-white border rounded-lg p-3 shadow-sm">
                  <Switch
                    id="er-mode"
                    checked={isERMode}
                    onCheckedChange={handleERCheck}
                    className="data-[state=checked]:bg-red-600"
                  />
                  <Label className="cursor-pointer font-semibold flex items-center gap-2">
                    <AlertCircle className={`h-4 w-4 ${isERMode ? "text-red-600" : "text-muted-foreground"}`} />
                    {isERMode ? <span className="text-red-600">ER Mode Active</span> : <span>ER Mode</span>}
                  </Label>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewTriage}>
                  <UserPlus className="h-4 w-4" />
                  New Triage Assessment
                </Button>
              </div>
            </div>
          </div>

          {isERMode && (
            <div className="ml-5 mr-5 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 animate-pulse" />
                <div>
                  <p className="font-bold text-red-900">ER Mode Enabled</p>
                  <p className="text-sm text-red-700">Showing Emergency Triage Queue only.</p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card onClick={() => handleCardFilter("all")} className={`cursor-pointer border-blue-200 bg-blue-50 transition ${selectedTriageCategory === "all" ? "ring-2 ring-blue-500" : ""}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">Total Assessments</CardTitle>
                  <Stethoscope className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{totalAssessments}</div>
                  <p className="text-xs text-blue-600">active encounters</p>
                </CardContent>
              </Card>
              <Card onClick={() => handleCardFilter("EMERGENT")} className={`cursor-pointer border-red-200 bg-red-50 transition ${selectedTriageCategory === "EMERGENT" ? "ring-2 ring-red-500" : ""}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-900">Emergent</CardTitle>
                  <Siren className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{totalEmergent}</div>
                  <p className="text-xs text-red-700">emergent cases</p>
                </CardContent>
              </Card>
              <Card onClick={() => handleCardFilter("URGENT")} className={`cursor-pointer border-yellow-200 bg-yellow-50 transition ${selectedTriageCategory === "URGENT" ? "ring-2 ring-yellow-500" : ""}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-900">Urgent</CardTitle>
                  <ClockAlert className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{totalUrgent}</div>
                  <p className="text-xs text-yellow-700">urgent cases</p>
                </CardContent>
              </Card>
              <Card onClick={() => handleCardFilter("NON_URGENT")} className={`cursor-pointer border-green-200 bg-green-50 transition ${selectedTriageCategory === "NON_URGENT" ? "ring-2 ring-green-500" : ""}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Non Urgent</CardTitle>
                  <ClipboardPlus className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{totalNonUrgent}</div>
                  <p className="text-xs text-green-700">non-urgent cases</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Triage Table */}
          <div className="px-4 lg:px-6">
            {isERMode ? (
              <Card>
                <CardHeader className="grid md:grid-cols-6">
                  <div className="md:col-span-5"><CardTitle>Emergency Triage Cases</CardTitle></div>
                  {searchQuery || selectedTriageType !== "EMERGENCY" || selectedTriageCategory !== "all" || selectedArrivalDate || selectedLastTriageDate ? (
                    <Button variant="outline" size="sm" className="border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => { setSearchQuery(""); setSelectedTriageType("EMERGENCY"); setSelectedTriageCategory("all"); setSelectedArrivalDate(null); setSelectedLastTriageDate(null) }}>
                      <RefreshCcw className="h-4 w-4 mr-2" />Clear Filters
                    </Button>
                  ) : (
                    <Button disabled variant="outline" size="sm"><RefreshCcw className="h-4 w-4 mr-2" />Clear Filters</Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <TriageFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedTriageType={selectedTriageType} onTriageTypeChange={setSelectedTriageType} selectedTriageCategory={selectedTriageCategory} onTriageCategoryChange={setSelectedTriageCategory} selectedArrivalDate={selectedArrivalDate} onArrivalDateChange={setSelectedArrivalDate} selectedLastTriageDate={selectedLastTriageDate} onLastTriageDateChange={setSelectedLastTriageDate} isERMode={isERMode} />
                  </div>
                  <ERTriageTable data={filteredTriageData} onFollowUp={handleFollowUp} onViewRecord={handleViewTriage} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="grid md:grid-cols-6">
                  <div className="md:col-span-5"><CardTitle className="mb-1">Triage Cases</CardTitle></div>
                  {searchQuery || selectedTriageType !== "all" || selectedTriageCategory !== "all" || selectedArrivalDate || selectedLastTriageDate ? (
                    <Button variant="outline" size="sm" className="border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => { setSearchQuery(""); setSelectedTriageType("all"); setSelectedTriageCategory("all"); setSelectedArrivalDate(null); setSelectedLastTriageDate(null) }}>
                      <RefreshCcw className="h-4 w-4 mr-2" />Clear Filters
                    </Button>
                  ) : (
                    <Button disabled variant="outline" size="sm"><RefreshCcw className="h-4 w-4 mr-2" />Clear Filters</Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <TriageFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedTriageType={selectedTriageType} onTriageTypeChange={setSelectedTriageType} selectedTriageCategory={selectedTriageCategory} onTriageCategoryChange={setSelectedTriageCategory} selectedArrivalDate={selectedArrivalDate} onArrivalDateChange={setSelectedArrivalDate} selectedLastTriageDate={selectedLastTriageDate} onLastTriageDateChange={setSelectedLastTriageDate} isERMode={isERMode} />
                  </div>
                  <TriageTable data={filteredTriageData} onViewRecord={handleViewTriage} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Encounter selector dialog */}
          <Dialog open={openEncounterSelect} onOpenChange={setOpenEncounterSelect}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Patient Encounter</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground">Choose an active encounter to triage, or proceed without a selection to create a new record.</p>
                <Select value={selectedEncounterId} onValueChange={setSelectedEncounterId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select encounter (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {encounters.map(enc => (
                      <SelectItem key={enc.id} value={enc.id}>
                        {enc.patient.lastName}, {enc.patient.firstName} — {enc.type} — {enc.currentLocation?.unit ?? "No location"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setOpenEncounterSelect(false)}>Cancel</Button>
                <Button onClick={handleEncounterSelected}>Continue to Triage</Button>
              </div>
            </DialogContent>
          </Dialog>

          <TriageWizard
            open={openNewTriage}
            onOpenChange={setOpenNewTriage}
            onRecord={handleRecordTriage}
          />

          <FollowUpWizard
            open={openFollowUp}
            onOpenChange={setOpenFollowUp}
            onRecord={handleRecordFollowUp}
            selectedPatient={selectedPatient}
          />

          <ViewTriageRecord
            open={openViewRecord}
            onOpenChange={setOpenViewRecord}
            selectedPatient={selectedPatient}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
