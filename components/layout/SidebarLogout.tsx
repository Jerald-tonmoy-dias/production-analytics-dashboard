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
        "group flex cursor-pointer items-center rounded-xl text-sm font-medium outline-none transition",
        "text-[#475569] hover:bg-primary/5 hover:text-primary dark:text-slate-400",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        collapsed
          ? "size-9 justify-center"
          : "w-full gap-3 px-3.5 py-2",
        className
      )}
      onClick={() => setOpen(true)}
    >
      <LogOut
        className="size-[18px] shrink-0 text-slate-400 transition-colors group-hover:text-primary"
        aria-hidden="true"
      />
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
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
            <DialogDescription>
              You will need to sign back in to access your workspace, customer
              orders, and analytics dashboards. (Demo only — no auth session.)
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
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
