import { handleGet } from "@/app/api/_lib/respond";
import { listActivities } from "@/lib/domain/activities";
import { loadDatasets } from "@/lib/domain/datasets";
import { parseActivitiesQuery } from "@/lib/schemas/query";

export async function GET(request: Request) {
  return handleGet(() => {
    const { limit } = parseActivitiesQuery(new URL(request.url).searchParams);
    const { activities } = loadDatasets();
    return { data: listActivities(activities, limit) };
  });
}
