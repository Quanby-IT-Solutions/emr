"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Wind, Heart, Activity, Stethoscope } from "lucide-react"

interface RapidAssessmentProps {
  airway: { obs: string; intv: string }
  breathing: { obs: string; intv: string }
  circulation: { obs: string; intv: string }
  onChange: (section: string, field: string, value: string) => void
}

export function RapidAssessmentComp({
  airway = { obs: "", intv: "" },
  breathing = { obs: "", intv: "" },
  circulation = { obs: "", intv: "" },
  onChange,
}: RapidAssessmentProps) {
  return (
    <div className="space-y-6">

      {/* AIRWAY */}
      <Card className="bg-blue-90">
        <CardContent className="pt-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="h-5 w-5 text-blue-600" />
              <Label className="text-lg font-semibold">Airway</Label>
            </div>
            
            {/* Assessment */}
            <div className="space-y-2">
              <Label className="font-medium">Assessment</Label>
              <Textarea
                placeholder="Describe airway assessment..."
                rows={4}
                value={airway.obs}
                onChange={(e) => onChange("airway", "obs", e.target.value)}
              />
            </div>

            {/* Intervention */}
            <div className="space-y-2">
              <Label className="font-medium">Intervention</Label>
              <Textarea
                placeholder="Document any airway interventions..."
                rows={4}
                value={airway.intv}
                onChange={(e) => onChange("airway", "intv", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BREATHING */}
      <Card className="bg-green-50">
        <CardContent className="pt-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="h-5 w-5 text-green-600" />
              <Label className="text-lg font-semibold">Breathing</Label>
            </div>
            
            <div className="space-y-2">
              <Label className="font-medium">Assessment</Label>
              <Textarea
                placeholder="Describe breathing assessment..."
                rows={4}
                value={breathing.obs}
                onChange={(e) => onChange("breathing", "obs", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Intervention</Label>
              <Textarea
                placeholder="Document breathing interventions..."
                rows={4}
                value={breathing.intv}
                onChange={(e) => onChange("breathing", "intv", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CIRCULATION */}
      <Card className="bg-red-50">
        <CardContent className="pt-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-red-600" />
              <Label className="text-lg font-semibold">Circulation</Label>
            </div>
            
            <div className="space-y-2">
              <Label className="font-medium">Assessment</Label>
              <Textarea
                placeholder="Describe circulation assessment..."
                rows={4}
                value={circulation.obs}
                onChange={(e) => onChange("circulation", "obs", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Intervention</Label>
              <Textarea
                placeholder="Document circulation interventions..."
                rows={4}
                value={circulation.intv}
                onChange={(e) => onChange("circulation", "intv", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}