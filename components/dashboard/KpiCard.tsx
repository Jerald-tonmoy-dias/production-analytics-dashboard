import {
  CircleAlert,
  CircleDollarSign,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
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
  {
    icon?: LucideIcon;
    percentMark?: boolean;
    cardClassName: string;
    iconClassName: string;
    hoverBorder: string;
    hoverShadow: string;
  }
> = {
  revenue: {
    icon: CircleDollarSign,
    cardClassName:
      "bg-[#fef6ee] border-amber-200/70 dark:bg-amber-950/20 dark:border-amber-800/30",
    iconClassName:
      "border-amber-100 bg-white text-amber-600 dark:border-amber-800/40 dark:bg-amber-900/60 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white group-hover:border-transparent",
    hoverBorder: "hover:border-amber-400/80 dark:hover:border-amber-600/70",
    hoverShadow: "hover:shadow-xl hover:shadow-amber-500/15",
  },
  orders: {
    icon: ShoppingBag,
    cardClassName:
      "bg-[#eff6ff] border-blue-200/70 dark:bg-blue-950/20 dark:border-blue-800/30",
    iconClassName:
      "border-blue-100 bg-white text-primary dark:border-blue-800/40 dark:bg-blue-900/60 dark:text-blue-400 group-hover:bg-primary group-hover:text-white group-hover:border-transparent",
    hoverBorder: "hover:border-primary dark:hover:border-primary",
    hoverShadow: "hover:shadow-xl hover:shadow-primary/20",
  },
  customers: {
    icon: Users,
    cardClassName:
      "bg-[#fef2f2] border-red-200/60 dark:bg-rose-950/20 dark:border-rose-800/30",
    iconClassName:
      "border-rose-100 bg-white text-rose-500 dark:border-rose-800/40 dark:bg-rose-900/60 dark:text-rose-300 group-hover:bg-rose-500 group-hover:text-white group-hover:border-transparent",
    hoverBorder: "hover:border-rose-400/80 dark:hover:border-rose-600/70",
    hoverShadow: "hover:shadow-xl hover:shadow-rose-500/15",
  },
  conversion: {
    percentMark: true,
    cardClassName:
      "bg-[#f0fdf4] border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-800/30",
    iconClassName:
      "border-emerald-100 bg-white text-emerald-600 dark:border-emerald-800/40 dark:bg-emerald-900/60 dark:text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-transparent",
    hoverBorder:
      "hover:border-emerald-400/80 dark:hover:border-emerald-600/70",
    hoverShadow: "hover:shadow-xl hover:shadow-emerald-500/15",
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
  const Icon = toneStyles?.icon;

  return (
    <div
      className={cn(
        "group relative flex min-w-0 cursor-default flex-col justify-between overflow-hidden rounded-2xl border p-5 shadow-sm select-none",
        "transition-all duration-300 ease-out hover:-translate-y-1.5",
        "motion-reduce:hover:translate-y-0",
        toneStyles?.cardClassName,
        toneStyles?.hoverBorder,
        toneStyles?.hoverShadow,
        className
      )}
      aria-busy={state === "loading" || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
          {state === "loading" ? (
            <Skeleton className="mt-2 h-8 w-28" />
          ) : state === "error" ? (
            <p
              role="alert"
              className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm"
            >
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              Couldn’t load this metric.
            </p>
          ) : (
            <p
              title={formatValue(value, format)}
              className={cn(
                "mt-2 font-mono text-2xl font-bold tracking-tight tabular-nums text-slate-900 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-white",
                isZero && "text-muted-foreground"
              )}
            >
              {formatValue(value, format)}
            </p>
          )}
        </div>
        {toneStyles ? (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-300 ease-out",
              "group-hover:scale-110 group-hover:rotate-6",
              toneStyles.iconClassName
            )}
          >
            {toneStyles.percentMark ? (
              <span className="text-sm font-bold" aria-hidden="true">
                %
              </span>
            ) : Icon ? (
              <Icon className="size-4" aria-hidden="true" />
            ) : null}
          </span>
        ) : null}
      </div>
      {hint && state === "default" ? (
        <p className="mt-4 text-xs text-slate-500 transition-colors group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
