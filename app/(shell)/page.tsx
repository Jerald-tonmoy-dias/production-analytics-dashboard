import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { PageHeader } from "@/components/shared/PageHeader";
import { getActivities, getAnalytics, getOrders } from "@/lib/api/rsc";
import { CHART_WINDOW_DAYS } from "@/lib/constants";

const RECENT_ORDERS_PAGE_SIZE = 5;

/** Series window uses wall-clock `now`; do not statically freeze at build. */
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [analytics, ordersPage, activities] = await Promise.all([
    getAnalytics(),
    getOrders({ page: 1, pageSize: RECENT_ORDERS_PAGE_SIZE }),
    getActivities(),
  ]);

  const { kpis, series } = analytics;
  const chartHint = `Last ${CHART_WINDOW_DAYS} UTC days`;

  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Revenue, orders, customers, and recent activity."
      />
      <section
        aria-label="Key metrics"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          label="Total revenue"
          hint="Completed orders, all time"
          value={kpis.totalRevenue}
          format="currency"
        />
        <KpiCard
          label="Orders"
          hint="All orders, all time"
          value={kpis.orderCount}
          format="number"
        />
        <KpiCard
          label="Active customers"
          hint="Customers with status active"
          value={kpis.activeCustomers}
          format="number"
        />
        <KpiCard
          label="Conversion rate"
          hint="Customers with a completed order"
          value={kpis.conversionRate}
          format="percent"
        />
      </section>
      <section aria-label="Trends" className="grid gap-4 lg:grid-cols-2">
        <TrendChart
          title="Revenue"
          description={chartHint}
          series={series.revenue}
          format="currency"
        />
        <TrendChart
          title="Orders"
          description={chartHint}
          series={series.orders}
          format="number"
        />
      </section>
      <section
        aria-label="Recent orders and activity"
        className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
      >
        <div className="min-w-0">
          <RecentOrders orders={ordersPage.data} />
        </div>
        <ActivityFeed activities={activities} />
      </section>
    </div>
  );
}
