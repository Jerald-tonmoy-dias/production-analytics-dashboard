import { OrdersTable } from "@/components/orders/OrdersTable";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersWorkspaceSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <Card className="min-w-0">
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardContent>
          <OrdersTable orders={[]} state="loading" />
        </CardContent>
      </Card>
    </div>
  );
}
