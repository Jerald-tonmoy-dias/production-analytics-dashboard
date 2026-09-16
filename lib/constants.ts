export const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
] as const;

export const CUSTOMER_STATUSES = ["active", "inactive"] as const;

export const ACTIVITY_TYPES = [
  "order.created",
  "order.status_changed",
  "customer.created",
  "payment.received",
] as const;

export const CURRENCY = "USD" as const;

export const CHART_WINDOW_DAYS = 30;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;
export const DEFAULT_ACTIVITY_LIMIT = 8;
export const MAX_ACTIVITY_LIMIT = 50;

/** UTC calendar day the mock dataset is built around. Series tests freeze `now` to this. */
export const DATASET_AS_OF_UTC = "2026-09-16T12:00:00.000Z";
