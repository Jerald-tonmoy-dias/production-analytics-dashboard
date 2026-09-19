import { Badge } from "@/components/ui/badge";
import type { CustomerStatus } from "@/lib/schemas/customer";
import { cn } from "@/lib/utils";

/**
 * Soft tinted customer status pills — same pastel-well language as order status.
 */
const STATUS_CLASS: Record<CustomerStatus, string> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
  inactive:
    "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400",
};

type CustomerStatusBadgeProps = {
  status: CustomerStatus;
};

export function customerStatusLabel(status: CustomerStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(STATUS_CLASS[status])}>
      {customerStatusLabel(status)}
    </Badge>
  );
}
