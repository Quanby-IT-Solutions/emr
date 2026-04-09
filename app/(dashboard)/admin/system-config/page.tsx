"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"

const STORAGE_KEY = "pgh-system-config"

function loadConfig() {
  if (typeof window === "undefined") return null
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}

type ModuleConfig = Record<string, boolean>

export default function SystemConfigPage() {
  const [modules, setModules] = useState<ModuleConfig>(() => loadConfig()?.modules ?? {
    scheduling: true, registrar: true, nursing: true, pharmacy: true, laboratory: true, billing: true,
  })
  const [backupRunning, setBackupRunning] = useState(false)
  const [restoreOpen, setRestoreOpen] = useState(false)
  const [lastBackup, setLastBackup] = useState(() => loadConfig()?.lastBackup ?? "April 9, 2026 at 2:05 AM — 12.4 GB")

  const handleSave = () => {
    const config = { modules, lastBackup, savedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    toast.success("System configuration saved successfully")
  }

  const handleBackup = () => {
    setBackupRunning(true)
    setTimeout(() => {
      const now = new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
      setLastBackup(`${now} — 12.8 GB`)
      const config = { modules, lastBackup: `${now} — 12.8 GB`, savedAt: new Date().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      setBackupRunning(false)
      toast.success("Manual backup completed successfully")
    }, 2000)
  }

  const handleRestore = () => {
    setRestoreOpen(false)
    toast.success("Restore simulation complete — system state restored to last backup point")
  }

  return (
    <ProtectedRoute requiredRole={UserRole.SYSTEM_ADMIN}>
      <DashboardLayout role={UserRole.SYSTEM_ADMIN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">System Configuration & Module Settings</h1>
            <p className="text-muted-foreground">Configure system-wide settings, modules, and access permissions.</p>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="hospital">
              <TabsList className="flex-wrap">
                <TabsTrigger value="hospital">Hospital Settings</TabsTrigger>
                <TabsTrigger value="modules">Module Toggles</TabsTrigger>
                <TabsTrigger value="philhealth">PhilHealth Config</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="hospital" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Hospital Settings</CardTitle>
                    <CardDescription>Configure PGH hospital details and operating parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Hospital Name</Label>
                        <Input defaultValue="Philippine General Hospital" />
                      </div>
                      <div className="space-y-2">
                        <Label>Hospital Code</Label>
                        <Input defaultValue="UP-PGH" />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input defaultValue="Taft Avenue, Ermita, Manila" />
                      </div>
                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Input defaultValue="Asia/Manila (UTC+8)" />
                      </div>
                      <div className="space-y-2">
                        <Label>OPD Working Hours</Label>
                        <Input defaultValue="7:00 AM – 5:00 PM" />
                      </div>
                      <div className="space-y-2">
                        <Label>Emergency Hours</Label>
                        <Input defaultValue="24/7" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Public Holidays (2026)</Label>
                      <Input defaultValue="Jan 1, Apr 9-10, May 1, Jun 12, Jun 17, Aug 25, Nov 1, Nov 30, Dec 25, Dec 30" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable to prevent user access during system maintenance</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modules" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Module On/Off Toggles</CardTitle>
                    <CardDescription>Enable or disable modules system-wide during maintenance or rollouts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {(Object.entries(modules) as [string, boolean][]).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <Label className="text-base capitalize">{key} Module</Label>
                          <p className="text-sm text-muted-foreground">{enabled ? "Active and accessible by users" : "Disabled — users cannot access"}</p>
                        </div>
                        <Switch checked={enabled} onCheckedChange={(v) => setModules(prev => ({ ...prev, [key]: v }))} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="philhealth" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>PhilHealth & Insurance Configuration</CardTitle>
                    <CardDescription>Manage PhilHealth transaction types and coverage settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2"><Label>PhilHealth API Endpoint</Label><Input defaultValue="https://api.philhealth.gov.ph/v1" /></div>
                      <div className="space-y-2"><Label>Facility PhilHealth ID</Label><Input defaultValue="H01-000001" /></div>
                    </div>
                    <div className="space-y-2"><Label>Supported Benefit Packages</Label><Input defaultValue="All Case Rate, No Balance Billing, Z-Benefits (Kidney, Breast Cancer, Prostate Cancer)" /></div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Point of Service (POS) Enabled</Label>
                        <p className="text-sm text-muted-foreground">Allow POS transactions for charity/indigent patients</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-verify PhilHealth Eligibility</Label>
                        <p className="text-sm text-muted-foreground">Automatically check patient eligibility during registration</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure SMS/email triggers for appointments, admissions, and IT alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Appointment Reminders (SMS)", desc: "Send SMS 24h before scheduled appointment", default: true },
                      { label: "Appointment Reminders (Email)", desc: "Send email confirmation upon booking", default: true },
                      { label: "Admission Notifications", desc: "Notify ward nurse when new admission is received", default: true },
                      { label: "IT Alert Notifications", desc: "Email IT team for critical system alerts", default: true },
                      { label: "Discharge Notifications", desc: "Notify registrar when discharge order is placed", default: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                        <div><Label>{item.label}</Label><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                        <Switch defaultChecked={item.default} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="backup" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Backup & Restore</CardTitle>
                    <CardDescription>Schedule automatic database backups and manage restores</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div><Label>Automatic Nightly Backup</Label><p className="text-sm text-muted-foreground">Runs daily at 2:00 AM Manila time</p></div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2"><Label>Backup Retention (days)</Label><Input type="number" defaultValue="30" /></div>
                      <div className="space-y-2"><Label>Backup Location</Label><Input defaultValue="/backups/pgh-his/" /></div>
                    </div>
                    <div className="space-y-2"><Label>Last Successful Backup</Label><p className="text-sm font-medium text-green-600">April 9, 2026 at 2:05 AM — 12.4 GB</p></div>
                    <div className="flex gap-3">
                      <Button onClick={handleBackup} disabled={backupRunning}>{backupRunning ? "Backing up..." : "Run Manual Backup"}</Button>
                      <Button variant="outline" onClick={() => setRestoreOpen(true)}>Restore from Backup</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Configure security policies for the hospital information system</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Two-Factor Authentication</Label><p className="text-sm text-muted-foreground">Require 2FA for all admin users</p></div><Switch /></div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2"><Label>Session Timeout (minutes)</Label><Input type="number" defaultValue="30" /></div>
                      <div className="space-y-2"><Label>Max Failed Login Attempts</Label><Input type="number" defaultValue="5" /></div>
                      <div className="space-y-2"><Label>Password Expiry (days)</Label><Input type="number" defaultValue="90" /></div>
                      <div className="space-y-2"><Label>Min Password Length</Label><Input type="number" defaultValue="8" /></div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>

        {/* Restore Wizard Dialog */}
        <Dialog open={restoreOpen} onOpenChange={setRestoreOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Restore from Backup</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">This will restore the system configuration to the last backup point. Current settings will be overwritten.</p>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-sm text-muted-foreground">{lastBackup}</p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-4">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Warning</p>
                <p className="text-sm text-red-600 dark:text-red-300">This action will overwrite current configuration. Ensure you have saved any important changes.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRestoreOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleRestore}>Confirm Restore</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
