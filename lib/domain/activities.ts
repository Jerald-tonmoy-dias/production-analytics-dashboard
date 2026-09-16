import { DEFAULT_ACTIVITY_LIMIT } from "@/lib/constants";
import type { Activity } from "@/lib/schemas/activity";

/**
 * Newest activity rows for the dashboard feed.
 *
 * Sorted by `createdAt` descending, then `id` descending, then sliced.
 *
 * @param activities - Parsed activity records.
 * @param limit - Max rows (API default 8, max 50).
 */
export function listActivities(
  activities: readonly Activity[],
  limit: number = DEFAULT_ACTIVITY_LIMIT
): Activity[] {
  return [...activities]
    .sort((left, right) => {
      const byDate = right.createdAt.localeCompare(left.createdAt);
      return byDate !== 0 ? byDate : right.id.localeCompare(left.id);
    })
    .slice(0, limit);
}
