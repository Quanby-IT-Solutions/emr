"use client"

import {
  IconDotsVertical,
  IconHeadset,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { ROLE_LABELS } from "@/lib/auth/roles"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { user: authUser, logout } = useAuth()
  const router = useRouter()

  // Use real auth data when available, fall back to props
  const displayName = authUser
    ? (ROLE_LABELS[authUser.role] ?? authUser.username)
    : user.name
  const displayEmail = authUser?.email ?? user.email
  const initials = authUser
    ? authUser.username.slice(0, 2).toUpperCase()
    : user.name.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors duration-200"
            >
              <Avatar className="h-9 w-9 rounded-xl border border-border shadow-sm">
                <AvatarImage src={user.avatar} alt={displayName} />
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs font-medium">
                  {displayEmail}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border-border/50 bg-card/95 backdrop-blur-xl shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-xl border border-border shadow-sm">
                  <AvatarImage src={user.avatar} alt={displayName} />
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs font-medium">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <div className="p-1">
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer transition-colors hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary">
                <Link href="/profile" className="flex items-center gap-2">
                  <IconUserCircle className="h-4 w-4 opacity-70" />
                  <span className="font-medium">Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer transition-colors hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary">
                <Link href="/it-support" className="flex items-center gap-2">
                  <IconHeadset className="h-4 w-4 opacity-70" />
                  <span className="font-medium">IT Support</span>
                </Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-border/50" />
            <div className="p-1">
              <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <IconLogout className="h-4 w-4 opacity-70" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
