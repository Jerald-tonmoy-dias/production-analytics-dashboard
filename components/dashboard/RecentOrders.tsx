import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUsd } from "@/lib/format";
import type { OrderListItem } from "@/lib/schemas/order";

type DashboardListState = "default" | "loading" | "error";

type RecentOrdersProps = {
  orders: OrderListItem[];
  state?: DashboardListState;
};

function RecentOrdersSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </div>
  );
}

export function RecentOrders({
  orders,
  state = "default",
}: RecentOrdersProps) {
  const empty = state === "default" && orders.length === 0;

  return (
    <div className="bg-card flex h-full min-h-0 min-w-0 flex-col justify-between rounded-2xl border border-slate-200/80 p-6 shadow-sm dark:border-slate-800">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent orders
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Newest orders across the workspace.
            </p>
          </div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span>View all</span>
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        {state === "loading" ? (
          <div aria-busy="true" aria-live="polite">
            <RecentOrdersSkeleton />
          </div>
        ) : state === "error" ? (
          <ErrorState
            title="Couldn’t load recent orders"
            description="The list failed to load. Try again in a moment."
            className="border-0 py-8"
          />
        ) : empty ? (
          <EmptyState
            title="No recent orders"
            description="Orders will appear here when customers start checking out."
            className="border-0 py-8"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">Recent orders</caption>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <th className="px-3 py-2.5">Order</th>
                  <th className="px-3 py-2.5">Product</th>
                  <th className="px-3 py-2.5">Customer</th>
                  <th className="px-3 py-2.5">Amount</th>
                  <th className="px-4 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="group transition hover:bg-primary/5 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-3 py-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-mono text-xs font-semibold text-slate-900 outline-none transition-colors group-hover:text-primary focus-visible:underline dark:text-white"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {order.productName}
                      </div>
                      {order.itemCount > 1 ? (
                        <div className="text-xs text-slate-400">
                          +{order.itemCount - 1} more
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">
                      {order.customerName}
                    </td>
                    <td className="px-3 py-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {formatUsd(order.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
