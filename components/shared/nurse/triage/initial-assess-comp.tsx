"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface Assessment {
  conscious: boolean
  breathing: boolean
  circulation: boolean
  bleeding: boolean
}

interface InitialAssessCompProps {
  assessment: Assessment
  setAssessment: React.Dispatch<React.SetStateAction<Assessment>>
}

export function InitialAssessComp({ assessment, setAssessment }: InitialAssessCompProps) {
  const toggle = (key: keyof Assessment) =>
    setAssessment(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Initial Condition Check</h3>

      <p className="text-muted-foreground text-sm">
        Determine if the patient requires rapid assessment or can proceed directly to vitals.
      </p>

      <div className="space-y-4">
        {[
          { key: "conscious" as const, label: "Patient is conscious and responsive" },
          { key: "breathing" as const, label: "Breathing is normal and adequate" },
          { key: "circulation" as const, label: "Circulation/pulse is stable" },
          { key: "bleeding" as const, label: "No active severe bleeding" },
        ].map(item => (
          <div 
            key={item.key} 
            className="flex items-center gap-3 p-5 border rounded-sm hover:bg-blue-50 cursor-pointer shadow-sm"
            onClick={() => toggle(item.key)}
          >
            <Checkbox
              checked={assessment[item.key]}
              onCheckedChange={() => {}}
            />
            <Label className="cursor-pointer flex-1 pointer-events-none">{item.label}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}