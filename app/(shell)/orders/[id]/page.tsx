import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { OrderDetailsHeaderActions } from "@/components/orders/OrderDetailsHeaderActions";
import { PageHeader } from "@/components/shared/PageHeader";
import { getOrder } from "@/lib/api/rsc";
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
    <div className="mx-auto min-w-0 max-w-[1360px] space-y-6">
      <nav
        aria-label="Breadcrumb"
        className="text-muted-foreground flex items-center gap-2 text-xs font-medium"
      >
        <Link
          href="/orders"
          className="hover:text-primary rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Orders
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground font-mono font-semibold">{order.id}</span>
      </nav>
      <PageHeader
        title={order.id}
        description={`Placed ${formatDateTime(order.createdAt)}`}
        className="[&_h1]:font-mono"
      >
        <OrderDetailsHeaderActions orderId={order.id} />
      </PageHeader>
      <OrderDetails order={order} />
    </div>
  );
}
