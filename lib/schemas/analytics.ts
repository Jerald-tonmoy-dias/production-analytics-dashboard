import { z } from "zod";
import { CHART_WINDOW_DAYS } from "@/lib/constants";

export const timeSeriesPointSchema = z.object({
  date: z.iso.date(),
  value: z.number().finite().nonnegative(),
});

export const analyticsKpisSchema = z.object({
  totalRevenue: z.number().finite().nonnegative(),
  orderCount: z.int().nonnegative(),
  activeCustomers: z.int().nonnegative(),
  conversionRate: z.number().finite().min(0).max(1),
});

export const analyticsSeriesSchema = z.object({
  windowDays: z.literal(CHART_WINDOW_DAYS),
  revenue: z.array(timeSeriesPointSchema),
  orders: z.array(timeSeriesPointSchema),
});

export const analyticsSchema = z.object({
  kpis: analyticsKpisSchema,
  series: analyticsSeriesSchema,
});

export type TimeSeriesPoint = z.infer<typeof timeSeriesPointSchema>;
export type AnalyticsKpis = z.infer<typeof analyticsKpisSchema>;
export type AnalyticsSeries = z.infer<typeof analyticsSeriesSchema>;
export type Analytics = z.infer<typeof analyticsSchema>;
