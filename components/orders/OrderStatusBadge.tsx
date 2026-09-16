import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/schemas/order";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "border-warning/40 bg-warning/10 text-warning",
  processing: "border-transparent bg-info/15 text-info",
  completed: "border-transparent bg-success text-success-foreground",
  cancelled: "border-destructive/40 bg-transparent text-destructive",
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
