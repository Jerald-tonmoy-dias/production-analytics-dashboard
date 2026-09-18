import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/schemas/order";
import { cn } from "@/lib/utils";

/**
 * Soft tinted status pills — pastel wells + saturated label text, matching
 * the NETIC-like card language. Avoid solid mid-tone fills that muddy contrast.
 */
const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "border-transparent bg-kpi-revenue text-kpi-revenue-fg",
  processing: "border-transparent bg-kpi-orders text-kpi-orders-fg",
  completed: "border-transparent bg-kpi-conversion text-kpi-conversion-fg",
  cancelled: "border-transparent bg-kpi-customers text-kpi-customers-fg",
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
