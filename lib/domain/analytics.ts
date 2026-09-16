import { computeKpis } from "@/lib/domain/kpis";
import { computeSeries } from "@/lib/domain/series";
import type { Analytics } from "@/lib/schemas/analytics";
import type { Customer } from "@/lib/schemas/customer";
import type { OrderRecord } from "@/lib/schemas/order";

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
