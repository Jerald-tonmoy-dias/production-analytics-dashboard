import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { formatUsd } from "@/lib/format";
import type { OrderListItem } from "@/lib/schemas/order";

type DashboardListState = "default" | "loading" | "error";

type RecentOrdersProps = {
  orders: OrderListItem[];
  state?: DashboardListState;
};

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
          <Table className="min-w-0 table-fixed">
            <TableCaption className="sr-only">Recent orders</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[16%]">Order</TableHead>
                <TableHead className="w-[30%]">Product</TableHead>
                <TableHead className="w-[24%]">Customer</TableHead>
                <TableHead className="w-[15%]">Amount</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="max-w-0">
                    <Link
                      href={`/orders/${order.id}`}
                      className="block truncate rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-0 whitespace-normal">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {order.productName}
                      </span>
                      {order.itemCount > 1 ? (
                        <span className="text-muted-foreground block truncate text-xs">
                          +{order.itemCount - 1} more
                        </span>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-0">
                    <span className="block truncate font-medium">
                      {order.customerName}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatUsd(order.amount)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
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
