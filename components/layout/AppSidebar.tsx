"use client";

import { useEffect, useSyncExternalStore } from "react";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import { AppNav } from "@/components/layout/AppNav";
import { Button } from "@/components/ui/button";
import {
  MD_MEDIA_QUERY,
  PRODUCT_NAME,
  PRODUCT_NAME_MARK,
} from "@/lib/constants";
import {
  readSidebarCollapsed,
  subscribeSidebarCollapsed,
  writeSidebarCollapsed,
} from "@/lib/sidebar";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  footer?: React.ReactNode;
};

export function AppSidebar({ footer }: AppSidebarProps) {
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
        "border-sidebar-border bg-sidebar text-sidebar-foreground hidden h-svh shrink-0 flex-col overflow-hidden border-r md:flex",
        "transition-[width] duration-[var(--motion-default)] ease-standard",
        collapsed ? "w-14" : "w-[13.5rem]"
      )}
      data-collapsed={collapsed ? "true" : undefined}
    >
      <div
        className={cn(
          "flex shrink-0 gap-1 py-3",
          collapsed
            ? "flex-col items-center px-1"
            : "items-center justify-between px-3"
        )}
      >
        {collapsed ? (
          <span
            className="font-heading text-xs font-semibold tracking-tight"
            title={PRODUCT_NAME}
          >
            {PRODUCT_NAME_MARK}
          </span>
        ) : (
          <p className="font-heading min-w-0 truncate text-sm font-semibold tracking-tight">
            {PRODUCT_NAME}
          </p>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
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
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <AppNav collapsed={collapsed} />
      </div>
      {footer ? (
        <div
          data-slot="shell-actions"
          className={cn(
            "mt-auto flex shrink-0 py-2",
            collapsed ? "justify-center px-1" : "px-3"
          )}
        >
          {footer}
        </div>
      ) : null}
    </aside>
  );
}
