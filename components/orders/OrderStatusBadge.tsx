import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/schemas/order";

const STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "secondary" | "outline"
> = {
  pending: "outline",
  processing: "secondary",
  completed: "default",
  cancelled: "outline",
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function orderStatusLabel(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge
      variant={STATUS_VARIANT[status]}
      className={status === "cancelled" ? "text-destructive" : undefined}
    >
      {orderStatusLabel(status)}
    </Badge>
  );
}
