"use client"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EncountersTabProps {
  patientData: any
}

export function EncountersTab({ patientData }: EncountersTabProps) {
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
    <TabsContent value="encounters">
      <Card>
        <CardHeader>
          <CardTitle>Hospital Encounters</CardTitle>
          <CardDescription>All patient visits and admissions</CardDescription>
        </CardHeader>
        <CardContent>
          {patientData.patient.encounters.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No encounters found</p>
          ) : (
            <div className="space-y-4">
              {patientData.patient.encounters.map((encounter: any) => (
                <Card key={encounter.id} className="bg-slate-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge>{encounter.type}</Badge>
                          <Badge variant="outline">{encounter.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Started: {formatDate(encounter.startDateTime)}
                        </p>
                        {encounter.attendingProvider && (
                          <p className="text-sm">
                            Provider: Dr. {encounter.attendingProvider.firstName}{' '}
                            {encounter.attendingProvider.lastName}
                          </p>
                        )}
                        {encounter.currentLocation && (
                          <p className="text-sm">
                            Location: {encounter.currentLocation.unit} - Room{' '}
                            {encounter.currentLocation.roomNumber} Bed{' '}
                            {encounter.currentLocation.bedNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}