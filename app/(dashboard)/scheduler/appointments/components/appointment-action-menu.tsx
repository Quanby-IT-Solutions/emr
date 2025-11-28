"use client"

import { MoreHorizontal, Edit, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppointmentEntry } from "@/app/(dashboard)/dummy-data/dummy-appointments"

interface AppointmentActionsMenuProps {
  appointment: AppointmentEntry
  onEdit: (appointment: AppointmentEntry) => void
  onConfirm: (appointment: AppointmentEntry) => void
  onCancel: (appointment: AppointmentEntry) => void
}

export function AppointmentActionsMenu({ appointment, onEdit, onConfirm, onCancel }: AppointmentActionsMenuProps) {
  const isConfirmed = appointment.bookingStatus === "Confirmed"
  const isCancelled = appointment.bookingStatus === "Cancelled"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(appointment)} disabled={isCancelled}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Details
        </DropdownMenuItem>
        
        {!isConfirmed && !isCancelled && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onConfirm(appointment)} className="text-green-600 focus:text-green-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Appointment
            </DropdownMenuItem>
          </>
        )}
        
        {!isCancelled && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onCancel(appointment)}
              className="text-destructive focus:text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Appointment
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}