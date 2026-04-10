"use client"

import * as React from "react"
import Link from "next/link"
import { IconHeartbeat } from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserRole } from "@/lib/auth/roles"
import { getSidebarConfig } from "@/lib/auth/sidebar-config"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: UserRole
  userName?: string
  userEmail?: string
}

export function AppSidebar({ role, userName = "User", userEmail = "user@example.com", ...props }: AppSidebarProps) {
  const navItems = getSidebarConfig(role)
  
  const user = {
    name: userName,
    email: userEmail,
    avatar: "/avatars/user.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconHeartbeat className="!size-5" />
                <span className="text-base font-semibold">QHealth EMR</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
