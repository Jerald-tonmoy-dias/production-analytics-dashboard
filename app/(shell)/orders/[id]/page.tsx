import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { getOrder } from "@/lib/api/orders";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { formatDateTime } from "@/lib/format";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  let order;
  try {
    order = await getOrder(id);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      notFound();
    }
    throw error;
  }

  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        title={order.id}
        description={`Placed ${formatDateTime(order.createdAt)}`}
      >
        <Button asChild variant="outline">
          <Link href="/orders">Back to orders</Link>
        </Button>
      </PageHeader>
      <OrderDetails order={order} />
    </div>
  );
}
