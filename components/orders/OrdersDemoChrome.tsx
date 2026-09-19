"use client";

import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ORDER_STATUSES } from "@/lib/constants";
import { showDemoToast } from "@/lib/demo-toast";
import { formatInteger } from "@/lib/format";
import type { OrderStatus } from "@/lib/schemas/order";
import { orderStatusLabel } from "@/components/orders/OrderStatusBadge";
import { cn } from "@/lib/utils";

type OrdersDemoChromeProps = {
  totalCount?: number;
  activeStatus?: OrderStatus;
  onStatusChange: (status: OrderStatus | undefined) => void;
};

const TAB_STATUSES: Array<OrderStatus | "all"> = [
  "all",
  ...ORDER_STATUSES,
];

/**
 * Orders header actions + status tabs from the HTML mock.
 * Tabs drive the real URL status filter; Export / Create are demo-only.
 */
export function OrdersDemoChrome({
  totalCount,
  activeStatus,
  onStatusChange,
}: OrdersDemoChromeProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="cursor-pointer rounded-xl text-xs"
          onClick={() =>
            showDemoToast("Export CSV is demo-only — no file is generated.")
          }
        >
          <Download className="size-3.5" aria-hidden="true" />
          Export CSV
        </Button>
        <Button
          type="button"
          size="sm"
          className="cursor-pointer rounded-xl text-xs shadow-sm"
          onClick={() =>
            showDemoToast("Create order is demo-only — no mutation API.")
          }
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Create order
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Order status tabs"
          className="bg-muted inline-flex flex-wrap gap-1 rounded-xl border p-1 shadow-inner"
        >
          {TAB_STATUSES.map((tab) => {
            const active =
              tab === "all" ? activeStatus == null : activeStatus === tab;
            const label = tab === "all" ? "All" : orderStatusLabel(tab);
            return (
              <button
                key={tab}
                type="button"
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition",
                  active
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() =>
                  onStatusChange(tab === "all" ? undefined : tab)
                }
              >
                <span>{label}</span>
                {tab === "all" && totalCount != null ? (
                  <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                    {formatInteger(totalCount)}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
        <p className="text-muted-foreground text-xs">
          Showing <strong className="text-foreground font-semibold">10</strong>{" "}
          per page
        </p>
      </div>
    </div>
  );
}
