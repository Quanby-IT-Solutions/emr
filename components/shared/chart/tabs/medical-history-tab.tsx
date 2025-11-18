"use client"
import { useState } from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconPlus } from '@tabler/icons-react'
import { UserRole } from "@/lib/auth/roles"
import { MedicalHistoryDialog } from "../dialogs/medical-history-dialog"

interface MedicalHistoryTabProps {
  patientData: any
  role: UserRole
  staffId: string
}

export function MedicalHistoryTab({ patientData, role, staffId }: MedicalHistoryTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <TabsContent value="history">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Patient medical, surgical, family, and social history</CardDescription>
            </div>
            {role === UserRole.NURSE && (
              <Button onClick={() => setDialogOpen(true)}>
                <IconPlus className="h-4 w-4 mr-2" />
                Add History
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {patientData.patient.patientHistories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No medical history recorded</p>
          ) : (
            <div className="space-y-3">
              {patientData.patient.patientHistories.map((history: any) => (
                <div key={history.id} className="flex items-start justify-between p-3 border rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{history.type.replace(/_/g, ' ')}</Badge>
                      <Badge variant="outline">{history.status}</Badge>
                    </div>
                    <p className="font-medium">{history.entry}</p>
                    {history.icd10Code && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ICD-10: {history.icd10Code}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MedicalHistoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        staffId={staffId}
        patientId={patientData.patient.id}
      />
    </TabsContent>
  )
}