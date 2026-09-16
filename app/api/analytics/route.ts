import { handleGet } from "@/app/api/_lib/respond";
import { getAnalytics } from "@/lib/domain/analytics";
import { loadDatasets } from "@/lib/domain/datasets";

/** Series window uses wall-clock `now`; do not statically freeze at build. */
export const dynamic = "force-dynamic";

export async function GET() {
  return handleGet(() => {
    const { customers, orders } = loadDatasets();
    return getAnalytics(customers, orders);
  });
}
