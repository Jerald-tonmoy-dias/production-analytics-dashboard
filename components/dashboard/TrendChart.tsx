"use client";

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
import type { TrendMetricFormat } from "@/components/dashboard/TrendChartCanvas";
import { formatInteger, formatUsd } from "@/lib/format";
import type { TimeSeriesPoint } from "@/lib/schemas/analytics";

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

export function TrendChart({
  title,
  description,
  series,
  format,
}: TrendChartProps) {
  const empty = series.length === 0;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        {empty ? (
          <EmptyState
            title="No chart data"
            description="There is nothing to plot for this window."
            className="border-0 py-8"
          />
        ) : (
          <div className="h-64 w-full min-w-0">
            <p className="sr-only">{seriesSummary(title, series, format)}</p>
            <TrendChartCanvas series={series} format={format} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
