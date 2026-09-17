"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatChartDay,
  formatCompactAxis,
  formatInteger,
  formatUsd,
} from "@/lib/format";
import type { TimeSeriesPoint } from "@/lib/schemas/analytics";

export type TrendMetricFormat = "currency" | "number";

/** Area for continuous magnitude; bar for discrete daily counts. */
export type TrendChartVariant = "area" | "bar";

type TrendChartCanvasProps = {
  series: TimeSeriesPoint[];
  format: TrendMetricFormat;
  variant?: TrendChartVariant;
};

function tooltipValue(value: number, format: TrendMetricFormat): string {
  return format === "currency" ? formatUsd(value) : formatInteger(value);
}

const CHART_MARGIN = { top: 12, right: 12, left: 4, bottom: 4 } as const;

function ChartAxes({ format }: { format: TrendMetricFormat }) {
  return (
    <>
      <CartesianGrid stroke="var(--border)" vertical={false} />
      <XAxis
        dataKey="date"
        tickFormatter={formatChartDay}
        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
        tickLine={false}
        axisLine={false}
        minTickGap={24}
      />
      <YAxis
        tickFormatter={(value: number) => formatCompactAxis(value, format)}
        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
        tickLine={false}
        axisLine={false}
        width={60}
        tickMargin={4}
      />
    </>
  );
}

function ChartTooltip({ format }: { format: TrendMetricFormat }) {
  return (
    <Tooltip
      isAnimationActive={false}
      formatter={(value) => [
        tooltipValue(Number(value), format),
        format === "currency" ? "Revenue" : "Orders",
      ]}
      labelFormatter={(label) => formatChartDay(String(label))}
      contentStyle={{
        background: "var(--popover)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--elevation-hover)",
        color: "var(--popover-foreground)",
        fontSize: 12,
      }}
      labelStyle={{ color: "var(--muted-foreground)" }}
      itemStyle={{ color: "var(--foreground)" }}
    />
  );
}

export function TrendChartCanvas({
  series,
  format,
  variant = "area",
}: TrendChartCanvasProps) {
  const seriesColor =
    format === "currency" ? "var(--chart-revenue)" : "var(--chart-orders)";

  if (variant === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={series} margin={CHART_MARGIN} barCategoryGap="18%">
          <ChartAxes format={format} />
          <ChartTooltip format={format} />
          <Bar
            dataKey="value"
            fill={seriesColor}
            fillOpacity={0.85}
            radius={[3, 3, 0, 0]}
            maxBarSize={18}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={series} margin={CHART_MARGIN}>
        <ChartAxes format={format} />
        <ChartTooltip format={format} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={seriesColor}
          fill={seriesColor}
          fillOpacity={0.16}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
