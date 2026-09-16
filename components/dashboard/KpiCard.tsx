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
  { icon: LucideIcon; containerClassName: string }
> = {
  revenue: {
    icon: CircleDollarSign,
    containerClassName: "bg-chart-revenue/15 text-chart-revenue",
  },
  orders: {
    icon: ShoppingBag,
    containerClassName: "bg-chart-orders/15 text-chart-orders",
  },
  customers: {
    icon: Users,
    containerClassName: "bg-info/15 text-info",
  },
  conversion: {
    icon: Percent,
    containerClassName: "bg-success/15 text-success",
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
  const { icon: Icon, containerClassName } = KPI_TONES[tone];

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md",
        containerClassName
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
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

  return (
    <Card
      size="sm"
      className={cn(
        "min-w-0 overflow-visible transition-[box-shadow,transform] duration-[var(--motion-default)] ease-standard",
        "hover:-translate-y-px hover:shadow-[var(--elevation-hover)]",
        className
      )}
      aria-busy={state === "loading" || undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardDescription>{label}</CardDescription>
          {tone ? <KpiIcon tone={tone} /> : null}
        </div>
        {state === "loading" ? (
          <Skeleton className="mt-1 h-8 w-28" />
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
            className={cn(
              "font-heading text-2xl font-semibold tracking-tight tabular-nums",
              isZero && "text-muted-foreground"
            )}
          >
            {formatValue(value, format)}
          </p>
        )}
        {hint && state === "default" ? (
          <p className="text-muted-foreground text-xs">{hint}</p>
        ) : null}
      </CardHeader>
    </Card>
  );
}
