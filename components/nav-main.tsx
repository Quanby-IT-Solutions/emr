"use client"

import { type Icon } from "@tabler/icons-react"
import Link from "next/link"

import { UserRole } from "@/lib/auth/roles"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
  role?: UserRole
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                asChild
                className="group h-10 transition-all duration-200 hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className="h-5 w-5 opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:text-primary" />}
                  <span className="font-medium text-[13px]">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
