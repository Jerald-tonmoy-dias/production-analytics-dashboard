import { Badge } from "@/components/ui/badge";
import type { CustomerStatus } from "@/lib/schemas/customer";
import { cn } from "@/lib/utils";

/**
 * Soft tinted customer status pills — same pastel-well language as order status.
 */
const STATUS_CLASS: Record<CustomerStatus, string> = {
  active: "border-transparent bg-kpi-conversion text-kpi-conversion-fg",
  inactive: "border-transparent bg-kpi-customers text-kpi-customers-fg",
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
