import { Suspense } from "react";
import { OrdersHeaderActions } from "@/components/orders/OrdersHeaderActions";
import { OrdersWorkspaceSkeleton } from "@/components/orders/OrdersWorkspaceSkeleton";
import { OrdersWorkspace } from "@/components/orders/OrdersWorkspace";
import { PageHeader } from "@/components/shared/PageHeader";
import { getAnalytics } from "@/lib/api/rsc";
import { formatInteger } from "@/lib/format";

export default async function OrdersPage() {
  const analytics = await getAnalytics();

  return (
    <div className="mx-auto min-w-0 max-w-[1360px] space-y-5 pb-8">
      <PageHeader
        title="Orders"
        description="Search, filter, inspect, and fulfill customer orders across channels."
        badge={
          <span className="border-primary/30 bg-primary/5 text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold">
            {formatInteger(analytics.kpis.orderCount)} total
          </span>
        }
      >
        <OrdersHeaderActions />
      </PageHeader>
      <Suspense fallback={<OrdersWorkspaceSkeleton />}>
        <OrdersWorkspace />
      </Suspense>
    </div>
  );
}
