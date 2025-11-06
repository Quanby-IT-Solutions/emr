"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateNewPatientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (newPatient: {
    firstName: string
    middleName?: string
    lastName: string
    address?: string
    birthday?: string
    age?: number
    phone?: string
    telephone?: string
    email?: string
    emergencyName?: string
    emergencyNumber?: string
    emergencyRelation?: string
    emergencyRelationOther?: string
  }) => void
}

const EMERGENCY_RELATIONSHIP_OPTIONS = Object.freeze([
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
  { value: "spouse", label: "Spouse" },
  { value: "child", label: "Child" },
  { value: "grandparent", label: "Grandparent" },
  { value: "aunt", label: "Aunt" },
  { value: "uncle", label: "Uncle" },
  { value: "cousin", label: "Cousin" },
  { value: "niece", label: "Niece" },
  { value: "nephew", label: "Nephew" },
  { value: "other", label: "Other" },
])

export function CreateNewPatientModal({ open, onOpenChange, onCreate,}: CreateNewPatientModalProps) {
  // --------------------------- State ---------------------------
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [birthday, setBirthday] = useState("")
  const [age, setAge] = useState<number | undefined>(undefined)
  const [phone, setPhone] = useState("")
  const [telephone, setTelephone] = useState("")
  const [email, setEmail] = useState("")
  const [emergencyName, setEmergencyName] = useState("")
  const [emergencyNumber, setEmergencyNumber] = useState("")
  const [emergencyRelation, setEmergencyRelation] = useState("")
  const [emergencyRelationOther, setEmergencyRelationOther] = useState("")

  // --------------------------- Handlers ---------------------------
  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBirthday(value)

    if (value) {
      const today = new Date()
      const birthDate = new Date(value)
      let computedAge = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        computedAge--
      }
      setAge(computedAge >= 0 ? computedAge : undefined)
    } else {
      setAge(undefined)
    }
  }

  const handleReset = () => {
    setFirstName("")
    setMiddleName("")
    setLastName("")
    setAddress("")
    setBirthday("")
    setAge(undefined)
    setPhone("")
    setTelephone("")
    setEmail("")
    setEmergencyName("")
    setEmergencyNumber("")
    setEmergencyRelation("")
    setEmergencyRelationOther("")
    onOpenChange(false)
  }

  const handleCreate = () => {
    onCreate({
      firstName,
      middleName,
      lastName,
      address,
      birthday,
      age,
      phone,
      telephone,
      email,
      emergencyName,
      emergencyNumber,
      emergencyRelation,
      emergencyRelationOther,
    })
    handleReset()
  }

  return (
    <Dialog open={open} onOpenChange={handleReset}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Patient Profile</DialogTitle>
          <DialogDescription className="mb-4">
            Enter the patient&apos;s basic details to schedule their appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {/* Name Section */}
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                placeholder="Santos"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Dela Cruz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Birthday + Age */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={handleBirthdayChange}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                value={age ?? ""}
                readOnly
                className="bg-muted/10 cursor-default"
                placeholder="Auto-calculated"
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid gap-1">
            <Label htmlFor="address">Current Address</Label>
            <Input
              id="address"
              placeholder="123 Main St, City, Province"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label htmlFor="contact">Mobile Number</Label>
              <Input
                id="contact"
                placeholder="09XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="telephone">Telephone (optional)</Label>
              <Input
                id="telephone"
                placeholder="(02) XXXXXXX"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                inputMode="tel"
              />
            </div>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="patient@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-muted my-3" />

          {/* Emergency Contact */}
          <div className="grid gap-2">
            <Label>Emergency Contact</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="emergencyName" className="text-sm text-muted-foreground">
                  Contact Name
                </Label>
                <Input
                  id="emergencyName"
                  placeholder="Ex: Maria Dela Cruz"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="emergencyNumber" className="text-sm text-muted-foreground">
                  Contact Number
                </Label>
                <Input
                  id="emergencyNumber"
                  placeholder="09XXXXXXXXX"
                  value={emergencyNumber}
                  onChange={(e) => setEmergencyNumber(e.target.value)}
                  inputMode="tel"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <div className="grid gap-1">
                <Label htmlFor="emergencyRelation" className="text-sm text-muted-foreground">
                  Relationship
                </Label>
                <Select
                  value={emergencyRelation}
                  onValueChange={setEmergencyRelation}
                >
                  <SelectTrigger id="emergencyRelation" className="w-full">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMERGENCY_RELATIONSHIP_OPTIONS.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {emergencyRelation === "other" && (
                <div className="grid gap-1">
                  <Label htmlFor="emergencyRelationOther" className="text-sm text-muted-foreground">
                    Please specify
                  </Label>
                  <Input
                    id="emergencyRelationOther"
                    placeholder="e.g. friend, boss, neighbor"
                    value={emergencyRelationOther}
                    onChange={(e) => setEmergencyRelationOther(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-4 flex justify-end gap-2 border-t pt-3">
          <Button variant="outline" onClick={handleReset}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
