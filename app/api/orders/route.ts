import { handleGet } from "@/app/api/_lib/respond";
import { loadDatasets } from "@/lib/domain/datasets";
import { listOrders } from "@/lib/domain/orders";
import { parseOrdersQuery } from "@/lib/schemas/query";

export async function GET(request: Request) {
  return handleGet(() => {
    const query = parseOrdersQuery(new URL(request.url).searchParams);
    const { customers, orders } = loadDatasets();
    const { page, pageSize, q, status, from, to } = query;
    return listOrders(
      orders,
      customers,
      { q, status, from, to },
      { page, pageSize }
    );
  });
}
