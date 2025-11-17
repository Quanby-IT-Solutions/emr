"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { useMemo, useState } from "react"
import { TriageAssessment, TriageEntry } from "../../dummy-data/dummy-triage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Siren, ClockAlert, ClipboardPlus, AlertCircle, RefreshCcw, UserPlus, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TriageFilters } from "./components/triage-filters"
import { TriageTable } from "./components/triage-table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ERTriageTable } from "./components/er-triage-table"
import { TriageWizard } from "@/app/(dashboard)/nurse/triage/components/new-triage-modal"
import { FollowUpWizard } from "./components/followup-triage-modal"

export default function TriagePage() {
    const [triageData, setTriageData] = useState<TriageAssessment[]>(TriageEntry)
    const [searchQuery, setSearchQuery] = useState("");
    const [openFollowUp, setOpenFollowUp] = useState(false);
    const [selectedTriageType, setSelectedTriageType] = useState("all");
    const [selectedTriageCategory, setSelectedTriageCategory] = useState("all");
    const [selectedArrivalDate, setSelectedArrivalDate] = useState<Date | null>(null);
    const [selectedLastTriageDate, setSelectedLastTriageDate] = useState<Date | null>(null);

    const [isERMode, setIsERMode] = useState(false);
    const [openNewTriage, setOpenNewTriage] = useState(false);

    // Statistics - Preliminary data
    const currentDate = new Date().toISOString().split('T')[0];
    const currentPatients = triageData.filter((entry) => entry.patient.lastDateOfTriage?.toISOString().split('T')[0] === currentDate);

    // Statistics
    const totalAssessments = triageData.length;
    const totalEmergent = currentPatients.filter((p) => p.patient.currentTriageCategory === "EMERGENT").length;
    const totalUrgent = currentPatients.filter((p) => p.patient.currentTriageCategory === "URGENT").length;
    const totalNonUrgent = currentPatients.filter((p) => p.patient.currentTriageCategory === "NON_URGENT").length;

    // Filters
    const filteredTriageData = useMemo(() => {
        return triageData.filter((entry) => {
            const searchMatch = entry.patient.name.toLowerCase().includes(searchQuery.toLowerCase());
            const triageTypeMatch = selectedTriageType === "all" || entry.patient.triageType === selectedTriageType;
            const triageCategoryMatch = selectedTriageCategory === "all" || entry.patient.currentTriageCategory === selectedTriageCategory;
            const arrivalDateMatch =
                !selectedArrivalDate?.toISOString().split("T")[0] ||
                entry.patient.arrivalDetails.date.toISOString().split("T")[0] ===
                    new Date(selectedArrivalDate).toISOString().split("T")[0];

            const lastTriageDateMatch =
                !selectedLastTriageDate?.toISOString().split("T")[0] ||
                entry.patient.lastDateOfTriage?.toISOString().split("T")[0] ===
                    new Date(selectedLastTriageDate).toISOString().split("T")[0];

            return searchMatch && triageTypeMatch && triageCategoryMatch && arrivalDateMatch && lastTriageDateMatch;
        });
    }, [
        triageData,
        searchQuery,
        selectedTriageType,
        selectedTriageCategory,
        selectedArrivalDate,
        selectedLastTriageDate,
    ]);

    const handleERCheck = (checked: boolean) => {
        setIsERMode(checked);
        if (checked) setSelectedTriageType("EMERGENCY");
        else setSelectedTriageType("all");
    };

    const handleFollowUp = () => setOpenFollowUp(true);

    const handleNewTriage = () => setOpenNewTriage(true);

    // Handle stat card filter
    const handleCardFilter = (category: string) => {
        setSelectedTriageCategory((current) => (current === category ? "all" : category));
    };

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
                                    <p className="text-xs text-red-700">emergent cases for today</p>
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
                                    <p className="text-xs text-yellow-700">urgent cases for today</p>
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
                                    <p className="text-xs text-green-700">non-urgent cases for today</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="px-4 lg:px-6">
                        <Card>
                            <CardHeader className="grid md:grid-cols-6">
                                <div className="md:col-span-5">
                                    <CardTitle className="mb-1">Triage Assessment Filters</CardTitle>
                                    <CardDescription>
                                        Search by Patient Name or ID, Triage Category, Type or Date
                                    </CardDescription>
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

                            <CardContent className="pt-4">
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
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Triage Table */}
                    <div className="px-4 lg:px-6">
                        {isERMode ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>ER Cases</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ERTriageTable data={filteredTriageData} onFollowUp={handleFollowUp} />
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Triage Cases</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <TriageTable data={filteredTriageData} />
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <TriageWizard open={openNewTriage} onOpenChange={setOpenNewTriage} />
                    <FollowUpWizard open={openFollowUp} onOpenChange={setOpenFollowUp} />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
}
