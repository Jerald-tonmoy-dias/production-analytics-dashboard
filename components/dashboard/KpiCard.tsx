import {
  CircleAlert,
  CircleDollarSign,
  Percent,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatInteger, formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export type KpiFormat = "currency" | "number" | "percent";

export type KpiCardState = "default" | "loading" | "error";

export type KpiTone = "revenue" | "orders" | "customers" | "conversion";

type KpiCardProps = {
  label: string;
  hint?: string;
  value?: number;
  format: KpiFormat;
  state?: KpiCardState;
  tone?: KpiTone;
  className?: string;
};

const KPI_TONES: Record<
  KpiTone,
  { icon: LucideIcon; cardClassName: string; iconClassName: string }
> = {
  revenue: {
    icon: CircleDollarSign,
    cardClassName:
      "bg-kpi-revenue ring-1 ring-amber-200/70 dark:ring-amber-800/30",
    iconClassName:
      "border border-amber-100 bg-white text-kpi-revenue-fg shadow-sm dark:border-amber-800/40 dark:bg-amber-950/50",
  },
  orders: {
    icon: ShoppingBag,
    cardClassName:
      "bg-kpi-orders ring-1 ring-blue-200/70 dark:ring-blue-800/30",
    iconClassName:
      "border border-blue-100 bg-white text-kpi-orders-fg shadow-sm dark:border-blue-800/40 dark:bg-blue-950/50",
  },
  customers: {
    icon: Users,
    cardClassName:
      "bg-kpi-customers ring-1 ring-rose-200/60 dark:ring-rose-800/30",
    iconClassName:
      "border border-rose-100 bg-white text-kpi-customers-fg shadow-sm dark:border-rose-800/40 dark:bg-rose-950/50",
  },
  conversion: {
    icon: Percent,
    cardClassName:
      "bg-kpi-conversion ring-1 ring-emerald-200/60 dark:ring-emerald-800/30",
    iconClassName:
      "border border-emerald-100 bg-white text-kpi-conversion-fg shadow-sm dark:border-emerald-800/40 dark:bg-emerald-950/50",
  },
};

function formatValue(value: number, format: KpiFormat): string {
  switch (format) {
    case "currency":
      return formatUsd(value);
    case "percent":
      return formatPercent(value);
    default:
      return formatInteger(value);
  }
}

function KpiIcon({ tone }: { tone: KpiTone }) {
  const { icon: Icon, iconClassName } = KPI_TONES[tone];

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full sm:size-10",
        iconClassName
      )}
    >
      <Icon className="size-4 sm:size-5" aria-hidden="true" />
    </span>
  );
}

export function KpiCard({
  label,
  hint,
  value = 0,
  format,
  state = "default",
  tone,
  className,
}: KpiCardProps) {
  const isZero = state === "default" && value === 0;
  const toneStyles = tone ? KPI_TONES[tone] : null;

  return (
    <Card
      size="sm"
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl shadow-[var(--elevation-card)] transition-[box-shadow,transform] duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-[var(--elevation-hover)]",
        "motion-reduce:hover:translate-y-0",
        toneStyles?.cardClassName,
        className
      )}
      aria-busy={state === "loading" || undefined}
    >
      <CardHeader className="min-w-0">
        <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
            <CardDescription className="text-pretty font-medium">
              {label}
            </CardDescription>
            {state === "loading" ? (
              <Skeleton className="mt-1 h-7 w-24 sm:h-8 sm:w-28" />
            ) : state === "error" ? (
              <p
                role="alert"
                className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm"
              >
                <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
                Couldn’t load this metric.
              </p>
            ) : (
              <p
                title={formatValue(value, format)}
                className={cn(
                  "font-mono max-w-full truncate text-lg font-bold tracking-tight tabular-nums sm:text-2xl",
                  isZero && "text-muted-foreground"
                )}
              >
                {formatValue(value, format)}
              </p>
            )}
            {hint && state === "default" ? (
              <p className="text-muted-foreground line-clamp-2 text-xs">{hint}</p>
            ) : null}
          </div>
          {tone ? <KpiIcon tone={tone} /> : null}
        </div>
      </CardHeader>
    </Card>
  );
}
