"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { sampleAuditLogs, type SampleAuditLogRow } from "@/lib/auditor/sample-audit-logs"

function formatWhenParts(iso: string): { date: string; time: string } {
  try {
    const d = new Date(iso)
    return {
      date: d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }),
    }
  } catch {
    return { date: iso, time: "" }
  }
}

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
}

const DETAIL_MAX_DEPTH = 5

function DetailValue({
  value,
  depth,
}: {
  value: unknown
  depth: number
}) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground/70">—</span>
  }
  if (typeof value === "boolean") {
    return <span>{value ? "Yes" : "No"}</span>
  }
  if (typeof value === "number") {
    return (
      <span>
        {Number.isInteger(value)
          ? value.toLocaleString()
          : value.toLocaleString(undefined, { maximumFractionDigits: 4 })}
      </span>
    )
  }
  if (typeof value === "string") {
    return <span className="break-words">{value}</span>
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-muted-foreground/70">None</span>
    }
    if (depth >= DETAIL_MAX_DEPTH) {
      return (
        <span className="break-all text-[10px] text-muted-foreground">
          {JSON.stringify(value)}
        </span>
      )
    }
    const allPrimitive = value.every(
      (v) =>
        v === null ||
        v === undefined ||
        ["string", "number", "boolean"].includes(typeof v)
    )
    if (allPrimitive) {
      return (
        <span className="flex flex-wrap gap-1">
          {value.map((v, i) => (
            <Badge
              key={i}
              variant="outline"
              className="font-normal normal-case"
            >
              {String(v)}
            </Badge>
          ))}
        </span>
      )
    }
    return (
      <ul className="list-inside list-disc space-y-0.5 pl-0.5 text-[11px]">
        {value.map((v, i) => (
          <li key={i}>
            <DetailValue value={v} depth={depth + 1} />
          </li>
        ))}
      </ul>
    )
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) {
      return <span className="text-muted-foreground/70">—</span>
    }
    if (depth >= DETAIL_MAX_DEPTH) {
      return (
        <span className="break-all text-[10px] text-muted-foreground">
          {JSON.stringify(value)}
        </span>
      )
    }
    return (
      <div className="space-y-1.5 border-l-2 border-border/60 pl-2.5">
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="grid gap-x-2 gap-y-0.5 text-[11px] leading-snug sm:grid-cols-[minmax(4.5rem,0.38fr)_1fr]"
          >
            <span className="text-muted-foreground">{humanizeKey(k)}</span>
            <div className="min-w-0">
              <DetailValue value={v} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    )
  }
  return <span className="break-words">{String(value)}</span>
}

function DetailsBlock({ details }: { details: unknown }) {
  if (details == null) {
    return (
      <span className="text-muted-foreground/50" aria-hidden>
        —
      </span>
    )
  }

  if (typeof details === "string") {
    return (
      <p className="m-0 break-words rounded-md border border-border/50 bg-muted/40 px-2.5 py-2 text-xs leading-relaxed text-foreground">
        {details}
      </p>
    )
  }

  if (typeof details !== "object" || details === null) {
    return (
      <span className="break-words text-xs text-foreground">
        {String(details)}
      </span>
    )
  }

  const entries = Object.entries(details as Record<string, unknown>)
  if (entries.length === 0) {
    return (
      <span className="text-muted-foreground/50" aria-hidden>
        —
      </span>
    )
  }

  return (
    <div className="space-y-0 divide-y divide-border/50 rounded-md border border-border/50 bg-muted/40 px-2.5 py-1">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid gap-x-3 gap-y-1 py-2 text-xs leading-snug first:pt-1.5 last:pb-1.5 sm:grid-cols-[minmax(5rem,0.42fr)_1fr]"
        >
          <span className="font-medium text-muted-foreground">
            {humanizeKey(key)}
          </span>
          <div className="min-w-0 text-foreground">
            <DetailValue value={value} depth={0} />
          </div>
        </div>
      ))}
    </div>
  )
}

function filterRows(
  rows: SampleAuditLogRow[],
  actionType: string,
  entityApplied: string
): SampleAuditLogRow[] {
  let out = rows
  if (actionType && actionType !== "all") {
    out = out.filter((r) => r.actionType === actionType)
  }
  const q = entityApplied.trim().toLowerCase()
  if (q) {
    out = out.filter((r) =>
      (r.entityType ?? "").toLowerCase().includes(q)
    )
  }
  return [...out].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

const cellPad = "px-3 py-2.5 align-top"
const headPad = "px-3 py-3"

export function AuditLogExplorer() {
  const [actionType, setActionType] = useState<string>("all")
  const [entityDraft, setEntityDraft] = useState("")
  const [entityApplied, setEntityApplied] = useState("")

  const items = useMemo(
    () => filterRows(sampleAuditLogs, actionType, entityApplied),
    [actionType, entityApplied]
  )

  const applyEntityFilter = () => {
    setEntityApplied(entityDraft.trim())
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <p className="text-xs text-muted-foreground">
        Demonstration events for preview—production will load from your audit data store.
      </p>

      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-end">
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="audit-action">Action type</Label>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger id="audit-action" className="w-full">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value="CREATE">CREATE</SelectItem>
                <SelectItem value="READ">READ</SelectItem>
                <SelectItem value="UPDATE">UPDATE</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="LOGIN">LOGIN</SelectItem>
                <SelectItem value="BREAK_GLASS">BREAK_GLASS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="audit-entity">Entity type (contains)</Label>
            <Input
              id="audit-entity"
              placeholder="e.g. BED_ASSIGNMENT"
              value={entityDraft}
              onChange={(e) => setEntityDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyEntityFilter()
              }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={applyEntityFilter}>
            Apply filters
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No sample events match these filters. Try another action type or entity
          substring.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <Table className="table-fixed text-sm">
            <colgroup>
              <col className="w-[9%]" />
              <col className="w-[15%]" />
              <col className="w-[8%]" />
              <col className="w-[13%]" />
              <col className="w-[20%]" />
              <col className="w-[9%]" />
              <col className="w-[26%]" />
            </colgroup>
            <TableHeader>
              <TableRow className="border-b bg-muted/60 hover:bg-muted/60">
                <TableHead className={`${headPad} font-semibold whitespace-normal`}>
                  Time
                </TableHead>
                <TableHead className={`${headPad} font-semibold`}>User</TableHead>
                <TableHead className={`${headPad} font-semibold`}>Action</TableHead>
                <TableHead className={`${headPad} font-semibold`}>Entity</TableHead>
                <TableHead className={`${headPad} font-semibold`}>
                  Reason / notes
                </TableHead>
                <TableHead className={`${headPad} font-semibold whitespace-nowrap`}>
                  IP
                </TableHead>
                <TableHead className={`${headPad} font-semibold`}>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row, i) => (
                <TableRow
                  key={row.id}
                  className={i % 2 === 1 ? "bg-muted/25" : undefined}
                >
                  <TableCell className={`${cellPad} w-[9%]`}>
                    {(() => {
                      const { date, time } = formatWhenParts(row.timestamp)
                      return (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-foreground">
                            {date}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {time || "—"}
                          </span>
                        </div>
                      )
                    })()}
                  </TableCell>
                  <TableCell
                    className={`${cellPad} whitespace-normal break-words leading-snug`}
                  >
                    <span className="font-medium text-foreground">
                      {row.user?.displayName ?? row.user?.username ?? "—"}
                    </span>
                    {row.user?.email ? (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {row.user.email}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className={`${cellPad} whitespace-normal`}>
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px] font-normal tracking-wide"
                    >
                      {row.actionType}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`${cellPad} whitespace-normal break-words leading-snug`}
                  >
                    <span className="font-mono text-[11px] text-foreground">
                      {row.entityType ?? "—"}
                    </span>
                    {row.entityId ? (
                      <span className="mt-1 block font-mono text-[11px] text-muted-foreground">
                        {row.entityId}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell
                    className={`${cellPad} whitespace-normal break-words leading-snug`}
                  >
                    {row.reasonForAccess ? (
                      <p className="border-l-2 border-primary/30 pl-2.5 text-sm text-foreground">
                        {row.reasonForAccess}
                      </p>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell
                    className={`${cellPad} whitespace-nowrap font-mono text-[11px] text-muted-foreground`}
                  >
                    {row.ipAddress ?? (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className={`${cellPad} min-w-0`}>
                    <DetailsBlock details={row.details} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
