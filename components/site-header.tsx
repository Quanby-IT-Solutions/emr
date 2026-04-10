"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SearchCommand } from "@/components/search-command"
import { NotificationPopover } from "@/components/notification-popover"
import { MessageDialog } from "@/components/message-dialog"
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border/50 bg-background/60 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 bg-border/50"
        />
        <div className="flex flex-1 items-center gap-2">
          <DynamicBreadcrumbs />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <SearchCommand />
          <MessageDialog />
          <NotificationPopover />
        </div>
      </div>
    </header>
  )
}
