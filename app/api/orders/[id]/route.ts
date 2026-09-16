import { handleGet } from "@/app/api/_lib/respond";
import { loadDatasets } from "@/lib/domain/datasets";
import { getOrderDetail } from "@/lib/domain/orders";

type OrderIdContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: OrderIdContext) {
  return handleGet(async () => {
    const { id } = await context.params;
    const { customers, orders } = loadDatasets();
    return getOrderDetail(orders, customers, id);
  });
}
