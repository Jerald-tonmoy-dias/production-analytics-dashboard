"use client";

import { useState } from "react";
import { CalendarDays, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showDemoToast } from "@/lib/demo-toast";
import { cn } from "@/lib/utils";

const DATE_RANGES = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Year to date",
] as const;

/**
 * Dashboard header chrome from the HTML mock — demo-only controls.
 * Chart series always remain the real last-30-day analytics payload.
 */
export function DashboardDemoChrome() {
  const [range, setRange] = useState<(typeof DATE_RANGES)[number]>("Last 30 days");
  const [open, setOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  function sync() {
    setSyncing(true);
    showDemoToast("Live sync is demo-only — data is already from the mock API.");
    window.setTimeout(() => setSyncing(false), 600);
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="bg-card text-muted-foreground inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium shadow-sm">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span>Live sync</span>
        <button
          type="button"
          className="hover:text-primary cursor-pointer rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Sync data (demo)"
          title="Demo only"
          onClick={sync}
        >
          <RefreshCw
            className={cn("size-3.5", syncing && "animate-spin")}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="cursor-pointer rounded-xl text-xs"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {range}
        </Button>
        {open ? (
          <div className="bg-popover absolute right-0 z-40 mt-2 w-44 rounded-xl border py-1.5 text-xs shadow-lg">
            {DATE_RANGES.map((option) => (
              <button
                key={option}
                type="button"
                className={cn(
                  "hover:bg-accent flex w-full cursor-pointer items-center justify-between px-3.5 py-2 text-left",
                  option === range && "bg-accent text-primary font-semibold"
                )}
                onClick={() => {
                  setRange(option);
                  setOpen(false);
                  showDemoToast(
                    `Date range “${option}” is demo chrome — charts stay last 30 UTC days.`
                  );
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="cursor-pointer rounded-xl text-xs"
        onClick={() =>
          showDemoToast("Export is demo-only — no file is generated.")
        }
      >
        <Download className="size-3.5" aria-hidden="true" />
        Export
      </Button>
    </div>
  );
}
