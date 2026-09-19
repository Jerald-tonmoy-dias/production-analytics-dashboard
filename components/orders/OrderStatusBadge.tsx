import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/schemas/order";
import { cn } from "@/lib/utils";

/**
 * Soft bordered status pills — HTML mock language (pastel well + border).
 */
const STATUS_CLASS: Record<OrderStatus, string> = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
  processing:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400",
  completed:
    "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
  cancelled:
    "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400",
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function orderStatusLabel(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-semibold", STATUS_CLASS[status])}>
      {orderStatusLabel(status)}
    </Badge>
  );
}
