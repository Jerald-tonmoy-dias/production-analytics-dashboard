import { apiGet } from "@/lib/api/request";
import { ValidationError } from "@/lib/errors";
import { orderDetailSchema, type OrderDetail, type OrderStatus } from "@/lib/schemas/order";
import {
  ordersListResponseSchema,
  type OrdersListResponse,
} from "@/lib/schemas/query";

/** Query fields for `GET /api/orders`. Omitted keys use server defaults. */
export type GetOrdersParams = {
  q?: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

function ordersSearchParams(params: GetOrdersParams): URLSearchParams {
  const search = new URLSearchParams();
  if (params.q) {
    search.set("q", params.q);
  }
  if (params.status) {
    search.set("status", params.status);
  }
  if (params.from) {
    search.set("from", params.from);
  }
  if (params.to) {
    search.set("to", params.to);
  }
  if (params.page != null) {
    search.set("page", String(params.page));
  }
  if (params.pageSize != null) {
    search.set("pageSize", String(params.pageSize));
  }
  return search;
}

/**
 * Load a filtered, paginated order list (`GET /api/orders`).
 *
 * Intended for TanStack Query on the Orders workspace. RSC cache tag: `orders`.
 *
 * @param params - Optional `q`, `status`, `from`, `to`, `page`, `pageSize`.
 * @throws {ValidationError} On `400` (invalid filters).
 * @throws {InternalError} On transport failure or an unexpected payload.
 */
export async function getOrders(
  params: GetOrdersParams = {}
): Promise<OrdersListResponse> {
  const searchParams = ordersSearchParams(params);
  return apiGet("/api/orders", ordersListResponseSchema, {
    searchParams: searchParams.toString() ? searchParams : undefined,
    tags: ["orders"],
  });
}

/**
 * Load a single order with line items and nested customer (`GET /api/orders/:id`).
 *
 * RSC cache tag: `orders`.
 *
 * @param id - Order id (`ord_…`).
 * @throws {ValidationError} When `id` is empty.
 * @throws {NotFoundError} When the order does not exist.
 * @throws {InternalError} On transport failure or an unexpected payload.
 */
export async function getOrder(id: string): Promise<OrderDetail> {
  const trimmed = id.trim();
  if (!trimmed) {
    throw new ValidationError("Invalid order id.", [
      { field: "id", issue: "Order id is required." },
    ]);
  }

  return apiGet(
    `/api/orders/${encodeURIComponent(trimmed)}`,
    orderDetailSchema,
    { tags: ["orders"] }
  );
}
