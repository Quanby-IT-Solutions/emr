"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  sampleImagingReports,
  sampleLabResults,
  samplePortalAllergies,
  samplePortalMedications,
  samplePortalProblems,
  sampleVisitSummaries,
} from "@/lib/patient/sample-data"
import { currency, samplePatientPortalInvoices } from "@/lib/biller/sample-data"
import {
  IconCalendar,
  IconChevronRight,
  IconClipboardList,
  IconCreditCard,
  IconFlask,
  IconHeartbeat,
  IconCurrencyDollar,
  IconMessage,
  IconUser,
} from "@tabler/icons-react"

export default function PatientDashboard() {
  const router = useRouter()

  const summary = useMemo(() => {
    const now = new Date()
    const upcomingVisits = [
      new Date("2026-05-12T09:00:00"),
      new Date("2026-05-20T14:00:00"),
    ].filter((d) => d >= now).length

    const releasedLabRows = sampleLabResults.filter((r) => r.releasedToPortal).length
    const activeMeds = samplePortalMedications.filter((m) => m.status === "Active").length
    const openBalance = samplePatientPortalInvoices.reduce((s, i) => s + i.balance, 0)

    return { upcomingVisits, releasedLabRows, activeMeds, openBalance }
  }, [])

  const upcomingVisitCards = [
    {
      id: "apt_001",
      provider: "Dr. Maria Santos",
      specialty: "Endocrinology",
      start: "2026-05-12T09:00:00",
      end: "2026-05-12T09:30:00",
      status: "Confirmed",
      type: "Follow-up consultation",
    },
    {
      id: "apt_002",
      provider: "Dr. Jose Reyes",
      specialty: "Family medicine",
      start: "2026-05-20T14:00:00",
      end: "2026-05-20T14:30:00",
      status: "Scheduled",
      type: "Annual physical",
    },
  ]

  const releasedLabs = sampleLabResults.filter((r) => r.releasedToPortal).slice(0, 3)
  const activeMeds = samplePortalMedications.filter((m) => m.status === "Active").slice(0, 3)
  const openInvoices = samplePatientPortalInvoices.filter((i) => i.balance > 0).slice(0, 3)

  const policyNotes = [
    "Most finalized results appear after release policy checks (timing + clinician review).",
    "Some sensitive documentation may be hidden from portal view.",
    "Portal is read-only: contact registration, clinic, or billing for changes.",
  ]

  const go = (path: string) => router.push(path)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Patient portal</h1>
            <p className="max-w-3xl text-muted-foreground">
              Read-only access to released demographics, visits, results, medications, allergies,
              appointments, and billing 
            </p>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card
              className="cursor-pointer transition hover:border-primary/60 hover:bg-muted/20"
              onClick={() => go("/patient/appointments")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming visits</CardTitle>
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.upcomingVisits}</div>
                <p className="text-xs text-muted-foreground">Sample — next 30 days</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition hover:border-primary/60 hover:bg-muted/20"
              onClick={() => go("/patient/results")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Results to review</CardTitle>
                <IconFlask className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.releasedLabRows}</div>
                <p className="text-xs text-muted-foreground">Released lab rows (demo)</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition hover:border-primary/60 hover:bg-muted/20"
              onClick={() => go("/patient/history")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health record</CardTitle>
                <IconHeartbeat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.activeMeds}</div>
                <p className="text-xs text-muted-foreground">Active medications (demo)</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition hover:border-primary/60 hover:bg-muted/20"
              onClick={() => go("/patient/billing")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balance due</CardTitle>
                <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currency(summary.openBalance)}</div>
                <p className="text-xs text-muted-foreground">Sample open balance</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-6 lg:px-6">
            <Button className="w-full justify-between lg:col-span-1" onClick={() => go("/patient/profile")}>Profile <IconChevronRight className="h-4 w-4" /></Button>
            <Button className="w-full justify-between lg:col-span-1" variant="outline" onClick={() => go("/patient/appointments")}>Appointments <IconChevronRight className="h-4 w-4" /></Button>
            <Button className="w-full justify-between lg:col-span-1" variant="outline" onClick={() => go("/patient/results")}>Results <IconChevronRight className="h-4 w-4" /></Button>
            <Button className="w-full justify-between lg:col-span-1" variant="outline" onClick={() => go("/patient/history")}>Health Record <IconChevronRight className="h-4 w-4" /></Button>
            <Button className="w-full justify-between lg:col-span-1" variant="outline" onClick={() => go("/patient/billing")}>Billing <IconChevronRight className="h-4 w-4" /></Button>
            <Button className="w-full justify-between lg:col-span-1" variant="outline" onClick={() => go("/patient/messages")}>Messages <IconChevronRight className="h-4 w-4" /></Button>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconCalendar className="h-4 w-4" /> Next visits
                </CardTitle>
                <CardDescription>Upcoming appointments already on file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingVisitCards.map((apt) => (
                  <div key={apt.id} className="rounded-md border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium">{apt.provider}</p>
                        <p className="text-xs text-muted-foreground">{apt.specialty} · {apt.type}</p>
                      </div>
                      <Badge variant={apt.status === "Confirmed" ? "default" : "secondary"}>{apt.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatDate(apt.start)} · {formatTime(apt.start)} - {formatTime(apt.end)}
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => go("/patient/appointments")}>Open Appointments</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconClipboardList className="h-4 w-4" /> Portal policy notes
                </CardTitle>
                <CardDescription>Why some information may be delayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {policyNotes.map((note) => (
                  <p key={note} className="rounded-md border bg-muted/30 p-2">
                    {note}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconFlask className="h-4 w-4" /> Recent released results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {releasedLabs.map((row) => (
                  <div key={row.id} className="rounded-md border p-2">
                    <p className="text-sm font-medium">{row.analyte}: {row.value}{row.unit ? ` ${row.unit}` : ""}</p>
                    <p className="text-xs text-muted-foreground">{row.panelName} · {row.resultDate}</p>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">Imaging released: {sampleImagingReports.filter((r) => r.releasedToPortal).length}</p>
                <Button variant="outline" className="w-full" onClick={() => go("/patient/results")}>View all results</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconUser className="h-4 w-4" /> Current health snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Active problems: <span className="font-semibold">{samplePortalProblems.filter((p) => p.status === "ACTIVE").length}</span></p>
                <p className="text-sm">Active medications: <span className="font-semibold">{samplePortalMedications.filter((m) => m.status === "Active").length}</span></p>
                <p className="text-sm">Active allergies: <span className="font-semibold">{samplePortalAllergies.length}</span></p>
                {activeMeds.map((med) => (
                  <div key={med.id} className="rounded-md border p-2 text-sm">
                    <p className="font-medium">{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.dose} · {med.frequency}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => go("/patient/history")}>Open health record</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconCreditCard className="h-4 w-4" /> Billing snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Open balance: <span className="font-semibold">{currency(summary.openBalance)}</span></p>
                {openInvoices.length === 0 ? (
                  <p className="rounded-md border p-2 text-sm text-muted-foreground">No open invoices.</p>
                ) : (
                  openInvoices.map((inv) => (
                    <div key={inv.id} className="rounded-md border p-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs">{inv.id}</span>
                        <Badge variant="warning">{inv.status}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Outstanding: {currency(inv.balance)}</p>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full" onClick={() => go("/patient/billing")}>Open billing</Button>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconMessage className="h-4 w-4" /> Inbox and records requests
                </CardTitle>
                <CardDescription>New requests and secure messages are currently preview-only.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border p-3">
                  <p className="font-medium">Secure messages</p>
                  <p className="text-sm text-muted-foreground">Send/receive from clinic teams (coming soon in demo).</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => go("/patient/messages")}>Go to messages</Button>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-medium">Request records</p>
                  <p className="text-sm text-muted-foreground">Submit records release requests and track status.</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => go("/patient/records")}>Go to records</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6 text-xs text-muted-foreground">
            Demo data source: patient sample fixtures and billing sample fixtures. For production,
            replace with API-backed data scoped by authenticated patient identity.
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
