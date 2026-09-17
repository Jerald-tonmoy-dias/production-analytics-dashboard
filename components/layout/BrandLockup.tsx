import { PRODUCT_NAME, PRODUCT_NAME_MARK } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLockup({ compact = false, className }: BrandLockupProps) {
  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-2",
        compact && "justify-center",
        className
      )}
    >
      <span
        className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-md font-heading text-xs font-semibold"
        title={compact ? PRODUCT_NAME : undefined}
        aria-hidden="true"
      >
        {PRODUCT_NAME_MARK}
      </span>
      {compact ? (
        <span className="sr-only">{PRODUCT_NAME}</span>
      ) : (
        <span className="font-heading min-w-0 truncate text-sm font-semibold tracking-tight">
          {PRODUCT_NAME}
        </span>
      )}
    </span>
  );
}
