"use client";

import { ORDER_STATUSES } from "@/lib/constants";
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
 * Status tabs from the HTML mock.
 * Tabs drive the real URL status filter.
 */
export function OrdersDemoChrome({
  totalCount,
  activeStatus,
  onStatusChange,
}: OrdersDemoChromeProps) {
  return (
    <div className="flex flex-col justify-between gap-3 pt-1 sm:flex-row sm:items-center">
      <nav
        aria-label="Order status tabs"
        className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200/80 bg-slate-100 p-1 shadow-inner dark:border-slate-700/70 dark:bg-slate-800/90"
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
                "flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs transition-all",
                active
                  ? "bg-white font-semibold text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                  : "font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
              onClick={() => onStatusChange(tab === "all" ? undefined : tab)}
            >
              <span>{label}</span>
              {tab === "all" && totalCount != null ? (
                <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  {formatInteger(totalCount)}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
      <p className="self-end pr-1 text-xs text-slate-500 sm:self-auto dark:text-slate-400">
        Showing{" "}
        <strong className="font-semibold text-slate-700 dark:text-slate-300">
          10
        </strong>{" "}
        per page
      </p>
    </div>
  );
}
