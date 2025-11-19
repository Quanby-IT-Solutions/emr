"use client"

import { useId } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Siren, ClockAlert, ClipboardPlus, Skull } from "lucide-react"
import { DISPOSITIONS, TRIAGE_LEVELS } from "@/app/(dashboard)/dummy-data/dummy-triage"

// Define only the fields this component needs
type TriageSummaryFields = {
  triagePriority: string
  triageNotes: string
  disposition: string
  dispositionOther: string
}

interface TriageSummaryCompProps<T extends TriageSummaryFields> {
  form: T
  setForm: React.Dispatch<React.SetStateAction<T>>
}

export function TriageSummaryComp<T extends TriageSummaryFields>({ form, setForm }: TriageSummaryCompProps<T>) {
  const id = useId()

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium leading-none">Priority Level</legend>
        <RadioGroup 
          className="grid grid-cols-2 gap-3" 
          value={form.triagePriority}
          onValueChange={(value) => setForm(f => ({ ...f, triagePriority: value }))}
        >
          {TRIAGE_LEVELS.map(level => {
            const IconComponent = level.icon === "Siren" ? Siren :
                                 level.icon === "ClockAlert" ? ClockAlert :
                                 level.icon === "ClipboardPlus" ? ClipboardPlus : Skull
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
                <IconComponent className={`h-6 w-6 ${level.iconColor}`} />
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

      <div className="space-y-2">
        <Label className="text-sm font-medium">Disposition</Label>
      
        <RadioGroup value={form.disposition} onValueChange={(value) => setForm(f => ({ ...f, disposition: value }))} className="grid grid-cols-2 gap-3">
          {DISPOSITIONS.map((disposition) => {
              const checked = form.disposition === disposition.value
      
              return (
                <div
                  key={`${id}-${disposition.value}`}
                  onClick={() => setForm(f => ({ ...f, disposition: disposition.value }))}
                  className={`flex items-center justify-between p-3 border rounded-sm cursor-pointer transition-colors shadow-sm hover:shadow-md ${
                  checked ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id={`${id}-${disposition.value}`} value={disposition.value} className="pointer-events-none" />
                    <Label htmlFor={`${id}-${disposition.value}`} className="cursor-pointer pointer-events-none text-sm">{disposition.label}</Label>
                  </div>
                </div>
              )
            })}
        </RadioGroup>

        {form.disposition === "Other" && (
          <div className="space-y-2 mt-3">
            <Label htmlFor="dispositionOther" className="text-sm text-muted-foreground">Please Specify:</Label>
            <Input id="dispositionOther" value={form.dispositionOther} onChange={e => setForm(f => ({ ...f, dispositionOther: e.target.value }))} placeholder="Specify disposition" />
          </div>
        )}
      </div>
    </div>
  )
}