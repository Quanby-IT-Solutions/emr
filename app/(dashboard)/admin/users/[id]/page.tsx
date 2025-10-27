import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requiredRole={UserRole.SYSTEM_ADMIN}>
      <DashboardLayout role={UserRole.SYSTEM_ADMIN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/admin/users">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">User Details</h1>
            <p className="text-muted-foreground">
              View and manage user information
            </p>
          </div>

          <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>User's basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="Dr. John Smith" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="john.smith@hospital.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role & Permissions</CardTitle>
                <CardDescription>User's system access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div>
                    <Badge variant="secondary">CLINICIAN</Badge>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <p className="text-sm text-muted-foreground">Oct 27, 2025 at 9:30 AM</p>
                </div>
                <div className="space-y-2">
                  <Label>Created Date</Label>
                  <p className="text-sm text-muted-foreground">Jan 15, 2025</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Manage this user</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Reset Password</Button>
                <Button variant="destructive" className="ml-auto">Deactivate User</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
