import Link from "next/link";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
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

export type OrdersTableState =
  | "default"
  | "loading"
  | "empty"
  | "noResults"
  | "error";

type OrdersTableProps = {
  orders: OrderListItem[];
  state?: OrdersTableState;
  onRetry?: () => void;
};

function OrdersTableSkeleton() {
  return (
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
        {Array.from({ length: 8 }, (_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-36" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-7 w-12" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function OrdersTable({
  orders,
  state = "default",
  onRetry,
}: OrdersTableProps) {
  if (state === "loading") {
    return (
      <div aria-busy="true" aria-live="polite">
        <OrdersTableSkeleton />
      </div>
    );
  }

  if (state === "error") {
    return (
      <ErrorState
        title="Couldn’t load orders"
        description="The list failed to load. Try again in a moment."
      >
        {onRetry ? (
          <Button type="button" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </ErrorState>
    );
  }

  if (state === "noResults") {
    return (
      <EmptyState
        title="No orders match"
        description="Try a different search, status, or date range."
      />
    );
  }

  if (state === "empty" || orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Orders will appear here when customers start checking out."
      />
    );
  }

  return (
    <Table>
      <TableCaption className="sr-only">Orders</TableCaption>
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
                className="rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:underline focus-visible:ring-3 focus-visible:ring-ring/50"
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
  );
}
