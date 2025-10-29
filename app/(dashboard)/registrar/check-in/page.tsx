"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function CheckInPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Check-In</h1>
            <p className="text-muted-foreground">
              Check-in patients for appointments
            </p>
          </div>
          <div className="flex px-4 lg:px-6 gap-4">
            <div className="w-1/2 px-2">
              <Card>
                <CardHeader></CardHeader>
                  <CardTitle>Search Patient</CardTitle>
                  <CardDescription>
                    <Input placeholder="Enter patient name or ID" />
                  </CardDescription>
              </Card>
            </div>
            <div className="w-1/2">Sample page</div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
