"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, RefreshCcw } from "lucide-react"

interface SearchPatientProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  departmentFilter: string
  setDepartmentFilter: (dept: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  onRefresh: () => void
}

export function SearchPatient({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  onRefresh
}: SearchPatientProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Patient
          </CardTitle>
          <CardDescription>
            Search by patient name, ID, or appointment reference number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter patient name, ID, or appointment #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                  <SelectItem value="GENERAL">General Medicine</SelectItem>
                  <SelectItem value="PEDIATRICS">Pediatrics</SelectItem>
                  <SelectItem value="CARDIOLOGY">Cardiology</SelectItem>
                  <SelectItem value="ORTHOPEDICS">Orthopedics</SelectItem>
                  <SelectItem value="OB-GYN">OB-GYN</SelectItem>
                  <SelectItem value="ENT">ENT</SelectItem>
                  <SelectItem value="DERMATOLOGY">Dermatology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="ARRIVED">Arrived</SelectItem>
                  <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium opacity-0">Action</label>
              <Button
                variant="outline"
                className="w-full"
                onClick={onRefresh}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}