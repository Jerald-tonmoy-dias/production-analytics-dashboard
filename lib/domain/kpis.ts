import type { AnalyticsKpis } from "@/lib/schemas/analytics";
import type { Customer } from "@/lib/schemas/customer";
import type { OrderRecord } from "@/lib/schemas/order";

export function computeKpis(
  customers: readonly Customer[],
  orders: readonly OrderRecord[]
): AnalyticsKpis {
  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.amount, 0);

  const convertedCustomerIds = new Set(
    orders
      .filter((order) => order.status === "completed")
      .map((order) => order.customerId)
  );

  return {
    totalRevenue,
    orderCount: orders.length,
    activeCustomers: customers.filter((customer) => customer.status === "active")
      .length,
    conversionRate:
      customers.length === 0
        ? 0
        : convertedCustomerIds.size / customers.length,
  };
}
