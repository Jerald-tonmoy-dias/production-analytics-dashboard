"use client";

import { useEffect, useSyncExternalStore } from "react";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import { AppNav } from "@/components/layout/AppNav";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { SidebarLogout } from "@/components/layout/SidebarLogout";
import { Button } from "@/components/ui/button";
import { MD_MEDIA_QUERY } from "@/lib/constants";
import {
  readSidebarCollapsed,
  subscribeSidebarCollapsed,
  writeSidebarCollapsed,
} from "@/lib/sidebar";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  orderCount?: number;
};

export function AppSidebar({ orderCount }: AppSidebarProps) {
  const collapsed = useSyncExternalStore(
    subscribeSidebarCollapsed,
    readSidebarCollapsed,
    () => false
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "b") {
        return;
      }
      if (!window.matchMedia(MD_MEDIA_QUERY).matches) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=true]")) {
        return;
      }
      event.preventDefault();
      writeSidebarCollapsed(!readSidebarCollapsed());
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <aside
      className={cn(
        "border-sidebar-border bg-sidebar text-sidebar-foreground relative hidden h-svh shrink-0 flex-col border-r md:flex",
        "transition-[width] duration-[var(--motion-default)] ease-standard",
        collapsed ? "w-14" : "w-64"
      )}
      data-collapsed={collapsed ? "true" : undefined}
    >
      <div
        className={cn(
          "flex shrink-0 py-3",
          collapsed ? "justify-center px-1" : "items-center px-3"
        )}
      >
        <BrandLockup compact={collapsed} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <AppNav collapsed={collapsed} orderCount={orderCount} />
      </div>
      <div
        className={cn(
          "border-sidebar-border shrink-0 border-t px-2 py-2",
          collapsed && "flex justify-center"
        )}
      >
        <SidebarLogout collapsed={collapsed} />
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className={cn(
          "bg-background text-foreground absolute top-3 right-0 z-30 cursor-pointer",
          "translate-x-1/2 rounded-full border shadow-sm",
          "hover:bg-muted"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-pressed={collapsed}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => writeSidebarCollapsed(!collapsed)}
      >
        {collapsed ? (
          <PanelLeft className="size-4" aria-hidden="true" />
        ) : (
          <PanelLeftClose className="size-4" aria-hidden="true" />
        )}
      </Button>
    </aside>
  );
}
