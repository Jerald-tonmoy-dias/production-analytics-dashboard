import { Suspense } from "react";
import { OrdersWorkspaceSkeleton } from "@/components/orders/OrdersWorkspaceSkeleton";
import { OrdersWorkspace } from "@/components/orders/OrdersWorkspace";
import { PageHeader } from "@/components/shared/PageHeader";

export default function OrdersPage() {
  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        title="Orders"
        description="Search, filter, and inspect orders."
      />
      <Suspense fallback={<OrdersWorkspaceSkeleton />}>
        <OrdersWorkspace />
      </Suspense>
    </div>
  );
}
