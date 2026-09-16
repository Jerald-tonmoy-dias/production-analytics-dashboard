import { describe, expect, it } from "vitest";
import { GET as getAnalyticsRoute } from "@/app/api/analytics/route";
import { GET as getActivitiesRoute } from "@/app/api/activities/route";
import { GET as getOrderRoute } from "@/app/api/orders/[id]/route";
import { GET as getOrdersRoute } from "@/app/api/orders/route";

function request(path: string): Request {
  return new Request(`http://localhost:3000${path}`);
}

describe("GET /api/analytics", () => {
  it("returns KPIs and a 30-day series", async () => {
    const response = await getAnalyticsRoute();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.kpis.orderCount).toBe(120);
    expect(body.series.windowDays).toBe(30);
    expect(body.series.revenue).toHaveLength(30);
    expect(body.series.orders).toHaveLength(30);
  });
});

describe("GET /api/orders", () => {
  it("returns a paginated list with defaults", async () => {
    const response = await getOrdersRoute(request("/api/orders"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(10);
    expect(body.pagination).toEqual({
      page: 1,
      pageSize: 10,
      total: 120,
      totalPages: 12,
    });
  });

  it("returns 400 for an invalid status", async () => {
    const response = await getOrdersRoute(
      request("/api/orders?status=shipped")
    );
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.message).toBe("Invalid status filter.");
    expect(body.error.details[0].field).toBe("status");
  });
});

describe("GET /api/orders/:id", () => {
  it("returns order detail for a known id", async () => {
    const response = await getOrderRoute(request("/api/orders/ord_1001"), {
      params: Promise.resolve({ id: "ord_1001" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe("ord_1001");
    expect(body.customer.id).toBe("cus_01");
    expect(Array.isArray(body.items)).toBe(true);
  });

  it("returns 404 for an unknown id", async () => {
    const response = await getOrderRoute(request("/api/orders/ord_missing"), {
      params: Promise.resolve({ id: "ord_missing" }),
    });
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toEqual({
      code: "NOT_FOUND",
      message: "Order ord_missing was not found.",
    });
  });
});

describe("GET /api/activities", () => {
  it("returns the default feed length", async () => {
    const response = await getActivitiesRoute(request("/api/activities"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(8);
  });
});
