import { z } from "zod";
import {
  DEFAULT_ACTIVITY_LIMIT,
  DEFAULT_PAGE_SIZE,
  MAX_ACTIVITY_LIMIT,
  MAX_PAGE_SIZE,
} from "@/lib/constants";
import { orderStatusSchema } from "@/lib/schemas/order";

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

export type OrdersQuery = z.infer<typeof ordersQuerySchema>;
export type ActivitiesQuery = z.infer<typeof activitiesQuerySchema>;
export type Pagination = z.infer<typeof paginationSchema>;
