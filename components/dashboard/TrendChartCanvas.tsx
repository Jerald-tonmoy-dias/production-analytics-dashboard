"use client";

import {
  Area,
  AreaChart,
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

type TrendChartCanvasProps = {
  series: TimeSeriesPoint[];
  format: TrendMetricFormat;
};

function tooltipValue(value: number, format: TrendMetricFormat): string {
  return format === "currency" ? formatUsd(value) : formatInteger(value);
}

export function TrendChartCanvas({ series, format }: TrendChartCanvasProps) {
  const seriesColor =
    format === "currency" ? "var(--chart-revenue)" : "var(--chart-orders)";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={series}
        margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
      >
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
        <Tooltip
          formatter={(value) => [
            tooltipValue(Number(value), format),
            format === "currency" ? "Revenue" : "Orders",
          ]}
          labelFormatter={(label) => formatChartDay(String(label))}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--popover-foreground)",
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--muted-foreground)" }}
          itemStyle={{ color: "var(--foreground)" }}
        />
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
