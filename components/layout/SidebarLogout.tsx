"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { showDemoToast } from "@/lib/demo-toast";
import { cn } from "@/lib/utils";

type SidebarLogoutProps = {
  collapsed?: boolean;
  className?: string;
};

/**
 * Chrome-only logout. Opens a demo confirm dialog — no auth session in v1.
 */
export function SidebarLogout({
  collapsed = false,
  className,
}: SidebarLogoutProps) {
  const [open, setOpen] = useState(false);

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
      onClick={() => setOpen(true)}
    >
      <LogOut className="size-4 shrink-0" aria-hidden="true" />
      <span className={collapsed ? "sr-only" : "min-w-0 flex-1 truncate text-left"}>
        Log out
      </span>
    </button>
  );

  return (
    <>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            Log out
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>
              This console has no authentication. Confirming only shows a demo
              message — your session is not cleared on a server.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="cursor-pointer rounded-xl"
              onClick={() => {
                setOpen(false);
                showDemoToast("Logged out safely (demo — no auth).");
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
