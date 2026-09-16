import { z } from "zod";
import {
  DEFAULT_ACTIVITY_LIMIT,
  DEFAULT_PAGE_SIZE,
  MAX_ACTIVITY_LIMIT,
  MAX_PAGE_SIZE,
} from "@/lib/constants";
import { ValidationError, type ErrorDetail } from "@/lib/errors";
import { orderListItemSchema, orderStatusSchema } from "@/lib/schemas/order";

export const ordersQuerySchema = z
  .object({
    q: z.string().default(""),
    status: orderStatusSchema.optional(),
    from: z.iso.date().optional(),
    to: z.iso.date().optional(),
    page: z.int().min(1).default(1),
    pageSize: z.int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  })
  .refine((query) => !query.from || !query.to || query.from <= query.to, {
    message: "from must be on or before to",
    path: ["from"],
  });

export const activitiesQuerySchema = z.object({
  limit: z
    .int()
    .min(1)
    .max(MAX_ACTIVITY_LIMIT)
    .default(DEFAULT_ACTIVITY_LIMIT),
});

export const paginationSchema = z.object({
  page: z.int().min(1),
  pageSize: z.int().min(1),
  total: z.int().nonnegative(),
  totalPages: z.int().nonnegative(),
});

export const ordersListResponseSchema = z.object({
  data: z.array(orderListItemSchema),
  pagination: paginationSchema,
});

export type OrdersQuery = z.infer<typeof ordersQuerySchema>;
export type ActivitiesQuery = z.infer<typeof activitiesQuerySchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type OrdersListResponse = z.infer<typeof ordersListResponseSchema>;

function blankToUndefined(value: string | null): string | undefined {
  if (value == null) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Coerce a query-string integer. Non-numeric text is passed through so Zod
 * can reject it; blank values are omitted so defaults apply.
 */
function coerceIntInput(value: string | null): unknown {
  const text = blankToUndefined(value);
  if (text === undefined) {
    return undefined;
  }
  if (/^[+-]?\d+$/.test(text)) {
    return Number(text);
  }
  return text;
}

/**
 * Flatten Zod issues into the API `details` shape.
 *
 * Root-level issues (no path) use `field: "query"`.
 */
export function zodErrorDetails(error: z.ZodError): ErrorDetail[] {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.map(String).join(".") : "query",
    issue: issue.message,
  }));
}

function invalidQueryMessage(
  details: ErrorDetail[],
  fallback: string
): string {
  if (details.length === 1 && details[0].field === "status") {
    return "Invalid status filter.";
  }
  const fromAfterTo = details.find(
    (detail) =>
      detail.field === "from" && detail.issue === "from must be on or before to"
  );
  if (fromAfterTo) {
    return fromAfterTo.issue;
  }
  return fallback;
}

/**
 * Parse `GET /api/orders` search params.
 *
 * Empty strings are treated as omitted (`?status=` does not 400). `page` and
 * `pageSize` are coerced from decimal integer strings.
 *
 * @param searchParams - Request query string.
 * @throws {ValidationError} When a parameter fails {@link ordersQuerySchema}.
 */
export function parseOrdersQuery(searchParams: URLSearchParams): OrdersQuery {
  const result = ordersQuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    status: blankToUndefined(searchParams.get("status")),
    from: blankToUndefined(searchParams.get("from")),
    to: blankToUndefined(searchParams.get("to")),
    page: coerceIntInput(searchParams.get("page")),
    pageSize: coerceIntInput(searchParams.get("pageSize")),
  });

  if (!result.success) {
    const details = zodErrorDetails(result.error);
    throw new ValidationError(
      invalidQueryMessage(details, "Invalid order list query."),
      details
    );
  }

  return result.data;
}

/**
 * Parse `GET /api/activities` search params.
 *
 * @param searchParams - Request query string.
 * @throws {ValidationError} When `limit` is outside the 1–50 integer range.
 */
export function parseActivitiesQuery(
  searchParams: URLSearchParams
): ActivitiesQuery {
  const result = activitiesQuerySchema.safeParse({
    limit: coerceIntInput(searchParams.get("limit")),
  });

  if (!result.success) {
    throw new ValidationError(
      "Invalid activities query.",
      zodErrorDetails(result.error)
    );
  }

  return result.data;
}
