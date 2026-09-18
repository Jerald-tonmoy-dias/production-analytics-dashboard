import { describe, expect, it } from "vitest";
import { listActivities } from "@/lib/domain/activities";
import { loadDatasets } from "@/lib/domain/datasets";
import {
  filterOrders,
  getOrderDetail,
  paginate,
} from "@/lib/domain/orders";
import { NotFoundError } from "@/lib/errors";
import type { OrderRecord } from "@/lib/schemas/order";
import type { Customer } from "@/lib/schemas/customer";

const customers: Customer[] = [
  {
    id: "cus_12",
    name: "Acme Labs",
    email: "ops@acme.test",
    status: "active",
    createdAt: "2025-11-02T00:00:00.000Z",
  },
  {
    id: "cus_13",
    name: "Northwind Ops",
    email: "hello@northwind.test",
    status: "active",
    createdAt: "2025-12-01T00:00:00.000Z",
  },
];

const orders: OrderRecord[] = [
  {
    id: "ord_1001",
    customerId: "cus_12",
    amount: 1490,
    currency: "USD",
    status: "pending",
    createdAt: "2026-09-10T23:00:00.000Z",
    updatedAt: "2026-09-10T23:00:00.000Z",
    items: [
      { sku: "PLAN-PRO", name: "Pro plan — annual", quantity: 1, unitPrice: 1490 },
    ],
  },
  {
    id: "ord_1002",
    customerId: "cus_13",
    amount: 49,
    currency: "USD",
    status: "completed",
    createdAt: "2026-09-11T00:00:00.000Z",
    updatedAt: "2026-09-11T04:00:00.000Z",
    items: [
      { sku: "PLAN-START", name: "Starter plan — monthly", quantity: 1, unitPrice: 49 },
    ],
  },
  {
    id: "ord_1003",
    customerId: "cus_12",
    amount: 18,
    currency: "USD",
    status: "cancelled",
    createdAt: "2026-09-12T12:00:00.000Z",
    updatedAt: "2026-09-12T15:00:00.000Z",
    items: [{ sku: "ADDON-SEAT", name: "Extra seat", quantity: 1, unitPrice: 18 }],
  },
];

describe("filterOrders", () => {
  it("is inclusive on from and to UTC calendar days", () => {
    const sameDay = filterOrders(orders, customers, {
      from: "2026-09-10",
      to: "2026-09-10",
    });
    expect(sameDay.map((item) => item.id)).toEqual(["ord_1001"]);

    const span = filterOrders(orders, customers, {
      from: "2026-09-10",
      to: "2026-09-11",
    });
    expect(span.map((item) => item.id)).toEqual(["ord_1002", "ord_1001"]);
  });

  it("matches q case-insensitively on id, name, email, and product", () => {
    expect(filterOrders(orders, customers, { q: "ORD_1001" })).toHaveLength(1);
    expect(filterOrders(orders, customers, { q: "acme" }).every((item) => item.customerId === "cus_12")).toBe(true);
    expect(filterOrders(orders, customers, { q: "HELLO@NORTHWIND" })).toHaveLength(1);
    expect(filterOrders(orders, customers, { q: "starter plan" }).map((item) => item.id)).toEqual([
      "ord_1002",
    ]);
    expect(filterOrders(orders, customers, { q: "PLAN-PRO" }).map((item) => item.id)).toEqual([
      "ord_1001",
    ]);
  });

  it("exposes the primary product on list rows", () => {
    const [newest] = filterOrders(orders, customers);
    expect(newest).toMatchObject({
      id: "ord_1003",
      productName: "Extra seat",
      productSku: "ADDON-SEAT",
      itemCount: 1,
    });
  });

  it("filters by status and sorts createdAt descending", () => {
    const pending = filterOrders(orders, customers, { status: "pending" });
    expect(pending.map((item) => item.id)).toEqual(["ord_1001"]);

    expect(filterOrders(orders, customers).map((item) => item.id)).toEqual([
      "ord_1003",
      "ord_1002",
      "ord_1001",
    ]);
  });
});

describe("paginate", () => {
  it("returns empty data when the list is empty", () => {
    expect(paginate([], { page: 1, pageSize: 10 })).toEqual({
      data: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    });
  });

  it("does not clamp a page past totalPages", () => {
    const items = [1, 2, 3, 4, 5];
    expect(paginate(items, { page: 4, pageSize: 2 })).toEqual({
      data: [],
      pagination: { page: 4, pageSize: 2, total: 5, totalPages: 3 },
    });
  });
});

describe("getOrderDetail", () => {
  it("joins the customer and line items", () => {
    const detail = getOrderDetail(orders, customers, "ord_1001");
    expect(detail.customerName).toBe("Acme Labs");
    expect(detail.productName).toBe("Pro plan — annual");
    expect(detail.productSku).toBe("PLAN-PRO");
    expect(detail.itemCount).toBe(1);
    expect(detail.customer).toEqual(customers[0]);
    expect(detail.items).toHaveLength(1);
  });

  it("throws NotFoundError for an unknown id", () => {
    expect(() => getOrderDetail(orders, customers, "ord_missing")).toThrow(
      NotFoundError
    );
  });
});

describe("listActivities", () => {
  it("returns the newest rows up to the limit", () => {
    const { activities } = loadDatasets();
    const listed = listActivities(activities, 8);
    expect(listed).toHaveLength(8);
    for (let i = 1; i < listed.length; i += 1) {
      expect(listed[i - 1]!.createdAt >= listed[i]!.createdAt).toBe(true);
    }
  });
});
