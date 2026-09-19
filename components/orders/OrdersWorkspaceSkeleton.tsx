import { OrdersTable } from "@/components/orders/OrdersTable";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersWorkspaceSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite">
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 shadow-sm dark:border-slate-800">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-9 w-full max-w-md rounded-xl" />
          <div className="flex flex-wrap gap-2.5">
            <Skeleton className="h-9 w-[130px] rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800">
        <OrdersTable orders={[]} state="loading" />
      </div>
    </div>
  );
}
