import { describe, expect, it } from "vitest";
import { ordersQuerySchema } from "@/lib/schemas/query";
import { orderRecordSchema } from "@/lib/schemas/order";
import { customerSchema } from "@/lib/schemas/customer";

describe("ordersQuerySchema", () => {
  it("applies defaults", () => {
    const query = ordersQuerySchema.parse({});
    expect(query).toEqual({
      q: "",
      page: 1,
      pageSize: 10,
    });
  });

  it("rejects an invalid status", () => {
    const result = ordersQuerySchema.safeParse({ status: "shipped" });
    expect(result.success).toBe(false);
  });

  it("rejects from after to", () => {
    const result = ordersQuerySchema.safeParse({
      from: "2026-09-10",
      to: "2026-09-01",
    });
    expect(result.success).toBe(false);
  });
});

describe("record schemas", () => {
  it("rejects an order whose amount does not match line items", () => {
    const result = orderRecordSchema.safeParse({
      id: "ord_x",
      customerId: "cus_01",
      amount: 10,
      currency: "USD",
      status: "pending",
      createdAt: "2026-09-16T00:00:00.000Z",
      updatedAt: "2026-09-16T00:00:00.000Z",
      items: [
        { sku: "A", name: "A", quantity: 1, unitPrice: 5 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a customer with a bad email", () => {
    const result = customerSchema.safeParse({
      id: "cus_01",
      name: "Acme",
      email: "not-an-email",
      status: "active",
      createdAt: "2026-09-16T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});
