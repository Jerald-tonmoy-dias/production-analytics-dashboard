"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  TrendChartVariant,
  TrendMetricFormat,
} from "@/components/dashboard/TrendChartCanvas";
import { formatInteger, formatUsd } from "@/lib/format";
import { showDemoToast } from "@/lib/demo-toast";
import type { TimeSeriesPoint } from "@/lib/schemas/analytics";
import { cn } from "@/lib/utils";

const TrendChartCanvas = dynamic(
  () =>
    import("@/components/dashboard/TrendChartCanvas").then(
      (mod) => mod.TrendChartCanvas
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

type TrendChartProps = {
  title: string;
  description?: string;
  series: TimeSeriesPoint[];
  format: TrendMetricFormat;
  /** Area for continuous magnitude; bar for discrete daily counts. */
  variant?: TrendChartVariant;
  /** Demo chrome: revenue daily/weekly + benchmark, or orders stacked/volume. */
  demoControls?: "revenue" | "orders";
};

function seriesSummary(
  title: string,
  series: TimeSeriesPoint[],
  format: TrendMetricFormat
): string {
  const total = series.reduce((sum, point) => sum + point.value, 0);
  const allZero = series.length > 0 && total === 0;
  if (allZero) {
    return `${title}: ${series.length} days, all values are zero.`;
  }
  const formatted =
    format === "currency" ? formatUsd(total) : formatInteger(total);
  return `${title}: ${series.length} days, total ${formatted}.`;
}

function Segment({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer rounded-lg px-2.5 py-1 text-xs transition",
        active
          ? "bg-card text-primary shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function TrendChart({
  title,
  description,
  series,
  format,
  variant = "area",
  demoControls,
}: TrendChartProps) {
  const empty = series.length === 0;
  const [revenueMode, setRevenueMode] = useState<"daily" | "weekly">("daily");
  const [benchmark, setBenchmark] = useState(false);
  const [ordersMode, setOrdersMode] = useState<"stacked" | "volume">("stacked");

  const subtitle =
    demoControls === "revenue"
      ? revenueMode === "daily"
        ? `${description ?? "Last 30 UTC days"} · Net sales trend`
        : "Weekly view is demo chrome — plot stays daily series"
      : demoControls === "orders"
        ? ordersMode === "stacked"
          ? `${description ?? "Last 30 UTC days"} · Status UI is demo chrome`
          : `${description ?? "Last 30 UTC days"} · Volume view (same series)`
        : description;

  return (
    <Card className="min-w-0 rounded-2xl">
      <CardHeader className="pb-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle>{title}</CardTitle>
            {subtitle ? (
              <CardDescription>{subtitle}</CardDescription>
            ) : null}
          </div>
          {demoControls === "revenue" ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={cn(
                  "cursor-pointer rounded-xl border px-2.5 py-1 text-xs font-medium transition",
                  benchmark
                    ? "border-border bg-muted font-semibold"
                    : "bg-muted/40 text-muted-foreground"
                )}
                onClick={() => {
                  const next = !benchmark;
                  setBenchmark(next);
                  showDemoToast(
                    next
                      ? "Previous-period line is demo-only — not computed from orders."
                      : "Benchmark hidden (demo)."
                  );
                }}
              >
                Previous period
              </button>
              <div className="bg-muted inline-flex rounded-xl p-0.5">
                <Segment
                  active={revenueMode === "daily"}
                  onClick={() => {
                    setRevenueMode("daily");
                    showDemoToast("Daily view — showing real 30-day series.");
                  }}
                >
                  Daily
                </Segment>
                <Segment
                  active={revenueMode === "weekly"}
                  onClick={() => {
                    setRevenueMode("weekly");
                    showDemoToast(
                      "Weekly is demo chrome — chart data stays daily from the API."
                    );
                  }}
                >
                  Weekly
                </Segment>
              </div>
            </div>
          ) : null}
          {demoControls === "orders" ? (
            <div className="bg-muted inline-flex rounded-xl p-0.5">
              <Segment
                active={ordersMode === "stacked"}
                onClick={() => {
                  setOrdersMode("stacked");
                  showDemoToast(
                    "Status breakdown UI is demo-only — bars are total daily counts."
                  );
                }}
              >
                Status breakdown
              </Segment>
              <Segment
                active={ordersMode === "volume"}
                onClick={() => {
                  setOrdersMode("volume");
                  showDemoToast("Volume trend — same real daily order counts.");
                }}
              >
                Volume
              </Segment>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        {empty ? (
          <EmptyState
            title="No chart data"
            description="There is nothing to plot for this window."
            className="border-0 py-8"
          />
        ) : (
          <div className="h-64 w-full min-w-0">
            <p className="sr-only">{seriesSummary(title, series, format)}</p>
            <TrendChartCanvas
              series={series}
              format={format}
              variant={variant}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
