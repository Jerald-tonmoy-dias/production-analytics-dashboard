import { CHART_WINDOW_DAYS } from "@/lib/constants";
import { utcDateKey, utcWindowDays } from "@/lib/domain/dates";
import type { AnalyticsSeries, TimeSeriesPoint } from "@/lib/schemas/analytics";
import type { OrderRecord } from "@/lib/schemas/order";

/**
 * Last 30 UTC days of revenue and order-count series, including zero days.
 *
 * Revenue buckets sum **completed** amounts. Order buckets count **all** orders
 * created that UTC day. Orders outside the window are ignored.
 *
 * @param orders - Parsed order records.
 * @param now - Window end clock; defaults to wall time. Tests freeze this.
 */
export function computeSeries(
  orders: readonly OrderRecord[],
  now: Date = new Date()
): AnalyticsSeries {
  const days = utcWindowDays(now, CHART_WINDOW_DAYS);
  const revenueByDay = new Map<string, number>();
  const ordersByDay = new Map<string, number>();

  for (const day of days) {
    revenueByDay.set(day, 0);
    ordersByDay.set(day, 0);
  }

  for (const order of orders) {
    const day = utcDateKey(order.createdAt);
    if (!ordersByDay.has(day)) {
      continue;
    }
    ordersByDay.set(day, (ordersByDay.get(day) ?? 0) + 1);
    if (order.status === "completed") {
      revenueByDay.set(day, (revenueByDay.get(day) ?? 0) + order.amount);
    }
  }

  const toPoints = (values: Map<string, number>): TimeSeriesPoint[] =>
    days.map((date) => ({ date, value: values.get(date) ?? 0 }));

  return {
    windowDays: CHART_WINDOW_DAYS,
    revenue: toPoints(revenueByDay),
    orders: toPoints(ordersByDay),
  };
}

/** UTC Monday (`YYYY-MM-DD`) for the week containing `isoDate`. */
export function utcWeekStart(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  const day = date.getUTCDay();
  const offset = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + offset);
  return utcDateKey(date);
}

/**
 * Roll daily series points into UTC ISO weeks (Mon–Sun), summing values.
 * Point `date` is the week’s Monday. Empty input → empty output.
 */
export function aggregateSeriesByWeek(
  series: readonly TimeSeriesPoint[]
): TimeSeriesPoint[] {
  if (series.length === 0) {
    return [];
  }

  const totals = new Map<string, number>();
  const order: string[] = [];

  for (const point of series) {
    const week = utcWeekStart(point.date);
    if (!totals.has(week)) {
      totals.set(week, 0);
      order.push(week);
    }
    totals.set(week, (totals.get(week) ?? 0) + point.value);
  }

  return order.map((date) => ({ date, value: totals.get(date) ?? 0 }));
}
