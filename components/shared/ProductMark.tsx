import { customerInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProductMarkProps = {
  name: string;
  className?: string;
};

/**
 * Initials mark for a product cell. Presentation only — mock data has no
 * product image URLs, so we do not invent remote assets.
 */
export function ProductMark({ name, className }: ProductMarkProps) {
  return (
    <span
      className={cn(
        "bg-kpi-orders text-kpi-orders-fg flex size-8 shrink-0 items-center justify-center rounded-lg text-[0.65rem] font-semibold tabular-nums",
        className
      )}
      aria-hidden="true"
    >
      {customerInitials(name)}
    </span>
  );
}
