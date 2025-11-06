"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Heart, Thermometer, Wind } from "lucide-react"
import { usePatientContext } from '../context/PatientContext'

interface VitalsFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  onComplete: () => void
}

export function VitalsForm({ open, onOpenChange, patientId, onComplete }: VitalsFormProps) {
  const { dispatch } = usePatientContext()
  const [bpSystolic, setBpSystolic] = useState<string>('')
  const [bpDiastolic, setBpDiastolic] = useState<string>('')
  const [heartRate, setHeartRate] = useState<string>('')
  const [temperature, setTemperature] = useState<string>('')
  const [oxygenSaturation, setOxygenSaturation] = useState<string>('')
  const [painLevel, setPainLevel] = useState<number[]>([0])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Auto-save to localStorage on change
    const vitalsData = {
      bpSystolic,
      bpDiastolic,
      heartRate,
      temperature,
      oxygenSaturation,
      painLevel: painLevel[0]
    }
    localStorage.setItem(`vitals-draft-${patientId}`, JSON.stringify(vitalsData))
  }, [bpSystolic, bpDiastolic, heartRate, temperature, oxygenSaturation, painLevel, patientId])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!bpSystolic || parseInt(bpSystolic) < 70 || parseInt(bpSystolic) > 250) {
      newErrors.bpSystolic = 'Systolic BP must be between 70-250 mmHg'
    }
    if (!bpDiastolic || parseInt(bpDiastolic) < 40 || parseInt(bpDiastolic) > 150) {
      newErrors.bpDiastolic = 'Diastolic BP must be between 40-150 mmHg'
    }
    if (!heartRate || parseInt(heartRate) < 30 || parseInt(heartRate) > 220) {
      newErrors.heartRate = 'Heart rate must be between 30-220 bpm'
    }
    if (!temperature || parseFloat(temperature) < 35 || parseFloat(temperature) > 42) {
      newErrors.temperature = 'Temperature must be between 35-42°C'
    }
    if (!oxygenSaturation || parseInt(oxygenSaturation) < 70 || parseInt(oxygenSaturation) > 100) {
      newErrors.oxygenSaturation = 'O2 saturation must be between 70-100%'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const vitals = {
      bpSystolic: parseInt(bpSystolic),
      bpDiastolic: parseInt(bpDiastolic),
      heartRate: parseInt(heartRate),
      temperature: parseFloat(temperature),
      oxygenSaturation: parseInt(oxygenSaturation),
      painLevel: painLevel[0]
    }

    dispatch({ type: 'UPDATE_VITALS', payload: { id: patientId, vitals } })
    
    // Clear draft
    localStorage.removeItem(`vitals-draft-${patientId}`)
    
    onComplete()
    onOpenChange(false)
  }

  const getPainColor = (level: number) => {
    if (level === 0) return 'bg-green-500'
    if (level <= 3) return 'bg-yellow-500'
    if (level <= 6) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Record Vital Signs
          </DialogTitle>
          <DialogDescription>
            Enter patient vitals - all fields are required
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Blood Pressure */}
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-red-600" />
                    <Label className="text-lg font-semibold">Blood Pressure</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bpSystolic">
                        Systolic (mmHg) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="bpSystolic"
                        type="number"
                        placeholder="120"
                        value={bpSystolic}
                        onChange={(e) => setBpSystolic(e.target.value)}
                        className={errors.bpSystolic ? 'border-red-500' : ''}
                        aria-invalid={!!errors.bpSystolic}
                        aria-describedby={errors.bpSystolic ? 'bpSystolic-error' : undefined}
                      />
                      {errors.bpSystolic && (
                        <p id="bpSystolic-error" className="text-sm text-red-500">
                          {errors.bpSystolic}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bpDiastolic">
                        Diastolic (mmHg) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="bpDiastolic"
                        type="number"
                        placeholder="80"
                        value={bpDiastolic}
                        onChange={(e) => setBpDiastolic(e.target.value)}
                        className={errors.bpDiastolic ? 'border-red-500' : ''}
                        aria-invalid={!!errors.bpDiastolic}
                      />
                      {errors.bpDiastolic && (
                        <p className="text-sm text-red-500">{errors.bpDiastolic}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Heart Rate & Temperature */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-green-50">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <Label htmlFor="heartRate" className="font-semibold">
                        Heart Rate (bpm) <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <Input
                      id="heartRate"
                      type="number"
                      placeholder="72"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className={errors.heartRate ? 'border-red-500' : ''}
                      aria-invalid={!!errors.heartRate}
                    />
                    {errors.heartRate && (
                      <p className="text-sm text-red-500">{errors.heartRate}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-orange-600" />
                      <Label htmlFor="temperature" className="font-semibold">
                        Temperature (°C) <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className={errors.temperature ? 'border-red-500' : ''}
                      aria-invalid={!!errors.temperature}
                    />
                    {errors.temperature && (
                      <p className="text-sm text-red-500">{errors.temperature}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Oxygen Saturation */}
            <Card className="bg-cyan-50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-cyan-600" />
                    <Label htmlFor="oxygenSaturation" className="font-semibold">
                      Oxygen Saturation (%) <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    placeholder="98"
                    value={oxygenSaturation}
                    onChange={(e) => setOxygenSaturation(e.target.value)}
                    className={errors.oxygenSaturation ? 'border-red-500' : ''}
                    aria-invalid={!!errors.oxygenSaturation}
                  />
                  {errors.oxygenSaturation && (
                    <p className="text-sm text-red-500">{errors.oxygenSaturation}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pain Level */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">
                    Pain Level: {painLevel[0]}
                  </Label>
                  <Slider
                    value={painLevel}
                    onValueChange={setPainLevel}
                    max={10}
                    step={1}
                    className="w-full"
                    aria-label="Pain level from 0 to 10"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0 - No Pain</span>
                    <span>10 - Worst Pain</span>
                  </div>
                  <div
                    className={`h-2 rounded-full transition-colors ${getPainColor(painLevel[0])}`}
                    role="presentation"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Vitals
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}