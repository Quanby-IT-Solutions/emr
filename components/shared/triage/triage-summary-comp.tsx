"use client"

import { useId } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Siren, ClockAlert, ClipboardPlus, Skull } from "lucide-react"

interface TriageSummaryForm {
  triagePriority: string
  triageNotes: string
}

interface TriageSummaryCompProps {
  form: TriageSummaryForm
  setForm: React.Dispatch<React.SetStateAction<TriageSummaryForm>>
}

export function TriageSummaryComp({ form, setForm }: TriageSummaryCompProps) {
  const id = useId()
  
  const triageLevels = [
    { 
      value: 'emergent', 
      label: 'Emergent',
      icon: Siren,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      iconColor: 'text-red-600',
      ringColor: 'has-data-[state=checked]:ring-red-500'
    },
    { 
      value: 'urgent', 
      label: 'Urgent',
      icon: ClockAlert,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-900',
      iconColor: 'text-yellow-600',
      ringColor: 'has-data-[state=checked]:ring-yellow-500'
    },
    { 
      value: 'non-urgent', 
      label: 'Non-Urgent',
      icon: ClipboardPlus,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      iconColor: 'text-green-600',
      ringColor: 'has-data-[state=checked]:ring-green-500'
    },
    { 
      value: 'dead', 
      label: 'Dead',
      icon: Skull,
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-900',
      iconColor: 'text-slate-600',
      ringColor: 'has-data-[state=checked]:ring-slate-500'
    }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Triage Summary & Notes</h3>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium leading-none">Priority Level</legend>
        <RadioGroup 
          className="grid grid-cols-2 gap-3" 
          value={form.triagePriority}
          onValueChange={(value) => setForm(f => ({ ...f, triagePriority: value }))}
        >
          {triageLevels.map(level => {
            const Icon = level.icon
            return (
              <label
                key={`${id}-${level.value}`}
                className={`relative flex flex-col items-center gap-3 rounded-lg border px-4 py-4 text-center shadow-sm transition-all outline-none cursor-pointer hover:shadow-md ${level.bgColor} ${level.borderColor} ${level.ringColor} has-data-[state=checked]:ring-2 has-focus-visible:ring-2`}
              >
                <RadioGroupItem
                  id={`${id}-${level.value}`}
                  value={level.value}
                  className="sr-only after:absolute after:inset-0"
                  aria-label={`triage-level-${level.value}`}
                />
                <Icon className={`h-6 w-6 ${level.iconColor}`} />
                <p className={`text-sm font-semibold leading-none ${level.textColor}`}>
                  {level.label}
                </p>
              </label>
            )
          })}
        </RadioGroup>
      </fieldset>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          rows={6}
          value={form.triageNotes}
          onChange={e => setForm(f => ({ ...f, triageNotes: e.target.value }))}
          placeholder="Enter clinical observations, assessment details, and any additional notes..."
        />
      </div>
    </div>
  )
}