import { apiGet } from "@/lib/api/request";
import {
  analyticsSchema,
  type Analytics,
} from "@/lib/schemas/analytics";

/**
 * Load dashboard KPIs and the 30-day chart series (`GET /api/analytics`).
 *
 * HTTP client for the REST resource. Dashboard RSC uses `lib/api/rsc`.
 *
 * @throws {InternalError} On transport failure or an unexpected payload.
 */
export async function getAnalytics(): Promise<Analytics> {
  return apiGet("/api/analytics", analyticsSchema, { tags: ["analytics"] });
}
