"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
  IconAlertCircle,
  IconBell,
  IconCircleCheck,
  IconClipboardText,
  IconFileCheck,
  IconStethoscope,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRole } from "@/lib/auth/roles"

type NotificationType =
  | "critical-results"
  | "order-updates"
  | "chart-deficiencies"
  | "cosignature-requests"
  | "system"

interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  patientName: string
  mrn: string
  patientId?: string
  createdAt: string
  isRead: boolean
}

const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "critical-results",
    title: "Critical potassium result: 2.8 mmol/L",
    patientName: "John Doe",
    mrn: "MRN-001",
    patientId: "1",
    createdAt: "2026-04-09T08:15:00",
    isRead: false,
  },
  {
    id: "n2",
    type: "critical-results",
    title: "Positive blood culture flagged",
    patientName: "Alice Wong",
    mrn: "MRN-007",
    createdAt: "2026-04-09T06:45:00",
    isRead: false,
  },
  {
    id: "n3",
    type: "critical-results",
    title: "Troponin markedly elevated",
    patientName: "Carlos Mendez",
    mrn: "MRN-008",
    createdAt: "2026-04-08T23:10:00",
    isRead: true,
  },
  {
    id: "n4",
    type: "order-updates",
    title: "CT Abdomen/Pelvis status changed to In Progress",
    patientName: "Bob Wilson",
    mrn: "MRN-003",
    patientId: "3",
    createdAt: "2026-04-09T07:30:00",
    isRead: false,
  },
  {
    id: "n5",
    type: "order-updates",
    title: "Hemoglobin A1c resulted and ready for review",
    patientName: "John Doe",
    mrn: "MRN-001",
    patientId: "1",
    createdAt: "2026-04-09T05:50:00",
    isRead: true,
  },
  {
    id: "n6",
    type: "order-updates",
    title: "Admission order accepted by bed control",
    patientName: "Maria Garcia",
    mrn: "MRN-004",
    createdAt: "2026-04-08T21:40:00",
    isRead: false,
  },
  {
    id: "n7",
    type: "chart-deficiencies",
    title: "Discharge summary missing attending attestation",
    patientName: "James Brown",
    mrn: "MRN-010",
    createdAt: "2026-04-09T07:05:00",
    isRead: false,
  },
  {
    id: "n8",
    type: "chart-deficiencies",
    title: "Unsigned progress note older than 24 hours",
    patientName: "Jane Smith",
    mrn: "MRN-002",
    patientId: "2",
    createdAt: "2026-04-08T18:20:00",
    isRead: true,
  },
  {
    id: "n9",
    type: "chart-deficiencies",
    title: "Procedure note missing diagnosis linkage",
    patientName: "Priya Patel",
    mrn: "MRN-009",
    createdAt: "2026-04-08T16:00:00",
    isRead: false,
  },
  {
    id: "n10",
    type: "cosignature-requests",
    title: "Resident H&P requires cosignature",
    patientName: "Emily Davis",
    mrn: "MRN-011",
    createdAt: "2026-04-09T04:25:00",
    isRead: false,
  },
  {
    id: "n11",
    type: "cosignature-requests",
    title: "Progress note addendum awaiting cosign",
    patientName: "Robert Lee",
    mrn: "MRN-005",
    createdAt: "2026-04-08T20:10:00",
    isRead: true,
  },
  {
    id: "n12",
    type: "cosignature-requests",
    title: "Critical care note pending attending review",
    patientName: "Susan Chen",
    mrn: "MRN-006",
    createdAt: "2026-04-08T14:50:00",
    isRead: false,
  },
  {
    id: "n13",
    type: "system",
    title: "Planned downtime for lab interface tonight at 23:00",
    patientName: "System",
    mrn: "N/A",
    createdAt: "2026-04-09T03:00:00",
    isRead: true,
  },
  {
    id: "n14",
    type: "system",
    title: "New sepsis screening workflow deployed",
    patientName: "System",
    mrn: "N/A",
    createdAt: "2026-04-08T15:30:00",
    isRead: false,
  },
  {
    id: "n15",
    type: "order-updates",
    title: "Portable chest X-ray completed",
    patientName: "Alice Wong",
    mrn: "MRN-007",
    createdAt: "2026-04-09T01:35:00",
    isRead: true,
  },
  {
    id: "n16",
    type: "critical-results",
    title: "Hemoglobin dropped to 6.9 g/dL",
    patientName: "Linda Park",
    mrn: "MRN-013",
    createdAt: "2026-04-09T08:55:00",
    isRead: false,
  },
]

const iconClassByType: Record<NotificationType, string> = {
  "critical-results": "bg-red-100 text-red-700",
  "order-updates": "bg-blue-100 text-blue-700",
  "chart-deficiencies": "bg-yellow-100 text-yellow-800",
  "cosignature-requests": "bg-purple-100 text-purple-700",
  system: "bg-gray-100 text-gray-700",
}

const labelByType: Record<NotificationType, string> = {
  "critical-results": "Critical Result",
  "order-updates": "Order Update",
  "chart-deficiencies": "Chart Deficiency",
  "cosignature-requests": "Cosignature Request",
  system: "System",
}

function NotificationTypeIcon({ type }: { type: NotificationType }) {
  if (type === "critical-results") {
    return <IconAlertCircle className="h-5 w-5" />
  }
  if (type === "order-updates") {
    return <IconCircleCheck className="h-5 w-5" />
  }
  if (type === "chart-deficiencies") {
    return <IconClipboardText className="h-5 w-5" />
  }
  if (type === "cosignature-requests") {
    return <IconFileCheck className="h-5 w-5" />
  }
  return <IconBell className="h-5 w-5" />
}

export default function NotificationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"all" | NotificationType>("all")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const visibleNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (activeTab !== "all" && notification.type !== activeTab) {
        return false
      }

      if (showUnreadOnly && notification.isRead) {
        return false
      }

      return true
    })
  }, [activeTab, notifications, showUnreadOnly])

  const unreadVisibleCount = visibleNotifications.filter(
    (notification) => !notification.isRead
  ).length

  const markOneAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  const markVisibleAsRead = () => {
    const visibleIds = new Set(visibleNotifications.map((notification) => notification.id))

    setNotifications((current) =>
      current.map((notification) =>
        visibleIds.has(notification.id) ? { ...notification, isRead: true } : notification
      )
    )

    toast.success("Visible notifications marked as read", {
      description: `${visibleNotifications.length} notification(s) updated`,
    })
  }

  const navigateToChart = (patientId?: string, notificationId?: string) => {
    if (notificationId) {
      markOneAsRead(notificationId)
    }
    router.push(patientId ? `/clinician/chart?patientId=${patientId}` : "/clinician/chart")
  }

  const navigateToOrders = (notificationId?: string) => {
    if (notificationId) {
      markOneAsRead(notificationId)
    }
    router.push("/clinician/orders")
  }

  const navigateToDocumentation = (notificationId?: string) => {
    if (notificationId) {
      markOneAsRead(notificationId)
    }
    router.push("/clinician/documentation")
  }

  const handleAcknowledge = (notification: NotificationItem) => {
    markOneAsRead(notification.id)
    toast.success("Critical result acknowledged", {
      description: `${notification.patientName} (${notification.mrn})`,
    })
  }

  const handleCosign = (notification: NotificationItem) => {
    markOneAsRead(notification.id)
    toast.success("Note cosigned", {
      description: `${notification.patientName} (${notification.mrn})`,
    })
  }

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-start justify-between gap-4 px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                Clinician inbox for alerts, results, documentation tasks, and system updates
              </p>
            </div>
            <Button onClick={markVisibleAsRead} disabled={visibleNotifications.length === 0}>
              Mark All as Read
            </Button>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | NotificationType)}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <TabsList className="h-auto flex-wrap justify-start">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="critical-results">Critical Results</TabsTrigger>
                  <TabsTrigger value="order-updates">Order Updates</TabsTrigger>
                  <TabsTrigger value="chart-deficiencies">Chart Deficiencies</TabsTrigger>
                  <TabsTrigger value="cosignature-requests">Cosignature Requests</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
                  <Switch checked={showUnreadOnly} onCheckedChange={setShowUnreadOnly} />
                  <div className="text-sm">
                    <p className="font-medium">Show Unread Only</p>
                    <p className="text-xs text-muted-foreground">
                      {unreadVisibleCount} unread in current view
                    </p>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>

          <div className="px-4 lg:px-6">
            <div className="space-y-3">
              {visibleNotifications.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    No notifications match the current filters.
                  </CardContent>
                </Card>
              ) : (
                visibleNotifications.map((notification) => {
                  const relativeTime = formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })

                  return (
                    <Card key={notification.id} className={notification.isRead ? "" : "border-blue-200"}>
                      <CardHeader className="pb-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${iconClassByType[notification.type]}`}
                            >
                              <NotificationTypeIcon type={notification.type} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {!notification.isRead && (
                                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                )}
                                <CardTitle
                                  className={`text-base ${notification.isRead ? "font-medium" : "font-semibold"}`}
                                >
                                  {notification.title}
                                </CardTitle>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span>
                                  {notification.patientName} | {notification.mrn}
                                </span>
                                <span>•</span>
                                <span>{relativeTime}</span>
                              </div>
                            </div>
                          </div>

                          <Badge variant="outline" className="w-fit">
                            {labelByType[notification.type]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2">
                          {notification.type === "critical-results" && (
                            <>
                              <Button size="sm" onClick={() => handleAcknowledge(notification)}>
                                Acknowledge
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigateToChart(notification.patientId, notification.id)}
                              >
                                View Result
                              </Button>
                            </>
                          )}

                          {notification.type === "order-updates" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigateToOrders(notification.id)}
                            >
                              View Order
                            </Button>
                          )}

                          {notification.type === "chart-deficiencies" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigateToChart(notification.patientId, notification.id)}
                              >
                                View Chart
                              </Button>
                              <Button size="sm" onClick={() => navigateToDocumentation(notification.id)}>
                                Sign Note
                              </Button>
                            </>
                          )}

                          {notification.type === "cosignature-requests" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigateToDocumentation(notification.id)}
                              >
                                Review Note
                              </Button>
                              <Button size="sm" onClick={() => handleCosign(notification)}>
                                Cosign
                              </Button>
                            </>
                          )}

                          {notification.type === "system" && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <IconStethoscope className="h-4 w-4" />
                              Informational notice
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
