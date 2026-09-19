import Link from "next/link";
import { PRODUCT_NAME, PRODUCT_NAME_MARK } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLockup({ compact = false, className }: BrandLockupProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex min-w-0 items-center gap-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        compact && "justify-center",
        className
      )}
    >
      <span
        className="bg-primary text-primary-foreground group-hover:bg-primary/90 flex size-8 shrink-0 items-center justify-center rounded-xl text-base font-bold shadow-[var(--shadow-brand-sm)] transition-colors"
        title={compact ? PRODUCT_NAME : undefined}
        aria-hidden="true"
      >
        {PRODUCT_NAME_MARK}
      </span>
      {compact ? (
        <span className="sr-only">{PRODUCT_NAME}</span>
      ) : (
        <span className="text-foreground group-hover:text-primary min-w-0 truncate text-[15px] font-bold tracking-tight transition-colors">
          {PRODUCT_NAME}
        </span>
      )}
    </Link>
  );
}
