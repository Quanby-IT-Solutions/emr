"use client"

import * as React from "react"
import Link from "next/link"
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
    <Sidebar collapsible="offcanvas" className="border-r-border/50 shadow-lg shadow-black/5" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-2 hover:bg-transparent"
            >
              <Link href="/" className="flex items-center gap-3">
                <img src="/new-logo.png" alt="QHealth Logo" className="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold tracking-tight text-foreground text-sm">QHealth</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
