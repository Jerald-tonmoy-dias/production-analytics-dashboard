import { computeKpis } from "@/lib/domain/kpis";
import { computeSeries } from "@/lib/domain/series";
import type { Analytics } from "@/lib/schemas/analytics";
import type { Customer } from "@/lib/schemas/customer";
import type { OrderRecord } from "@/lib/schemas/order";

/**
 * Dashboard analytics payload: all-time KPIs plus the 30-day chart series.
 *
 * @param customers - Parsed customer records.
 * @param orders - Parsed order records.
 * @param now - Series window end; defaults to wall time.
 * @returns Shape of `GET /api/analytics` (TASK-005).
 */
export function getAnalytics(
  customers: readonly Customer[],
  orders: readonly OrderRecord[],
  now: Date = new Date()
): Analytics {
  const series = computeSeries(orders, now);
  return {
    kpis: computeKpis(customers, orders),
    series,
  };
}
