"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface ClinicalNoteSection {
  title: string
  content: string
}

export interface ChartNote {
  id: string
  noteType: string
  author: string
  date: string
  status: "Signed" | "Unsigned" | "Cosigned" | "Amended"
  sections: ClinicalNoteSection[]
}

export interface LabResult {
  id: string
  testName: string
  value: string
  unit: string
  referenceRange: string
  flag: "Normal" | "Abnormal" | "Critical" | null
  date: string
}

export interface ImagingReport {
  id: string
  study: string
  radiologist: string
  date: string
  finding: string
  impression: string
  critical: boolean
}

export interface OrderSummary {
  id: string
  type: string
  item: string
  status: string
  orderedBy: string
  date: string
}

interface ClinicalNotesViewerProps {
  notes: ChartNote[]
  labResults: LabResult[]
  imagingReports: ImagingReport[]
  orders: OrderSummary[]
}

const noteStatusClass: Record<string, string> = {
  Signed: "bg-blue-100 text-blue-800 border-blue-300",
  Unsigned: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Cosigned: "bg-green-100 text-green-800 border-green-300",
  Amended: "bg-purple-100 text-purple-800 border-purple-300",
}

const labFlagClass: Record<string, string> = {
  Normal: "bg-green-100 text-green-800 border-green-300",
  Abnormal: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Critical: "bg-red-100 text-red-800 border-red-300",
}

export function NotesPanel({ notes }: { notes: ChartNote[] }) {
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{note.noteType}</CardTitle>
              <Badge className={noteStatusClass[note.status]}>{note.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {note.author} — {note.date}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {note.sections.map((section, i) => (
              <div key={i}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{section.title}</p>
                <p className="text-sm mt-0.5">{section.content}</p>
                {i < note.sections.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      {notes.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No notes found for this category.</p>
      )}
    </div>
  )
}

export function LabResultsPanel({ results }: { results: LabResult[] }) {
  return (
    <div className="space-y-2">
      {results.map((result) => (
        <div key={result.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
          <div className="space-y-0.5">
            <p className="font-medium">{result.testName}</p>
            <p className="text-xs text-muted-foreground">{result.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-mono font-medium">
                {result.value} <span className="text-muted-foreground">{result.unit}</span>
              </p>
              <p className="text-xs text-muted-foreground">Ref: {result.referenceRange}</p>
            </div>
            {result.flag && <Badge className={labFlagClass[result.flag]}>{result.flag}</Badge>}
          </div>
        </div>
      ))}
      {results.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No lab results available.</p>
      )}
    </div>
  )
}

export function ImagingPanel({ reports }: { reports: ImagingReport[] }) {
  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{report.study}</CardTitle>
              {report.critical && <Badge className="bg-red-100 text-red-800 border-red-300">Critical</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              {report.radiologist} — {report.date}
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Findings</p>
              <p className="text-sm mt-0.5">{report.finding}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Impression</p>
              <p className="text-sm mt-0.5">{report.impression}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      {reports.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No imaging reports available.</p>
      )}
    </div>
  )
}

export function OrdersPanel({ orders }: { orders: OrderSummary[] }) {
  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
          <div className="space-y-0.5">
            <p className="font-medium">{order.item}</p>
            <p className="text-xs text-muted-foreground">{order.orderedBy} — {order.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{order.type}</Badge>
            <Badge className="bg-gray-100 text-gray-800 border-gray-300">{order.status}</Badge>
          </div>
        </div>
      ))}
      {orders.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No orders for this encounter.</p>
      )}
    </div>
  )
}
