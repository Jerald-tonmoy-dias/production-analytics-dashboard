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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
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
    <Card>
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>Newest orders across the workspace.</CardDescription>
      </CardHeader>
      <CardContent>
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
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="block">{order.customerName}</span>
                    <span className="text-muted-foreground text-xs">
                      {order.customerEmail}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatUsd(order.amount)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`} aria-label={`View ${order.id}`}>
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
