import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { PageHeaderSkeleton } from "@/components/shared/PageSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CHART_WINDOW_DAYS } from "@/lib/constants";

function ChartSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle>{title}</CardTitle>
        <CardDescription>Last {CHART_WINDOW_DAYS} UTC days</CardDescription>
      </CardHeader>
      <CardContent className="pt-3">
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <PageHeaderSkeleton />
      <section
        aria-label="Key metrics"
        className="grid grid-cols-2 gap-4 xl:grid-cols-4"
      >
        <KpiCard
          label="Total revenue"
          format="currency"
          state="loading"
          tone="revenue"
          className="border-chart-revenue/40"
        />
        <KpiCard
          label="Orders"
          format="number"
          state="loading"
          tone="orders"
        />
        <KpiCard
          label="Active customers"
          format="number"
          state="loading"
          tone="customers"
        />
        <KpiCard
          label="Conversion rate"
          format="percent"
          state="loading"
          tone="conversion"
        />
      </section>
      <section aria-label="Trends" className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton title="Revenue" />
        <ChartSkeleton title="Orders" />
      </section>
      <section
        aria-label="Recent orders and activity"
        className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
      >
        <div className="min-h-0 min-w-0 xl:h-full">
          <RecentOrders orders={[]} state="loading" />
        </div>
        <div className="min-h-0 min-w-0 xl:h-full">
          <ActivityFeed activities={[]} state="loading" />
        </div>
      </section>
    </div>
  );
}
