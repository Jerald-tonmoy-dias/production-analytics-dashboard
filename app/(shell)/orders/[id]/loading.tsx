import { OrderDetailsSkeleton } from "@/components/orders/OrderDetails";
import { PageHeaderSkeleton } from "@/components/shared/PageSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <OrderDetailsSkeleton />
    </div>
  );
}
