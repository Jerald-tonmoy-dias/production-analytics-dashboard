import { Suspense } from "react";
import { OrdersWorkspaceSkeleton } from "@/components/orders/OrdersWorkspaceSkeleton";
import { OrdersWorkspace } from "@/components/orders/OrdersWorkspace";
import { PageHeader } from "@/components/shared/PageHeader";

export default function OrdersPage() {
  return (
    <div className="mx-auto min-w-0 max-w-[1360px] space-y-5">
      <PageHeader
        title="Orders"
        description="Search, filter, inspect, and fulfill customer orders across channels."
      />
      <Suspense fallback={<OrdersWorkspaceSkeleton />}>
        <OrdersWorkspace />
      </Suspense>
    </div>
  );
}
