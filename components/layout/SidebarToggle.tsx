"use client";

import { useSyncExternalStore } from "react";
import { Columns2 } from "lucide-react";
import {
  readSidebarCollapsed,
  subscribeSidebarCollapsed,
  writeSidebarCollapsed,
} from "@/lib/sidebar";
import { cn } from "@/lib/utils";

/** Top-bar sidebar toggle — matches HTML mock placement (left of header). */
export function SidebarToggle() {
  const collapsed = useSyncExternalStore(
    subscribeSidebarCollapsed,
    readSidebarCollapsed,
    () => false
  );

  return (
    <button
      type="button"
      className={cn(
        "hidden cursor-pointer rounded-lg p-1.5 text-slate-500 transition md:inline-flex",
        "hover:bg-primary/5 hover:text-primary",
        "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      )}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-pressed={collapsed}
      title="Toggle Sidebar"
      onClick={() => writeSidebarCollapsed(!collapsed)}
    >
      <Columns2 className="size-5" aria-hidden="true" />
    </button>
  );
}
