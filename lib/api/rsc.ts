import { cache } from "react";
import { getAnalytics as computeAnalytics } from "@/lib/domain/analytics";
import { listActivities } from "@/lib/domain/activities";
import { loadDatasets } from "@/lib/domain/datasets";
import { getOrderDetail, listOrders } from "@/lib/domain/orders";
import {
  ordersSearchParams,
  type GetOrdersParams,
} from "@/lib/api/orders";
import { ValidationError } from "@/lib/errors";
import type { Activity } from "@/lib/schemas/activity";
import type { Analytics } from "@/lib/schemas/analytics";
import type { OrderDetail } from "@/lib/schemas/order";
import {
  parseActivitiesQuery,
  parseOrdersQuery,
  type OrdersListResponse,
} from "@/lib/schemas/query";

/**
 * Dashboard KPIs and 30-day series, same payload as `GET /api/analytics`.
 *
 * Runs in-process so Server Components do not HTTP-fetch this app's own
 * origin (that loop fails on Vercel when `VERCEL_URL` is the deployment host).
 * Wrapped in React `cache()` so the shell layout (Orders badge) and Dashboard
 * page share one compute per request.
 *
 * @returns Analytics DTO (`kpis` + `series`).
 * @throws {InternalError} When mock JSON fails to parse.
 */
export const getAnalytics = cache(async (): Promise<Analytics> => {
  const { customers, orders } = loadDatasets();
  return computeAnalytics(customers, orders);
});

/**
 * Activity feed rows, same payload as `GET /api/activities` unwrapped `{ data }`.
 *
 * @param limit - Max rows (server default 8, max 50).
 * @returns Newest activity rows.
 * @throws {ValidationError} When `limit` is outside 1–50.
 * @throws {InternalError} When mock JSON fails to parse.
 */
export async function getActivities(limit?: number): Promise<Activity[]> {
  const searchParams = new URLSearchParams();
  if (limit != null) {
    searchParams.set("limit", String(limit));
  }
  const query = parseActivitiesQuery(searchParams);
  const { activities } = loadDatasets();
  return listActivities(activities, query.limit);
}

/**
 * Filtered, paginated order list, same payload as `GET /api/orders`.
 *
 * Intended for Dashboard RSC (recent orders). The Orders workspace still
 * calls the HTTP helper so TanStack Query stays a real REST client.
 *
 * @param params - Optional `q`, `status`, `from`, `to`, `page`, `pageSize`.
 * @throws {ValidationError} On invalid filters.
 * @throws {InternalError} When mock JSON fails to parse.
 */
export async function getOrders(
  params: GetOrdersParams = {}
): Promise<OrdersListResponse> {
  const query = parseOrdersQuery(ordersSearchParams(params));
  const { customers, orders } = loadDatasets();
  const { page, pageSize, q, status, from, to } = query;
  return listOrders(
    orders,
    customers,
    { q, status, from, to },
    { page, pageSize }
  );
}

/**
 * Single order with line items and nested customer, same as `GET /api/orders/:id`.
 *
 * @param id - Order id (`ord_…`).
 * @throws {ValidationError} When `id` is empty.
 * @throws {NotFoundError} When the order does not exist.
 * @throws {InternalError} When mock JSON fails to parse.
 */
export async function getOrder(id: string): Promise<OrderDetail> {
  const trimmed = id.trim();
  if (!trimmed) {
    throw new ValidationError("Invalid order id.", [
      { field: "id", issue: "Order id is required." },
    ]);
  }

  const { customers, orders } = loadDatasets();
  return getOrderDetail(orders, customers, trimmed);
}
