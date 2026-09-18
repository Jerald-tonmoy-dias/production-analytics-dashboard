"use client";

import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SidebarLogoutProps = {
  collapsed?: boolean;
  className?: string;
};

/**
 * Chrome-only logout control. There is no auth session in v1 — the control
 * matches sidebar nav styling for a complete shell without wiring real logout.
 */
export function SidebarLogout({
  collapsed = false,
  className,
}: SidebarLogoutProps) {
  const button = (
    <button
      type="button"
      aria-label="Log out"
      title="Log out (demo — no authentication)"
      className={cn(
        "flex cursor-pointer items-center rounded-xl border border-transparent text-sm font-medium outline-none transition-colors duration-[var(--motion-fast)] ease-standard",
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        collapsed
          ? "size-9 justify-center"
          : "min-h-10 w-full gap-2.5 px-3 py-2",
        className
      )}
    >
      <LogOut className="size-4 shrink-0" aria-hidden="true" />
      <span className={collapsed ? "sr-only" : "min-w-0 flex-1 truncate text-left"}>
        Log out
      </span>
    </button>
  );

  if (!collapsed) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        Log out
      </TooltipContent>
    </Tooltip>
  );
}
