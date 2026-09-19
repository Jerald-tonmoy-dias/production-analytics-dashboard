"use client";

import { useEffect, useSyncExternalStore } from "react";
import { AppNav } from "@/components/layout/AppNav";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { SidebarLogout } from "@/components/layout/SidebarLogout";
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
        "border-sidebar-border bg-sidebar text-sidebar-foreground relative z-30 hidden h-svh shrink-0 flex-col border-r md:flex",
        "transition-[width] duration-300 ease-standard select-none",
        collapsed ? "w-14" : "w-60"
      )}
      data-collapsed={collapsed ? "true" : undefined}
    >
      <div
        className={cn(
          "flex h-16 shrink-0",
          collapsed ? "items-center justify-center px-1" : "items-center px-4"
        )}
      >
        <BrandLockup compact={collapsed} />
      </div>
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto pb-2",
          collapsed ? "px-1" : "px-3 pt-3"
        )}
      >
        <AppNav collapsed={collapsed} orderCount={orderCount} />
      </div>
      <div
        className={cn(
          "border-sidebar-border shrink-0 border-t",
          collapsed ? "flex justify-center p-2" : "p-3"
        )}
      >
        <SidebarLogout collapsed={collapsed} />
      </div>
    </aside>
  );
}
