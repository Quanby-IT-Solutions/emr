"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Activity, Heart, Thermometer, Wind, Weight, Ruler } from "lucide-react"

interface VitalSignsForm {
  bpSystolic: string
  bpDiastolic: string
  pulseRate: string
  temperature: string
  oxygenSaturation: string
  respirationRate: string
  weight: string
  height: string
}

interface VitalSignsCompProps {
  form: VitalSignsForm
  setForm: React.Dispatch<React.SetStateAction<VitalSignsForm>>
}

export function VitalSignsComp({ form, setForm }: VitalSignsCompProps) {
  return (
    <div className="space-y-6">
      {/* Blood Pressure */}
      <Card className="bg-blue-50">
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-red-600" />
              <Label className="text-lg font-semibold">Blood Pressure</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bpSystolic">
                  Systolic (mmHg)
                </Label>
                <Input
                  id="bpSystolic"
                  type="number"
                  placeholder="120"
                  value={form.bpSystolic || ''}
                  onChange={(e) => setForm(f => ({ ...f, bpSystolic: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bpDiastolic">
                  Diastolic (mmHg)
                </Label>
                <Input
                  id="bpDiastolic"
                  type="number"
                  placeholder="80"
                  value={form.bpDiastolic || ''}
                  onChange={(e) => setForm(f => ({ ...f, bpDiastolic: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heart Rate & Temperature */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-green-50">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                <Label htmlFor="pulseRate" className="font-semibold">
                  Pulse Rate (bpm)
                </Label>
              </div>
              <Input
                id="pulseRate"
                type="number"
                placeholder="72"
                value={form.pulseRate || ''}
                onChange={(e) => setForm(f => ({ ...f, pulseRate: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-orange-600" />
                <Label htmlFor="temperature" className="font-semibold">
                  Temperature (°C)
                </Label>
              </div>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="36.5"
                value={form.temperature || ''}
                onChange={(e) => setForm(f => ({ ...f, temperature: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Oxygen Saturation & Respiration */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-cyan-50">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-cyan-600" />
                <Label htmlFor="oxygenSaturation" className="font-semibold">
                  Oxygen Saturation (%)
                </Label>
              </div>
              <Input
                id="oxygenSaturation"
                type="number"
                placeholder="98"
                value={form.oxygenSaturation || ''}
                onChange={(e) => setForm(f => ({ ...f, oxygenSaturation: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-purple-600" />
                <Label htmlFor="respirationRate" className="font-semibold">
                  Respiration Rate
                </Label>
              </div>
              <Input
                id="respirationRate"
                type="number"
                placeholder="16"
                value={form.respirationRate || ''}
                onChange={(e) => setForm(f => ({ ...f, respirationRate: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight & Height */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-amber-50">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Weight className="h-5 w-5 text-amber-600" />
                <Label htmlFor="weight" className="font-semibold">
                  Weight (kg)
                </Label>
              </div>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={form.weight || ''}
                onChange={(e) => setForm(f => ({ ...f, weight: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-indigo-50">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-indigo-600" />
                <Label htmlFor="height" className="font-semibold">
                  Height (cm)
                </Label>
              </div>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={form.height || ''}
                onChange={(e) => setForm(f => ({ ...f, height: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}