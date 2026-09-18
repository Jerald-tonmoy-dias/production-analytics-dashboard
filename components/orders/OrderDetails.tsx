import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { CustomerStatusBadge } from "@/components/shared/CustomerStatusBadge";
import { ErrorState } from "@/components/shared/ErrorState";
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
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatUsd } from "@/lib/format";
import type { OrderDetail } from "@/lib/schemas/order";

type OrderDetailsState = "default" | "error";

type OrderDetailsProps = {
  order?: OrderDetail;
  state?: OrderDetailsState;
};

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

export function OrderDetailsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function OrderDetails({
  order,
  state = "default",
}: OrderDetailsProps) {
  if (state === "error") {
    return (
      <ErrorState
        title="Couldn’t load this order"
        description="The order failed to load. Try again in a moment."
      />
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Status, amount, and timestamps.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Status">
                <OrderStatusBadge status={order.status} />
              </DetailItem>
              <DetailItem label="Amount">
                <span className="tabular-nums font-medium">
                  {formatUsd(order.amount)}
                </span>
              </DetailItem>
              <DetailItem label="Created">
                <time dateTime={order.createdAt}>
                  {formatDateTime(order.createdAt)}
                </time>
              </DetailItem>
              <DetailItem label="Updated">
                <time dateTime={order.updatedAt}>
                  {formatDateTime(order.updatedAt)}
                </time>
              </DetailItem>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
            <CardDescription>{order.customer.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Name">{order.customer.name}</DetailItem>
              <DetailItem label="Email">
                <span className="break-all">{order.customer.email}</span>
              </DetailItem>
              <DetailItem label="Status">
                <CustomerStatusBadge status={order.customer.status} />
              </DetailItem>
              <DetailItem label="Customer since">
                <time dateTime={order.customer.createdAt}>
                  {formatDateTime(order.customer.createdAt)}
                </time>
              </DetailItem>
            </dl>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Line items</CardTitle>
          <CardDescription>
            {order.items.length} {order.items.length === 1 ? "item" : "items"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
                <TableHead className="text-right">Line total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={`${item.sku}-${index}`}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatUsd(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatUsd(item.quantity * item.unitPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatUsd(order.amount)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
