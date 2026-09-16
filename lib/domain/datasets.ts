import { parseDatasets, type Datasets } from "@/lib/domain/parse";
import customersJson from "@/data/customers.json";
import ordersJson from "@/data/orders.json";
import activitiesJson from "@/data/activities.json";

/**
 * Load and validate the committed mock JSON.
 *
 * Pages must not import `data/*.json`; Route Handlers (TASK-005) call this.
 *
 * @throws {InternalError} When a file is corrupt or referentially inconsistent.
 */
export function loadDatasets(): Datasets {
  return parseDatasets({
    customers: customersJson,
    orders: ordersJson,
    activities: activitiesJson,
  });
}
