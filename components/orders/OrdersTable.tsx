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
  onClearFilters?: () => void;
  /** Demo chrome: local selection only. */
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
};

function productSecondaryLabel(order: OrderListItem): string {
  if (order.itemCount > 1) {
    return `${order.productSku} · +${order.itemCount - 1} more`;
  }
  return order.productSku;
}

function OrdersTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10" />
          <TableHead>Order</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 8 }, (_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="size-3.5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-20 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-7 w-12" />
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
  onClearFilters,
  selectedIds = [],
  onSelectedIdsChange,
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
      >
        {onClearFilters ? (
          <Button type="button" variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : null}
      </EmptyState>
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

  const allSelected =
    orders.length > 0 && orders.every((order) => selectedIds.includes(order.id));

  return (
    <Table>
      <TableCaption className="sr-only">Orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 text-center">
            <input
              type="checkbox"
              className="accent-primary size-3.5 cursor-pointer rounded border"
              checked={allSelected}
              aria-label="Select all rows on this page (demo)"
              onChange={(event) => {
                onSelectedIdsChange?.(
                  event.target.checked ? orders.map((order) => order.id) : []
                );
              }}
            />
          </TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const checked = selectedIds.includes(order.id);
          return (
            <TableRow key={order.id}>
              <TableCell className="text-center">
                <input
                  type="checkbox"
                  className="accent-primary size-3.5 cursor-pointer rounded border"
                  checked={checked}
                  aria-label={`Select ${order.id} (demo)`}
                  onChange={(event) => {
                    if (!onSelectedIdsChange) {
                      return;
                    }
                    if (event.target.checked) {
                      onSelectedIdsChange([...selectedIds, order.id]);
                    } else {
                      onSelectedIdsChange(
                        selectedIds.filter((id) => id !== order.id)
                      );
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <Link
                  href={`/orders/${order.id}`}
                  className="font-mono text-xs font-semibold underline-offset-4 outline-none hover:underline focus-visible:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {order.id}
                </Link>
              </TableCell>
              <TableCell>
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {order.productName}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {productSecondaryLabel(order)}
                  </span>
                </span>
              </TableCell>
              <TableCell>
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {order.customerName}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {order.customerEmail}
                  </span>
                </span>
              </TableCell>
              <TableCell className="font-mono text-sm tabular-nums">
                {formatUsd(order.amount)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                {formatDateTime(order.createdAt)}
              </TableCell>
              <TableCell>
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <Link
                    href={`/orders/${order.id}`}
                    aria-label={`View ${order.id}`}
                  >
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
