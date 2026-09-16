import { NotFoundError } from "@/lib/errors";
import { utcDayEnd, utcDayStart } from "@/lib/domain/dates";
import type { Customer } from "@/lib/schemas/customer";
import type {
  OrderDetail,
  OrderListItem,
  OrderRecord,
  OrderStatus,
} from "@/lib/schemas/order";
import type { Pagination } from "@/lib/schemas/query";

export type OrderFilters = {
  q?: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
};

export type PageRequest = {
  page: number;
  pageSize: number;
};

function customerById(
  customers: readonly Customer[]
): Map<string, Customer> {
  return new Map(customers.map((customer) => [customer.id, customer]));
}

export function toOrderListItem(
  order: OrderRecord,
  customer: Customer
): OrderListItem {
  return {
    id: order.id,
    customerId: order.customerId,
    customerName: customer.name,
    customerEmail: customer.email,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    createdAt: order.createdAt,
  };
}

export function filterOrders(
  orders: readonly OrderRecord[],
  customers: readonly Customer[],
  filters: OrderFilters = {}
): OrderListItem[] {
  const customersMap = customerById(customers);
  const query = filters.q?.trim().toLowerCase() ?? "";
  const fromTime = filters.from ? utcDayStart(filters.from).getTime() : undefined;
  const toTime = filters.to ? utcDayEnd(filters.to).getTime() : undefined;

  const items: OrderListItem[] = [];

  for (const order of orders) {
    const customer = customersMap.get(order.customerId);
    if (!customer) {
      continue;
    }

    if (filters.status && order.status !== filters.status) {
      continue;
    }

    const created = new Date(order.createdAt).getTime();
    if (fromTime !== undefined && created < fromTime) {
      continue;
    }
    if (toTime !== undefined && created > toTime) {
      continue;
    }

    const listItem = toOrderListItem(order, customer);
    if (query) {
      const haystack =
        `${listItem.id} ${listItem.customerName} ${listItem.customerEmail}`.toLowerCase();
      if (!haystack.includes(query)) {
        continue;
      }
    }

    items.push(listItem);
  }

  items.sort((left, right) => {
    const byDate = right.createdAt.localeCompare(left.createdAt);
    return byDate !== 0 ? byDate : right.id.localeCompare(left.id);
  });

  return items;
}

export function paginate<T>(
  items: readonly T[],
  { page, pageSize }: PageRequest
): { data: T[]; pagination: Pagination } {
  const total = items.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = start >= total ? [] : items.slice(start, start + pageSize);

  return {
    data,
    pagination: { page, pageSize, total, totalPages },
  };
}

export function listOrders(
  orders: readonly OrderRecord[],
  customers: readonly Customer[],
  filters: OrderFilters,
  page: PageRequest
): { data: OrderListItem[]; pagination: Pagination } {
  return paginate(filterOrders(orders, customers, filters), page);
}

export function getOrderDetail(
  orders: readonly OrderRecord[],
  customers: readonly Customer[],
  id: string
): OrderDetail {
  const order = orders.find((candidate) => candidate.id === id);
  if (!order) {
    throw new NotFoundError(`Order ${id} was not found.`);
  }

  const customer = customers.find(
    (candidate) => candidate.id === order.customerId
  );
  if (!customer) {
    throw new NotFoundError(`Customer ${order.customerId} was not found.`);
  }

  return {
    ...toOrderListItem(order, customer),
    updatedAt: order.updatedAt,
    items: order.items,
    customer,
  };
}
