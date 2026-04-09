"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconShieldCheck,
  IconAlertTriangle,
  IconCheck,
  IconArrowBack,
  IconFlask,
  IconPill,
  IconStethoscope,
} from "@tabler/icons-react"
import { toast } from "sonner"

export interface VerificationOrder {
  id: number
  patient: string
  mrn: string
  age: number
  weight: number
  allergies: { substance: string; severity: "Mild" | "Moderate" | "Severe" }[]
  renalFunction: string
  eGFR: number
  activeProblems: string[]
  medication: string
  dose: string
  route: string
  frequency: string
  indication: string
  prescriber: string
  priority: "STAT" | "Urgent" | "Routine"
  orderTime: string
  isHighRisk: boolean
  isProspective: boolean
  clinicalChecks: {
    allergyCheck: "Pass" | "Fail" | "Warning"
    allergyDetail?: string
    doseRangeCheck: "Pass" | "Fail" | "Warning"
    doseRangeDetail?: string
    drugInteraction: "None" | "Minor" | "Moderate" | "Major"
    drugInteractionDetail?: string
    renalDosing: "N/A" | "Adequate" | "Adjustment Needed"
    renalDosingDetail?: string
  }
}

interface VerificationDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: VerificationOrder | null
  onVerify: (orderId: number) => void
  onReturn: (orderId: number, reason: string) => void
}

export function VerificationDetailSheet({
  open,
  onOpenChange,
  order,
  onVerify,
  onReturn,
}: VerificationDetailSheetProps) {
  const [returnReason, setReturnReason] = useState("")
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [coSignAcknowledged, setCoSignAcknowledged] = useState(false)

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setReturnReason("")
      setShowReturnForm(false)
      setCoSignAcknowledged(false)
    }
    onOpenChange(isOpen)
  }

  function handleVerify() {
    if (!order) return
    if (order.isHighRisk && !coSignAcknowledged) {
      toast.error("High-risk medication requires co-sign acknowledgment")
      return
    }
    onVerify(order.id)
    handleOpenChange(false)
  }

  function handleReturn() {
    if (!order) return
    if (!returnReason.trim()) {
      toast.error("Return reason is required")
      return
    }
    onReturn(order.id, returnReason)
    handleOpenChange(false)
  }

  const checkBadge = (status: string) => {
    switch (status) {
      case "Pass":
      case "None":
      case "N/A":
      case "Adequate":
        return <Badge variant="default">{status}</Badge>
      case "Warning":
      case "Minor":
        return <Badge variant="warning">{status}</Badge>
      case "Fail":
      case "Major":
      case "Adjustment Needed":
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const severityBadge = (severity: "Mild" | "Moderate" | "Severe") => {
    switch (severity) {
      case "Mild":
        return <Badge variant="outline">{severity}</Badge>
      case "Moderate":
        return <Badge variant="warning">{severity}</Badge>
      case "Severe":
        return <Badge variant="destructive">{severity}</Badge>
    }
  }

  if (!order) return null

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <IconShieldCheck className="h-5 w-5" />
            Order Verification Review
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* High-Risk Warning Banner */}
          {order.isHighRisk && (
            <div className="flex items-start gap-3 rounded-lg border border-orange-300 bg-orange-50 p-4 dark:border-orange-700 dark:bg-orange-950/30">
              <IconAlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                  High-Risk Medication — Requires Second Pharmacist Co-Sign
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-400">
                  This medication is classified as high-alert. Independent double verification is required
                  before dispensing.
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={coSignAcknowledged}
                    onChange={(e) => setCoSignAcknowledged(e.target.checked)}
                    className="h-4 w-4 rounded border-orange-400"
                  />
                  <span className="text-xs font-medium text-orange-800 dark:text-orange-300">
                    I confirm I have independently verified this order as second pharmacist
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Prospective Banner */}
          {order.isProspective && (
            <div className="flex items-start gap-3 rounded-lg border border-blue-300 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-950/30">
              <IconStethoscope className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                  Prospective Verification — Pre-Operative
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  This order is for a planned surgical procedure. Verify post-op medication protocol compliance.
                </p>
              </div>
            </div>
          )}

          {/* Patient Context */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  <span className="font-medium">{order.patient}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">MRN:</span>{" "}
                  <span className="font-medium">{order.mrn}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Age:</span>{" "}
                  <span className="font-medium">{order.age} yrs</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Weight:</span>{" "}
                  <span className="font-medium">{order.weight} kg</span>
                </div>
                <div>
                  <span className="text-muted-foreground">eGFR:</span>{" "}
                  <span className="font-medium">{order.eGFR} mL/min</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Renal:</span>{" "}
                  <span className="font-medium">{order.renalFunction}</span>
                </div>
              </div>

              {/* Allergies */}
              <div>
                <span className="text-sm text-muted-foreground">Allergies:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {order.allergies.length === 0 ? (
                    <Badge variant="outline">NKDA</Badge>
                  ) : (
                    order.allergies.map((a, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <Badge variant="outline">{a.substance}</Badge>
                        {severityBadge(a.severity)}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Active Problems */}
              <div>
                <span className="text-sm text-muted-foreground">Active Problems:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {order.activeProblems.map((p, i) => (
                    <Badge key={i} variant="secondary">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <IconPill className="h-4 w-4" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Medication:</span>{" "}
                  <span className="font-medium">{order.medication}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dose:</span>{" "}
                  <span className="font-medium">{order.dose}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Route:</span>{" "}
                  <span className="font-medium">{order.route}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Frequency:</span>{" "}
                  <span className="font-medium">{order.frequency}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Indication:</span>{" "}
                  <span className="font-medium">{order.indication}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Prescriber:</span>{" "}
                  <span className="font-medium">{order.prescriber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority:</span>{" "}
                  <Badge
                    variant={
                      order.priority === "STAT"
                        ? "destructive"
                        : order.priority === "Urgent"
                        ? "warning"
                        : "outline"
                    }
                  >
                    {order.priority}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Ordered:</span>{" "}
                  <span className="font-medium">{order.orderTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Checks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <IconFlask className="h-4 w-4" />
                Clinical Decision Support Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Allergy Check</span>
                <div className="flex items-center gap-2">
                  {checkBadge(order.clinicalChecks.allergyCheck)}
                  {order.clinicalChecks.allergyDetail && (
                    <span className="text-xs text-muted-foreground">
                      {order.clinicalChecks.allergyDetail}
                    </span>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span>Dose Range Check</span>
                <div className="flex items-center gap-2">
                  {checkBadge(order.clinicalChecks.doseRangeCheck)}
                  {order.clinicalChecks.doseRangeDetail && (
                    <span className="text-xs text-muted-foreground">
                      {order.clinicalChecks.doseRangeDetail}
                    </span>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span>Drug Interaction</span>
                <div className="flex items-center gap-2">
                  {checkBadge(order.clinicalChecks.drugInteraction)}
                  {order.clinicalChecks.drugInteractionDetail && (
                    <span className="text-xs text-muted-foreground">
                      {order.clinicalChecks.drugInteractionDetail}
                    </span>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span>Renal Dosing</span>
                <div className="flex items-center gap-2">
                  {checkBadge(order.clinicalChecks.renalDosing)}
                  {order.clinicalChecks.renalDosingDetail && (
                    <span className="text-xs text-muted-foreground">
                      {order.clinicalChecks.renalDosingDetail}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Return to Prescriber Form */}
          {showReturnForm ? (
            <div className="space-y-3">
              <Label>Reason for Return to Prescriber *</Label>
              <Textarea
                placeholder="Provide the clinical reason for returning this order..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowReturnForm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReturn}
                  disabled={!returnReason.trim()}
                >
                  <IconArrowBack className="h-4 w-4 mr-1" />
                  Confirm Return
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleVerify}
                disabled={order.isHighRisk && !coSignAcknowledged}
              >
                <IconCheck className="h-4 w-4 mr-1" />
                Verify Order
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowReturnForm(true)}
              >
                <IconArrowBack className="h-4 w-4 mr-1" />
                Return to Prescriber
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
