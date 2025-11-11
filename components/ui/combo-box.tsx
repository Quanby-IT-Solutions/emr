"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
}

export function Combobox({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...", 
  emptyMessage = "No results found.",
  disabled = false 
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const selectedLabel = options.find((option) => option.value === value)?.label || placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open} 
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 m-1">
        <Command>
          <CommandInput placeholder={`Search...`} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          {/* Scrollable container for options */}
          <div className="max-h-[200px] overflow-y-auto">
            <CommandGroup>
              {options.map((option) => (
                <CommandItem 
                  key={option.value} 
                  value={option.value} 
                  onSelect={(currentValue) => { 
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false) 
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export type { ComboboxOption }
