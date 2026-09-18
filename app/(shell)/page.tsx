import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { PageHeader } from "@/components/shared/PageHeader";
import { getActivities, getAnalytics, getOrders } from "@/lib/api/rsc";
import { CHART_WINDOW_DAYS } from "@/lib/constants";

const RECENT_ORDERS_PAGE_SIZE = 5;
const ACTIVITY_FEED_LIMIT = 5;

/** Series window uses wall-clock `now`; do not statically freeze at build. */
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [analytics, ordersPage, activities] = await Promise.all([
    getAnalytics(),
    getOrders({ page: 1, pageSize: RECENT_ORDERS_PAGE_SIZE }),
    getActivities(ACTIVITY_FEED_LIMIT),
  ]);

  const { kpis, series } = analytics;
  const chartHint = `Last ${CHART_WINDOW_DAYS} UTC days`;

  return (
    <div className="motion-enter min-w-0 space-y-8">
      <PageHeader
        title="Dashboard"
        description="Revenue, orders, customers, and recent activity."
      />
      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          label="Total revenue"
          hint="Completed orders, all time"
          value={kpis.totalRevenue}
          format="currency"
          tone="revenue"
        />
        <KpiCard
          label="Orders"
          hint="All orders, all time"
          value={kpis.orderCount}
          format="number"
          tone="orders"
        />
        <KpiCard
          label="Active customers"
          hint="Customers with status active"
          value={kpis.activeCustomers}
          format="number"
          tone="customers"
        />
        <KpiCard
          label="Conversion rate"
          hint="Customers with a completed order"
          value={kpis.conversionRate}
          format="percent"
          tone="conversion"
        />
      </section>
      <section aria-label="Trends" className="grid gap-6 lg:grid-cols-2">
        <TrendChart
          title="Revenue"
          description={chartHint}
          series={series.revenue}
          format="currency"
          variant="area"
        />
        <TrendChart
          title="Orders"
          description={chartHint}
          series={series.orders}
          format="number"
          variant="bar"
        />
      </section>
      <section
        aria-label="Recent orders and activity"
        className="grid min-w-0 items-stretch gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
      >
        <div className="min-h-0 min-w-0">
          <RecentOrders orders={ordersPage.data} />
        </div>
        <div className="min-h-0 min-w-0">
          <ActivityFeed activities={activities} />
        </div>
      </section>
    </div>
  );
}
