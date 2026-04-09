"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { sampleImagingReports, sampleLabResults } from "@/lib/patient/sample-data"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { IconFlask, IconScan } from "@tabler/icons-react"

function labFlagClasses(flag: string | null) {
  if (flag === "Critical") return "font-semibold text-red-700 dark:text-red-400"
  if (flag === "H" || flag === "L" || flag === "A") return "font-medium text-amber-800 dark:text-amber-200"
  return ""
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <ProtectedRoute requiredRole={UserRole.PATIENT}>
        <DashboardLayout role={UserRole.PATIENT}>
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
              <p className="text-muted-foreground">Loading results…</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  const releasedLabs = sampleLabResults.filter((r) => r.releasedToPortal)
  const pendingLabs = sampleLabResults.filter((r) => !r.releasedToPortal)
  const releasedImaging = sampleImagingReports.filter((r) => r.releasedToPortal)

  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Results</h1>
            <p className="max-w-3xl text-muted-foreground">
              Read-only laboratory and imaging reports released to the portal. Release timing and
              sensitive categories follow organizational policy in production.
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="labs" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="labs" className="gap-2">
                  <IconFlask className="size-4" />
                  Laboratory
                </TabsTrigger>
                <TabsTrigger value="imaging" className="gap-2">
                  <IconScan className="size-4" />
                  Imaging
                </TabsTrigger>
              </TabsList>

              <TabsContent value="labs" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Released lab results</CardTitle>
                    <CardDescription>
                      Abnormal and critical values are highlighted for visibility—this preview is not
                      clinical decision support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Panel</TableHead>
                          <TableHead>Analyte</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Ref range</TableHead>
                          <TableHead>Flag</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {releasedLabs.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="max-w-[140px] whitespace-normal text-sm">
                              {row.panelName}
                            </TableCell>
                            <TableCell className="font-medium">{row.analyte}</TableCell>
                            <TableCell className={labFlagClasses(row.flag)}>
                              {row.value}
                              {row.unit ? ` ${row.unit}` : ""}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">{row.refRange}</TableCell>
                            <TableCell>
                              {row.flag ? (
                                <Badge variant={row.flag === "Critical" ? "destructive" : "secondary"}>
                                  {row.flag}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs whitespace-nowrap">{row.resultDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {pendingLabs.length > 0 && (
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-base">Not yet released</CardTitle>
                      <CardDescription>
                        Some results stay hidden until policies are satisfied (e.g. clinician review,
                        timing).
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      {pendingLabs.map((row) => (
                        <p key={row.id}>
                          <span className="font-medium text-foreground">{row.panelName}</span> —{" "}
                          {row.analyte}. {row.releaseNote ?? "Not visible in the portal yet."}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="imaging" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Imaging reports</CardTitle>
                    <CardDescription>
                      Finalized reports; viewing images can link to your imaging viewer when
                      integrated.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {releasedImaging.map((rep) => (
                      <Card key={rep.id} className="bg-muted/40">
                        <CardContent className="space-y-3 pt-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{rep.modality}</Badge>
                            {rep.critical && <Badge variant="destructive">Critical finding</Badge>}
                            <span className="text-xs text-muted-foreground font-mono">{rep.accession}</span>
                          </div>
                          <h4 className="font-semibold">{rep.study}</h4>
                          <p className="text-sm text-muted-foreground">Report date: {rep.reportDate}</p>
                          <p className="text-sm leading-relaxed">{rep.impression}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!rep.viewerAvailable}
                            title={rep.viewerAvailable ? "Demo only — no PACS integration" : "Unavailable"}
                          >
                            View images (PACS)
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
