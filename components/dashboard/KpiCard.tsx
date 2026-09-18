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
    cardClassName: "bg-kpi-revenue ring-transparent",
    iconClassName: "bg-white/70 text-kpi-revenue-fg dark:bg-black/20",
  },
  orders: {
    icon: ShoppingBag,
    cardClassName: "bg-kpi-orders ring-transparent",
    iconClassName: "bg-white/70 text-kpi-orders-fg dark:bg-black/20",
  },
  customers: {
    icon: Users,
    cardClassName: "bg-kpi-customers ring-transparent",
    iconClassName: "bg-white/70 text-kpi-customers-fg dark:bg-black/20",
  },
  conversion: {
    icon: Percent,
    cardClassName: "bg-kpi-conversion ring-transparent",
    iconClassName: "bg-white/70 text-kpi-conversion-fg dark:bg-black/20",
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
        "flex size-10 shrink-0 items-center justify-center rounded-full",
        iconClassName
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
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
        "min-w-0 overflow-visible shadow-[var(--elevation-card)] transition-[box-shadow,transform] duration-[var(--motion-default)] ease-standard",
        "hover:-translate-y-px hover:shadow-[var(--elevation-hover)]",
        toneStyles?.cardClassName,
        className
      )}
      aria-busy={state === "loading" || undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardDescription className="font-medium">{label}</CardDescription>
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
          </div>
          {tone ? <KpiIcon tone={tone} /> : null}
        </div>
      </CardHeader>
    </Card>
  );
}
