import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { CustomerAvatar } from "@/components/shared/CustomerAvatar";
import { ProductMark } from "@/components/shared/ProductMark";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatUsd } from "@/lib/format";
import type { OrderListItem } from "@/lib/schemas/order";

type DashboardListState = "default" | "loading" | "error";

type RecentOrdersProps = {
  orders: OrderListItem[];
  state?: DashboardListState;
};

function productSecondaryLabel(order: OrderListItem): string {
  if (order.itemCount > 1) {
    return `${order.productSku} · +${order.itemCount - 1} more`;
  }
  return order.productSku;
}

function RecentOrdersSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </div>
  );
}

export function RecentOrders({
  orders,
  state = "default",
}: RecentOrdersProps) {
  const empty = state === "default" && orders.length === 0;

  return (
    <Card className="flex h-full min-h-0 min-w-0 flex-col">
      <CardHeader className="shrink-0">
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>Newest orders across the workspace.</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        {state === "loading" ? (
          <div aria-busy="true" aria-live="polite">
            <RecentOrdersSkeleton />
          </div>
        ) : state === "error" ? (
          <ErrorState
            title="Couldn’t load recent orders"
            description="The list failed to load. Try again in a moment."
            className="border-0 py-8"
          />
        ) : empty ? (
          <EmptyState
            title="No recent orders"
            description="Orders will appear here when customers start checking out."
            className="border-0 py-8"
          />
        ) : (
          <Table>
            <TableCaption className="sr-only">Recent orders</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="align-middle">
                    <Link
                      href={`/orders/${order.id}`}
                      className="rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <ProductMark name={order.productName} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {order.productName}
                        </span>
                        <span className="text-muted-foreground block truncate text-xs">
                          {productSecondaryLabel(order)}
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <CustomerAvatar name={order.customerName} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {order.customerName}
                        </span>
                        <span className="text-muted-foreground block truncate text-xs">
                          {order.customerEmail}
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="align-middle text-right tabular-nums">
                    {formatUsd(order.amount)}
                  </TableCell>
                  <TableCell className="align-middle whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground align-middle whitespace-nowrap">
                    {formatDateTime(order.createdAt)}
                  </TableCell>
                  <TableCell className="align-middle text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/orders/${order.id}`}
                        aria-label={`View ${order.id}`}
                      >
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
