"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown, Download, RefreshCw } from "lucide-react";
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
      <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Live sync
        </span>
        <button
          type="button"
          className="ml-0.5 cursor-pointer rounded-sm outline-none transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Sync data (demo)"
          title="Sync data now"
          onClick={sync}
        >
          <RefreshCw
            className={cn("size-3.5", syncing && "animate-spin")}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="relative">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <CalendarDays className="size-3.5 text-slate-400" aria-hidden="true" />
          <span>{range}</span>
          <ChevronDown className="size-3 text-slate-400" aria-hidden="true" />
        </button>
        {open ? (
          <div className="absolute right-0 z-40 mt-2 w-44 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-medium shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {DATE_RANGES.map((option) => (
              <button
                key={option}
                type="button"
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between px-3.5 py-2 text-left text-slate-700 transition hover:bg-primary/5 dark:text-slate-300 dark:hover:bg-slate-800",
                  option === range &&
                    "bg-primary/10 font-semibold text-primary dark:bg-primary/20"
                )}
                onClick={() => {
                  setRange(option);
                  setOpen(false);
                  showDemoToast(
                    `Date range “${option}” is demo chrome — charts stay last 30 UTC days.`
                  );
                }}
              >
                <span>{option}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:bg-primary/5 hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        onClick={() =>
          showDemoToast("Export is demo-only — no file is generated.")
        }
      >
        <Download className="size-3.5 text-slate-400" aria-hidden="true" />
        <span>Export</span>
      </button>
    </div>
  );
}
