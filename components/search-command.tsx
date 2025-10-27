"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  IconSearch,
  IconFile,
  IconUser,
  IconCalendar,
  IconPill,
  IconFlask,
  IconFileText,
} from "@tabler/icons-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function SearchCommand() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-muted-foreground sm:pr-12 md:w-80 lg:w-96 xl:w-[500px]"
      >
        <IconSearch className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/scheduler/schedule"))}
            >
              <IconCalendar className="mr-2 h-4 w-4" />
              <span>Schedule Appointment</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/registrar/registration"))}
            >
              <IconUser className="mr-2 h-4 w-4" />
              <span>Register Patient</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/clinician/orders"))}
            >
              <IconFileText className="mr-2 h-4 w-4" />
              <span>Create Order</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Patients">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/nurse/patients"))}
            >
              <IconUser className="mr-2 h-4 w-4" />
              <span>View Patients</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/registrar/patients"))}
            >
              <IconSearch className="mr-2 h-4 w-4" />
              <span>Search Patients</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Clinical">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/nurse/medications"))}
            >
              <IconPill className="mr-2 h-4 w-4" />
              <span>Medications</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/lab-tech/queue"))}
            >
              <IconFlask className="mr-2 h-4 w-4" />
              <span>Lab Orders</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/clinician/documentation"))}
            >
              <IconFile className="mr-2 h-4 w-4" />
              <span>Documentation</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
