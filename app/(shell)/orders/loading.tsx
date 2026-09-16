import { OrdersWorkspaceSkeleton } from "@/components/orders/OrdersWorkspaceSkeleton";
import { PageHeaderSkeleton } from "@/components/shared/PageSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <OrdersWorkspaceSkeleton />
    </div>
  );
}
