import { describe, expect, it } from "vitest";
import {
  getActivities,
  getAnalytics,
  getOrder,
  getOrders,
} from "@/lib/api/rsc";
import { NotFoundError, ValidationError } from "@/lib/errors";

describe("lib/api/rsc", () => {
  it("returns analytics KPIs from the mock dataset", async () => {
    const analytics = await getAnalytics();
    expect(analytics.kpis.orderCount).toBe(120);
    expect(analytics.series.windowDays).toBe(30);
    expect(analytics.series.revenue).toHaveLength(30);
  });

  it("returns the default activity feed length", async () => {
    await expect(getActivities()).resolves.toHaveLength(8);
  });

  it("rejects an out-of-range activity limit", async () => {
    await expect(getActivities(0)).rejects.toBeInstanceOf(ValidationError);
  });

  it("pages recent orders for the dashboard", async () => {
    const page = await getOrders({ page: 1, pageSize: 5 });
    expect(page.data).toHaveLength(5);
    expect(page.pagination).toEqual({
      page: 1,
      pageSize: 5,
      total: 120,
      totalPages: 24,
    });
  });

  it("returns a known order", async () => {
    const order = await getOrder("ord_1001");
    expect(order.id).toBe("ord_1001");
    expect(order.customer.id).toBe("cus_01");
  });

  it("throws NotFoundError for a missing order", async () => {
    await expect(getOrder("ord_missing")).rejects.toBeInstanceOf(NotFoundError);
  });
});
