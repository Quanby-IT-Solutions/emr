"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { useMemo, useState } from "react"
import { TriageAssessment, TriageEntry } from "../../dummy-data/dummy-triage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Siren, ClockAlert, ClipboardPlus, Ghost, RefreshCcw, UserPlus, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TriageFilters } from "./components/triage-filters"
import { TriageTable } from "./components/triage-table"

export default function TriagePage() {
    const [triageData, setTriageData] = useState<TriageAssessment[]>(TriageEntry)
    const [triageOpen, setTriageOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTriageType, setSelectedTriageType] = useState("all");
    const [selectedTriageCategory, setSelectedTriageCategory] = useState("all");
    const [selectedArrivalDate, setSelectedArrivalDate] = useState<Date | null>(null);
    const [selectedLastTriageDate, setSelectedLastTriageDate] = useState<Date | null>(null);
    
    // Statistics - Preliminary data
    const currentDate = new Date().toISOString().split('T')[0];
    const currentPatients = triageData.filter((entry) => entry.patient.lastDateOfTriage?.toISOString().split('T')[0] === currentDate);

    // Statistics
    const totalAssessments = currentPatients.length;
    const totalEmergent = currentPatients.filter((p) => p.patient.currentTriageCategory === "EMERGENT").length;
    const totalUrgent = currentPatients.filter((p) => p.patient.currentTriageCategory === "URGENT").length;
    const totalNonUrgent = currentPatients.filter((p) => p.patient.currentTriageCategory === "NON_URGENT").length;
    const totalDeceased = currentPatients.filter((p) => p.patient.currentTriageCategory === "DEAD").length;

    // Filters
    const filteredTriageData = useMemo(() => {
        return triageData.filter((entry) => {
            const searchMatch = entry.patient.name.toLowerCase().includes(searchQuery.toLowerCase());
            const triageTypeMatch = selectedTriageType === "all" || entry.patient.triageType === selectedTriageType;
            const triageCategoryMatch = selectedTriageCategory === "all" || entry.patient.currentTriageCategory === selectedTriageCategory;
            const arrivalDateMatch = !selectedArrivalDate?.toISOString().split('T')[0] || entry.patient.arrivalDetails.date.toISOString().split('T')[0] === new Date(selectedArrivalDate).toISOString().split('T')[0];
            const lastTriageDateMatch = !selectedLastTriageDate?.toISOString().split('T')[0] || entry.patient.lastDateOfTriage?.toISOString().split('T')[0] === new Date(selectedLastTriageDate).toISOString().split('T')[0];
            return searchMatch && triageTypeMatch && triageCategoryMatch && arrivalDateMatch && lastTriageDateMatch;
        })
    }, [triageData, searchQuery, selectedTriageType, selectedTriageCategory, selectedArrivalDate, selectedLastTriageDate]);
    
    return (
        <ProtectedRoute requiredRole={UserRole.NURSE}>
            <DashboardLayout role={UserRole.NURSE}>
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"> 
                    <div className="px-4 lg:px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">Triage Assessment</h1>
                                <p className="text-muted-foreground">
                                    Conduct patient triage assessments
                                </p>
                            </div>

                            {/* Open Triage Modal */}
                            <div className="flex items-center gap-4">
                                <Button onClick={() => setTriageOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                                <UserPlus className="mr-2 h-4 w-4" />
                                    Start Triage Assessment
                                </Button>
                            </div>
                        </div>
                        
                    </div>
                    
                    {/* Statistics Cards */}
                    <div className="px-4 lg:px-6">
                        <div className="grid gap-4 md:grid-cols-5">
                            {/* Total Assessments */}
                            <Card className="border-blue-200 bg-blue-50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-900">
                                    Total Assessments
                                </CardTitle>
                                <Stethoscope className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{totalAssessments}</div>
                                <p className="text-xs text-blue-600">
                                    assessments conducted today
                                </p>
                                </CardContent>
                            </Card>

                            {/* Total Emergent Cases for Today */}
                            <Card className="border-red-200 bg-red-50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-red-900">
                                    Emergent
                                </CardTitle>
                                <Siren className="h-4 w-4 text-red-600" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-2xl font-bold  text-red-600">{totalEmergent}</div>
                                <p className="text-xs  text-red-700">
                                    emergent cases for today
                                </p>
                                </CardContent>
                            </Card>

                            {/* Total Urgent Cases for Today */}
                            <Card className="border-yellow-200 bg-yellow-50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-yellow-900">
                                    Urgent
                                </CardTitle>
                                <ClockAlert className="h-4 w-4  text-yellow-600" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-2xl font-bold  text-yellow-600">{totalUrgent}</div>
                                <p className="text-xs  text-yellow-700">
                                    urgent cases for today
                                </p>
                                </CardContent>
                            </Card>

                            {/* Total Non Urgent Cases for Today */}
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-800">
                                    Non Urgent
                                </CardTitle>
                                <ClipboardPlus className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-2xl font-bold text-green-600">{totalNonUrgent}</div>
                                <p className="text-xs text-green-700">
                                    non-urgent cases for today
                                </p>
                                </CardContent>
                            </Card>

                            {/* Total Deceased */}
                            <Card className="border-gray-200 bg-gray-50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-900">
                                    Deceased
                                </CardTitle>
                                <Ghost className="h-4 w-4 text-gray-600" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-2xl font-bold text-gray-600">{totalDeceased}</div>
                                <p className="text-xs text-gray-700">
                                    deceased patients today
                                </p>
                                </CardContent>
                            </Card>
                        </div>


                    </div>

                    {/* Filters Section */}
                    <div className="px-4 lg:px-6">
                        <Card>
                        <CardHeader className="grid md:grid-cols-6">
                            <div className="md:col-span-5">
                            <CardTitle className="mb-1">Triage Assessment Filters</CardTitle>
                            <CardDescription>Search by Patient Name or ID, Triage Category, Type or Date</CardDescription>
                            </div>
                            {/* Clear Filters Button */}
                            {searchQuery || selectedTriageType !== "all" || selectedTriageCategory !== "all" || selectedArrivalDate || selectedLastTriageDate ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => {
                                    setSearchQuery("")
                                    setSelectedTriageType("all")
                                    setSelectedTriageCategory("all")
                                    setSelectedArrivalDate(null)
                                    setSelectedLastTriageDate(null)
                                    }}
                                >
                                    <RefreshCcw className="h-4 w-4 mr-2" />
                                    Clear Filters
                                </Button>
                                ) : (
                                <Button
                                    disabled
                                    variant="outline"
                                    size="sm"
                                    className="border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => {
                                    setSearchQuery("")
                                    setSelectedTriageType("all")
                                    setSelectedTriageCategory("all")
                                    setSelectedArrivalDate(null)
                                    setSelectedLastTriageDate(null)
                                    }}
                                >
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
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle>
                                    Triage Cases
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TriageTable
                                    data={filteredTriageData}
                                />
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
}