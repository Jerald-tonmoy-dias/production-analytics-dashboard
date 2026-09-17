import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/schemas/order";
import { cn } from "@/lib/utils";

/** Filled semantic badges — status text stays for accessibility. */
const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "border-transparent bg-warning text-warning-foreground",
  processing: "border-transparent bg-info text-info-foreground",
  completed: "border-transparent bg-success text-success-foreground",
  cancelled: "border-transparent bg-destructive text-white",
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function orderStatusLabel(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(STATUS_CLASS[status])}>
      {orderStatusLabel(status)}
    </Badge>
  );
}
