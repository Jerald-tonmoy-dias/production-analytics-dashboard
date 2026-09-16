import { apiGet } from "@/lib/api/request";
import {
  activitiesListResponseSchema,
  type Activity,
} from "@/lib/schemas/activity";

/**
 * Load the dashboard activity feed (`GET /api/activities`).
 *
 * Unwraps `{ data }` so callers receive the activity rows. RSC cache tag:
 * `analytics`.
 *
 * @param limit - Max rows (server default 8, max 50).
 * @throws {ValidationError} When `limit` is outside 1–50.
 * @throws {InternalError} On transport failure or an unexpected payload.
 */
export async function getActivities(limit?: number): Promise<Activity[]> {
  const searchParams = new URLSearchParams();
  if (limit != null) {
    searchParams.set("limit", String(limit));
  }

  const payload = await apiGet(
    "/api/activities",
    activitiesListResponseSchema,
    {
      searchParams: searchParams.toString() ? searchParams : undefined,
      tags: ["analytics"],
    }
  );
  return payload.data;
}
