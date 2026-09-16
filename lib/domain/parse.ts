import { InternalError } from "@/lib/errors";
import { activitiesSchema, type Activity } from "@/lib/schemas/activity";
import { customersSchema, type Customer } from "@/lib/schemas/customer";
import { ordersSchema, type OrderRecord } from "@/lib/schemas/order";

export type Datasets = {
  customers: Customer[];
  orders: OrderRecord[];
  activities: Activity[];
};

/**
 * Unwrap a Zod `safeParse` result or map failure to {@link InternalError}.
 *
 * @throws {InternalError} When the dataset does not match the schema.
 */
function parseOrThrow<T>(
  result: { success: true; data: T } | { success: false },
  message: string
): T {
  if (!result.success) {
    throw new InternalError(message);
  }
  return result.data;
}

/**
 * Parse the customers JSON payload.
 *
 * @param data - Unknown JSON (file import or test fixture).
 * @throws {InternalError} When the payload fails Zod.
 */
export function parseCustomers(data: unknown): Customer[] {
  return parseOrThrow(
    customersSchema.safeParse(data),
    "Corrupt customers dataset."
  );
}

/**
 * Parse the orders JSON payload. Amount must equal the sum of line items.
 *
 * @param data - Unknown JSON (file import or test fixture).
 * @throws {InternalError} When the payload fails Zod.
 */
export function parseOrders(data: unknown): OrderRecord[] {
  return parseOrThrow(ordersSchema.safeParse(data), "Corrupt orders dataset.");
}

/**
 * Parse the activities JSON payload.
 *
 * @param data - Unknown JSON (file import or test fixture).
 * @throws {InternalError} When the payload fails Zod.
 */
export function parseActivities(data: unknown): Activity[] {
  return parseOrThrow(
    activitiesSchema.safeParse(data),
    "Corrupt activities dataset."
  );
}

/**
 * Parse all three datasets and require every order to reference a known customer.
 *
 * @throws {InternalError} On schema failure or a dangling `customerId`.
 */
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
