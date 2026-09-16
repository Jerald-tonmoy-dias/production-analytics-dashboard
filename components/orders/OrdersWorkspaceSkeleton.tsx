import { OrdersTable } from "@/components/orders/OrdersTable";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersWorkspaceSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
      <OrdersTable orders={[]} state="loading" />
    </div>
  );
}
