"use client";

import { Download, Plus } from "lucide-react";
import { showDemoToast } from "@/lib/demo-toast";

/** Orders page header actions — demo-only (no CSV / mutations). */
export function OrdersHeaderActions() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:bg-slate-50 hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        onClick={() =>
          showDemoToast("Export CSV is demo-only — no file is generated.")
        }
      >
        <Download className="size-3.5 text-slate-400" aria-hidden="true" />
        Export CSV
      </button>
      <button
        type="button"
        className="bg-primary hover:bg-primary/90 inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white shadow-[var(--shadow-brand-sm)] transition"
        onClick={() =>
          showDemoToast("Create order is demo-only — no mutation API.")
        }
      >
        <Plus className="size-3.5" aria-hidden="true" />
        Create order
      </button>
    </div>
  );
}
