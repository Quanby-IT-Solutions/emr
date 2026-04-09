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

function formatDetails(details: unknown): string {
  if (details == null) return "—"
  try {
    const s = JSON.stringify(details)
    return s.length > 120 ? `${s.slice(0, 117)}…` : s
  } catch {
    return String(details)
  }
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
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
        Sample events for UI preview only — no API or database call. Wire to real
        audit storage when backend work starts.
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
        <div className="rounded-md border">
          <Table className="table-fixed">
            <colgroup>
              <col className="w-[10%]" />
              <col className="w-[14%]" />
              <col className="w-[9%]" />
              <col className="w-[12%]" />
              <col className="w-[24%]" />
              <col className="w-[9%]" />
              <col className="w-[22%]" />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Reason / notes</TableHead>
                <TableHead className="whitespace-nowrap">IP</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap align-top text-xs">
                    {formatWhen(row.timestamp)}
                  </TableCell>
                  <TableCell className="align-top text-sm whitespace-normal break-words">
                    {row.user?.displayName ?? row.user?.username ?? "—"}
                    {row.user?.email ? (
                      <span className="block text-xs text-muted-foreground">
                        {row.user.email}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="align-top whitespace-normal">
                    <Badge variant="outline">{row.actionType}</Badge>
                  </TableCell>
                  <TableCell className="align-top text-sm whitespace-normal break-words">
                    <span className="font-mono text-xs">
                      {row.entityType ?? "—"}
                    </span>
                    {row.entityId ? (
                      <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                        {row.entityId}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="align-top text-sm whitespace-normal break-words">
                    {row.reasonForAccess ? (
                      <p className="border-l-2 border-muted-foreground/25 pl-2 text-foreground leading-snug">
                        {row.reasonForAccess}
                      </p>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap align-top font-mono text-xs">
                    {row.ipAddress ?? "—"}
                  </TableCell>
                  <TableCell className="align-top font-mono text-xs whitespace-normal break-all text-muted-foreground leading-snug">
                    {formatDetails(row.details)}
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
