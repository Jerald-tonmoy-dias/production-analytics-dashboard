import type { OrderStatus } from "@/lib/schemas/order";
import { parseOrdersQuery } from "@/lib/schemas/query";

/** URL-backed orders workspace filters (`q`, `status`, `from`, `to`, `page`). */
export type OrdersUrlState = {
  q: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
  page: number;
};

/**
 * Read orders workspace filters from the current query string.
 *
 * Invalid params fall back to defaults so a bad URL does not crash the page.
 *
 * @param searchParams - `useSearchParams()` or `new URLSearchParams(window.location.search)`.
 */
export function readOrdersUrl(searchParams: URLSearchParams): OrdersUrlState {
  try {
    const parsed = parseOrdersQuery(searchParams);
    return {
      q: parsed.q,
      status: parsed.status,
      from: parsed.from,
      to: parsed.to,
      page: parsed.page,
    };
  } catch {
    return { q: "", page: 1 };
  }
}

/**
 * Serialize orders filters to a query string. Omits empty `q`, unset filters,
 * and `page=1` so the default workspace URL stays `/orders`.
 *
 * @param state - Current filters and page.
 */
export function writeOrdersSearch(state: OrdersUrlState): string {
  const search = new URLSearchParams();
  const q = state.q.trim();
  if (q) {
    search.set("q", q);
  }
  if (state.status) {
    search.set("status", state.status);
  }
  if (state.from) {
    search.set("from", state.from);
  }
  if (state.to) {
    search.set("to", state.to);
  }
  if (state.page > 1) {
    search.set("page", String(state.page));
  }
  return search.toString();
}

/**
 * Whether any list filter is active (not pagination).
 *
 * @param state - URL filters.
 */
export function hasOrdersFilters(
  state: Pick<OrdersUrlState, "q" | "status" | "from" | "to">
): boolean {
  return Boolean(state.q.trim() || state.status || state.from || state.to);
}
