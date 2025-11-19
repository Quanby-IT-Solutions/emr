"use client"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OrdersTabProps {
  patientData: any
}

export function OrdersTab({ patientData }: OrdersTabProps) {
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
    <TabsContent value="orders">
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Medications, labs, imaging, and procedures</CardDescription>
        </CardHeader>
        <CardContent>
          {patientData.recentOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recent orders</p>
          ) : (
            <div className="space-y-3">
              {patientData.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge>{order.orderType}</Badge>
                      <Badge variant="outline">{order.status}</Badge>
                      {order.priority === 'STAT' && (
                        <Badge variant="destructive">STAT</Badge>
                      )}
                      {order.priority === 'URGENT' && (
                        <Badge className="bg-orange-500">URGENT</Badge>
                      )}
                    </div>
                    <p className="text-sm mt-1">
                      Ordered by: Dr. {order.placer.firstName} {order.placer.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}