import { InternalError } from "@/lib/errors";
import { activitiesSchema, type Activity } from "@/lib/schemas/activity";
import { customersSchema, type Customer } from "@/lib/schemas/customer";
import { ordersSchema, type OrderRecord } from "@/lib/schemas/order";

export type Datasets = {
  customers: Customer[];
  orders: OrderRecord[];
  activities: Activity[];
};

function parseOrThrow<T>(
  result: { success: true; data: T } | { success: false },
  message: string
): T {
  if (!result.success) {
    throw new InternalError(message);
  }
  return result.data;
}

export function parseCustomers(data: unknown): Customer[] {
  return parseOrThrow(
    customersSchema.safeParse(data),
    "Corrupt customers dataset."
  );
}

export function parseOrders(data: unknown): OrderRecord[] {
  return parseOrThrow(ordersSchema.safeParse(data), "Corrupt orders dataset.");
}

export function parseActivities(data: unknown): Activity[] {
  return parseOrThrow(
    activitiesSchema.safeParse(data),
    "Corrupt activities dataset."
  );
}

export function parseDatasets(raw: {
  customers: unknown;
  orders: unknown;
  activities: unknown;
}): Datasets {
  const customers = parseCustomers(raw.customers);
  const orders = parseOrders(raw.orders);
  const activities = parseActivities(raw.activities);

  const customerIds = new Set(customers.map((customer) => customer.id));
  const missing = orders.find((order) => !customerIds.has(order.customerId));
  if (missing) {
    throw new InternalError(
      `Order ${missing.id} references unknown customer ${missing.customerId}.`
    );
  }

  return { customers, orders, activities };
}
