import { parseDatasets, type Datasets } from "@/lib/domain/parse";
import customersJson from "@/data/customers.json";
import ordersJson from "@/data/orders.json";
import activitiesJson from "@/data/activities.json";

export function loadDatasets(): Datasets {
  return parseDatasets({
    customers: customersJson,
    orders: ordersJson,
    activities: activitiesJson,
  });
}
