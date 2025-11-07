"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { AppointmentEntry } from "../../dummy-data/dummy-appointments";

interface EditBookingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedAppointment: AppointmentEntry | undefined;
    onConfirmUpdate: (updatedAppointment: AppointmentEntry) => void;
}

export function EditBookingModal({ open, onOpenChange, selectedAppointment, onConfirmUpdate }: EditBookingModalProps) {
    const [patient, setPatient] = useState<string>(selectedAppointment?.patientName || "");
    const [ageSex, setAgeSex] = useState<string>(selectedAppointment?.ageSex || "");
    const [provider, setProvider] = useState<string>(selectedAppointment?.provider || "");
    const [department, setDepartment] = useState<string>(selectedAppointment?.department || "");  // Default to a valid department
    const [departmentLocation, setDepartmentLocation] = useState<string>(selectedAppointment?.departmentLocation || ""); 
    const [officeLocation, setOfficeLocation] = useState<string>(selectedAppointment?.officeLocation || ""); 
    const [date, setDate] = useState<Date | undefined>(selectedAppointment?.appointmentDate ? new Date(selectedAppointment.appointmentDate) : undefined);
    const [time, setTime] = useState<string>(selectedAppointment?.appointmentTime || "")
    const [visitType, setVisitType] = useState<"New" | "Follow-up" | "Consultation">(selectedAppointment?.visitType || "Follow-up");
    const [status, setStatus] = useState<"Confirmed" | "Pending" | "Cancelled">("Pending");



    const handleUpdateData = () => {
        if (selectedAppointment && date) {
            onConfirmUpdate({
                patientId: selectedAppointment.patientId,
                patientName: patient,
                ageSex,
                provider,
                appointmentDate: date.toISOString().split('T')[0],
                appointmentTime: time,
                department,
                departmentLocation,
                officeLocation,
                visitType,
                bookingStatus: status,
            });
        }  
        onOpenChange(false);
    }

    // Convert 24h time to 12h AM/PM format
    const convertTo12Hour = (time24: string) => {
        const [hours, minutes] = time24.split(":");
        const hour = parseInt(hours);
        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
    };

    // Convert 12h AM/PM format to 24h format
    const convertTo24Hour = (time12: string) => {
        const [time, period] = time12.split(" ");
        const [hours, minutes] = time.split(":");
        let hour24 = parseInt(hours);
        
        if (period === "PM" && hour24 !== 12) {
            hour24 += 12;
        } else if (period === "AM" && hour24 === 12) {
            hour24 = 0;
        }
        
        return `${hour24.toString().padStart(2, "0")}:${minutes}:00`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
           <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogDescription>
                Modify the details of the selected appointment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-5">
              {/* Patient Details */}
              <div className="grid gap-4 mt-4">
                <Label className="font-semibold">Patient Details</Label>
                <div className="grid gap-1">
                  <Label htmlFor="patientName" className="text-muted-foreground">Patient Name</Label>
                  <Input 
                    id="patient" 
                    name="patient" 
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                  />
                </div>
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="grid gap-1">
                    <Label htmlFor="contact" className="text-sm text-muted-foreground">Mobile Number</Label>
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="09XXXXXXXXX"
                      inputMode="tel"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="telephone" className="text-sm text-muted-foreground">Telephone (optional)</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      placeholder="(02) XXXXXXX"
                      inputMode="tel"
                    />
                  </div>
                </div>

                {/* Health Provider Details */}    
                <Label className="font-semibold">Health Provider Details</Label>            
                <div className="grid gap-1">
                  <Label htmlFor="provider" className="text-muted-foreground">Provider</Label>
                  <Input 
                    id="provider" 
                    name="provider" 
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="grid gap-1">
                    <Label htmlFor="department" className="text-sm text-muted-foreground">Specialty/Department:</Label>
                    <Input id="department" name="department" defaultValue="Cardiology" readOnly/>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="location" className="text-sm text-muted-foreground">Location:</Label>
                    <Input id="location" name="location" defaultValue="North Clinic" readOnly/>
                  </div>                
                </div>
                
                <Label><strong>Appointment Details</strong></Label>
                <div className="grid md:grid-cols-[2fr_2fr] gap-3">
                  {/* Appointment Date and Time*/}
                  <div className="grid gap-1 ">
                    <Label htmlFor="datetime" className="text-muted-foreground">Scheduled Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {date ? date.toDateString() : "Select date"}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger> 
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => {
                            if (newDate) {
                              setDate(newDate);
                            }
                          }}
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label htmlFor="time-picker" className="text-muted-foreground">Scheduled Time</Label>
                    <Input
                      type="time"
                      id="time-picker"
                      step="1"
                      value={time ? convertTo24Hour(time) : ""}
                      onChange={(e) => {
                        const time24 = e.target.value;
                        const [hours, minutes] = time24.split(":");
                        setTime(convertTo12Hour(`${hours}:${minutes}`));
                      }}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                  
                  {/* Appointment Status*/}
                  <div className="grid gap-1 ">
                    <Label htmlFor="status" className="text-muted-foreground">Booking Status</Label>
                    <Select
                      name="status"
                      value={status}
                      onValueChange={(newValue: "Confirmed" | "Pending" | "Cancelled") => setStatus(newValue)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-2">
              <Button onClick={handleUpdateData}>
                Confirm
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false); 
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    )
}