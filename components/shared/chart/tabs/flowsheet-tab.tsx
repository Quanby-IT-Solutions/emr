"use client"
import { useState, useEffect } from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconPlus } from '@tabler/icons-react'
import { UserRole } from "@/lib/auth/roles"
import { FlowsheetDialog } from "../dialogs/flowsheet-dialog"

interface FlowsheetTabProps {
  patientData: any
  role: UserRole
  staffId: string
}

export function FlowsheetTab({ patientData, role, staffId }: FlowsheetTabProps) {
  const [flowsheetObs, setFlowsheetObs] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const activeEncounter = patientData.patient.encounters.find(
    (e: any) => e.status === 'ACTIVE'
  )

  const fetchFlowsheetObs = async () => {
    if (!activeEncounter) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/flowsheet?encounterId=${activeEncounter.id}`)
      const data = await response.json()
      setFlowsheetObs(data.observations || [])
    } catch (error) {
      console.error('Failed to fetch flowsheet:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlowsheetObs()
  }, [activeEncounter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <TabsContent value="chart">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Flowsheet Observations</CardTitle>
              <CardDescription>Vital signs and patient measurements</CardDescription>
            </div>
            {role === UserRole.NURSE && activeEncounter && (
              <Button onClick={() => setDialogOpen(true)}>
                <IconPlus className="h-4 w-4 mr-2" />
                Add Observation
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!activeEncounter ? (
            <p className="text-center text-muted-foreground py-8">No active encounter</p>
          ) : loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : flowsheetObs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No observations recorded</p>
          ) : (
            <div className="space-y-3">
              {flowsheetObs.map((obs: any) => (
                <div key={obs.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-semibold">{obs.observationType.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      Recorded by: {obs.recorder.firstName} {obs.recorder.lastName} -{' '}
                      {formatDate(obs.recordedAt)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    {obs.value} {obs.unit}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FlowsheetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        activeEncounter={activeEncounter}
        staffId={staffId}
        onSuccess={fetchFlowsheetObs}
      />
    </TabsContent>
  )
}