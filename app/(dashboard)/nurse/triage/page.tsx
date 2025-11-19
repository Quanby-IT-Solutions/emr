"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { useMemo, useState } from "react"
import { TriageAssessment, TriageEntry } from "../../dummy-data/dummy-triage"
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

export default function TriagePage() {
    const [triageData, setTriageData] = useState<TriageAssessment[]>(TriageEntry)
    const [searchQuery, setSearchQuery] = useState("");
    const [openFollowUp, setOpenFollowUp] = useState(false);
    const [openViewRecord, setOpenViewRecord] = useState(false);
    const [selectedTriageType, setSelectedTriageType] = useState("all");
    const [selectedTriageCategory, setSelectedTriageCategory] = useState("all");
    const [selectedArrivalDate, setSelectedArrivalDate] = useState<Date | null>(null);
    const [selectedLastTriageDate, setSelectedLastTriageDate] = useState<Date | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<TriageAssessment | null>(null)

    const [isERMode, setIsERMode] = useState(false);
    const [openNewTriage, setOpenNewTriage] = useState(false);

    // Statistics
    const totalAssessments = triageData.length;
    const totalEmergent = triageData.filter((p) => p.patient.currentTriageCategory === "EMERGENT").length;
    const totalUrgent = triageData.filter((p) => p.patient.currentTriageCategory === "URGENT").length;
    const totalNonUrgent = triageData.filter((p) => p.patient.currentTriageCategory === "NON_URGENT").length;

    // Filters
    const filteredTriageData = useMemo(() => {
    return triageData.filter((entry) => {
        const searchMatch =
        entry.patient.name.toLowerCase().includes(searchQuery.toLowerCase())

        const triageTypeMatch =
        selectedTriageType === "all" ||
        entry.patient.arrivalDetails.department === selectedTriageType

        const triageCategoryMatch =
        selectedTriageCategory === "all" ||
        entry.patient.currentTriageCategory === selectedTriageCategory

        const arrivalDateMatch =
        !selectedArrivalDate ||
        entry.patient.arrivalDetails.date.toDateString() ===
            new Date(selectedArrivalDate).toDateString()

        const lastTriageDateMatch =
        !selectedLastTriageDate ||
        entry.patient.lastDateOfTriage?.toDateString() ===
            new Date(selectedLastTriageDate).toDateString()

        return (
        searchMatch &&
        triageTypeMatch &&
        triageCategoryMatch &&
        arrivalDateMatch &&
        lastTriageDateMatch
        )
    })
    }, [triageData, searchQuery, selectedTriageType, selectedTriageCategory, selectedArrivalDate, selectedLastTriageDate])


    const handleERCheck = (checked: boolean) => {
        setIsERMode(checked);
        if (checked) setSelectedTriageType("EMERGENCY");
        else setSelectedTriageType("all");
    };

    const handleFollowUp = (patient: TriageAssessment) => {
        setSelectedPatient(patient)
        setOpenFollowUp(true)
    }

    const handleNewTriage = () => setOpenNewTriage(true);

    const handleViewTriage = (patient: TriageAssessment) => {
        setSelectedPatient(patient)
        setOpenViewRecord(true)
    }

    // Handle stat card filter
    const handleCardFilter = (category: string) => {
        setSelectedTriageCategory((current) => (current === category ? "all" : category));
    };

    const handleRecordTriage = (data: TriageWizardOutput) => {
        const f = data.form

        // Generate new patient ID
        let newPatientId = f.patientId
        
        if (!newPatientId) {
            const existingIds = triageData.map(entry => entry.patient.id)
            const numericIds = existingIds
            .filter(id => id.startsWith('PT-2025-'))
            .map(id => parseInt(id.replace('PT-2025-', '')))
            .filter(num => !isNaN(num))
            
            const lastId = numericIds.length > 0 ? Math.max(...numericIds) : 0
            newPatientId = `PT-2025-${String(lastId + 1).padStart(3, '0')}`
        }

        // Parse name
        let firstName = f.firstName
        let middleName = f.middleName
        let lastName = f.lastName
        
        if (!firstName && !lastName && f.patientName) {
            const parts = f.patientName.split(',')
            if (parts.length === 2) {
            lastName = parts[0].trim()
            const namesPart = parts[1].trim().split(' ')
            firstName = namesPart[0] || ''
            middleName = namesPart.slice(1).join(' ') || ''
            } else {
            firstName = f.patientName
            }
        }

        const newRecord: TriageAssessment = {
            patient: {
            id: newPatientId,
            name: f.patientName || `${lastName}, ${firstName} ${middleName}`.trim(),
            firstName: firstName,
            middleName: middleName ?? "",
            lastName: lastName,
            ageSex: `${f.age}/${f.sex}`,
            age: f.age,
            sex: f.sex,
            phoneNumber: Number(f.phoneNumber) || 0,
            address: f.address ?? "",
            occupation: f.occupation ?? "",
            currentTriageCategory: (f.triagePriority as "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD") || "NON_URGENT",
            status: "IN APT. QUEUE",
            lastDateOfTriage: f.arrivalDate ?? null,
            lastTimeOfTriage: f.arrivalTime ?? new Date().toLocaleTimeString(),
            companion: {
                name: f.companionName ?? "",
                contact: f.companionContact ? Number(f.companionContact) : null,
                relation: f.companionRelation ?? "",
            },
            arrivalDetails: {
                arrivalStatus: (f.arrivalStatus as "alive" | "dead-on-arrival") ?? "alive",
                date: f.arrivalDate ?? new Date(),
                time: f.arrivalTime ?? new Date().toLocaleTimeString(),
                modeOfTransport: f.arrivalMode ?? "",
                modeOfTransportOther: f.arrivalModeOther ?? "",
                transferredFrom: f.transferredFrom || null,
                department: (f.department as "EMERGENCY" | "OPD" | "WALK_IN" | "REFERRAL" | "SCHEDULED" | "OTHER") || "",
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
                    assessment: f.airwayAssessment ?? "",
                    airwayNotes: f.airwayNotes ?? "",
                    interventions: f.airwayInterventions ?? "",
                },
                breathingStatus: {
                    assessment: f.breathingAssessment ?? "",
                    breathingNotes: f.breathingNotes ?? "",
                    interventions: f.breathingInterventions ?? "",
                },
                circulationStatus: {
                    assessment: f.circulationAssessment ?? "",
                    circulationNotes: f.circulationNotes ?? "",
                    interventions: f.circulationInterventions ?? "",
                },
                triageCategory: (f.triagePriority as "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD") || "NON_URGENT",
                // triageType: "EMERGENCY",
                triageDisposition: f.disposition ?? "",
                triageDispositionOther: f.dispositionOther ?? null,
                triageNotes: f.triageNotes ?? "",
                triageOfficer: {
                    nurseId: "N-001",
                    firstName: "System",
                    lastName: "User",
                },
                dateOfTriage: new Date(),
                timeOfTriage: new Date().toLocaleTimeString(),
                },
            ],
            },
        }

        setTriageData(prev => [newRecord, ...prev])
    }

    const handleRecordFollowUp = (data: FollowUpWizardOutput) => {
        const f = data.form

        // Create new triage detail entry
        const newTriageDetail = {
            chiefComplaint: selectedPatient?.patient.triageDetails[selectedPatient.patient.triageDetails.length - 1]?.chiefComplaint || "",
            symptoms: selectedPatient?.patient.triageDetails[selectedPatient.patient.triageDetails.length - 1]?.symptoms || {
            chestPain: false,
            difficultyBreathing: false,
            fever: false,
            weakness: false,
            lossOfConsciousness: false,
            bleeding: false,
            others: false
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
            totalScore:
                (Number(f.gcsEyeOpening) || 0) +
                (Number(f.gcsVerbalResponse) || 0) +
                (Number(f.gcsMotorResponse) || 0),
            },
            airwayStatus: {
            assessment: f.airwayAssessment ?? "",
            airwayNotes: f.airwayNotes ?? "",
            interventions: f.airwayInterventions ?? "",
            },
            breathingStatus: {
            assessment: f.breathingAssessment ?? "",
            breathingNotes: f.breathingNotes ?? "",
            interventions: f.breathingInterventions ?? "",
            },
            circulationStatus: {
            assessment: f.circulationAssessment ?? "",
            circulationNotes: f.circulationNotes ?? "",
            interventions: f.circulationInterventions ?? "",
            },
            triageCategory: (f.triagePriority as "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD") || "NON_URGENT",
            triageType: "EMERGENCY" as const,
            triageDisposition: f.disposition ?? "",
            triageDispositionOther: f.dispositionOther ?? null,
            triageNotes: f.triageNotes ?? "",
            triageOfficer: {
            nurseId: "N-001",
            firstName: "System",
            lastName: "User",
            },
            dateOfTriage: new Date(),
            timeOfTriage: new Date().toLocaleTimeString(),
        }

        // Update the triage data
        setTriageData(prev => prev.map(entry => {
            if (entry.patient.id === data.patientId) {
            return {
                ...entry,
                patient: {
                ...entry.patient,
                // Update current triage category based on new assessment
                currentTriageCategory: (f.triagePriority as "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD") || entry.patient.currentTriageCategory,
                // Update last triage date and time
                lastDateOfTriage: new Date(),
                lastTimeOfTriage: new Date().toLocaleTimeString(),
                // Add new triage detail to the array
                triageDetails: [...entry.patient.triageDetails, newTriageDetail]
                }
            }
            }
            return entry
        }))

        // Clear selected patient
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
                                        <AlertCircle
                                            className={`h-4 w-4 ${isERMode ? "text-red-600" : "text-muted-foreground"}`}
                                        />
                                        {isERMode ? (
                                            <span className="text-red-600">ER Mode Active</span>
                                        ) : (
                                            <span>ER Mode</span>
                                        )}
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
                            <p className="text-sm text-red-700">You are currently viewing the Emergency Triage Queue</p>
                        </div>
                        </div>  
                    </div>
                    )}

                    {/* Statistics Cards */}
                    <div className="px-4 lg:px-6">
                        <div className="grid gap-4 md:grid-cols-4">

                            {/* Total Assessments */}
                            <Card
                                onClick={() => handleCardFilter("all")}
                                className={`cursor-pointer border-blue-200 bg-blue-50 transition 
                                    ${selectedTriageCategory === "all" ? "ring-2 ring-blue-500" : ""}`}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-blue-900">Total Assessments</CardTitle>
                                    <Stethoscope className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">{totalAssessments}</div>
                                    <p className="text-xs text-blue-600">assessments conducted</p>
                                </CardContent>
                            </Card>

                            {/* Emergent */}
                            <Card
                                onClick={() => handleCardFilter("EMERGENT")}
                                className={`cursor-pointer border-red-200 bg-red-50 transition
                                    ${selectedTriageCategory === "EMERGENT" ? "ring-2 ring-red-500" : ""}`}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-red-900">Emergent</CardTitle>
                                    <Siren className="h-4 w-4 text-red-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">{totalEmergent}</div>
                                    <p className="text-xs text-red-700">emergent cases</p>
                                </CardContent>
                            </Card>

                            {/* Urgent */}
                            <Card
                                onClick={() => handleCardFilter("URGENT")}
                                className={`cursor-pointer border-yellow-200 bg-yellow-50 transition
                                    ${selectedTriageCategory === "URGENT" ? "ring-2 ring-yellow-500" : ""}`}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-yellow-900">Urgent</CardTitle>
                                    <ClockAlert className="h-4 w-4 text-yellow-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">{totalUrgent}</div>
                                    <p className="text-xs text-yellow-700">urgent cases</p>
                                </CardContent>
                            </Card>

                            {/* Non-Urgent */}
                            <Card
                                onClick={() => handleCardFilter("NON_URGENT")}
                                className={`cursor-pointer border-green-200 bg-green-50 transition
                                    ${selectedTriageCategory === "NON_URGENT" ? "ring-2 ring-green-500" : ""}`}
                            >
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
                                    <div className="md:col-span-5">
                                        <CardTitle>Emergency Triage Cases</CardTitle>
                                    </div>
                                    {searchQuery ||
                                    selectedTriageType !== "EMERGENCY" ||
                                    selectedTriageCategory !== "all" ||
                                    selectedArrivalDate ||
                                    selectedLastTriageDate ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setSelectedTriageType("EMERGENCY");
                                                setSelectedTriageCategory("all");
                                                setSelectedArrivalDate(null);
                                                setSelectedLastTriageDate(null);
                                            }}
                                        >
                                            <RefreshCcw className="h-4 w-4 mr-2" />
                                            Clear Filters
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline" size="sm">
                                            <RefreshCcw className="h-4 w-4 mr-2" />
                                            Clear Filters
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-6">
                                        <TriageFilters
                                            searchQuery={searchQuery}
                                            onSearchChange={setSearchQuery}
                                            selectedTriageType={selectedTriageType}
                                            onTriageTypeChange={setSelectedTriageType}
                                            selectedTriageCategory={selectedTriageCategory}
                                            onTriageCategoryChange={setSelectedTriageCategory}
                                            selectedArrivalDate={selectedArrivalDate}
                                            onArrivalDateChange={setSelectedArrivalDate}
                                            selectedLastTriageDate={selectedLastTriageDate}
                                            onLastTriageDateChange={setSelectedLastTriageDate}
                                            isERMode={isERMode}
                                        />                                        
                                    </div>
                                    <ERTriageTable 
                                        data={filteredTriageData} 
                                        onFollowUp={handleFollowUp} 
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader className="grid md:grid-cols-6">
                                    <div className="md:col-span-5">
                                        <CardTitle className="mb-1">Triage Cases</CardTitle>
                                    </div>
                                    {searchQuery ||
                                    selectedTriageType !== "all" ||
                                    selectedTriageCategory !== "all" ||
                                    selectedArrivalDate ||
                                    selectedLastTriageDate ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setSelectedTriageType("all");
                                                setSelectedTriageCategory("all");
                                                setSelectedArrivalDate(null);
                                                setSelectedLastTriageDate(null);
                                            }}
                                        >
                                            <RefreshCcw className="h-4 w-4 mr-2" />
                                            Clear Filters
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline" size="sm">
                                            <RefreshCcw className="h-4 w-4 mr-2" />
                                            Clear Filters
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-6">
                                        <TriageFilters
                                            searchQuery={searchQuery}
                                            onSearchChange={setSearchQuery}
                                            selectedTriageType={selectedTriageType}
                                            onTriageTypeChange={setSelectedTriageType}
                                            selectedTriageCategory={selectedTriageCategory}
                                            onTriageCategoryChange={setSelectedTriageCategory}
                                            selectedArrivalDate={selectedArrivalDate}
                                            onArrivalDateChange={setSelectedArrivalDate}
                                            selectedLastTriageDate={selectedLastTriageDate}
                                            onLastTriageDateChange={setSelectedLastTriageDate}
                                            isERMode={isERMode}
                                        />                                        
                                    </div>
                                
                                    <TriageTable data={filteredTriageData} onViewRecord={handleViewTriage}/>
                                </CardContent>
                            </Card>
                        )}
                    </div>

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
