"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import {
  sampleImagingReports,
  sampleLabResults,
  samplePortalAllergies,
  samplePortalMedications,
  samplePortalProblems,
  sampleReleasedClinicalNotes,
  sampleVisitSummaries,
} from "@/lib/patient/sample-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  IconAlertCircle,
  IconCalendar,
  IconFileText,
  IconFlask,
  IconPill,
  IconStethoscope,
} from "@tabler/icons-react"
export default function HealthRecordPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <ProtectedRoute requiredRole={UserRole.PATIENT}>
        <DashboardLayout role={UserRole.PATIENT}>
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
              <p className="text-muted-foreground">Loading health record…</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const severityVariant = (severity: string) => {
    switch (severity) {
      case "SEVERE":
        return "destructive" as const
      case "MODERATE":
        return "default" as const
      case "MILD":
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Health record</h1>
            <p className="max-w-3xl text-muted-foreground">
              Read-only released items: visit summaries, signed note excerpts (Clinical Documentation →
              Portal), problem list, medications, and allergies. Labs and imaging detail are on{" "}
              <Link href="/patient/results" className="text-primary underline-offset-4 hover:underline">
                Results
              </Link>
              .
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="visits" className="w-full">
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
                <TabsTrigger value="visits" className="gap-1.5">
                  <IconCalendar className="size-4 shrink-0" />
                  Visits
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-1.5">
                  <IconFileText className="size-4 shrink-0" />
                  Released notes
                </TabsTrigger>
                <TabsTrigger value="problems" className="gap-1.5">
                  <IconStethoscope className="size-4 shrink-0" />
                  Problems
                </TabsTrigger>
                <TabsTrigger value="medications" className="gap-1.5">
                  <IconPill className="size-4 shrink-0" />
                  Medications
                </TabsTrigger>
                <TabsTrigger value="allergies" className="gap-1.5">
                  <IconAlertCircle className="size-4 shrink-0" />
                  Allergies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visits" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Visit summaries</CardTitle>
                    <CardDescription>
                      Released visit summaries tied to encounters (sample data).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sampleVisitSummaries.length === 0 ? (
                      <p className="py-8 text-center text-muted-foreground">No visit summaries available.</p>
                    ) : (
                      sampleVisitSummaries.map((v) => (
                        <Card key={v.id} className="bg-muted/40">
                          <CardContent className="space-y-3 pt-6">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">{v.visitType}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(v.visitDate)} · {v.department}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {v.providerName} · <span className="font-mono">{v.encounterId}</span>
                            </p>
                            <Separator />
                            <p className="text-sm leading-relaxed">{v.summary}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Released clinical notes</CardTitle>
                    <CardDescription>
                      Signed documentation released to the portal. Sensitive notes may be withheld
                      by policy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sampleReleasedClinicalNotes.map((n) => (
                      <Card key={n.id} className="bg-muted/40">
                        <CardContent className="space-y-2 pt-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{n.noteType}</Badge>
                            <span className="font-mono text-xs text-muted-foreground">{n.encounterId}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {n.authoredBy} · Signed{" "}
                            {new Date(n.signedAt).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                          <Separator />
                          <p className="text-sm leading-relaxed">{n.excerpt}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="problems" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Problem list</CardTitle>
                    <CardDescription>Active and resolved problems released to the portal (sample).</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {samplePortalProblems.map((p) => (
                      <Card key={p.id} className="bg-muted/40">
                        <CardContent className="pt-6">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">{p.description}</h4>
                              {p.icd10Code && (
                                <p className="mt-1 text-sm text-muted-foreground">ICD-10: {p.icd10Code}</p>
                              )}
                            </div>
                            <Badge variant={p.status === "ACTIVE" ? "default" : "secondary"}>{p.status}</Badge>
                          </div>
                          {p.onsetDate && (
                            <p className="mt-3 text-sm text-muted-foreground">Onset: {formatDate(p.onsetDate)}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current medications</CardTitle>
                    <CardDescription>Read-only list of current medications.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {samplePortalMedications.filter((m) => m.status === "Active").length === 0 ? (
                      <p className="py-8 text-center text-muted-foreground">No active medications on file.</p>
                    ) : (
                      samplePortalMedications
                        .filter((m) => m.status === "Active")
                        .map((m) => (
                          <Card key={m.id} className="bg-muted/40">
                            <CardContent className="space-y-2 pt-6">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-lg font-semibold">{m.name}</h4>
                                <Badge>Active</Badge>
                              </div>
                              <p className="text-sm">
                                {m.dose} · {m.route} · {m.frequency}
                              </p>
                              <p className="text-xs text-muted-foreground">Started {formatDate(m.startDate)}</p>
                              {m.instructions && (
                                <p className="text-sm text-muted-foreground">{m.instructions}</p>
                              )}
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="allergies" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <IconAlertCircle className="size-5" />
                      Allergies
                    </CardTitle>
                    <CardDescription>Released allergy list (read-only).</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {samplePortalAllergies.map((a) => (
                      <Card key={a.id} className="border-red-200 bg-red-50/80 dark:border-red-900 dark:bg-red-950/30">
                        <CardContent className="pt-6">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h4 className="text-lg font-semibold text-red-900 dark:text-red-100">{a.substance}</h4>
                              {a.reaction && (
                                <p className="mt-1 text-sm text-red-800 dark:text-red-200">Reaction: {a.reaction}</p>
                              )}
                            </div>
                            <Badge variant={severityVariant(a.severity)}>{a.severity}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <IconFlask className="size-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">Labs & imaging</CardTitle>
                  <CardDescription>Structured results and reports with flags live on Results.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>
                  {sampleLabResults.filter((r) => r.releasedToPortal).length} lab row(s) released (sample)
                </span>
                <span>·</span>
                <span>
                  {sampleImagingReports.filter((r) => r.releasedToPortal).length} imaging report(s) released (sample)
                </span>
                <Link
                  href="/patient/results"
                  className="ml-auto text-primary underline-offset-4 hover:underline"
                >
                  Open results
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
