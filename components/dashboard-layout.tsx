import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { UserRole } from "@/lib/auth/roles"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  role: UserRole
  children: React.ReactNode
}

export function DashboardLayout({ role, children }: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar role={role} variant="inset" />
      <SidebarInset className="relative bg-background">
        {/* Subtle patterned background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-30 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-1 flex-col">
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2 relative z-10">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
