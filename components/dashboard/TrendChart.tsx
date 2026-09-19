"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  TrendChartVariant,
  TrendMetricFormat,
} from "@/components/dashboard/TrendChartCanvas";
import { formatInteger, formatUsd } from "@/lib/format";
import { aggregateSeriesByWeek } from "@/lib/domain/series";
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
    loading: () => <Skeleton className="h-60 w-full" />,
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
  /** Optional static total badge (orders chart). */
  totalBadge?: string;
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

function seriesStats(
  series: TimeSeriesPoint[],
  format: TrendMetricFormat,
  grain: "daily" | "weekly" = "daily"
) {
  if (series.length === 0) {
    return null;
  }
  const total = series.reduce((sum, point) => sum + point.value, 0);
  const avg = total / series.length;
  let peak = series[0]!;
  for (const point of series) {
    if (point.value > peak.value) {
      peak = point;
    }
  }
  const peakDate = new Date(`${peak.date}T00:00:00.000Z`);
  const peakLabel = peakDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  if (format === "currency") {
    const peakShort =
      peak.value >= 1000
        ? `$${(peak.value / 1000).toFixed(1)}k`
        : formatUsd(peak.value);
    return {
      left: [
        {
          label: grain === "weekly" ? "Avg weekly" : "Avg daily",
          value: formatUsd(Math.round(avg)),
        },
        {
          label: grain === "weekly" ? "Peak week" : "Peak day",
          value: `${peakLabel} (${peakShort})`,
        },
      ],
    };
  }
  return {
    left: [
      {
        label: grain === "weekly" ? "Weekly velocity" : "Daily velocity",
        value:
          grain === "weekly"
            ? `${avg.toFixed(1)} orders/wk`
            : `${avg.toFixed(1)} orders`,
      },
    ],
  };
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
        "cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition",
        active
          ? "bg-white text-primary shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-slate-700 dark:text-white"
          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
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
  totalBadge,
}: TrendChartProps) {
  const empty = series.length === 0;
  const [revenueMode, setRevenueMode] = useState<"daily" | "weekly">("daily");
  const [benchmark, setBenchmark] = useState(false);
  const [ordersMode, setOrdersMode] = useState<"stacked" | "volume">("stacked");

  const plottedSeries =
    demoControls === "revenue" && revenueMode === "weekly"
      ? aggregateSeriesByWeek(series)
      : series;
  const grain =
    demoControls === "revenue" && revenueMode === "weekly" ? "weekly" : "daily";
  const stats = seriesStats(plottedSeries, format, grain);

  const subtitle =
    demoControls === "revenue"
      ? revenueMode === "daily"
        ? `${description ?? "Last 30 UTC days"} · Net sales trend`
        : `${description ?? "Last 30 UTC days"} · Weekly totals (rolled up from daily)`
      : demoControls === "orders"
        ? ordersMode === "stacked"
          ? `${description ?? "Last 30 UTC days"} · Daily status breakdown`
          : `${description ?? "Last 30 UTC days"} · Volume trend`
        : description;

  return (
    <div className="bg-card flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200/80 p-6 shadow-sm dark:border-slate-800">
      <div>
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>
              {demoControls === "revenue" ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400"
                  title="Demo chrome — not computed from prior window"
                >
                  <TrendingUp className="size-3" aria-hidden="true" />
                  +14.8%
                </span>
              ) : null}
              {totalBadge ? (
                <span className="border-primary/30 bg-primary/5 text-primary inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold">
                  {totalBadge}
                </span>
              ) : null}
            </div>
            {subtitle ? (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>
          {demoControls === "revenue" ? (
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-medium transition",
                  benchmark
                    ? "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200"
                    : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}
                title="Compare against previous 30-day window (demo)"
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
                <span
                  className="h-0.5 w-2 rounded-full border-t border-dashed border-slate-500 bg-slate-400"
                  aria-hidden="true"
                />
                <span className="text-[11px]">vs Previous</span>
              </button>
              <div className="inline-flex items-center rounded-xl border border-slate-200/80 bg-slate-100 p-0.5 dark:border-slate-700/80 dark:bg-slate-800">
                <Segment
                  active={revenueMode === "daily"}
                  onClick={() => setRevenueMode("daily")}
                >
                  Daily
                </Segment>
                <Segment
                  active={revenueMode === "weekly"}
                  onClick={() => setRevenueMode("weekly")}
                >
                  Weekly
                </Segment>
              </div>
            </div>
          ) : null}
          {demoControls === "orders" ? (
            <div className="inline-flex items-center self-start rounded-xl border border-slate-200/80 bg-slate-100 p-0.5 sm:self-auto dark:border-slate-700/80 dark:bg-slate-800">
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
                Volume trend
              </Segment>
            </div>
          ) : null}
        </div>

        {empty ? (
          <EmptyState
            title="No chart data"
            description="There is nothing to plot for this window."
            className="border-0 py-8"
          />
        ) : (
          <div className="relative h-60 w-full min-w-0">
            <p className="sr-only">
              {seriesSummary(title, plottedSeries, format)}
            </p>
            <TrendChartCanvas
              series={plottedSeries}
              format={format}
              variant={variant}
            />
          </div>
        )}
      </div>

      {!empty && stats ? (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            {demoControls === "orders" ? (
              <div>
                <span className="text-slate-400 dark:text-slate-500">
                  Fulfillment:{" "}
                </span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  80.0%
                </span>
              </div>
            ) : null}
            {stats.left.map((item) => (
              <div key={item.label}>
                <span className="text-slate-400 dark:text-slate-500">
                  {item.label}:{" "}
                </span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            {demoControls === "revenue" ? (
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-amber-500" />
                <span>Current</span>
              </div>
            ) : null}
            {demoControls === "orders" ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="bg-primary size-2.5 rounded-sm" />
                  <span>Completed</span>
                </div>
                <div className="hidden items-center gap-1.5 sm:flex">
                  <span className="size-2.5 rounded-sm bg-blue-300" />
                  <span>Processing</span>
                </div>
                <div className="hidden items-center gap-1.5 md:flex">
                  <span className="size-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />
                  <span>Cancelled/Pending</span>
                </div>
              </>
            ) : null}
            {benchmark ? (
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-2.5 border-t border-dashed border-slate-500 bg-slate-400" />
                <span>Previous</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
