import { CircleAlert } from "lucide-react";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatInteger, formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export type KpiFormat = "currency" | "number" | "percent";

export type KpiCardState = "default" | "loading" | "error";

type KpiCardProps = {
  label: string;
  hint?: string;
  value?: number;
  format: KpiFormat;
  state?: KpiCardState;
  className?: string;
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
  className,
}: KpiCardProps) {
  const isZero = state === "default" && value === 0;

  return (
    <Card
      size="sm"
      className={cn("min-w-0", className)}
      aria-busy={state === "loading" || undefined}
    >
      <CardHeader>
        <CardDescription>{label}</CardDescription>
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
