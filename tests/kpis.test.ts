import { describe, expect, it } from "vitest";
import { DATASET_AS_OF_UTC } from "@/lib/constants";
import { getAnalytics } from "@/lib/domain/analytics";
import { utcDateKey } from "@/lib/domain/dates";
import { loadDatasets } from "@/lib/domain/datasets";
import { computeKpis } from "@/lib/domain/kpis";
import { parseDatasets } from "@/lib/domain/parse";
import { computeSeries } from "@/lib/domain/series";
import type { Customer } from "@/lib/schemas/customer";
import type { OrderRecord } from "@/lib/schemas/order";

const now = new Date(DATASET_AS_OF_UTC);

const customer = (
  overrides: Partial<Customer> & Pick<Customer, "id">
): Customer => ({
  name: overrides.name ?? overrides.id,
  email: overrides.email ?? `${overrides.id}@example.test`,
  status: overrides.status ?? "active",
  createdAt: overrides.createdAt ?? "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const order = (
  overrides: Partial<OrderRecord> & Pick<OrderRecord, "id" | "customerId" | "status">
): OrderRecord => {
  const amount = overrides.amount ?? 100;
  return {
    amount,
    currency: "USD",
    createdAt: overrides.createdAt ?? "2026-09-10T12:00:00.000Z",
    updatedAt: overrides.updatedAt ?? overrides.createdAt ?? "2026-09-10T12:00:00.000Z",
    items: overrides.items ?? [
      { sku: "PLAN-PRO", name: "Pro", quantity: 1, unitPrice: amount },
    ],
    ...overrides,
  };
};

describe("loadDatasets", () => {
  it("parses the mock JSON through Zod", () => {
    const { customers, orders, activities } = loadDatasets();
    expect(customers.length).toBe(40);
    expect(orders.length).toBeGreaterThanOrEqual(80);
    expect(orders.length).toBeLessThanOrEqual(150);
    expect(activities.length).toBeGreaterThan(0);
  });

  it("contains mixed statuses, zero-order customers, and a zero-revenue day", () => {
    const { customers, orders } = loadDatasets();
    const statuses = new Set(orders.map((item) => item.status));
    expect(statuses).toEqual(
      new Set(["pending", "processing", "completed", "cancelled"])
    );

    const orderedCustomerIds = new Set(orders.map((item) => item.customerId));
    const zeroOrderCustomers = customers.filter(
      (item) => !orderedCustomerIds.has(item.id)
    );
    expect(zeroOrderCustomers.length).toBeGreaterThan(0);

    const onZeroRevenueDay = orders.filter(
      (item) => utcDateKey(item.createdAt) === "2026-09-04"
    );
    expect(onZeroRevenueDay.length).toBeGreaterThan(0);
    expect(onZeroRevenueDay.every((item) => item.status !== "completed")).toBe(
      true
    );

    const onEmptyDay = orders.filter(
      (item) => utcDateKey(item.createdAt) === "2026-09-03"
    );
    expect(onEmptyDay).toHaveLength(0);
  });

  it("rejects an order that points at a missing customer", () => {
    const { customers, orders, activities } = loadDatasets();
    expect(() =>
      parseDatasets({
        customers,
        orders: [{ ...orders[0], customerId: "cus_missing" }],
        activities,
      })
    ).toThrow(/unknown customer/);
  });
});

describe("computeKpis", () => {
  it("returns conversion 0 when there are no customers", () => {
    const kpis = computeKpis([], [
      order({ id: "ord_1", customerId: "cus_1", status: "completed", amount: 50 }),
    ]);
    expect(kpis.conversionRate).toBe(0);
    expect(kpis.totalRevenue).toBe(50);
  });

  it("counts only completed orders toward revenue and conversion", () => {
    const customers = [
      customer({ id: "cus_1" }),
      customer({ id: "cus_2" }),
      customer({ id: "cus_3", status: "inactive" }),
    ];
    const orders = [
      order({ id: "ord_1", customerId: "cus_1", status: "completed", amount: 40 }),
      order({ id: "ord_2", customerId: "cus_1", status: "completed", amount: 10 }),
      order({ id: "ord_3", customerId: "cus_2", status: "pending", amount: 999 }),
      order({ id: "ord_4", customerId: "cus_3", status: "cancelled", amount: 5 }),
    ];

    expect(computeKpis(customers, orders)).toEqual({
      totalRevenue: 50,
      orderCount: 4,
      activeCustomers: 2,
      conversionRate: 1 / 3,
    });
  });
});

describe("computeSeries", () => {
  it("emits 30 UTC days including zeros and completed-only revenue", () => {
    const series = computeSeries(
      [
        order({
          id: "ord_1",
          customerId: "cus_1",
          status: "completed",
          amount: 80,
          createdAt: "2026-09-16T01:00:00.000Z",
          updatedAt: "2026-09-16T01:00:00.000Z",
        }),
        order({
          id: "ord_2",
          customerId: "cus_1",
          status: "pending",
          amount: 40,
          createdAt: "2026-09-16T02:00:00.000Z",
          updatedAt: "2026-09-16T02:00:00.000Z",
        }),
        order({
          id: "ord_3",
          customerId: "cus_1",
          status: "completed",
          amount: 10,
          createdAt: "2026-08-01T00:00:00.000Z",
          updatedAt: "2026-08-01T00:00:00.000Z",
        }),
      ],
      now
    );

    expect(series.windowDays).toBe(30);
    expect(series.revenue).toHaveLength(30);
    expect(series.orders).toHaveLength(30);
    expect(series.revenue[0]?.date).toBe("2026-08-18");
    expect(series.revenue.at(-1)?.date).toBe("2026-09-16");

    const todayRevenue = series.revenue.find((point) => point.date === "2026-09-16");
    const todayOrders = series.orders.find((point) => point.date === "2026-09-16");
    const emptyDay = series.revenue.find((point) => point.date === "2026-09-03");

    expect(todayRevenue?.value).toBe(80);
    expect(todayOrders?.value).toBe(2);
    expect(emptyDay?.value).toBe(0);
  });
});

describe("getAnalytics", () => {
  it("composes kpis and series for the mock dataset", () => {
    const { customers, orders } = loadDatasets();
    const analytics = getAnalytics(customers, orders, now);
    expect(analytics.kpis.orderCount).toBe(orders.length);
    expect(analytics.series.orders).toHaveLength(30);
    const zeroRevenue = analytics.series.revenue.find(
      (point) => point.date === "2026-09-04"
    );
    expect(zeroRevenue?.value).toBe(0);
  });
});
