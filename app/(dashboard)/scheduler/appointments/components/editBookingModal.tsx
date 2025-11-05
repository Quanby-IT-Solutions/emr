"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditBookingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedAppointment: {
        id: number;
        patient: string;
        provider: string;
        date: Date;
        time: string;
        status: string;
    } | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDateChange?: (date: Date) => void;
}

export function EditBookingModal({ open, onOpenChange, selectedAppointment, handleInputChange, onDateChange }: EditBookingModalProps) {
    console.log(selectedAppointment)

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
                    value={selectedAppointment?.patient || ""}
                    onChange={handleInputChange}
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
                    value={selectedAppointment?.provider || ""}
                    onChange={handleInputChange}
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
                          {selectedAppointment?.date ? selectedAppointment.date.toDateString() : "Select date"}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger> 
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedAppointment?.date}
                          onSelect={(newDate) => {
                            if (newDate && onDateChange) {
                              onDateChange(newDate);
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
                      defaultValue={selectedAppointment?.time ?
                        // Convert "hh:mm AM/PM" to "HH:MM:SS" 24h format
                        (() => {
                          const [time, period] = selectedAppointment.time.split(" ");
                          const [hours, minutes] = time.split(":");
                          const hours24 = period === "AM" ? Number(hours) : Number(hours) + 12;
                          return `${hours24.toString().padStart(2, "0")}:${minutes}:00`;
                        })() : ""}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                  
                  {/* Appointment Status*/}
                  <div className="grid gap-1 ">
                    <Label htmlFor="datetime" className="text-muted-foreground">Booking Status</Label>
                    <Select
                      name="status"
                      defaultValue={selectedAppointment?.status || "pending"}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-2">
              <Button onClick={() => { 
                onOpenChange(false); 
              }}>
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